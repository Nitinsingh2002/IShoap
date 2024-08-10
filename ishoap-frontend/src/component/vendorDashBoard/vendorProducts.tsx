import { useEffect, useState } from 'react'
import './vendorProduct.css'
import { IProduct } from '../../contract/productContract'
import { useFetchApi } from '../../Custom-Hooks/useFetchApi';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { Outlet } from 'react-router-dom';


export function VendorProduct() {
    const [products, setProduct] = useState<IProduct[]>();
    const fetchDataFromApi = useFetchApi();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];


    const LoadProduct = async () => {
        const result = await fetchDataFromApi({
            url: 'http://localhost:8000/vendor/get-vendor-products',
            method: 'GET',
            token: token
        })

        if (result.error) {
            toast.error(result.error, {
                autoClose: 1000
            });
        } else {
            toast.success('product data stored', {
                autoClose: 1000
            })
            setProduct(result.response);
        }
    }

    useEffect(() => {
        LoadProduct();
    }, [])


    return (
        <>
            <ToastContainer />

            <div className='added-product'>
                <h5 style={{color:'gray'}}>Products added by you</h5>
            </div>



            <div className='vendor-product-container'>
                {
                    products?.map((product) => (
                        <div className='vendor-card'>
                            <div className='vendor-card-image'>
                                <img src={`http://localhost:8000/images/${product.image[0]}`} />
                            </div>
                            <div className='vendor-card-name'>
                                {product.name}
                            </div>
                        </div>
                    ))
                }
            </div>

        </>
    )
}