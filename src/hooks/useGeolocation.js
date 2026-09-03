import { useCallback, useRef, useState } from "react";

function geolocationErrorMessage(error) {
  switch (error?.code) {
    case 1:
      return "Location permission denied. Allow location access in your browser settings and try again.";
    case 2:
      return "Your location is currently unavailable. Check your connection and try again.";
    case 3:
      return "Location request timed out. Please try again.";
    default:
      return "Could not determine your location.";
  }
}

export function useGeolocation() {
  const [state, setState] = useState({ loading: false, error: null, coords: null });
  const pendingRequestRef = useRef(null);

  const request = useCallback(() => {
    if (pendingRequestRef.current) return pendingRequestRef.current;

    const pendingRequest = new Promise((resolve, reject) => {
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
          if (!Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude)) {
            const msg = "Could not determine your location.";
            setState({ loading: false, error: msg, coords: null });
            reject(new Error(msg));
            return;
          }
          setState({ loading: false, error: null, coords });
          resolve(coords);
        },
        (error) => {
          const msg = geolocationErrorMessage(error);
          setState({ loading: false, error: msg, coords: null });
          reject(new Error(msg));
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
      );
    });

    pendingRequestRef.current = pendingRequest;
    pendingRequest.finally(() => {
      pendingRequestRef.current = null;
    }).catch(() => {});
    return pendingRequest;
  }, []);

  return { ...state, request };
}