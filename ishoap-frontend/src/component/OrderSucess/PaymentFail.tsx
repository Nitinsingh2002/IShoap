import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";

export const OrderFail = () => {
    const { orderId } = useParams();
    const fetchDataFromApi = useFetchApi();

    const deleteOrder = async () => {
        try {
            const result = await fetchDataFromApi({
                url: `http://localhost:8000/payment/remove/order/${orderId}`,
                method: 'delete'
            })
        } catch (error) {
            console.log("failed to delete order")
        }
    }

    useEffect(() => {
        deleteOrder();
    }, [orderId])



    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '90vh',
                backgroundColor: '#f0f0f0',
                padding: 3,
                borderRadius: 2,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    marginBottom: 2,
                    color: '#f44336',
                    fontWeight: 'bold'
                }}
            >
                Payment Failed
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: '#555',
                    textAlign: 'center',
                    marginBottom: 2,
                }}
            >
                We were unable to complete your order due to a payment issue. Please try again or contact customer support.
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: '#555',
                    cursor: 'pointer',
                    '&:hover': {
                        textDecoration: 'underline'
                    }
                }}
                onClick={() => window.location.href = '/'}
            >
                Return to Home Page
            </Typography>
        </Box>
    );
};
