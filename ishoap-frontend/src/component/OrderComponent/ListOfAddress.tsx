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
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { useDispatch } from "react-redux";
import { setAddress } from "../../Redux/OrderReducer/OrderReducer";
import OrderDataContract from '../../contract/Orders.contract';
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../../contract/DecodedTokenContract";



export const ListOfAddress = () => {
    const [loading, SetLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddres] = useState<AddressContract[]>();
    const [selectedAddress, setSelectedAddress] = useState<AddressContract>();
    const fetchDataFromApi = useFetchApi();
    const [cookies] = useCookies(['token']);
    const token = cookies['token'];
    const navigate = useNavigate();
    const [currentOrderId, setCurrentOrderId] = useState<string>();
    const [currentOrderDetails, setCurrentOrderDetails] = useState<OrderDataContract>();
    const [decodedToken, setDecodedToken] = useState<DecodedToken>()
    const [paymentLoading, setPaymentLoading] = useState<boolean>(false);


    const dispatch = useDispatch<AppDispatch>();

    async function LoadAddress(): Promise<void> {
        const result = await fetchDataFromApi({
            url: "http://localhost:8000/user/get-address",
            method: "GET",
            token: token
        });

        if (result.error) {
            toast.error(result.error, {
                autoClose: 800
            });
            setError("something went wrong in fetching address! please try again later");
        } else {
            setAddres(result.response);
        }
        SetLoading(false);
    }

    const handleSelectedAddress = (id: string) => {
        const selAddress = address?.find((singleAddress) => singleAddress._id === id);
        setSelectedAddress(selAddress);
        dispatch(setAddress(selAddress));
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const HandlePayment = async (totalPrice: number, id: string) => {
        const res = await loadRazorpayScript();
        setPaymentLoading(false);
        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            navigate(`/order/fail/${id}`);
            return;
        }

        try {
            const result = await axios.post("http://localhost:8000/payment/checkout", { amount: totalPrice });

            const options = {
                key: "rzp_test_CIy6z3k40WoX6Z",
                amount: currentOrderDetails?.totalPrice,
                currency: "INR",
                name: "Ishoap",
                description: "Transaction of order made by customer",
                image: "/logo192.png",
                order_id: result.data.id, // Pass the order ID obtained in the response of sever creating order
                callback_url: `http://localhost:8000/payment/verify/${id}`, // Your verification endpoint
                prefill: {
                    name: decodedToken?.name || "",
                    email: decodedToken?.email || "",
                    contact: selectedAddress?.mobile || ""
                },
                notes: {
                    address: selectedAddress?.street || ""
                },
                theme: {
                    color: "#3399cc"
                },
                //to perform action when user click on dismiss payment x icon persent in razor pay
                modal: {
                    ondismiss: function () {
                        setPaymentLoading(false);
                        navigate(`/order/fail/${id}`);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            setPaymentLoading(false);

        } catch (error) {
            setPaymentLoading(false);
            navigate(`/order/fail/${id}`);
        }
    };

    //   function to place Order 
    const adressFromStore = useSelector((state: RootState) => state.order.address);
    const cartDataFromStore = useSelector((state: RootState) => state.order.cartProducts)

    const PlaceOrder = async () => {
        setPaymentLoading(true);
        const result = await fetchDataFromApi({
            url: "http://localhost:8000/order/add-order",
            method: "POST",
            token: token,
            data: { products: cartDataFromStore, addressId: adressFromStore?._id }
        });
        if (result.error) {
            navigate("/order/fail");
        } else {
            setCurrentOrderId(result.response);
            //return id of current order
            getOrderDetails(result.response);
        }
    }



    // function to get order details 
    const getOrderDetails = async (currentOrderId: string) => {
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/order/get-currentOrder/${currentOrderId}`,
            method: "GET",
            token: token
        })

        if (result.error) {
            navigate(`/order/fail/${currentOrderId}`);
        } else {
            setCurrentOrderDetails(result.response);
            HandlePayment(result.response.totalPrice, result.response._id)
        }
    }




    useEffect(() => {

        if (!token) {
            navigate('/login');
        } else {
            LoadAddress();
            const decode: any = jwtDecode(token);
            setDecodedToken(decode);

        }
    }, [token]);

    return (
        <>
            <div className="parentat">
                <div className="at">
                    <ToastContainer />
                    {loading || paymentLoading ? (
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
                            <Link to="/order/add-address">
                                <Button variant="contained" className='add-address-btn'>
                                    <div>Add New Address</div>
                                    <div className='bi bi-plus-lg'></div>
                                </Button>
                            </Link>

                            {address?.map((a, index) => (
                                <div className={selectedAddress?._id === a._id ? "single-address activeAdres" : "single-address"} key={index}
                                    onClick={() => handleSelectedAddress(a._id)}
                                >
                                    <div className='name-mobile-container'>
                                        <span>{a.name}</span>
                                        <span>{a.mobile}</span>
                                    </div>
                                    <div className='all-container'>
                                        <span>{a.street},</span>
                                        <span>{a.city},</span>
                                        <span>{a.state},</span>
                                        <span>{a.country},</span>
                                        <span> - {a.postalCode}</span>
                                    </div>
                                </div>
                            ))}

                            {selectedAddress && (
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button variant="contained" color="error" onClick={PlaceOrder}>
                                        Payment
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
