import axios from "axios";
import { setCurrentMode } from "./scrollerAction";

const requestStart = () => ({ type: "CREATE_SOLDIER_START" });
const requestSuccess = () => ({ type: "CREATE_SOLDIER_SUCCESS" });
const requestFail = (error) => ({ type: "CREATE_SOLIDER_FAIL", error });

const setSuperiorList = (superiorList) => ({
  type: "SET_SUPERIOR_LIST",
  superiorList,
});

export const setCreated = (created) => ({ type: "SET_CREATED", created });
export const restoreState = () => ({ type: "RESTORE_INITIAL_STATE" });

export const createNewSoldier = (soldier, history, formData = null) => {
  return (dispatch) => {
    dispatch(requestStart());
    axios
      .post("/api/soldiers/insert", soldier)
      .then((res) => {
        dispatch(requestSuccess());
        dispatch(setCreated(true));
        dispatch(setCurrentMode(0));
        if (res.data.imageUrl !== `/images/default.png`) {
          const filename = res.data.imageUrl.slice(8);
          dispatch(saveAvatar(formData, filename, history));
        } else {
          history.push("/");
        }
      })
      .catch((err) => dispatch(requestFail(err.response)));
  };
};

export const getSuperiorList = () => {
  return (dispatch) => {
    axios.get("/api/allSoldiers").then((res) => {
      dispatch(setSuperiorList(res.data));
    });
  };
};

export const saveAvatar = (formData, fileName, history) => {
  return (dispatch) => {
    axios
      .post(`/saveImages/${fileName}`, formData, {})
      .then((res) => {
        history.push("/");
      })
      .catch((err) => console.log(err));
  };
};
