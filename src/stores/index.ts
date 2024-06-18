import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import parseReducer from "./parse";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { version } from "../../package.json"


import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "lx-parse",
  version: Number(version.replaceAll(".", "")),
  storage,
  // blacklist: ["iframeSrc", "keyCount", "activeIndex", "activeIndex", "hasRecentSelection"],
  whitelist: ["history"] // , "activeIndex"
};

const persistedReducer = persistReducer(persistConfig, parseReducer);

export const store = configureStore({
  reducer: { parse: persistedReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
