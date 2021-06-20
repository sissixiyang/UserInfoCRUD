const INITIAL_STATE = {
    currentSoldier: null,
    isUpdating: false,
    error: "",
    superiorList: [],
    image: null,
    avatarUrl: "assets/default.png"
}

const currentSoldierReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "UPDATE_SOLDIER_START":
            return {
                ...state,
                isUpdating: true,
            }
        case "UPDATE_SOLDIER_SUCCESS":
            return {
                ...state,
                isUpdating: false,
                error: null,
                success: true,
            }
        case "UPDATE_SOLDIER_FAIL":
            return {
                ...state,
                isUpdating: false,
                error: action.error,
                success: false,
            }
        case "SET_CURRENT_SOLDIER":
            return {
                ...state,
                currentSoldier: action.currentSoldier,
            }
        case "RESTORE_INITIAL_STATE":
            return INITIAL_STATE;
        case "SET_SUPERIOR_LIST":
            return {
                ...state,
                superiorList: action.superiorList,
            }
        case "SET_AVATAR_URL":
            return {
                ...state,
                avatarUrl: action.avatarUrl,
            }
        case "SET_IMAGE":
            return {
                ...state,
                image: action.image,
            }
        default:
            return state;
    }
}

export default currentSoldierReducer;
