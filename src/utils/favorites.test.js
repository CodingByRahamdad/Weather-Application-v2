import { describe, expect, it } from "vitest";
import { addFavoriteToList, isFavoriteInList, removeFavoriteFromList } from "./favorites";

const loc = (id) => ({ id, name: `City ${id}`, country: "Testland", latitude: 1, longitude: 1 });

describe("addFavoriteToList", () => {
  it("adds a new location to an empty list", () => {
    const result = addFavoriteToList([], loc("a"));
    expect(result.added).toBe(true);
    expect(result.list).toHaveLength(1);
    expect(result.list[0].id).toBe("a");
  });

  it("does not add a duplicate location", () => {
    const first = addFavoriteToList([], loc("a"));
    const second = addFavoriteToList(first.list, loc("a"));
    expect(second.added).toBe(false);
    expect(second.reason).toBe("duplicate");
    expect(second.list).toHaveLength(1);
  });

  it("enforces the maximum favorites limit", () => {
    let list = [];
    for (let i = 0; i < 5; i++) {
      list = addFavoriteToList(list, loc(`city-${i}`), 5).list;
    }
    expect(list).toHaveLength(5);

    const overLimit = addFavoriteToList(list, loc("one-too-many"), 5);
    expect(overLimit.added).toBe(false);
    expect(overLimit.reason).toBe("limit");
    expect(overLimit.list).toHaveLength(5);
  });

  it("does not mutate the original list", () => {
    const original = [loc("a")];
    addFavoriteToList(original, loc("b"));
    expect(original).toHaveLength(1);
  });
});

describe("removeFavoriteFromList", () => {
  it("removes a favorite by id", () => {
    const list = [loc("a"), loc("b")];
    const result = removeFavoriteFromList(list, "a");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("b");
  });

  it("does not mutate the original list", () => {
    const list = [loc("a"), loc("b")];
    removeFavoriteFromList(list, "a");
    expect(list).toHaveLength(2);
  });
});

describe("isFavoriteInList", () => {
  it("returns true when the id is present", () => {
    expect(isFavoriteInList([loc("a")], "a")).toBe(true);
  });

  it("returns false when the id is absent", () => {
    expect(isFavoriteInList([loc("a")], "b")).toBe(false);
  });
});
