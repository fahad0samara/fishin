import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";

import categoryReducer from "./category/categorySlice";
import darkModeReducer from "./Darkmode/darkModeSlice";
import productReducer from "./Product/productSlice";
import authReducer from "../auth/authSlice";

import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart", "darkmode"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    category: categoryReducer,
    product: productReducer,
    darkmode: darkModeReducer,
    auth: authReducer,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
