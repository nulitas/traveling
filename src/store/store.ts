import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/api";
import authReducer from "@/store/modules/authSlice";
import articleReducer from "@/store/modules/articleSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    article: articleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
