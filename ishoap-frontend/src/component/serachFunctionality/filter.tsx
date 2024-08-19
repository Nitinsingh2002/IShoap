import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../Redux/store';
import { fetchSearchResults, setMaxPrice, setMinPrice } from '../../Redux/searchReducer/SearchReducer';
import { useSelector } from 'react-redux';



export const Filter = () => {


    const [showFilterButton, setShowFilterButton] = useState<boolean>(true);
    const dispatch = useDispatch<AppDispatch>();


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


    const handleShowFilter = () => {
        setShowFilterButton(!showFilterButton);
    }




    return (
        <>
            <Box sx={{ bgcolor: "white", borderRadius: '5px', paddingLeft: '0.75rem', paddingBottom: { xs: 1, sm: 2 },paddingTop:{xs:1,sm:0} }}>


                <Box sx={{ display: { xs: 'block', sm: 'none' }, justifyContent: 'center', alignItems: 'center' }}>
                    {
                        showFilterButton ?
                            <Typography variant="h6" onClick={handleShowFilter}  >  <i className="bi bi-list"></i>  Filter Option </Typography>
                            :
                            <Typography variant="h6" onClick={handleShowFilter} > <i className="bi bi-x-circle-fill"></i>    </Typography>
                    }
                </Box>



                <Typography variant='h6' sx={{ display: { xs: 'none', sm: 'block' } }}>Filter options</Typography>

                <hr className='searchHr' />

                <Box className={showFilterButton ? "slidingFilter" : "reverseSliding"}
                    sx={{ display: { xs: 'flex', sm: "block" }, justifyContent: 'space-between', alignItems: 'center', padding: { xs: '0 0.5rem', sm: 0 } }}
                >


                    <Box sx={{ display: "flex", gap: "0.3rem", alignItems: 'center', }}>
                        <Typography variant='body2'>Min price :</Typography>
                        <input type=" text"
                            value={minPrice}
                            onChange={handleMinPrice}
                            className='inputSearchMinMax'
                        />
                    </Box>


                    <Box sx={{ display: "flex", gap: "0.3rem", mt: { xs: 0, sm: 2 }, alignItems: 'center' }}>
                        <Typography variant='body2'>Max price :</Typography>
                        <input type=" text"
                            value={maxPrice}
                            onChange={handleMaxPrice}
                            className='inputSearchMinMax'
                        />
                    </Box>
                    <Button
                        onClick={handleFilter}
                        variant="contained" size="small" sx={{ mt: { xs: 0, sm: 1 } }}>
                        Apply filter
                    </Button>
                </Box>
            </Box>
        </>
    )
}