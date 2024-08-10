import { useFormik } from "formik"
import { VendorDetails } from '../../contract/vendorDetailsContract'
import * as Yup from 'yup';
import { Button } from "@mui/material";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";
import { ToastContainer, toast } from "react-toastify";




export function VendorUpdateDetails() {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token']
    const navigate = useNavigate();
    const fetchDataFromApi = useFetchApi();

    const validatonSchema = Yup.object().shape({
        name: Yup.string().required("name is required").min(2, "name is too short").max(50, 'name is too long'),
        email: Yup.string().email('please enter valid email').required('email is required'),
        mobile: Yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits long').required('Mobile is required'),
    })
    const formik = useFormik<VendorDetails>({
        initialValues: {
            name: '',
            email: '',
            mobile: ''
        },
        validationSchema: validatonSchema,
        onSubmit: async (formdata, { resetForm }) => {
            const { name, mobile, email } = formdata;

            const result = await fetchDataFromApi({
                url: 'http://localhost:8000/vendor/update-details',
                method: 'PUT',
                data: {
                    name: name, email: email, mobile: mobile
                },
                token: token
            })

            if (result.error) {
                toast.error(result.error, {
                    autoClose: 1000
                })
            } else {
                toast.success("Details updated sucessfully", {
                    autoClose: 1000
                })
            }
            resetForm();
        }
    })

    useEffect(() => {
        if (!token) {
            navigate('/vendor/login')
        }
    }, [])

    return (
        <>
            <ToastContainer />
            <form onSubmit={formik.handleSubmit} className='address-form'>
                <h6 className=' fs-4'>Update details</h6>
                <hr />
                <div className='form-group '>
                    <label htmlFor="name" className='mb-2'>Enter your Name</label>
                    <input type='text'
                        name='name'
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
                    {formik.errors.name && formik.touched.name && <div className="text-danger">{formik.errors.name} </div>}
                </div>

                <div className='form-group '>
                    <label htmlFor="email" className='mb-2'>Enter your Email</label>
                    <input type='email'
                        name='email'
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                    {formik.errors.email && formik.touched.email && <div className="text-danger">{formik.errors.email} </div>}
                </div>

                <div className='form-group '>
                    <label htmlFor="mobile" className='mb-2'>Contact Number</label>
                    <input type='mobile'
                        name='mobile'
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.mobile}
                    />
                    {formik.errors.mobile && formik.touched.mobile && <div className="text-danger">{formik.errors.mobile} </div>}
                </div>
                <div className='form-group mb-2 mt-2'>
                    <Button variant="contained" type='submit' style={{ width: '100%' }}>Submit</Button>
                </div>
            </form>
        </>
    )
}