import axios from 'axios';




export const GoogleAuth = () => {


    const handleGoogleLogin = async () => {
        try {
            
            const response = await axios.get('http://localhost:8000/user/auth/google', {
                withCredentials: true 
            });
            console.log('Successful Google Login:', response.data);
        } catch (error) {
            console.error('Error during Google Login:', error);
        }
    };



    return (
        <>
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </>
    )
}