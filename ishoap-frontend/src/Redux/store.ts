
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import SearchReducer from "./searchReducer/SearchReducer";
import OrderReducer from './OrderReducer/OrderReducer';


const rootReducer = combineReducers({
    order: OrderReducer,
    search: SearchReducer
});

export const store = configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;