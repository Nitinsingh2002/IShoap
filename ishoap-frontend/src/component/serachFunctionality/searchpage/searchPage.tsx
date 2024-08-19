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
            <Box sx={{ width: '100vw', padding: '1rem', display: 'flex', pb: 0 }}>

                {
                    !error &&
                    <Box sx={{ width: '20vw', }}>
                        <Filter />
                    </Box>
                }
                <Box sx={{ width: error ? '100vw' : '80vw', }}>
                    <SearchCard />
                </Box>

            </Box>
        </>
    )
}