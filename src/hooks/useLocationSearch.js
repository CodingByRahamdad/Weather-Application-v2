import { useEffect, useRef, useState } from "react";
import { searchLocations } from "../services/geocodingService";
import { useDebounced } from "./useDebounced";

export function useLocationSearch(query, minLen = 2) {
  const debounced = useDebounced(query, 350);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    const term = debounced.trim();
    if (term.length < minLen) {
      setResults([]);
      setError(null);
      setLoading(false);
      abortRef.current?.abort();
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    searchLocations(term, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Search failed. Please try again.");
        setLoading(false);
      });

    return () => controller.abort();
  }, [debounced, minLen]);

  return { results, loading, error };
}
