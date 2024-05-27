import { useCookies } from "react-cookie";
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";
import { useEffect, useState } from "react";
import { ProductDetails } from '../../contract/productDetails.contract';
import { useNavigate } from "react-router-dom";
import { AdminProductCard } from "./admin-product-card";
import { toast } from "react-toastify";
import Loadingcomponent from "../Loading/Loading";
import { dividerClasses } from "@mui/material";


export function AdminAllProductList() {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token']
    const fetchDataFromApi = useFetchApi();
    const [allProduct, setAllProduct] = useState<ProductDetails[]>()
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>()
    const [disabled, setDisabled] = useState<boolean>(false);



    const navigate = useNavigate();

    const loadAllproduct = async (): Promise<void> => {
        setLoading(true);
        setLoading(true);
        const result = await fetchDataFromApi({
            url: "http://localhost:8000/product/get-allproducts",
            method: 'get',
            token: token
        })

        if (result.error) {
            setError(result.error || 'Something went wrong in fetching product');
        } else {
            setAllProduct(result.response);
        }

        setLoading(false);
    }

    const deleteProduct = async (id: string): Promise<void> => {
        console.log("delete function called")
        // setLoading(true);
        setDisabled(true);
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/product/remove-product/${id}`,
            method: "delete",
            token: token
        })
        if (result.error) {
            toast.error(result.error, {
                autoClose: 100
            })
            setError(result.error)
        } else {
            toast.success("Product deleted sucessfully", {
                autoClose: 1000
            });
        }
        loadAllproduct();
        // setLoading(false);
        setDisabled(false);
    }

    const updateProduct = async (id: string): Promise<void> => {
        console.log("update function called")
        // setLoading(true)
        setDisabled(true);
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
        loadAllproduct();
        // setLoading(false)
        setDisabled(false);
    }


    useEffect(() => {
        if (!token) {
            navigate('/admin/login')
        } else {
            loadAllproduct();

        }
    }, [])

    return (
        <>
            {
                loading ? (
                    <div className="text-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                        <Loadingcomponent />
                    </div>
                ) : (allProduct &&
                    <AdminProductCard
                        productList={allProduct}
                        deleteProduct={deleteProduct}
                        updateProduct={updateProduct}
                        disabled={disabled}
                    />)
            }
        </>
    )
}