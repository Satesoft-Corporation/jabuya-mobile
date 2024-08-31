import { combineReducers } from "redux";
import userReducer from "./userReducer";
import salesReducer from "./salesReducer";

const rootReducer = combineReducers({
  userData: userReducer,
  sales: salesReducer,
});

export default rootReducer;
