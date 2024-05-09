import axios from "axios";
import { error } from "console";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function FormDemo() {
    const [image, setImage] = useState('');

    function handleImageChange(e: any) {
        setImage(e.target.files[0]);
        formik.handleChange(e);
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            image: ''
        },

        onSubmit: async (formData) => {
            console.log(image);
            const formDetails = new FormData();
            formDetails.append('name', formData.name)
            formDetails.append('image',image)

            alert(JSON.stringify(formData));
            axios.post('http://localhost:8000/vendor/test',formDetails).then((res) => toast.success("added")).catch((error)=>console.log(error))
        }
    });

    return (
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <label htmlFor="name">Name</label>
            <input
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange}
                name="name"
            />
            <label htmlFor="image">Image</label>
            <input
                id="image"
                name="image"
                type="file"
                onChange={handleImageChange}
            />
            <button type="submit">Submit</button>
        </form>
    );
}
