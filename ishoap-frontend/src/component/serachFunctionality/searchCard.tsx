
import Loadingcomponent from "../Loading/Loading";
import { Box } from "@mui/material";
import './searchCard.css'
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from '../../Redux/store';


export const SearchCard = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { searchData: searchResult, loading, error } = useSelector((state: RootState) => state.search);

    const trimWord = (s: string): string => {
        const length = s.length;
        if (length > 70) {
            let str = s.substring(0, 70) + "..."
            return str;
        } else {
            return s;
        }
    }

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
                                            <Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/product/${data._id}`} key={data._id}>
                                                <div className="search_card" >
                                                    <div className="card_image">
                                                        <img className="search_card_img"
                                                            src={`http://localhost:8000/images/${data.image[0]}`}
                                                        />
                                                    </div>
                                                    <div className="card_details">
                                                        <div className="card_details_name">{trimWord(data.name)}</div>
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
                                            </Link>
                                        ))
                                    }
                                </div>
                            )
                    )
            }
        </>
    )
}