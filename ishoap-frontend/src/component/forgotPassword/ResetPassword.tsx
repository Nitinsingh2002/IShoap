import { Button } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useParams } from "react-router-dom";
import * as Yup from 'yup';

export const ResetPassword = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [message, setMessage] = useState<string>();
    const { token } = useParams();
    console.log(token)

    const validationSchema = Yup.object().shape({
        password: Yup.string()
        .matches(
            /^(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'?/>.<,]).{8,}$/,
            'Password must be at least 8 characters long, include at least one number, and one special character'
        )
        .required('Password is required')
    });

    const formik = useFormik({
        initialValues: {
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (formData) => {
            setLoading(true);
            try {
                const { password } = formData;
                const response = await axios.post(`http://localhost:8000/user/reset-password/${token}`, { password });
                setMessage(response.data);
                setError(undefined)
            } catch (error: any) {
                setError(error.response?.data?.message || "An error occurred. Please try again.");
                setMessage("");
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <>
            <form onSubmit={formik.handleSubmit} className="login-form">
                <h2 className="text-center mb-2 pt-2">Ishoap</h2>

                <div className='form-group mb-2'>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.password && formik.touched.password && (
                        <div className="text-danger ">{formik.errors.password}</div>
                    )}
                </div>

                <div className='form-group mb-2 mt-3'>
                    <Button
                        variant="contained"
                        type='submit'
                        sx={{ width: '100%' }}
                        color={loading ? "error" : 'primary'}
                    >
                        {loading ? "Please wait" : "Reset password"}
                    </Button>
                </div>

                {message && (
                    <div className="text-center text-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="text-center text-danger">
                        {error}
                    </div>
                )}
            </form>
        </>
    );
};
