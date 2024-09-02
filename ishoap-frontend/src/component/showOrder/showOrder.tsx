import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useFetchApi } from '../../Custom-Hooks/useFetchApi';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Loadingcomponent from '../Loading/Loading';
import Order from '../../contract/Order.Details.Contract';

export const ShowOrder = () => {
    const fetchDataFromApi = useFetchApi();
    const [cookies] = useCookies(['token', 'role']);
    const token = cookies['token'];
    const navigate = useNavigate();

    const [orderData, setOrderData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);

    const LoadOrderDetails = async () => {
        setLoading(true);
        const result = await fetchDataFromApi({
            url: "http://localhost:8000/order/get-order",
            method: 'GET',
            token: token,
        });

        if (result.error) {
            setError(result.error);
        } else {
            setOrderData(result.response);
        }
        setLoading(false);
    };

    const resizeTitle = (str: string, maxLength: number): string => {
        return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
    };




    useEffect(() => {
        if (!token) {
            navigate("http://localhost:3000/");
        } else {
            LoadOrderDetails();
        }
    }, [token]);

    return (
        <>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <Loadingcomponent />
                </div>
            ) : error ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                    <Typography variant="h4" color="error" gutterBottom>
                        Orders Not Found
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        We're sorry, but the order details you are looking for do not exist or could not be found.
                    </Typography>
                </div>
            ) : orderData.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <Typography variant="h6" color="textSecondary">
                        No Orders Available
                    </Typography>
                </div>
            ) : (
                <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto' }}>
                    {orderData.map((order) => (
                        <Accordion key={order._id} sx={{ mb: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${order._id}-content`} id={`panel${order._id}-header`}>
                                <Typography variant="h6">Order ID: {order._id}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>



                                {/* Full-Width Product Details */}
                                <Box>
                                    <Typography variant="h6" gutterBottom>Products</Typography>
                                    {order.products.map((productItem) => (
                                        <Card key={productItem.productId._id} sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%', boxShadow: 'unset' }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ width: 150, height: 150, objectFit: 'cover' }}
                                                image={`http://localhost:8000/images/${productItem.productId.image[0]}`}
                                                alt={productItem.productId.name}
                                            />
                                            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                <CardContent>
                                                    <Typography variant="h6" >{resizeTitle(productItem.productId.name, 40)}</Typography>
                                                    <Typography variant="body2" sx={{ pb: 1 }}>{resizeTitle(productItem.productId.description,120)}</Typography>
                                                    <Typography variant="body2" sx={{ pb: 1 }}>Quantity: {productItem.quantity}</Typography>
                                                    <Typography variant="body2" sx={{ pb: 1 }}>Price: {productItem.productId.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</Typography>

                                                </CardContent>
                                            </Box>
                                        </Card>
                                    ))}
                                </Box>

                                <Box>
                                    <hr style={{ margin: 0, padding: 0 }} />
                                </Box>

                                {/* Horizontal layout for Order Info and Shipping Address */}
                                <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '100%', boxShadow: 'unset' }}>
                                    {/* Order Details */}
                                    <CardContent sx={{ flex: 1, paddingRight: 2 }}>
                                        <Typography variant="h6" gutterBottom>Order Information</Typography>
                                        <Typography variant="subtitle1">Date: {new Date(order.createdAt).toLocaleDateString()}</Typography>
                                        <Typography variant="subtitle1">Total Price: {order.totalPrice.toLocaleString('en-IN', { style: 'currency', currency: "INR" })}</Typography>
                                        <Typography variant="subtitle1">Payment Status: {order.paymentStatus}</Typography>
                                    </CardContent>

                                    {/* Shipping Address */}
                                    <CardContent sx={{ flex: 1, paddingLeft: 2 }}>
                                        <Typography variant="h6" gutterBottom>Shipping Address</Typography>
                                        <Typography variant="body1">{order.AddressId.name}</Typography>
                                        <Typography variant="body2">{order.AddressId.street}, {order.AddressId.city}</Typography>
                                        <Typography variant="body2">{order.AddressId.state}, {order.AddressId.country}</Typography>
                                        <Typography variant="body2">Postal Code: {order.AddressId.postalCode}</Typography>
                                        <Typography variant="body2">Mobile: {order.AddressId.mobile}</Typography>
                                    </CardContent>
                                </Card>


                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            )}
        </>
    );
};
