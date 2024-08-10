import { useFormik } from 'formik';
import { UserRegister } from '../../contract/userRegisterContract';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker.css';
import './register.css'
import Divider from '@mui/material/Divider';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


export function Register() {

    const [isSubmitting, setisSubmitting] = useState<boolean>(false);
    const navigate  = useNavigate();
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required').min(2, 'Too short for a first name!').max(50, 'Too long for a first name!'),
        lastName: Yup.string().required('Last name is required').min(2, 'Last name is too short').max(50, 'Last name is too long'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string()
            .matches(
                /^(?=.*\d)(?=.*[!@#$%^&*()_+{}":;'?/>.<,]).{8,}$/,
                'Password must be at least 8 characters long, include at least one number, and one special character'
            )
            .required('Password is required'),
        mobile: Yup.string()
            .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits long')
            .required('Mobile is required'),
        gender: Yup.string()
            .required('Gender is required'),
        DateOfBirth: Yup.date()
            .nullable()
            .max(new Date(), 'Date of birth cannot be in the future')
            .required('Date of birth is required'),
    })

    const formik = useFormik<UserRegister>({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            mobile: '',
            gender: '',
            DateOfBirth: null
        },
        validationSchema: validationSchema,

        onSubmit: async (formData,{resetForm}) => {
            setisSubmitting(true);
            try {
                const { firstName, lastName, email, mobile, gender, password, DateOfBirth } = formData;
                const response = await axios.post('http://localhost:8000/user/user-register',
                    { firstName, lastName, email, mobile, gender, password, DateOfBirth })
                toast.success("User registered successfully!",{autoClose:800});
                resetForm();
                navigate("/login");
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response) {
                    toast.error(error.response.data,{autoClose:1000});
                } else {
                    toast.error("An unexpected error occurred.",{autoClose:1000});
                }
            } finally {
                setisSubmitting(false)
            }
        },
    });

    return (
        <div className='registerDiv'>


            <ToastContainer />
            <form onSubmit={formik.handleSubmit} className='register-form'>
                <h2 className='register-h2'>Ishoap</h2>


                <div className='form-group mb-2'>
                    <label htmlFor="firstName">First Name</label>
                    <input type="text"
                        className="form-control"
                        id="firstName" name='firstName'
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.firstName && formik.touched.firstName && <div className="text-danger"> {formik.errors.firstName}</div>}
                </div>

                <div className='form-group mb-2'>
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text"
                        className="form-control"
                        id="lastName"
                        name='lastName'
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.lastName && formik.touched.lastName && <div className="text-danger"> {formik.errors.lastName}</div>}
                </div>

                <div className='form-group mb-2'>
                    <label htmlFor="email">Email</label>
                    <input type="email"
                        className="form-control"
                        id="email"
                        name='email'
                        value={formik.values.email}
                        onChange={formik.handleChange} />
                    {formik.errors.email && formik.touched.email && <div className="text-danger"> {formik.errors.email}</div>}
                </div>

                <div className='form-group mb-2'>
                    <label htmlFor="mobile">Contact number</label>
                    <input type="text"
                        className="form-control"
                        id="mobile"
                        name='mobile'
                        value={formik.values.mobile}
                        onChange={formik.handleChange} />
                    {formik.errors.mobile && formik.touched.mobile && <div className="text-danger"> {formik.errors.mobile}</div>}
                </div>

                <div className='form-group '>
                    <label className="form-label">Gender: &nbsp; &nbsp;  </label>

                    <div className="form-check form-check-inline mt-1">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="genderMale"
                            value="male"
                            onChange={formik.handleChange}
                            checked={formik.values.gender === 'male'}
                        />
                        <label className="form-check-label" htmlFor="genderMale">Male</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="genderFemale"
                            value="female"
                            onChange={formik.handleChange}
                            checked={formik.values.gender === 'female'}
                        />
                        <label className="form-check-label" htmlFor="genderFemale">Female</label>
                    </div>
                    {formik.touched.gender && formik.errors.gender && <div className='text-danger'> {formik.errors.gender}</div>}

                </div>

                <div className='form-group mb-2'>
                    <label htmlFor="DateOfBirth">Date of Birth</label>
                    <div className="w-100">
                        <DatePicker
                            selected={formik.values.DateOfBirth}
                            onChange={date => formik.setFieldValue('DateOfBirth', date)}
                            dateFormat="MMMM d, yyyy"
                            className="form-control w-100"
                            placeholderText='enter date in M D,Y format'
                        />
                    </div>

                    {formik.touched.DateOfBirth && formik.errors.DateOfBirth && (
                        <div className="text-danger">{String(formik.errors.DateOfBirth)}</div>
                    )}
                </div>

                <div className='form-group mb-2'>
                    <label htmlFor="password">Password</label>
                    <input type='password'
                        className='form-control'
                        id='password'
                        name='password'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.password && formik.touched.password && <div className="text-danger"> {formik.errors.password}</div>}
                </div>



                <div className='form-group mb-2'>
                    <Button variant="contained" type='submit' className='form-control' disabled={isSubmitting}>Submit</Button>
                </div>

                <Divider>OR</Divider>

                <button className='btn btn-link  w-100 text-center'><Link to="/login">already have an account? login</Link></button>

            </form>

        </div>


    );
}
