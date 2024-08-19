
import { configureStore } from "@reduxjs/toolkit";
import SearchReducer from "./searchReducer/SearchReducer";

export const store = configureStore({
    reducer: {
        search: SearchReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;