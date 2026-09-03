import { useCallback, useEffect, useState } from "react";

// Simple hash-based router. Location shape:  #/weather?city=London
function parse() {
  const raw = window.location.hash.replace(/^#/, "") || "/weather";
  const [path, queryStr = ""] = raw.split("?");
  return { path: path || "/weather", query: new URLSearchParams(queryStr) };
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parse());

  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener("hashchange", onChange);
    if (!window.location.hash) {
      window.location.hash = "#/weather";
    }
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((path, params) => {
    const q = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
      });
    }
    const qs = q.toString();
    const target = `#${path}${qs ? `?${qs}` : ""}`;
    if (window.location.hash !== target) {
      window.location.hash = target;
    }
  }, []);

  return { route, navigate };
}
