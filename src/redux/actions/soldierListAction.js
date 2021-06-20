import axios from "axios";

const requestStart = () => ({ type: "SOLDIER_FETCH_START" });
const requestSuccess = (info) => ({
  type: "SOLDIER_FETCH_SUCCESS",
  soldierList: info.soldiers,
  recordsPerPage: info.recordsPerPage,
  pageNum: info.pageNum,
});
const requestFail = (error) => {
  return {
    type: "SOLDIER_FETCH_FAIL",
    error: error.data,
  };
};

const subordinateRequestStart = () => ({ type: "SUBORDINATE_FETCH_START" });
const superiorRequestStart = () => ({ type: "SUPERIOR_FETCH_START" });

const AccRequestSuccess = (info) => ({
  type: "ACC_FETCH_SUCCESS",
  soldierList: info.soldiers,
  recordsPerPage: info.recordsPerPage,
  pageNum: info.pageNum,
});

const subordinatesSuccess = (info) => {
  return {
    type: "SUBORDINATE_FETCH_SUCCESS",
    subordinates: info.subordinates,
    recordsPerPage: info.recordsPerPage,
    pageNum: info.pageNum,
  };
};

const superiorSuccess = (superior) => ({
  type: "SUPERIOR_FETCH_SUCCESS",
  superior,
});

export const restoreState = () => ({ type: "RESTORE_STATE" });

const deleteRequestStart = () => ({ type: "SOLDIER_DELETE_START" });
const deleteRequestSuccess = () => ({ type: "SOLDIER_DELETE_SUCCESS" });
const deleteRequestFail = (error) => ({
  type: "SOLDIER_DELETE_FAIL",
  error: error.data,
});

export const setQuery = (query) => ({ type: "SET_QUERY", query });
export const setSortBy = (sortBy) => ({ type: "SET_SORT_BY", sortBy });
export const setDirection = (direction) => ({
  type: "SET_DIRECTION",
  direction,
});

export const setPageNum = (pageNum) => ({ type: "SET_PageNum", pageNum });
export const clearSoldierList = () => ({ type: "CLEAR_SOLDIER_LIST" });

export const fetchAccData = (
  pageNum,
  query = "",
  sortBy = "noSort",
  direction = 0,
  scrollElement,
  scrollTop
) => {
  return (dispatch) => {
    if (query) {
      dispatch(
        getAccSearchList(
          query,
          pageNum,
          {
            sortBy: sortBy,
            direction: direction,
          },
          scrollElement,
          scrollTop
        )
      );
    } else {
      dispatch(
        getAccSoldierList(
          pageNum,
          { sortBy: sortBy, direction: direction },
          scrollElement,
          scrollTop
        )
      );
    }
  };
};

export const fetchAccSubordinatesData = (
  id,
  pageNum,
  query = "",
  sortBy = "noSort",
  direction = 0,
  scrollElement,
  scrollTop
) => {
  console.log(query);
  return (dispatch) => {
    query
      ? dispatch(
          getAccSearchSubordinatesList(
            id,
            query,
            pageNum,
            {
              sortBy: sortBy,
              direction: direction,
            },
            scrollElement,
            scrollTop
          )
        )
      : dispatch(
          getAccSubordinatesList(
            id,
            pageNum,
            { sortBy: sortBy, direction: direction },
            scrollElement,
            scrollTop
          )
        );
  };
};

export const fetchData = (
  pageNum,
  query = "",
  sortBy = "noSort",
  direction = 0
) => {
  return (dispatch) => {
    query
      ? dispatch(
          getSearchList(query, pageNum, {
            sortBy: sortBy,
            direction: direction,
          })
        )
      : dispatch(
          getSoldierList(pageNum, { sortBy: sortBy, direction: direction })
        );
  };
};

export const fetchSubordinatesData = (
  id,
  pageNum,
  query = "",
  sortBy = "noSort",
  direction = 0
) => {
  return (dispatch) => {
    query
      ? dispatch(
          getSearchSubordinatesList(id, query, pageNum, {
            sortBy: sortBy,
            direction: direction,
          })
        )
      : dispatch(
          getSubordinatesList(id, pageNum, {
            sortBy: sortBy,
            direction: direction,
          })
        );
  };
};

export const deleteSoldier = (
  id,
  pageNum,
  query,
  sortBy,
  direction,
  scrollElement,
  scrollTop,
  mode = 0,
  lastSoldierId
) => {
  return (dispatch) => {
    dispatch(deleteRequestStart());
    axios
      .delete(`/api/soldiers/delete/${id}`)
      .then((res) => {
        dispatch(deleteRequestSuccess());
        if (mode === 0) {
          dispatch(
            fetchAccData(
              pageNum,
              query,
              sortBy,
              direction,
              scrollElement,
              scrollTop
            )
          ); //main page api
        } else if (mode === 1) {
          dispatch(
            fetchAccSubordinatesData(
              lastSoldierId,
              pageNum,
              query,
              sortBy,
              direction,
              scrollElement,
              scrollTop
            )
          );
        } else {
          dispatch(fetchData(0, "", "noSort", 0));
        }
      })
      .catch((err) => dispatch(deleteRequestFail(err.response)));
  };
};

