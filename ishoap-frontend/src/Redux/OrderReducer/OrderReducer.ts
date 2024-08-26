import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { CartDetails } from '../../contract/cartContract';
import { ShowAddressContract } from "../../contract/showAddressComntract";

interface orderInterface {
    loading: boolean,
    error: string | undefined,
    cartProducts: CartDetails[],
    address: ShowAddressContract | undefined
}

//creating inital state 
const initialState: orderInterface = {
    loading: false,
    error: undefined,
    cartProducts: [],
    address: undefined
}

//async thunk for creating order ........




//async thunk for creating order finished ....

//order slice 
const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setAddress(state, action) {
            state.address = action.payload;
        },
        setCartProduct(state, action) {
            state.cartProducts = action.payload;
        }
    }
})

export const { setAddress, setCartProduct } = orderSlice.actions;
export default orderSlice.reducer;




