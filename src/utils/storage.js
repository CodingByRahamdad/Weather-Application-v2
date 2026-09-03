// Defensive JSON storage helpers that never throw on corrupted data.

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    return fallback;
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
