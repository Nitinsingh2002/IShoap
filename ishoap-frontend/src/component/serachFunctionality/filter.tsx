import { Box, Button, Divider, InputAdornmentClasses } from '@mui/material';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

export const Filter = () => {
    const [minPrice, setMinPrice] = useState<number>();
    const [maxPrice, setMaxPrice] = useState<number>();

    const handleMinPrice = (e: any) => {
        setMinPrice(e.target.value);
    }
    const handleMaxPrice = (e: any) => {
        setMaxPrice(e.target.value);
    }

    const handleFilter  = (e:any) =>{
          alert("filter button clicked")
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