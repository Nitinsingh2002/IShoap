import { useParams } from "react-router-dom"
import { ProductDetails } from "../../contract/productDetails.contract"
import { useEffect, useState } from "react";
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Button, ButtonBase } from "@mui/material";
import { pending } from '../../contract/pendingConract';
import Loadingcomponent from "../Loading/Loading";
import { ReusableModal } from "../Resuable-modal/ReuasbleModal";

export function SinglePendingProduct() {
    const [produtDetails, setProductDetaiils] = useState<pending>();
    const { id } = useParams();
    const fetchDataFromApi = useFetchApi();
    const [cookies] = useCookies(['token', 'role']);
    const token = cookies['token'];
    const role = cookies['role'] || 'user';
    const navigate = useNavigate();
    const [currentImg, setCurrentImg] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const handleDeleteClick = (): void => {
        setIsModalOpen(true);
    };
    const handleCloseModal = (): void => {
        setIsModalOpen(false);
    };

    const handleSelectImage = (index: number): void => {
        console.log("state is updated")
        setCurrentImg(index);
    }

    const loadProductDetails = async () => {
        setLoading(true)
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/product/pending-product/${id}`,
            token: token,
            method: "GET"
        })
        console.log("api called");
        if (result.error) {
            setError(result.error);
        } else {
            setProductDetaiils(result.response);
        }
        setLoading(false)
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
        loadProductDetails();
        navigate('/admin/pending-product')
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
        loadProductDetails();
        navigate('/admin/pending-product')
    }

    useEffect(() => {
        if (!token) {
            navigate('/admin/login')
        } else {
            loadProductDetails();
        }
    }, [token])



    return (
        <>
            {
                loading ? (
                    <div className="text-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                        <Loadingcomponent />
                    </div>
                ) : error ? (
                    <div className="text-center product-not-found-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
                        <h2 className="product-not-found-message" style={{ color: '#ff6347', fontSize: '2rem', fontWeight: 'bold', margin: '20px 0' }}>Product Not Found</h2>
                        <p style={{ color: '#555', fontSize: '1rem' }}>We're sorry, but the product you are looking for does not exist.</p>
                    </div>
                ) :
                    (
                        <div className="Product-container">
                            <ToastContainer />
                            <div className="first-half">
                                <div className="all-image-container">
                                    {produtDetails && produtDetails.image && produtDetails.image.map((image, index) => (
                                        <div className={`small-image ${currentImg === index ? 'activeImage' : ''}`} key={image} onClick={() => handleSelectImage(index)}>
                                            <img src={`http://localhost:8000/images/${image}`} alt={image} />
                                        </div>
                                    ))}
                                </div>

                                <div className="single-image-container">
                                    <div className="selected-img">
                                        {
                                            produtDetails?.image && <img src={`http://localhost:8000/images/${produtDetails?.image[currentImg]}`} />
                                        }
                                    </div>
                                </div>
                            </div>


                            <div className="second-half">
                                <div className="product-name">
                                    {produtDetails?.name}
                                </div>

                                <div className="price-container">
                                    <p className="special-price">Special price</p>
                                    <div className="price">
                                        <div className="actual-price">
                                            {produtDetails?.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                        </div>
                                        <div className="discount-price">
                                            {produtDetails?.price !== undefined && (
                                                <>
                                                    <s>{((produtDetails?.price + 200)).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</s>

                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="product-description">
                                    <p className="description-title">Description</p>
                                    <p className="description-body">{produtDetails?.description}</p>
                                </div>

                                <div className="product-data-warranty">

                                    <div className="product-warranty-data">
                                        <div className="warrenty-icon-container">
                                            <span className="bi bi-truck icon-class"></span>
                                        </div>
                                        <p className="p">Free Delivery</p>
                                    </div>

                                    <div className="product-warranty-data">
                                        <div className="warrenty-icon-container">
                                            <span className="bi bi-repeat icon-class"></span>
                                        </div>
                                        <p className="p">30 Days Replacement</p>
                                    </div>

                                    <div className="product-warranty-data">
                                        <div className="warrenty-icon-container">
                                            <span className="bi bi-truck icon-class"></span>
                                        </div>
                                        <p className="p">Nitin Delivered </p>
                                    </div>

                                    <div className="product-warranty-data">
                                        <div className="warrenty-icon-container">
                                            <span className="bi bi-shield-plus icon-class"></span>
                                        </div>
                                        <p className="p">2 Year Warranty </p>
                                    </div>
                                </div>
                                <hr className="hr me-3" />


                                <div className="avialable-product">
                                    {
                                        produtDetails?.stock !== undefined && (
                                            <>
                                                <p> Stock :
                                                    {
                                                        <span>{produtDetails.stock}</span>
                                                    }
                                                </p>

                                                <p>Sold By : <span className="avialable">{produtDetails.vendorId?.name}</span></p>
                                            </>
                                        )
                                    }
                                </div>
                                <hr className="availablehr" />


                                <div className="avialable-product" style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center', marginRight:'1rem' }}>
                                    <div>
                                        {produtDetails?._id !== undefined && (
                                            <Button variant='contained' disabled={isSubmitting} onClick={() => { AcceptPendindingProduct(produtDetails?._id) }}>Accept</Button>
                                        )}
                                    </div>
                                    <div>
                                        <Button variant='contained' disabled={isSubmitting} color='error' onClick={handleDeleteClick}>Decline</Button>
                                        {produtDetails?._id !== undefined && (
                                            <ReusableModal
                                                isOpen={isModalOpen}
                                                onClose={handleCloseModal}
                                                onConfirm={() => { delclinePendingProduct(produtDetails?._id) }}
                                                message="Are you sure to delete this item from Ishoap?"
                                            />
                                        )}

                                    </div>
                                </div>

                            </div>
                        </div>
                    )
            }



        </>
    )
}