import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWeather } from "../services/weatherService";

export function getAutoRefreshDelay(minutes) {
  const parsed = Number(minutes);
  return [5, 10, 15].includes(parsed) ? parsed * 60_000 : null;
}

export function useWeather(location, autoRefreshMinutes = 0) {
  const [state, setState] = useState({ data: null, loading: false, error: null });
  const [nonce, setNonce] = useState(0);
  const abortRef = useRef(null);
  const requestIdRef = useRef(0);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!location) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const id = ++requestIdRef.current;

    setState((s) => ({ ...s, loading: true, error: null }));

    fetchWeather(location, controller.signal)
      .then((data) => {
        if (controller.signal.aborted || id !== requestIdRef.current) return;
        setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (controller.signal.aborted || id !== requestIdRef.current) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ data: null, loading: false, error: "Could not load weather. Please try again." });
      });

    return () => controller.abort();
  }, [location?.id, location?.latitude, location?.longitude, nonce]);

  const autoRefreshDelay = getAutoRefreshDelay(autoRefreshMinutes);
  useEffect(() => {
    if (!location || !autoRefreshDelay) return undefined;

    const timerId = window.setInterval(refresh, autoRefreshDelay);
    return () => window.clearInterval(timerId);
  }, [location?.id, location?.latitude, location?.longitude, autoRefreshDelay, refresh]);

  return { ...state, refresh };
}