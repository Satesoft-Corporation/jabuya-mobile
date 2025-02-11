import { combineReducers } from "redux";
import userReducer from "./userReducer";
import shopReducer from "./shopReducer";

const rootReducer = combineReducers({
  userData: userReducer,
  shop: shopReducer,
});

export default rootReducer;
