import { useCookies } from "react-cookie"
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UpdateProducContract } from '../../contract/productUpdatecontract';
import { toast } from "react-toastify";


export const AdminUpdateProduct = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];
    const [loadedProductDetail, setLoadedProductDetail] = useState<UpdateProducContract>()
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const navigate = useNavigate();
    const fetchDataFromApi = useFetchApi();

    const updateProduct = async (id: string): Promise<void> => {
        setLoading(true)
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/product/update-product/${id}`,
            method: "put",
            token: token
        })
        if (result.error) {
            setError(result.error)
        } else {
            toast.success("Product Updated sucessfully", {
                autoClose: 1000
            });
        }
        setLoading(false)
    }


    const LoadProduct = async () => {
        setLoading(true)
        const result = await fetchDataFromApi({
            url: '',
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

    return (
        <>

        </>
    )
}