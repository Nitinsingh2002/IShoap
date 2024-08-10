import { Button } from "@mui/material";
import { Formik, useFormik } from "formik"
import { useEffect, useState } from "react"
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";
import { useCookies } from "react-cookie";
import * as Yup from 'yup'
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Loadingcomponent from "../Loading/Loading";

interface Category {
    name: string
}

export const UpdateCategory = () => {


    const [name, setName] = useState<string>('');
    const fetchDataFromApi = useFetchApi();
    const [cookies] = useCookies(['token']);
    const token = cookies['token'];
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [categoryName, setCategoryName] = useState<Category>({name:""})


    const validationSchema = Yup.object({
        name: Yup.string()
            .min(2, 'name is too short!')
            .max(50, 'name is too  Long!')
            .required('category name is required')
    });

    const formik = useFormik({
        initialValues: {
            name: categoryName.name
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (formData, { setSubmitting, resetForm }) => {
            const result = await fetchDataFromApi({
                url: `http://localhost:8000/category/update/${id}`,
                method: 'put',
                token: token,
                data: formData
            });

            if (result.error) {
                setError(result.error);
                toast.error(result.error, { autoClose: 900 });
            } else {
                toast.success("Category name updated sucessfully", { autoClose: 900 });
                resetForm();
            }
            setSubmitting(false);
        },
    });



    const LoadCategoryDetails = async () => {
        setLoading(true)
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/category/get-category/${id}`,
            method: 'get',
            token: token,
        });

        if (result.error) {
            setError(result.error);
        } else {
            setCategoryName(result.response);
        }
        setLoading(false)
    }

    useEffect(() => {
        LoadCategoryDetails();
    }, [id])

    return (
        <>
            <ToastContainer />
            {
                loading ?
                    (
                        <div className="text-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                            <Loadingcomponent />
                        </div>
                    ) : error ? (
                        <div className="text-center product-not-found-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                            <h2 className="product-not-found-message" style={{ color: '#ff6347', fontSize: '2rem', fontWeight: 'bold', margin: '20px 0' }}>Category details not found</h2>
                        </div>
                    ) : (
                        <form className="address-form" onSubmit={formik.handleSubmit}>
                            <h6 className='fs-4 '>Add Category</h6>
                            <hr />
                            <div className="form-group mb-2">
                                <label htmlFor="name">Enter category name</label>
                                <input type="text" className="form-control" onChange={formik.handleChange} name="name" value={formik.values.name} />
                                {formik.errors.name && formik.touched.name && <div className="text-danger"> {formik.errors.name}</div>}
                            </div>
                            <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting} className='w-100'>
                                {formik.isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>

                            <div className='w-100 text-center text-danger'>
                                {error}
                            </div>
                        </form>
                    )
            }
        </>
    )
}