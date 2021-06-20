import axios from "axios";

const requestStart = () => ({ type: "UPDATE_SOLDIER_START" });
const requestSuccess = () => ({ type: "UPDATE_SOLDIER_SUCCESS" });
const requestFail = (error) => ({
  type: "UPDATE_SOLDIER_FAIL",
  error: error.data,
});

export const setCurrentSoldier = (soldier) => ({
  type: "SET_CURRENT_SOLDIER",
  currentSoldier: soldier,
});

const setCurrentSuperiorList = (superiorList) => ({
  type: "SET_SUPERIOR_LIST",
  superiorList,
});

export const setAvatarUrl = (avatarUrl) => ({
  type: "SET_AVATAR_URL",
  avatarUrl,
});
export const setImage = (image) => ({ type: "SET_IMAGE", image });
export const restoreState = () => ({ type: "RESTORE_INITIAL_STATE" });

export const updateSoldier = (soldier, id, history, formData) => {
  return (dispatch) => {
    dispatch(requestStart());
    axios
      .put(`/api/soldiers/update/${id}`, soldier)
      .then((res) => {
        dispatch(requestSuccess());
        if (formData) {
          const filename = res.data.imageUrl.slice(8);
          dispatch(saveAvatar(formData, filename, history));
        } else {
          history.push("/");
        }
      })
      .catch((err) => {
        dispatch(requestFail(err.response));
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

export const getCurrentSuperiorList = (id) => {
  return (dispatch) => {
    axios.get(`/api/superiorList/${id}`).then((res) => {
      dispatch(setCurrentSuperiorList(res.data));
    });
  };
};
