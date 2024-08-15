import { Box } from "@mui/material"
import React, { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom";

export const SearchBar = () => {
    const [searchData, setSearchData] = useState<String | undefined>(undefined);
  const navigate = useNavigate();

    const handleSearchchnage = (e: any) => {
        setSearchData(e.target.value);
    }

    // trim is used to remove leading and trailing withspace and it will return false when string is empty
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (searchData?.trim() && e.key === 'Enter') {
            navigate(`/search/${searchData}`)
        }
    }

    const handleSearchbutton = () => {
        if (searchData?.trim()) {
            navigate(`/search/${searchData}`)
        }
    }



    return (
        <>
            <Box sx={{ width: '100vw', height: '2.5rem' }}>
                <input type="text"
                    onKeyUp={handleSearch}
                    onChange={handleSearchchnage}
                    placeholder="search product in ishaop"
                    style={{ width: '92vw', height: '2.5rem', textAlign: 'center', outline: 'none', border: '1px solid gray', color: 'gray', borderRight: 'none' }} />
                <button
                    style={{ width: '8vw', height: '2.5rem', outline: 'none', border: '1px solid gray', borderLeft: 'none' }}
                    onClick={handleSearchbutton}>
                    Search
                </button>
            </Box>
        </>
    )
}