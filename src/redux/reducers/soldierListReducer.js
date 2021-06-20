const INITIAL_STATE = {
  soldierList: [],
  pageNum: 0,
  recordsPerPage: 6,
  isFetching: false,
  fetchErr: "",
  isDeleting: false,
  deleteErr: "",
  query: "",
  sortBy: "noSort",
  direction: 0,
  hasMore: true,
};

const soldierListReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SOLDIER_FETCH_START":
      return {
        ...state,
        isFetching: true,
      };
    case "SUBORDINATE_FETCH_START":
      return {
        ...state,
        isFetching: true,
      };
    case "SUPERIOR_FETCH_START":
      return {
        ...state,
        isFetching: true,
      };
    case "SOLDIER_FETCH_SUCCESS":
      if (action.soldierList.length === 0) {
        return {
          ...state,
          isFetching: false,
          soldierList: [...state.soldierList, ...action.soldierList],
          recordsPerPage: action.recordsPerPage,
          pageNum: action.pageNum,
          fetchErr: "",
          hasMore: false,
        };
      }
      return {
        ...state,
        isFetching: false,
        soldierList: [...state.soldierList, ...action.soldierList],
        recordsPerPage: action.recordsPerPage,
        pageNum: action.pageNum,
        fetchErr: "",
      };

    case "ACC_FETCH_SUCCESS":
      return {
        ...state,
        isFetching: false,
        soldierList: action.soldierList,
        recordsPerPage: action.recordsPerPage,
        pageNum: action.pageNum,
        fetchErr: "",
      };

    case "SUPERIOR_FETCH_SUCCESS":
      return {
        ...state,
        isFetching: false,
        soldierList: [action.superior],
      };
    case "SUBORDINATE_FETCH_SUCCESS":
      if (action.subordinates.length === 0) {
        return {
          ...state,
          isFetching: false,
          soldierList: [...state.soldierList, ...action.subordinates],
          hasMore: false,
          pageNum: action.pageNum,
          fetchErr: "",
        };
      }

      return {
        ...state,
        isFetching: false,
        soldierList: [...state.soldierList, ...action.subordinates],
        pageNum: action.pageNum,
        fetchErr: "",
      };
    case "SOLDIER_FETCH_FAIL":
      return {
        ...state,
        isFetching: false,
        fetchErr: action.err,
      };
    case "SOLDIER_DELETE_START":
      return {
        ...state,
        isDeleting: true,
      };
    case "SOLDIER_DELETE_SUCCESS":
      return {
        ...state,
        isDeleting: false,
        deleteErr: "",
      };
    case "SOLDIER_DELETE_FAIL":
      return {
        ...state,
        isDeleting: false,
        deleteErr: action.err,
      };
    case "RESTORE_STATE":
      return INITIAL_STATE;
    case "SET_QUERY":
      return {
        ...state,
        query: action.query,
      };
    case "SET_SORT_BY":
      return {
        ...state,
        sortBy: action.sortBy,
      };
    case "SET_PageNum":
      return {
        ...state,
        pageNum: action.pageNum,
      };
    case "SET_DIRECTION":
      return {
        ...state,
        direction: action.direction,
      };
    case "SET_HAS_MORE":
      return {
        ...state,
        hasMore: action.hasMore,
      };
    case "CLEAR_SOLDIER_LIST": {
      return {
        ...state,
        soldierList: [],
      };
    }
    default:
      return state;
  }
};

export default soldierListReducer;
