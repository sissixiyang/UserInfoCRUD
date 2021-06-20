export const setHasMore = (hasMore) => ({ type: "SET_HAS_MORE", hasMore });

export const setCurrentMode = (currentMode) => ({
  type: "SET_CURRENT_MODE",
  currentMode,
});

export const setLoadFunc = (func) => ({ type: "SET_LOAD_FUNC", func });

export const setScrollTop = (scrollTop) => ({
  type: "SET_SCROLL_TOP",
  scrollTop,
});

export const setLastSoldier = (lastSoldier) => ({
  type: "SET_LAST_SOLDIER",
  lastSoldier,
});
