import { useFormik } from 'formik';
import { PendingProduct } from '../../contract/pendingProductContract'
import * as Yup from 'yup'
import { Category, Description } from '@mui/icons-material';


export function VendorAddProduct() {
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required").min(2, 'name is too short').max(50, 'name is too long'),
        Description: Yup.string().required('description is required').min(50, 'description is too short').max(1000, 'description is too long'),
        price: Yup.number().required('price is required').min(1, 'price must be greater then 0'),
        stock: Yup.number().required('Stock is required').min(0, 'stock can not less then 0'),
        categoryId: Yup.string().required('category is required'),
        image : Yup.array().required('image is required').min(4,'please add 4 images').max(4,'you can not add more than 4 images')

    })
    const formik = useFormik<PendingProduct>({
        initialValues: {
            name: '',
            description: '',
            price: null,
            stock: null,
            image: [],
            categoryId: ''
        },
        validationSchema: validationSchema,
        onSubmit: (formData) => {

        }
    })
    return (
        <>
        </>
    )
}