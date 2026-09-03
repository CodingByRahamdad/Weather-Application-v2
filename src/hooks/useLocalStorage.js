import { useCallback, useEffect, useState } from "react";
import { readJson, writeJson } from "../utils/storage";

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => readJson(key, initial));

  useEffect(() => {
    writeJson(key, value);
  }, [key, value]);

  const set = useCallback((v) => {
    setValue((prev) => (typeof v === "function" ? v(prev) : v));
  }, []);

  return [value, set];
}
