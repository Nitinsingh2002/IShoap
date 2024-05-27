
import { useFormik } from 'formik'
import { VendorRegistraion } from '../../contract/vendorRegistraionContract'
import * as Yup from 'yup'
import { useFetchApi } from "../../Custom-Hooks/useFetchApi"
import { error } from 'console'
import { ToastContainer, toast } from 'react-toastify'
import { Button } from '@mui/material'
import { useCookies } from "react-cookie";
import { Link, useNavigate } from 'react-router-dom'


export const VendorLogin = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const fetchDataFromApi = useFetchApi();
    const validationSchema = Yup.object().shape({
        email: Yup.string().required('email is required').email('please enter valid email'),
        password: Yup.string().required('password is required')
    })

    const formik = useFormik<VendorRegistraion>({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (formData, { resetForm }) => {
            const expirationTime = new Date();
            expirationTime.setTime(expirationTime.getTime() + (4 * 60 * 60 * 1000));
            const { email, password } = formData;
            console.log(email, password)
            const result = await fetchDataFromApi({
                url: 'http://localhost:8000/vendor/login',
                method: 'POST',
                data: { email: email, password: password }
            })
            if (result.error) {
                toast.error(result.error, {
                    autoClose: 1000
                });
            } else {
                setCookie('token', result.response, {
                    expires: expirationTime,
                    path:'/vendor'
                });
                resetForm();
                navigate('/vendor');
            }

        }
    })
    return (
        <>
            <ToastContainer />
            <form onSubmit={formik.handleSubmit} className="login-form">
                <h2 className="text-center mb-2 pt-2">Vendor Login</h2>

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
                    <Button variant="contained" type='submit' style={{ width: '100%' }} >Login</Button>
                </div>

                <div className="form-group mb-2">
                    <p className="btn btn-link w-100 text-center" style={{ margin: '0' }}><Link to="/vendor/registration">Don't have an account? Register</Link></p>
                </div>
            </form>
        </>
    )
}