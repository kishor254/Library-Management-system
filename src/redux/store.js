import { configureStore } from "@reduxjs/toolkit";
import libraryReducer from "./librarySlice";
import { libraryMiddleware } from "./middleware/libraryMiddleware";

export const store = configureStore({
  reducer: {
    library: libraryReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(libraryMiddleware),
  devTools: true
});

export default store;