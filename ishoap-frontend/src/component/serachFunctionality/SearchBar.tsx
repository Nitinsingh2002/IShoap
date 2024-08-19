import { Box } from "@mui/material"
import React, { useState } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSearchResults, setQuery } from "../../Redux/searchReducer/SearchReducer";
import { AppDispatch, RootState } from '../../Redux/store'
import { useSelector } from "react-redux";



export const SearchBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>()

    const handleSearchchnage = (e: any) => {
        dispatch(setQuery(e.target.value));
    }

    const { query } = useSelector((state: RootState) => state.search);

    // trim is used to remove leading and trailing withspace and it will return false when string is empty
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (query?.trim() && e.key === 'Enter') {
            navigate(`/search/${query}`)
            dispatch(fetchSearchResults({ query }));
        }
    }

    const handleSearchbutton = () => {
        if (query?.trim()) {
            navigate(`/search/${query}`)
            dispatch(fetchSearchResults({ query }));
        }
    }



    return (
        <>
            <Box sx={{ width: '100vw', height: '2.5rem' }}>
                <input type="text"
                    onKeyUp={handleSearch}
                    onChange={handleSearchchnage}
                    placeholder="search product in ishaop"
                    className="responsive-input"
                />
                <button
                    className="searchButton"
                    onClick={handleSearchbutton}>
                    Search
                </button>
            </Box>
        </>
    )
}