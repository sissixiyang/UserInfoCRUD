import { combineReducers } from "redux";
import soldierListReducer from "./soldierListReducer";
import newSoldierReducer from "./newSoldierReducer";
import currentSoldierReducer from "./currentSoldierReducer";
import scrollReducer from "./scollerReducer";

const reducers = combineReducers({
  soldierListReducer,
  newSoldierReducer,
  currentSoldierReducer,
  scrollReducer,
});

export default reducers;
