import { Button } from "@mui/material";
import { Formik, useFormik } from "formik"
import { useState } from "react"
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";
import { useCookies } from "react-cookie";
import * as Yup from 'yup'
import { ToastContainer, toast } from "react-toastify";


export const AddCategory = () => {

    const [name, setName] = useState<string>('');
    const fetchDataFromApi = useFetchApi();
    const [cookies] = useCookies(['token']);
    const token = cookies['token'];
    const [error, setError] = useState<string | null>(null)


    const validationSchema = Yup.object({
        name: Yup.string()
            .min(2, 'name is too short!')
            .max(50, 'name is too  Long!')
            .required('category name is required')
    });

    const formik = useFormik({
        initialValues: {
            name: ''
        },
        validationSchema: validationSchema,

        onSubmit: async (formData, { setSubmitting, resetForm }) => {
            const { name } = formData;
            const result = await fetchDataFromApi({
                url: 'http://localhost:8000/category/add',
                method: 'post',
                token: token,
                data: formData
            });

            if (result.error) {
                setError(result.error);
                toast.error(result.error, { autoClose: 900 });
            } else {
                toast.success("Category added successfully", { autoClose: 900 });
                resetForm(); 
            }
            setSubmitting(false);
        },
    });

    return (
        <>
            <ToastContainer />
            <form className="address-form" onSubmit={formik.handleSubmit}>
                <h6 className='fs-4 '>Add Category</h6>
                <hr />
                <div className="form-group mb-2">
                    <label htmlFor="name">Enter category name</label>
                    <input type="text" className="form-control" onChange={formik.handleChange} name="name"  value={formik.values.name}/>
                    {formik.errors.name && formik.touched.name && <div className="text-danger"> {formik.errors.name}</div>}
                </div>
                <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting} className='w-100'>
                    {formik.isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>

                <div className='w-100 text-center text-danger'>
                    {error}
                </div>
            </form>
        </>
    )
}