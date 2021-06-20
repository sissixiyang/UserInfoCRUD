const INITIAL_STATE = {
  isCreating: false,
  error: "",
  superiorList: [],
  created: false,
};

const newSoldierReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "CREATE_SOLDIER_START":
      return {
        ...state,
        isCreating: true,
      };
    case "CREATE_SOLDIER_SUCCESS":
      return {
        ...state,
        isCreating: false,
        error: "",
      };
    case "CREATE_SOLDIER_FAIL":
      return {
        ...state,
        isCreating: false,
        error: action.error,
      };
    case "RESTORE_INITIAL_STATE":
      return INITIAL_STATE;
    case "SET_SUPERIOR_LIST":
      return {
        ...state,
        superiorList: action.superiorList,
      };
    case "SET_CREATED":
      return {
        ...state,
        created: action.created,
      };

    default:
      return state;
  }
};

export default newSoldierReducer;
