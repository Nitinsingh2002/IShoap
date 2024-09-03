import { useFormik } from "formik";
import { UserLogin } from '../../contract/loginContract';
import * as Yup from 'yup';
import { Button, Divider, hexToRgb } from "@mui/material";
import './login.css';
import axios from "axios";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GitHub, Google } from '@mui/icons-material';




export function Userlogin() {
    let navigate = useNavigate();

    const [cookies, setCookie, removeCookie] = useCookies(['token', 'role']);
    const [islogin, setIsLogin] = useState<boolean>(false)


    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().required("Password is required")
    });

    const formik = useFormik<UserLogin>({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (formData) => {
            setIsLogin(true)
            try {
                const expirationTime = new Date();
                expirationTime.setTime(expirationTime.getTime() + (4 * 60 * 60 * 1000));
                const { email, password } = formData;
                const response = await axios.post('http://localhost:8000/user/user-login', { email, password })
                setCookie('token', response.data, { expires: expirationTime })
                setCookie('role', 'user', { expires: expirationTime });
                navigate("/");
                toast.success("Login sucessfull !")
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    toast.error(error.response.data)
                } else {
                    toast.error("something went wrong in user login")
                }
            } finally {
                setIsLogin(false)
            }
        }
    });


    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/user/auth/google';
    };

    const handleGithubLogin = () => {
        window.location.href = 'http://localhost:8000/user/auth/github';
    }

    return (

        <>
            <ToastContainer />
            <form onSubmit={formik.handleSubmit} className="login-form">
                <h2 className="text-center mb-2 pt-2">Ishoap</h2>

                <div className='form-group mb-2'>
                    <label htmlFor="email">Email</label>
                    <input type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.email && formik.touched.email && <div className="text-danger">{formik.errors.email}</div>}
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="password">Password</label>
                    <input type="password"
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        id="password"
                        className="form-control"
                    />
                    {formik.errors.password && formik.touched.password && <div className="text-danger">{formik.errors.password}</div>}
                </div>

                <div className='form-group mb-2 mt-3'>
                    <Button variant="contained" type='submit' className='form-control' disabled={islogin}>Login</Button>
                </div>


                <Divider className="mb-2">OR</Divider>

                {/* <div className="form-group mb-2 d-flex"  style={{gap:'1rem'}}> */}
                <div>
                    <Button
                        onClick={handleGoogleLogin}
                        variant="outlined"
                        sx={{
                            width: "100%",
                            borderColor: "black",
                            borderRadius:'10px'
                          }}
                        style={{
                            width: "100%",
                            color:"black"
                        }}
                        className=" google-button google-button"
                        startIcon={<Google />}

                    >
                        Login with Google
                    </Button>

                    <Button
                        onClick={handleGithubLogin}
                        variant="outlined"
                        sx={{
                            width: "100%",
                            borderColor: "black",
                            borderRadius:'10px'
                          }}
                        style={{
                            width: "100%",
                            color:"black"
                        }}
                        className=" google-button google-button mt-2"
                        startIcon={<GitHub sx={{ color: "black" }} />}
                       
                    >
                        Login with Github
                    </Button>
                </div>


          <hr  />

             
  
                <div className="form-group ">
                    <button className="btn btn-link form-control text-center"><Link to="/user/forgotPassword">Forgot password? click here </Link></button>
                </div>


                <div className="form-group mb-2 mt-0">
                    <button className="btn btn-link form-control text-center"><Link to="/register">Don't have an account? Register</Link></button>
                </div>


            </form>
        </>
    );
}
