import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { ShowAddressContract } from '../../contract/showAddressComntract'
import * as Yup from 'yup'
import { Button } from '@mui/material';
import './address.css'
import Select from 'react-select';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export function AddressForm({ onAddressSubmitted }: { onAddressSubmitted: () => void }) {
    // { onAddressSubmitted }: { onAddressSubmitted: () => void }  
    //  { onAddressSubmitted }:void is not valid synatax in ts so we write like that onAddressSubmitted is function that retun void;
    const navigate = useNavigate();

    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token']
    const [isSubmitting, setIsSubmiiting] = useState<boolean>(false);


    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
        "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
        "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
        "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
        "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
        "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Lakshadweep",
        "Puducherry"
    ];

    const stateOptions = indianStates.map(state => ({ label: state, value: state }));

    const validationSchema = Yup.object().shape({
        street: Yup.string().min(2, "street name is too short").max(40, "stret name is too long").required("street name is required"),
        city: Yup.string().min(2, "city name is too short").max(40, "city name is too long").required("city name is required"),
        state: Yup.string().min(2, "state name is too short").max(40, "state name is too long").required("state name is required"),
        country: Yup.string().min(2, "country name is too short").max(40, "country name is too long").required("country name is required"),
        postalCode: Yup.string().matches(/^\d{6}$/, "postal code must be exactly 6 digits").required("pin code is required"),
        mobile: Yup.string().matches(/^\d{10}$/, "mobile number must be exactly 10 digits").required('contact number is required'),
        name: Yup.string().required("name is required").min(2, "name is too short").max(40, 'name is too long')
    })


    const formik = useFormik<ShowAddressContract>({
        initialValues: {
            street: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
            mobile: "",
            name: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (formData, { resetForm }) => {
            setIsSubmiiting(true);
            try {
                const { street, city, state, country, postalCode, mobile, name } = formData
                const response = await axios.post('http://localhost:8000/user/add-address',
                    { street, city, state, country, postalCode, mobile, name }, {
                    headers: {
                        Authorization: token
                    }
                })

                toast.success(response.data, {
                    autoClose: 1000
                })
                resetForm()
                //calback function to show address
                onAddressSubmitted();
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response) {
                    toast.error(error.response.data)
                } else {
                    toast.error("something went wrong in adding address")
                }
            } finally {
                setIsSubmiiting(false)
            }
        }
    })

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }, [token])


    return (
        <>
            <ToastContainer />
            <form onSubmit={formik.handleSubmit} className='address-form'>
                <h6 className='text-center fs-4'>Add Address</h6>
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
                    <label htmlFor="street" className='mb-2'>Enter your street</label>
                    <input type='text'
                        name='street'
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.street}
                    />
                    {formik.errors.street && formik.touched.street && <div className="text-danger">{formik.errors.street} </div>}
                </div>


                <div className='form-group mb-2'>
                    <label htmlFor="city" >Enter your city</label>
                    <input type='text'
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.city}
                        name='city'
                    />
                    {formik.errors.city && formik.touched.city && <div className="text-danger">{formik.errors.city} </div>}
                </div>


                <div className="form-group mb-3">
                    <label htmlFor="state">State</label>
                    <Select
                        id="state"
                        className={`basic-single ${formik.touched.state && formik.errors.state ? 'is-invalid' : ''}`}
                        name="state"
                        options={stateOptions}
                        value={stateOptions.find(option => option.value === formik.values.state)}
                        onChange={(option) => formik.setFieldValue('state', option ? option.value : '')}
                        placeholder="Select a state"

                    />

                    {formik.touched.state && formik.errors.state && <div className="invalid-feedback">{formik.errors.state}</div>}
                </div>

                <div className='form-group mb-3'>
                    <label htmlFor="city"  >Enter your Country</label>
                    <Select
                        id='country'
                        className={`basic-single   ${formik.touched.state && formik.errors.state ? 'is-invalid' : ''}`}
                        name='country'
                        options={[{ label: "India", value: "India" }]}
                        value={{ label: "India", value: "India" }}
                        isSearchable={false}
                        onChange={(option) => formik.setFieldValue('country', option ? option.value : '')}
                    />

                    {formik.errors.country && formik.touched.country && <div className="text-danger">{formik.errors.country} </div>}
                </div>


                <div className='form-group mb-2'>
                    <label htmlFor="postal code"  >Enter your postal code</label>
                    <input type='text'
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.postalCode}
                        name='postalCode'
                    />
                    {formik.errors.postalCode && formik.touched.postalCode && <div className="text-danger">{formik.errors.postalCode} </div>}
                </div>

                <div className='form-group mb-2'>
                    <label htmlFor="city">Enter your Mobile</label>
                    <input type='text'
                        className='form-control'
                        onChange={formik.handleChange}
                        value={formik.values.mobile}
                        name='mobile'
                    />
                    {formik.errors.mobile && formik.touched.mobile && <div className="text-danger">{formik.errors.mobile} </div>}
                </div>


                <div className='form-group mb-'>
                    <Button variant="contained" type='submit' className='form-control' disabled={isSubmitting} >Submit</Button>
                </div>
            </form>
        </>
    )
}