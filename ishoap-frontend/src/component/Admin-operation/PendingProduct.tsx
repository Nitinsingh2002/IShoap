import { useEffect, useState } from "react"
import { pending } from '../../contract/pendingConract';
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";
import { ToastContainer, toast } from "react-toastify";
import Loadingcomponent from "../Loading/Loading";
import { Button } from "@mui/material";
import { ReusableModal } from "../Resuable-modal/ReuasbleModal";

export const PendingProduct = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [allPendingProduct, setAllPendingProuct] = useState<pending[]>()
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const token = cookies['token'];
    const navigate = useNavigate();
    const fetchDataFromApi = useFetchApi();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


    const handleCloseModal = (): void => {
        setIsModalOpen(false);
    };

    const handleDeleteClick = (): void => {
        setIsModalOpen(true);
    };


    const LoadAllPendingProduct = async () => {
        console.log("api call for deletion")
        setLoading(true);
        const result = await fetchDataFromApi({
            url: 'http://localhost:8000/product/getall-pendingProduct',
            method: 'get',
            token: token
        })
        if (result.error) {
            setError(result.error)
        } else {
            setAllPendingProuct(result.response);
        }

        setLoading(false)
    }

    const AcceptPendindingProduct = async (id: String): Promise<void> => {
        setIsSubmitting(true)

        const result = await fetchDataFromApi({
            url: `http://localhost:8000/product/aproved/${id}`,
            method: 'post',
            token: token
        })
        if (result.error) {
            setError(result.error)
        } else {
            toast.success("Product added to ishoap", {
                autoClose: 900
            });
        }
        setIsSubmitting(false);
        LoadAllPendingProduct();
    }


    const delclinePendingProduct = async (id: string): Promise<void> => {
        setIsSubmitting(true)

        const result = await fetchDataFromApi({
            url: `http://localhost:8000/product/decline/${id}`,
            method: 'post',
            token: token
        })
        if (result.error) {
            setError(result.error)
        } else {
            toast.success("Product removed from pending product", {
                autoClose: 900
            });
        }
        setIsSubmitting(false);
        setIsModalOpen(false);
        LoadAllPendingProduct();
    }




    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
        }
        else {
            LoadAllPendingProduct();
        }
    }, [token])



    return (
        <>
            <ToastContainer />
            {
                loading ? (
                    <div className="text-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                        <Loadingcomponent />
                    </div>
                ) : error ? (
                    <div className="text-center product-not-found-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                        <h2 className="product-not-found-message" style={{ color: '#ff6347', fontSize: '2rem', fontWeight: 'bold', margin: '20px 0' }}>
                            Pending product could not be fetched due to an error
                        </h2>
                    </div>
                ) : (
                    <>
                        {allPendingProduct && allPendingProduct.length > 0 ? (
                            allPendingProduct.map((product) => (
                                <Link to={`/admin/pending-product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', }}>
                                    <div key={product._id} className='admin-product-container'>

                                        <div className='admin-product-img'>
                                            <img src={`http://localhost:8000/images/${product.image[0]}`} alt={product.name} />
                                        </div>

                                        <div className='admin-product-details'>
                                            <h5 className='admin-product-name'>{product.name}</h5>
                                            <div>
                                                <span className='fw-bold admin-price'>Price: </span>
                                                {product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                            </div>

                                            <div>
                                                Available: {product.stock}
                                            </div>
                                        </div>

                                        <div className='admin-product-operation'>
                                            <div>
                                                <Button variant='outlined' disabled={isSubmitting} onClick={() => { AcceptPendindingProduct(product._id) }}>Accept</Button>
                                            </div>
                                            <div>
                                                <Button variant='outlined' color='error' disabled={isSubmitting} onClick={handleDeleteClick}>Decline</Button>
                                                <ReusableModal
                                                    isOpen={isModalOpen}
                                                    onClose={handleCloseModal}
                                                    onConfirm={() => { delclinePendingProduct(product._id) }}
                                                    message="Are you sure to delete this item from Ishoap?"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center product-not-found-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                                <h2 className="product-not-found-message" style={{ color: '#ff6347', fontSize: '2rem', fontWeight: 'bold', margin: '20px 0' }}>
                                    No pending products available
                                </h2>
                            </div>
                        )}
                    </>
                )
            }
        </>
    )

}