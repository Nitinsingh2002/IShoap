import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Categorydetails } from '../../contract/categoryDetailsContract';
import { ToastContainer, toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import { useFetchApi } from '../../Custom-Hooks/useFetchApi';
import { PendingProduct } from '../../contract/pendingProductContract'
import { Button } from '@mui/material';





export function VendorAddProduct() {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];
    const fetchDataFromApi = useFetchApi();
    const [category, setCategory] = useState<Categorydetails[]>([{
        name: '',
        _id: ''
    }]);
    const [image, setImage] = useState<File[]>([]);


    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            const newImages = [...image];
            newImages[index] = e.target.files[0];
            setImage(newImages);
            formik.setFieldValue(`image[${index}]`, e.target.files[0]);
        }
    };

    console.log(image);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required").min(2, 'Name is too short').max(50, 'Name is too long'),
        description: Yup.string().required('Description is required').min(50, 'Description is too short').max(1000, 'Description is too long'),
        price: Yup.number().required('Price is required').min(1, 'Price must be greater than 0'),
        stock: Yup.number().required('Stock is required').min(0, 'Stock cannot be less than 0'),
        categoryId: Yup.string().required('Category is required'),
        image: Yup.array().required('image is required')
    });

    const formik = useFormik<PendingProduct>({
        initialValues: {
            name: '',
            description: '',
            price: undefined,
            stock: undefined,
            image: ['', '', '', ''],
            categoryId: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (formData, { resetForm }) => {
            const { name, description, price, stock, categoryId } = formData;

            const formDetails = new FormData();
            image.forEach((file) => {
                formDetails.append('image', file);
            });
            formDetails.append('name', name);
            formDetails.append('description', description);
            formDetails.append('categoryId', categoryId);
            formDetails.append('price', String(price));
            formDetails.append('stock', String(stock));


            const result = await fetchDataFromApi({
                url: 'http://localhost:8000/vendor/add-pendingProduct',
                method: 'POST',
                data: formDetails,
                token: token
            })

            if (result.error) {
                toast.error(result.error, {
                    autoClose: 1000
                })
            } else {
                toast.success("Product added waiting for admin ", {
                    autoClose: 1000
                })
            }
            resetForm();
            setImage([]);
            document.querySelectorAll('input[type="file"]').forEach(input => {
                const fileInput = input as HTMLInputElement;
                fileInput.value = '';
            });
        }
    });

    const fetchCategory = async () => {
        const result = await fetchDataFromApi({
            url: "http://localhost:8000/category/get",
            token: token,
            method: 'GET'
        });

        if (result.error) {
            toast.error(result.error, {
                autoClose: 1000
            });
        } else {
            setCategory(result.response);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    return (
        <>
            <div className='registerDiv'>
                <ToastContainer />
                <form onSubmit={formik.handleSubmit} className='address-form' encType="multipart/form-data" >
                    <h6 className=' fs-4'>Add product</h6>
                    <hr />

                    <div className='form-group mb-2'>
                        <label htmlFor="name">Product Name</label>
                        <input type="text"
                            className="form-control"
                            id="name" name='name'
                            value={formik.values.name}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.name && formik.touched.name && <div className="text-danger"> {formik.errors.name}</div>}
                    </div>

                    <div className='form-group mb-2'>
                        <label htmlFor="price">Product Price</label>
                        <input type="text"
                            className="form-control"
                            id="price" name='price'
                            value={formik.values.price}
                            onChange={formik.handleChange}
                        />
                        {formik.errors.price && formik.touched.price && <div className="text-danger"> {formik.errors.price}</div>}
                    </div>

                    <div className='form-group mb-2'>
                        <label htmlFor="stock">Product Stock</label>
                        <input type="text"
                            className="form-control"
                            id="stock" name='stock'
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                        />
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
                        <label htmlFor="stock" className='form-label'>Product Description</label>
                        <div >
                            <textarea className='form-control'
                                rows={5}
                                name='description'
                                onChange={formik.handleChange}
                                value={formik.values.description} />
                        </div>
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


                    <div className='form-group mb-'>
                        <Button variant="contained" type='submit' style={{ width: '100%' }}>Submit</Button>
                    </div>

                </form>
            </div>
        </>
    );
}
