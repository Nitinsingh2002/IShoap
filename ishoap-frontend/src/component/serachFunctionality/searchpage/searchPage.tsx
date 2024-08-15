import { Box } from "@mui/material"
import { Filter } from "../filter"
import { SearchCard } from "../searchCard"




export const SearchPage = () => {
    return (
        <>
            <Box sx={{ width: '100vw', padding: '1rem', display: 'flex', pb: 0 }}>
                <Box sx={{ width: '20vw' }}>
                    <Filter />
                </Box>

                <Box sx={{ width: '80vw',}}>
                    <SearchCard />
                </Box>
            </Box>
        </>
    )
}