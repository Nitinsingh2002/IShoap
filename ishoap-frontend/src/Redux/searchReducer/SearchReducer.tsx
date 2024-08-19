import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { ProductDetails } from "../../contract/productDetails.contract";


// creating interface to create initial store in tsx
interface SearchState {
    searchData: ProductDetails[],
    loading: boolean,
    error: string | undefined,
    query: string,
    minPrice?: number | undefined,
    maxPrice?: number | undefined
}

//creating initial state 
const initialState: SearchState = {
    searchData: [],
    loading: true,
    error: undefined,
    query: '',
    minPrice: undefined,
    maxPrice: undefined
};

//function to call search result  
export const fetchSearchResults = createAsyncThunk<ProductDetails[],
    { query: string, minPrice?: number, maxPrice?: number },
    { rejectValue: string }
>(
    'search/fetchSearchResults',
    async ({ query, minPrice, maxPrice }, { rejectWithValue }) => {
        try {
            console.log("asynthunk call")
            let url = `http://localhost:8000/product/serach/?query=${query}`;
            if (minPrice !== undefined) {
                url += `&minPrice=${minPrice}`;
            }
            if (maxPrice !== undefined) {
                url += `&maxPrice=${maxPrice}`;
            }
            const response = await axios.get(url);
            return response.data;
        } catch (error: any) {
            const axiosError = error as AxiosError<{ message: string }>;
            return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch search results");
        }
    }
);



const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery(state, action) {
            state.query = action.payload
        },
        setMinPrice(state, action) {
            state.minPrice = action.payload
        },
        setMaxPrice(state, action) {
            state.maxPrice = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchResults.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.loading = false;
                state.searchData = action.payload;
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.minPrice =undefined;
                state.maxPrice = undefined;
            });
    },
});

export const { setQuery, setMinPrice, setMaxPrice } = searchSlice.actions;
export default searchSlice.reducer;