export const getSoldierList = (pageNum, sort) => {
  return (dispatch) => {
    dispatch(requestStart());
    axios
      .get(`/api/soldiers/${pageNum}/${sort.sortBy}/${sort.direction}/0`)
      .then((res) => {
        dispatch(requestSuccess(res.data));
      })
      .catch((err) => dispatch(requestFail(err.response)));
  };
};

export const getSearchList = (query, pageNum, sort) => {
  return (dispatch) => {
    dispatch(requestStart());
    axios
      .get(
        `/api/soldiers/${query}/${pageNum}/${sort.sortBy}/${sort.direction}/0`
      )
      .then((res) => {
        dispatch(requestSuccess(res.data));
      })
      .catch((err) => dispatch(requestFail(err.response)));
  };
};

export const getAccSoldierList = (pageNum, sort, scrollElement, scrollTop) => {
  return (dispatch) => {
    dispatch(requestStart());
    axios
      .get(`/api/soldiers/${pageNum}/${sort.sortBy}/${sort.direction}/1`)
      .then((res) => {
        dispatch(AccRequestSuccess(res.data));
        scrollElement.current.scrollTop = scrollTop;
      })
      .catch((err) => dispatch(requestFail(err.response)));
  };
};

export const getAccSearchList = (
  query,
  pageNum,
  sort,
  scrollElement,
  scrollTop
) => {
  return (dispatch) => {
    dispatch(requestStart());
    axios
      .get(
        `/api/soldiers/${query}/${pageNum}/${sort.sortBy}/${sort.direction}/1`
      )
      .then((res) => {
        dispatch(AccRequestSuccess(res.data));
        scrollElement.current.scrollTop = scrollTop;
      })
      .catch((err) => dispatch(requestFail(err.response)));
  };
};

export const getSubordinatesList = (id, pageNum, sort) => {
  return (dispatch) => {
    dispatch(subordinateRequestStart());
    axios
      .get(
        `/api/subordinates/${id}/${pageNum}/${sort.sortBy}/${sort.direction}/0`
      )
      .then((res) => {
        dispatch(subordinatesSuccess(res.data));
      })
      .catch((err) => dispatch(requestFail(err.response)));
  };
};

export const getAccSubordinatesList = (
  id,
  pageNum,
  sort,
  scrollElement,
  scrollTop
) => {
  return (dispatch) => {
    dispatch(subordinateRequestStart());
    axios
      .get(
        `/api/subordinates/${id}/${pageNum}/${sort.sortBy}/${sort.direction}/1`
      )
      .then((res) => {
        dispatch(subordinatesSuccess(res.data));
        scrollElement.current.scrollTop = scrollTop;
      })
      .catch((err) => dispatch(requestFail(err.response)));
  };
};

export const getSearchSubordinatesList = (id, query, pageNum, sort) => {
  return (dispatch) => {
    dispatch(subordinateRequestStart());
    axios
      .get(
        `/api/subordinates/${id}/${query}/${pageNum}/${sort.sortBy}/${sort.direction}/0`
      )
      .then((res) => {
        dispatch(subordinatesSuccess(res.data));
      })
      .catch((err) => dispatch(requestFail(err.response)));
  };
};

export const getAccSearchSubordinatesList = (
  id,
  query,
  pageNum,
  sort,
  scrollElement,
  scrollTop
) => {
  return (dispatch) => {
    dispatch(subordinateRequestStart());
    axios
      .get(
        `/api/subordinates/${id}/${query}/${pageNum}/${sort.sortBy}/${sort.direction}/1`
      )
      .then((res) => {
        dispatch(subordinatesSuccess(res.data));
        scrollElement.current.scrollTop = scrollTop;
      })
      .catch((err) => dispatch(requestFail(err.response)));
  };
};

export const getSuperior = (id) => {
  return (dispatch) => {
    dispatch(superiorRequestStart());
    axios
      .get(`/api/soldiers/${id}`)
      .then((res) => {
        dispatch(superiorSuccess(res.data));
      })
      .catch((err) => dispatch(requestFail(err.response)));
  };
};

export const fetchAllData = (scrollElement) => {
  return (dispatch) => {
    dispatch(requestStart());
    axios
      .get(`/api/allPages`)
      .then((res) => {
        dispatch(requestSuccess(res.data));
        scrollElement.current.scrollTop = scrollElement.current.scrollHeight;
      })
      .catch((err) => dispatch(requestFail(err.response)));
  };
};
