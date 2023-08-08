import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";

import categoryReducer from "./category/categorySlice";
import darkModeReducer from "./Darkmode/darkModeSlice";
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

    darkmode: darkModeReducer,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AppDispatch = typeof store.dispatch;
