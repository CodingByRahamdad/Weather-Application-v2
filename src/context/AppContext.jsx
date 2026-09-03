import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { addFavoriteToList, MAX_FAVORITES } from "../utils/favorites";

const DEFAULT_SETTINGS = {
  temperatureUnit: "celsius",
  windUnit: "kmh",
  precipUnit: "mm",
  theme: "dark",
  reduceMotion: false,
  highContrast: false,
  forecastRange: 7,
  showChart: true,
  showStatistics: true,
};

const AppContext = createContext(null);

const K_SETTINGS = "halcyon.settings.v1";
const K_FAVS = "halcyon.favorites.v1";
const K_HISTORY = "halcyon.history.v1";
const K_LAST = "halcyon.lastLocation.v1";

export function AppProvider({ children }) {
  const [settings, setSettings] = useLocalStorage(K_SETTINGS, DEFAULT_SETTINGS);
  const [favorites, setFavorites] = useLocalStorage(K_FAVS, []);
  const [history, setHistory] = useLocalStorage(K_HISTORY, []);
  const [selectedLocation, setSelectedLocation] = useLocalStorage(K_LAST, null);
  const [toasts, setToasts] = useState([]);

  // Apply theme + high-contrast classes on <html>.
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
      const dark = settings.theme === "dark" || (settings.theme === "auto" && prefersDark);
      root.classList.toggle("dark", dark);
      root.classList.toggle("high-contrast", settings.highContrast);
      root.classList.toggle("reduce-motion", settings.reduceMotion);
    };
    applyTheme();
    if (settings.theme === "auto") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", applyTheme);
      return () => mq.removeEventListener("change", applyTheme);
    }
  }, [settings.theme, settings.highContrast, settings.reduceMotion]);

  const updateSettings = useCallback(
    (partial) => setSettings((prev) => ({ ...prev, ...partial })),
    [setSettings],
  );
  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), [setSettings]);

  const isFavorite = useCallback((id) => favorites.some((f) => f.id === id), [favorites]);

  const toast = useCallback((t) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const addFavorite = useCallback(
    (loc) => {
      setFavorites((prev) => {
        const result = addFavoriteToList(prev, loc, MAX_FAVORITES);
        if (!result.added && result.reason === "limit") {
          toast({
            type: "error",
            message: `You can save up to ${MAX_FAVORITES} favorites. Remove one to add another.`,
          });
        }
        return result.list;
      });
    },
    [setFavorites, toast],
  );

  const removeFavorite = useCallback(
    (id) => setFavorites((prev) => prev.filter((f) => f.id !== id)),
    [setFavorites],
  );

  const pushHistory = useCallback(
    (loc) => {
      setHistory((prev) => {
        if (prev[0]?.id === loc.id) return prev;
        const filtered = prev.filter((h) => h.id !== loc.id);
        return [{ ...loc }, ...filtered].slice(0, 5);
      });
    },
    [setHistory],
  );

  const removeHistory = useCallback(
    (id) => setHistory((prev) => prev.filter((h) => h.id !== id)),
    [setHistory],
  );

  const clearHistory = useCallback(() => setHistory([]), [setHistory]);

  const selectLocation = useCallback(
    (loc) => {
      setSelectedLocation(loc);
      if (loc) pushHistory(loc);
    },
    [setSelectedLocation, pushHistory],
  );

  const dismissToast = useCallback(
    (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      resetSettings,
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      history,
      pushHistory,
      removeHistory,
      clearHistory,
      selectedLocation,
      selectLocation,
      toasts,
      toast,
      dismissToast,
    }),
    [
      settings,
      updateSettings,
      resetSettings,
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      history,
      pushHistory,
      removeHistory,
      clearHistory,
      selectedLocation,
      selectLocation,
      toasts,
      toast,
      dismissToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
