import { useEffect, useState } from "react"
import { AddressContract } from "../../contract/addressContract";
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Loadingcomponent from "../Loading/Loading";
import { Button } from "@mui/material";
import './orderAdress.css'

export const ListOfAddress = () => {
    const [loading, SetLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState<AddressContract[]>();


    const fetchDataFromApi = useFetchApi();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];
    const navigate = useNavigate();

    async function LoadAddress(): Promise<void> {
        const result = await fetchDataFromApi({
            url: "http://localhost:8000/user/get-address",
            method: "GET",
            token: token
        })

        if (result.error) {
            toast.error(result.error, {
                autoClose: 800
            })
            setError("something went wrong in fetching address! please try again letter");
        } else {
            setAddress(result.response)
        }
        SetLoading(false);
    }

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            LoadAddress();
        }
    }, [token]);





    return (
        <>
            <div className="parentat">
                <div className="at">
                    <ToastContainer />
                    {
                        loading ? (
                            <div className="text-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                                <Loadingcomponent />
                            </div>

                        ) : error ? (
                            <div className="text-center product-not-found-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                                <h2 className="product-not-found-message" style={{ color: '#ff6347', fontSize: '2rem', fontWeight: 'bold', margin: '20px 0' }}>Product Not Found</h2>
                                <p style={{ color: '#555', fontSize: '1rem' }}>We're sorry, but the product you are looking for does not exist.</p>
                            </div>
                        ) : (
                            <div className="show-all-address">
                                <h4 className="mt-2 mb-0">Pick the address where you want the product delivered</h4>
                                <hr className='w-100' />
                                <Link to="/order/add-address" >
                                    <Button variant="contained" className='add-address-btn'>

                                        <div>Add New Address</div>
                                        <div className='bi bi-plus-lg'> </div>

                                    </Button>
                                </Link>

                                {
                                    address?.map((a, index) => (
                                        <div className='single-address' key={index}>
                                            <div className='name-mobile-container'>
                                                <span>{a.name}</span>
                                                <span>{a.mobile}</span>
                                            </div>
                                            <div className='all-container'>
                                                <span >{a.street},</span>
                                                <span > {a.city},</span>
                                                <span > {a.state},</span>
                                                <span > {a.country},</span>
                                                <span > - {a.postalCode}</span>
                                            </div>
                                        </div>
                                    ))
                                }

                            </div>
                        )

                    }
                </div>
            </div>
        </>
    )
}