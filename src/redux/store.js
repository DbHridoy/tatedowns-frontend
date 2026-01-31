
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice.js";
import { baseApi } from "./baseApi.js";
import storage from 'redux-persist/lib/storage'

import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import { setupListeners } from "@reduxjs/toolkit/query";

const persistedConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
};

const combinedReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistedReducer = persistReducer(persistedConfig, combinedReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
