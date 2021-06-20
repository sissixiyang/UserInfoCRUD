const INITIAL_STATE = {
  currentMode: 0,
  lastSoldier: null,
  scrollTop: 0,
};

const scrollReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_CURRENT_MODE":
      return {
        ...state,
        currentMode: action.currentMode,
      };
    case "SET_SCROLL_TOP":
      return {
        ...state,
        scrollTop: action.scrollTop,
      };
    case "SET_LAST_SOLDIER":
      return {
        ...state,
        lastSoldier: action.lastSoldier,
      };
    default:
      return state;
  }
};

export default scrollReducer;
