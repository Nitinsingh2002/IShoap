import { useFormik } from "formik";
import { UserLogin } from '../../contract/loginContract';
import * as Yup from 'yup';
import { Button, hexToRgb } from "@mui/material";
import '../user-Login/login.css';
import axios from "axios";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";



export function AdminLogin() {

    const [cookies, setCookie, removeCookie] = useCookies(['token', 'role']);
    const [islogin, setIsLogin] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const navigate = useNavigate();

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
                const response = await axios.post('http://localhost:8000/admin/login', { email, password })
                setCookie('token', response.data, { expires: expirationTime, path: '/admin' });
                setCookie('role', 'admin', { expires: expirationTime, path: '/admin' });

                navigate("/admin");
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(error.response.data);
                } else {
                    toast.error("something went wrong in user login")
                }
            } finally {
                setIsLogin(false)
            }
        }
    });

    return (

        <>


            <form onSubmit={formik.handleSubmit} className="login-form">
                <h2 className="text-center mb-2 pt-2">Admin Login</h2>

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
                    <Button variant="contained" type='submit' className='w-100' disabled={islogin}>Login</Button>
                </div>

                {
                    error && <div className="w-100 text-center text-danger"> {error}</div>
                }

            </form>



        </>
    );
}
