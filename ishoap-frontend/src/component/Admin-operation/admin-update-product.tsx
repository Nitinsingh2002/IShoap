import { useCookies } from "react-cookie"
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UpdateProducContract } from '../../contract/productUpdatecontract';
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Loadingcomponent from "../Loading/Loading";
import { Button } from "@mui/material";



export const AdminUpdateProduct = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];
    const [loadedProductDetail, setLoadedProductDetail] = useState<UpdateProducContract>({
        name: '', price: 0, stock: 0, description: ''
    })
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const navigate = useNavigate();
    const fetchDataFromApi = useFetchApi();
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const LoadProduct = async () => {
        setLoading(true)
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/product/get-details/${id}`,
            method: 'get',
            token: token
        })
        if (result.error) {
            setError(result.error)
        } else {
            setLoadedProductDetail(result.response);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (!token) {
            navigate('/admin/login')
        } else {
            LoadProduct();
        }
    }, [])

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('name is required').min(2, 'name is too short').max(100, 'name is too long'),
        price: Yup.number().required('Price is required').min(1, 'Price must be greater than 0'),
        stock: Yup.number().required('Stock is required').min(1, 'Stock cannot be less than 0'),
        description: Yup.string().required('Description is required').min(50, 'Description is too short').max(1000, 'Description is too long'),
    })



    const formik = useFormik<UpdateProducContract>({
        initialValues: {
            name: loadedProductDetail.name,
            price: loadedProductDetail.price,
            stock: loadedProductDetail.stock,
            description: loadedProductDetail.description
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (formData, { resetForm }) => {
            setIsSubmitting(true);
            const { name, price, description, stock } = formData;
            const result = await fetchDataFromApi({
                url: `http://localhost:8000/product/update-product/${id}`,
                method: "put",
                token: token,
                data: { name: name, price: price, description: description, stock: stock }
            })
            if (result.error) {
                setError(result.error)
            } else {
                toast.success("Product Updated sucessfully", {
                    autoClose: 900
                });
                setTimeout(() => {
                    navigate("/admin/all-product")
                }, 1100)
            }
            setIsSubmitting(false);
        }
    })

    return (
        <>
            {
                loading ? (
                    <div className='loading-div'>
                        <Loadingcomponent />
                    </div>
                ) : (
                    <div className='registerDiv'>
                        <ToastContainer />
                        <form onSubmit={formik.handleSubmit} className='address-form'>
                            <h6 className='fs-4'>Update product</h6>
                            <hr />
                            <div className='form-group mb-2'>
                                <label htmlFor="name">Product Name</label>
                                <input type="text" className="form-control" id="name" name='name' value={formik.values.name} onChange={formik.handleChange} />
                                {formik.errors.name && formik.touched.name && <div className="text-danger"> {formik.errors.name}</div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label htmlFor="price">Product Price</label>
                                <input type="text" className="form-control" id="price" name='price' value={formik.values.price} onChange={formik.handleChange} />
                                {formik.errors.price && formik.touched.price && <div className="text-danger"> {formik.errors.price}</div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label htmlFor="stock">Product Stock</label>
                                <input type="text" className="form-control" id="stock" name='stock' value={formik.values.stock} onChange={formik.handleChange} />
                                {formik.errors.stock && formik.touched.stock && <div className="text-danger"> {formik.errors.stock}</div>}
                            </div>

                            <div className='form-group mb-2'>
                                <label htmlFor="description">Product Description</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name='description'
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    rows={3}
                                />
                                {formik.errors.description && formik.touched.description && <div className="text-danger"> {formik.errors.description}</div>}
                            </div>


                            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} className='w-100'>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>

                            <div className='w-100 text-center text-danger'>
                                {error}
                            </div>

                        </form >
                    </div>

                )
            }
        </>
    )
}