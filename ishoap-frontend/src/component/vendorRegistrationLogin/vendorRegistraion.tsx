import { useFormik } from "formik"
import * as Yup from 'yup'
import { VendorRegistraion } from '../../contract/vendorRegistraionContract'
import { Button, Divider } from "@mui/material"
import { Link } from "react-router-dom"
import { useFetchApi } from "../../Custom-Hooks/useFetchApi"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

export const VendorRegistration = () => {
const nvigate = useNavigate();
    const fetchDataFromApi = useFetchApi();
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('name is required').min(2, 'name is tooo short').max(50, 'name is too long'),
        email: Yup.string().required("email is required").email('pleaae enter valid email'),
        password: Yup.string()
            .matches(
                /^(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'?/>.<,]).{8,}$/,
                'Password must be at least 8 characters long, include at least one number, and one special character'
            ),
        mobile: Yup.string().required('contact number is required').matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits long')
    })

    const formik = useFormik<VendorRegistraion>({
        initialValues: {
            name: '',
            email: '',
            mobile: '',
            password: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (formData, { resetForm }) => {
            const { name, email, mobile, password } = formData;
            const result = await fetchDataFromApi({
                url: 'http://localhost:8000/vendor/register',
                method: 'POST',
                data: { name: name, email: email, mobile: mobile, password: password }
            })
            if (result.error) {
                toast.error(result.error, {
                    autoClose: 1000
                });
            } else {
                toast.success('vendor registred sucessfully', {
                    autoClose: 1000
                });
                nvigate('/vendor/login');
            }
            resetForm();
        }
    })
    return (
        <>  
        <ToastContainer/>

            <form onSubmit={formik.handleSubmit} className='register-form'>
                <h2 className='register-h2 pt-2'> Vendor Registration </h2>
                <hr />
                <div className='form-group mb-2'>
                    <label htmlFor="name">Company Name</label>
                    <input type="text"
                        className="form-control"
                        id="name" name='name'
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.name && formik.touched.name && <div className="text-danger"> {formik.errors.name}</div>}
                </div>

                <div className='form-group mb-2'>
                    <label htmlFor="email">Company Email</label>
                    <input type="text"
                        className="form-control"
                        id="email" name='email'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.email && formik.touched.email && <div className="text-danger"> {formik.errors.email}</div>}
                </div>

                <div className='form-group mb-2'>
                    <label htmlFor="mobile">Contact Number</label>
                    <input type="text"
                        className="form-control"
                        id="mobile" name='mobile'
                        value={formik.values.mobile}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.mobile && formik.touched.mobile && <div className="text-danger"> {formik.errors.mobile}</div>}
                </div>

                <div className='form-group mb-2'>
                    <label htmlFor="password">Password</label>
                    <input type="password"
                        className="form-control"
                        id="email" name='password'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.password && formik.touched.password && <div className="text-danger"> {formik.errors.password}</div>}
                </div>

                <div className='form-group mb-2'>
                    <Button variant="contained" type='submit' style={{ width: '100%' }}>Submit</Button>
                </div>

                <Divider>OR</Divider>

                <button className='btn btn-link  w-100 text-center'><Link to="/vendor/login">already have an account? login</Link></button>
            </form>
        </>
    )
}