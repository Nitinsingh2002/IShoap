import { Box, Typography } from "@mui/material";

export const OrderSuccess = () => {
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
                    color: '#4caf50', 
                    fontWeight: 'bold' 
                }}
            >
                Order Successful
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
