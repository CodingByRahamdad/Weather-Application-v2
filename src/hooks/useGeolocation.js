import { useCallback, useState } from "react";

export function useGeolocation() {
  const [state, setState] = useState({ loading: false, error: null, coords: null });

  const request = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        const msg = "Geolocation is not supported by this browser.";
        setState({ loading: false, error: msg, coords: null });
        reject(new Error(msg));
        return;
      }

      setState({ loading: true, error: null, coords: null });
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setState({ loading: false, error: null, coords });
          resolve(coords);
        },
        (err) => {
          const msg =
            err.code === err.PERMISSION_DENIED
              ? "Location permission denied."
              : err.code === err.POSITION_UNAVAILABLE
              ? "Location unavailable."
              : err.code === err.TIMEOUT
              ? "Location request timed out."
              : "Could not determine location.";
          setState({ loading: false, error: msg, coords: null });
          reject(new Error(msg));
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
      );
    });
  }, []);

  return { ...state, request };
}
