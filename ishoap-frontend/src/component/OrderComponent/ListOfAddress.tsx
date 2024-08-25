import { useEffect, useState } from "react"
import { AddressContract } from "../../contract/addressContract";
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Loadingcomponent from "../Loading/Loading";
import { Button } from "@mui/material";
import './orderAdress.css'
import axios from "axios";
import Razorpay from 'razorpay';


export const ListOfAddress = () => {
    const [loading, SetLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState<AddressContract[]>();

    const [selectedAddress, setSelectedAddress] = useState<AddressContract>();


    const fetchDataFromApi = useFetchApi();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];
    const navigate = useNavigate();
    const ammount = 500;

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


    const handleSelectedAddress = (id: string) => {
        const selAddress = address?.find((singleAddress) => singleAddress._id == id);
        setSelectedAddress(selAddress);
    }





    const HandlePayment = async () => {
        console.log("trying to call checkout ")
        try {
            const result = await axios.post("http://localhost:8000/payment/checkout", { ammount });
            console.log(result.data);

            const keyID = " rzp_test_CIy6z3k40WoX6Z"
            // call back url for payment  

            const options = {
                key_id: keyID,
                amount: result.data.amount,
                currency: "INR",
                name: "Ishoap",
                description: "Test Transaction",
                image: "./logo192.png",
                order_id: "order_IluGWxBm9U8zJ8",    //   we have  to create 
                callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
                prefill: {
                    name: "Gaurav Kumar",
                    email: "gaurav.kumar@example.com",
                    contact: "9000090000"
                },
                notes: {
                    address: "RAZOR PAY OFFICE"
                },
                theme: {
                    color: "#3399cd"
                }
            };


            const rzp1 = new Razorpay(options);


            // document.getElementById('rzp-button1').onclick = function (e) {
            //     rzp1.open();
            // }

        } catch (error) {

        }
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
                                        <div className={selectedAddress?._id == a._id ? "single-address activeAdres" : "single-address"} key={index}
                                            onClick={() => handleSelectedAddress(a._id)}
                                        >
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

                                {
                                    selectedAddress && <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Button variant="contained" color="error" onClick={HandlePayment}>
                                            Payment
                                        </Button>
                                    </div>

                                }
                            </div>

                        )

                    }
                </div>
            </div >
        </>
    )
}