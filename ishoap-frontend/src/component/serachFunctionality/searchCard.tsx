import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { ProductDetails } from '../../contract/productDetails.contract';
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";
import { useCookies } from "react-cookie";
import Loadingcomponent from "../Loading/Loading";
import { AddBox } from "@mui/icons-material";
import { Box } from "@mui/material";
import './searchCard.css'

export const SearchCard = () => {
    const { query } = useParams();
    const [searchResult, setSearchResult] = useState<ProductDetails[]>([]);

    const [error, setError] = useState();
    const [loading, setLoading] = useState<boolean>(true);
    const fetchDataFromApi = useFetchApi();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];
    const navigate = useNavigate();

    const LoadSearchResult = async (query: any) => {
        console.log("function called")
        setLoading(true);
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/product/serach/?query=${query}`,
            method: "GET",
            token: token,
        })
        if (result.error) {
            setError(result.error);
        } else {
            console.log("response feacthed from api", result.response)
            setSearchResult(result.response);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            LoadSearchResult(query);
        }
    }, [])

    console.log(searchResult)

    return (
        <>
            {
                loading ?
                    (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '85vh' }}><Loadingcomponent /></Box>
                    ) :
                    (
                        error ?
                            (
                                <div className="text-center product-not-found-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                                    <h2 className="product-not-found-message" style={{ color: '#ff6347', fontSize: '2rem', fontWeight: 'bold', margin: '20px 0' }}>Product Not Found</h2>
                                    <p style={{ color: '#555', fontSize: '1rem' }}>We're sorry, but the product you are looking for does not exist.</p>
                                </div>
                            )
                            :
                            (
                                <div className="search_card_conatiner">
                                    {
                                        searchResult.map((data) => (
                                            <div className="search_card" key={data._id}>
                                                <div className="card_image">
                                                    <img className="search_card_img"
                                                        src={`http://localhost:8000/images/${data.image[0]}`}
                                                    />
                                                </div>
                                                <div className="card_details">
                                                    <div className="card_details_name">{data.name}</div>
                                                    <div>
                                                        <span className="card_details_left_side">Special Price: </span>
                                                        <span className="bold"> {data.price.toLocaleString('en-In', { style: 'currency', currency: 'INR' })}</span>
                                                        <span className="dicPrice"><s>{(data.price + 200).toLocaleString('en-In', { style: 'currency', currency: 'INR' })}</s></span>
                                                    </div>
                                                    <div> <span className="card_details_left_side">Sold By:</span><span className="bold"> {(data.vendorId.name)} </span> </div>
                                                    <div>
                                                        <span className="card_details_left_side">Rating: </span>
                                                        <span className="bold">{data.rating.rate}</span>
                                                        <span className="bi bi-star-fill    color_star" ></span>
                                                    </div>
                                                
                                                    <div><span className="bold">{data.stock > 0 ? "In Stock" : "Out of stock"}</span></div>

                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                    )
            }
        </>
    )
}