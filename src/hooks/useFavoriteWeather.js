import { useEffect, useRef, useState } from "react";
import { fetchWeather } from "../services/weatherService";

// Fetch weather for a list of locations in parallel. Cached per id in memory
// for the lifetime of the component; refetches when the id set changes.
export function useFavoriteWeather(locations) {
  const [map, setMap] = useState({});
  const controllerRef = useRef(null);

  useEffect(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    if (locations.length === 0) {
      setMap({});
      return;
    }

    setMap((prev) => {
      const next = {};
      for (const loc of locations) {
        next[loc.id] = prev[loc.id] ?? { bundle: null, loading: true, error: null };
        if (!prev[loc.id]) next[loc.id] = { bundle: null, loading: true, error: null };
        else next[loc.id] = { ...prev[loc.id], loading: prev[loc.id].bundle === null };
      }
      return next;
    });

    Promise.all(
      locations.map((loc) =>
        fetchWeather(loc, controller.signal)
          .then((bundle) => ({ id: loc.id, bundle, error: null }))
          .catch((err) => {
            if (err instanceof DOMException && err.name === "AbortError") return null;
            return { id: loc.id, bundle: null, error: "Load failed" };
          }),
      ),
    ).then((results) => {
      if (controller.signal.aborted) return;
      setMap((prev) => {
        const next = { ...prev };
        for (const r of results) {
          if (!r) continue;
          next[r.id] = { bundle: r.bundle, loading: false, error: r.error };
        }
        return next;
      });
    });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations.map((l) => l.id).join("|")]);

  return map;
}
