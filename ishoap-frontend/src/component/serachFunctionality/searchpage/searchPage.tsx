import { Box } from "@mui/material"
import { Filter } from "../filter"
import { SearchCard } from "../searchCard"
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../Redux/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSearchResults } from "../../../Redux/searchReducer/SearchReducer";






export const SearchPage = () => {


    const { query } = useParams<{ query?: string }>();



    const dispatch = useDispatch<AppDispatch>();
    const error = useSelector((state: RootState) => state.search.error);
    const [cookies] = useCookies(['token']);
    const token = cookies['token'];
    const navigate = useNavigate();

    console.log("query is ", query)

    useEffect(() => {
        console.log("screen rerender")
        if (!token) {
            navigate('/login');
        }
        else if (query) {
            dispatch(fetchSearchResults({ query }));
        }
    }, [query]);






    return (
        <>
            <Box sx={{
                width: '100vw',
                minHeight: "90vh",
                padding: { xs: '0.5rem 0', sm: '0.5rem 1rem' },
                bgcolor: 'rgb(233, 231, 231)',
                display: 'flex', pb: 0,

                gap: '1vw',
                flexDirection: { xs: 'column', sm: 'row' }
            }}>

                {
                    !error &&
                    <Box sx={{ width: { xs: '100vw', sm: '20vw' } }}>
                        <Filter />
                    </Box>
                }
                <Box sx={{ width: error ? '100vw' : { xs: '100vw', sm: '79vw' } }}>

                    <SearchCard />
                </Box>

            </Box>
        </>
    )
}