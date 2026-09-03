// Pure helpers for favorite-location list management, kept independent of
// React so the duplicate/limit rules can be unit tested directly.

export const MAX_FAVORITES = 20;

/**
 * Attempts to add `loc` to `list`.
 * Returns a new result object rather than mutating `list`:
 *   { list, added, reason }
 * - added: true if the location was appended
 * - reason: "duplicate" | "limit" | null
 */
export function addFavoriteToList(list, loc, max = MAX_FAVORITES) {
  if (list.some((f) => f.id === loc.id)) {
    return { list, added: false, reason: "duplicate" };
  }
  if (list.length >= max) {
    return { list, added: false, reason: "limit" };
  }
  return {
    list: [...list, { ...loc, addedAt: Date.now() }],
    added: true,
    reason: null,
  };
}

export function removeFavoriteFromList(list, id) {
  return list.filter((f) => f.id !== id);
}

export function isFavoriteInList(list, id) {
  return list.some((f) => f.id === id);
}
