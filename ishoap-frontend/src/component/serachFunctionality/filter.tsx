import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../Redux/store';
import { fetchSearchResults, setMaxPrice, setMinPrice } from '../../Redux/searchReducer/SearchReducer';
import { useSelector } from 'react-redux';



export const Filter = () => {

    const dispatch = useDispatch<AppDispatch>();
    // const { query } = useParams();

    const { query, minPrice, maxPrice } = useSelector((state: RootState) => state.search);

    const handleMinPrice = (e: any) => {
        const value = e.target.value;
        dispatch(setMinPrice(value ? parseFloat(value) : undefined));

    }
    const handleMaxPrice = (e: any) => {
        const value = e.target.value;
        dispatch((setMaxPrice(value ? parseFloat(value) : undefined)));

    }

    const handleFilter = (e: any) => {
        if (query != undefined) {
            dispatch(fetchSearchResults({ query, minPrice, maxPrice }))
        }
    }





    return (
        <>
            <Typography variant='h6' sx={{}}>Filter options</Typography>
            <hr style={{ marginRight: '0.5rem', marginTop: '0.3rem' }} />

            <Box sx={{ display: "flex", gap: "0.3rem", alignContent: 'center' }}>
                <Typography variant='body2'>Min price :</Typography>
                <input type=" text"
                    value={minPrice}
                    onChange={handleMinPrice}
                    style={{ borderRadius: "8px", outline: "none", border: '1px solid gray', width: '8vw', paddingLeft: '0.5rem', color: 'gray' }}
                />
            </Box>


            <Box sx={{ display: "flex", gap: "0.3rem", mt: 2, alignContent: 'center' }}>
                <Typography variant='body2'>Max price :</Typography>
                <input type=" text"
                    value={maxPrice}
                    onChange={handleMaxPrice}
                    style={{
                        borderRadius: "8px", outline: "none", border: '1px solid gray',
                        width: '8vw', paddingLeft: '0.5rem', color: 'gray'
                    }}
                />
            </Box>
            <Button
                onClick={handleFilter}
                variant="contained" size="small" sx={{ mt: 1 }}>
                Apply filter
            </Button>
        </>
    )
}