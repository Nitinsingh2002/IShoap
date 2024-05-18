import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Categorydetails } from '../../contract/categoryDetailsContract';
import { ToastContainer, toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import { useFetchApi } from '../../Custom-Hooks/useFetchApi';
import { Button } from '@mui/material';
import { VendorDetails } from '../../contract/vendorDetailsContract';
import Loadingcomponent from '../Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { AddAdminProduct } from '../../contract/addProductContrct';
import './admin.css';

export function AdminAddProduct() {
    const [cookies] = useCookies(['token']);
    const token = cookies['token'];
    const fetchDataFromApi = useFetchApi();
    const [category, setCategory] = useState<Categorydetails[]>([]);
    const [error, setError] = useState<string>();
    const [vendorList, setVendorList] = useState<VendorDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [image, setImage] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            const newImages = [...image];
            newImages[index] = e.target.files[0];
            setImage(newImages);
            formik.setFieldValue(`image[${index}]`, e.target.files[0]);
        }
    };

    const loadCategoryDetails = async () => {
        console.log("load category function called");
        setLoading(true);
        const result = await fetchDataFromApi({
            url: 'http://localhost:8000/category/get',
            method: 'GET',
            token: token,
        });

        if (result.error) {
            setError(result.error);
        } else {
            setCategory(result.response);
        }
        setLoading(false);
    };

    const loadVendorDetails = async () => {
        setLoading(true);
        console.log("load vendor function called");
        const result = await fetchDataFromApi({
            url: "http://localhost:8000/vendor/get-vendor",
            method: 'GET',
            token: token,
        });

        if (result.error) {
            setError(result.error);
        } else {
            setVendorList(result.response);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!token) {
            navigate("/admin/login");
        }
        loadCategoryDetails();
        loadVendorDetails();
    }, [token, navigate]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required").min(2, 'Name is too short').max(100, 'Name is too long'),
        description: Yup.string().required('Description is required').min(50, 'Description is too short').max(1000, 'Description is too long'),
        price: Yup.number().required('Price is required').min(1, 'Price must be greater than 0'),
        stock: Yup.number().required('Stock is required').min(0, 'Stock cannot be less than 0'),
        categoryId: Yup.string().required('Select a category'),
        vendorId: Yup.string().required('Select a vendor'),
    });

    const formik = useFormik<AddAdminProduct>({
        initialValues: {
            name: '',
            description: '',
            price: '',
            stock: '',
            image: ['', '', '', ''],
            categoryId: '',
            vendorId: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (formData, { resetForm }) => {
            setIsSubmitting(true);
            const { name, description, price, stock, categoryId, vendorId } = formData;
            const formDetails = new FormData();
            image.forEach((file) => {
                formDetails.append('image', file);
            });
            formDetails.append('name', name);
            formDetails.append('description', description);
            formDetails.append('categoryId', categoryId);
            formDetails.append('price', String(price));
            formDetails.append('stock', String(stock));
            formDetails.append('vendorId', vendorId);

            const result = await fetchDataFromApi({
                url: 'http://localhost:8000/product/add-product',
                method: 'POST',
                data: formDetails,
                token: token
            });

            if (result.error) {
                setError(result.error);
            } else {
                toast.success("Product added successfully", { autoClose: 1000 });
                resetForm();
                setImage([]);
                document.querySelectorAll('input[type="file"]').forEach(input => {
                    const fileInput = input as HTMLInputElement;
                    fileInput.value = '';
                });
            }
            setIsSubmitting(false);
        }
    });


    return (
        <>
            {loading ? (
                <div className='loading-div'>
                    <Loadingcomponent />
                </div>
            ) : (
                <div className='registerDiv'>
                    <ToastContainer />
                    <form onSubmit={formik.handleSubmit} className='address-form' encType="multipart/form-data">
                        <h6 className='fs-4'>Add product</h6>
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
                            <div>
                                <label htmlFor="categoryId">Product Category</label>
                            </div>
                            <select
                                id="categoryId"
                                name="categoryId"
                                className={`form-control ${formik.touched.categoryId && formik.errors.categoryId ? 'is-invalid' : ''}`}
                                value={formik.values.categoryId}
                                onChange={formik.handleChange}
                            >
                                <option value="">Select category</option>
                                {category.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                            {formik.errors.categoryId && formik.touched.categoryId && <div className="text-danger"> {formik.errors.categoryId}</div>}
                        </div>
                        <div className='form-group mb-2'>
                            <div>
                                <label htmlFor="vendorId">Product Vendor</label>
                            </div>
                            <select
                                id="vendorId"
                                name="vendorId"
                                className={`form-control ${formik.touched.vendorId && formik.errors.vendorId ? 'is-invalid' : ''}`}
                                value={formik.values.vendorId}
                                onChange={formik.handleChange}
                            >
                                <option value="">Select vendor</option>
                                {vendorList.map((vendor) => (
                                    <option key={vendor._id} value={vendor._id}>{vendor.name}</option>
                                ))}
                            </select>
                            {formik.errors.vendorId && formik.touched.vendorId && <div className="text-danger"> {formik.errors.vendorId}</div>}
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

                        <div className='mb-3'>
                            <label htmlFor="image" className='form-label'>Product Images</label>
                            {[0, 1, 2, 3].map((index) => (
                                <input
                                    key={index}
                                    type='file'
                                    className='form-control mb-1'
                                    onChange={(e) => handleImageChange(index, e)}
                                    name={`image[${index}]`}
                                />
                            ))}
                            {formik.errors.image && formik.touched.image && <div className='text-danger'> {formik.errors.image} </div>}
                        </div>

                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} className='w-100'>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>

                        <div className='w-100 text-center text-danger'>
                            {error}
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
