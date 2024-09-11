import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import logger from "redux-logger";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import rootReducer from "reducers";

const persistConfig = {
  key: "duqact",
  storage: AsyncStorage,
  timeout: 100000,
  stateReconciler: autoMergeLevel2,
};

let middleware = [thunk];
if (process.env.NODE_ENV === "development") {
  middleware.push(logger);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
const duqactStore = createStore(
  persistedReducer,
  applyMiddleware(...middleware)
);
const persistor = persistStore(duqactStore);

export { duqactStore, persistor };
