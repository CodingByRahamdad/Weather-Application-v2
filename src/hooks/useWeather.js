import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWeather } from "../services/weatherService";

export function useWeather(location) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.id, location?.latitude, location?.longitude, nonce]);

  return { ...state, refresh };
}
