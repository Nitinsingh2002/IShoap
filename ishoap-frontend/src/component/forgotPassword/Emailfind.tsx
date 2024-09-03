import { Button } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';


export const FindAccount = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<String | undefined>(undefined);
    const [message, setMessage] = useState<string>();



    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email address").required("Email is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",

        },
        validationSchema: validationSchema,
        onSubmit: async (formData) => {
            setLoading(true)
            try {
                const { email } = formData;
                const response = await axios.post('http://localhost:8000/user/forgot-password', { email })
                setMessage(response.data);

            } catch (error: any) {
                setError(error.response?.data?.message || "An error occurred. Please try again.");
            } finally {
                setLoading(false)
            }
        }
    });
    return (
        <>
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


                <div className='form-group mb-2 mt-3'>
                    <Button variant="contained" type='submit' sx={{ width: '100%' }} color={loading ? "error" : 'primary'} >
                        {loading ? "Please wait" : "click here"}
                    </Button>
                </div>

                {
                    message &&
                    <div className="text-center  text-success">
                        {message}
                    </div>
                }

                {error && (
                    <div className="text-center text-danger">
                        {error}
                    </div>
                )}


            </form>
        </>
    )
}