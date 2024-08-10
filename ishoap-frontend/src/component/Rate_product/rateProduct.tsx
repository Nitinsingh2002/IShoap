import { useEffect, useState } from 'react'
import './rateproduct.css'
import { Button } from '@mui/material';
import { useFetchApi } from '../../Custom-Hooks/useFetchApi';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { RatingDetailsContract } from "../../contract/ratingDetails.contract"




export function RateProduct() {
    const [rating, setRatingValue] = useState<RatingDetailsContract>({ rating: 0 });
    const fetchDataFromApi = useFetchApi();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];
    const [ratingDetails, setRatingDetails] = useState<RatingDetailsContract>();
    const navigate = useNavigate();
    const { id } = useParams();

    const addRating = async () => {

        const result = await fetchDataFromApi({
            method: 'POST',
            url: `http://localhost:8000/rating/add-rating/product/${id}`,
            token: token,
            data: { rating: rating.rating }
        })
        if (result.error) {
            toast.error(result.error, {
                autoClose: 1000
            })
            setTimeout(() => {
                navigate(`/product/${id}`)
            }, 1100)
        } else {
            toast.success("Rating added", {
                autoClose: 1000
            })
            setTimeout(() => {
                navigate(`/product/${id}`)
            }, 1100)
        }
    }


    const fetchRating = async () => {
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/rating/get-rating/${id}`,
            token: token,
            method: 'GET'
        })

        if (result.error) {
            toast.error(result.error)
        } else {
            setRatingDetails(result.response);
            setRatingValue({
                _id: result.response._id,
                rating: result.response.rating
            });
        }
    }


    useEffect(() => {
        fetchRating();
    }, [])


    const updateRating = async () => {
        const ratingId = ratingDetails?._id;
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/rating/upadte-rating/${ratingId}/product/${id}`,
            token: token,
            method: 'PUT',
            data: { rating: rating.rating }
        })
        if (result.error) {
            toast.error(result.error, {
                autoClose: 1000
            });
            setTimeout(() => {
                navigate(`/product/${id}`)
            }, 1100)
        } else {
            toast.success('Rating updated sucessfully', {
                autoClose: 1000
            });
            setTimeout(() => {
                navigate(`/product/${id}`)
            }, 1100)
        }
    }

    const deleteRating = async () => {
        const ratingId = ratingDetails?._id;
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/rating/remove-rating/${ratingId}/product/${id}`,
            token: token,
            method: 'DELETE'
        })
        if (result.error) {
            toast.error(result.error, {
                autoClose: 1000
            });
            setTimeout(() => {
                navigate(`/product/${id}`)
            }, 1100)
        } else {
            toast.error('Your Rating Deleted Sucessfully', {
                autoClose: 1000
            });
            setTimeout(() => {
                navigate(`/product/${id}`)
            }, 1100)
        }
    }



    return (
        <>
            <ToastContainer />
            {
                ratingDetails ? (
                    <div className='fetch-rating'>

                        <div className='fetch_updated'>
                            <p className='already' >You already rate this product</p>
                            <span className={`bi bi-star-fill fs-3 me-4 ${rating.rating >= 1 ? 'bg-color-star' : ''}`} onClick={() => setRatingValue({ rating: 1 })}></span>
                            <span className={`bi bi-star-fill fs-3 me-4 ${rating.rating >= 2 ? 'bg-color-star' : ''}`} onClick={() => setRatingValue({ rating: 2 })}></span>
                            <span className={`bi bi-star-fill fs-3 me-4 ${rating.rating >= 3 ? 'bg-color-star' : ''}`} onClick={() => setRatingValue({ rating: 3 })}></span>
                            <span className={`bi bi-star-fill fs-3 me-4 ${rating.rating >= 4 ? 'bg-color-star' : ''}`} onClick={() => setRatingValue({ rating: 4 })}></span>
                            <span className={`bi bi-star-fill fs-3 me-4 ${rating.rating >= 5 ? 'bg-color-star' : ''}`} onClick={() => setRatingValue({ rating: 5 })}></span>
                        </div>
                        <div className='rating-update-delete-button'>
                            <Button className='mt-3' variant='contained' onClick={updateRating}>Update</Button>
                            <Button className='mt-3 bg-danger' variant='contained' onClick={deleteRating}>Delete</Button>
                        </div>
                    </div>
                ) :
                    (
                        <>
                            <div className='fetch-rating'>
                            <div className='fetch_updated'>
                                    <span className={`bi bi-star-fill fs-3 me-4 ${rating.rating >= 1 ? 'bg-color-star' : ''}`} onClick={() => setRatingValue({ rating: 1 })}></span>
                                    <span className={`bi bi-star-fill fs-3 me-4 ${rating.rating >= 2 ? 'bg-color-star' : ''}`} onClick={() => setRatingValue({ rating: 2 })}></span>
                                    <span className={`bi bi-star-fill fs-3 me-4 ${rating.rating >= 3 ? 'bg-color-star' : ''}`} onClick={() => setRatingValue({ rating: 3 })}></span>
                                    <span className={`bi bi-star-fill fs-3 me-4 ${rating.rating >= 4 ? 'bg-color-star' : ''}`} onClick={() => setRatingValue({ rating: 4 })}></span>
                                    <span className={`bi bi-star-fill fs-3 me-4 ${rating.rating >= 5 ? 'bg-color-star' : ''}`} onClick={() => setRatingValue({ rating: 5 })}></span>
                                </div>
                                <div className='rating-button'>
                                    <Button className='mt-3' variant='contained' onClick={addRating} >Submit rating</Button>
                                </div>
                            </div>

                        </>
                    )
            }
        </>
    )
}