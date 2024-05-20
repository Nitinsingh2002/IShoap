import { useParams } from "react-router-dom"
import { ProductDetails } from "../../contract/productDetails.contract"
import { useEffect, useState } from "react";
import { useFetchApi } from "../../Custom-Hooks/useFetchApi";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import './singleproduct.css'
import { Button, ButtonBase } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Link } from "react-router-dom";
import Loadingcomponent from "../Loading/Loading";
import { ReusableModal } from "../Resuable-modal/ReuasbleModal";

export function SingleProduct() {
    const [produtDetails, setProductDetaiils] = useState<ProductDetails>();
    const { id } = useParams();
    const fetchDataFromApi = useFetchApi();
    const [cookies] = useCookies(['token', 'role']);
    const token = cookies['token'];
    const role = cookies['role'] || 'user';
    const navigate = useNavigate();
    const [currentImg, setCurrentImg] = useState<number>(0);
    const [quantity, setquantity] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [stockvalue, setStockValue] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>();


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
            url: `http://localhost:8000/product/get-details/${id}`,
            token: token,
            method: "GET"
        })
        console.log("api called");
        if (result.error) {
            toast.error("something went wrong in loading product details");
            setError(result.error);
        } else {
            setProductDetaiils(result.response);
            setStockValue(result.response.stock);
        }
        setLoading(false)
    }

    const handleplusClick = () => {
        if (quantity < 5) {
            setquantity(quantity + 1);
        }
    }

    const handleminusclick = () => {
        if (1 < quantity) {
            setquantity(quantity - 1);
        }
    }

    const addToCart = async () => {
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/cart/add/${id}`,
            method: 'POST',
            token: token,
            data: { quantity: quantity }
        })
        if (result.error) {
            toast.error(result.error, {
                autoClose: 1000
            })
        } else {
            toast.success("product added to cart", {
                autoClose: 1000
            })
        }
    }


    const handleaddstock = () => {
        setStockValue(stockvalue + 1);
    }

    const handlesubstractstock = () => {
        if (1 < stockvalue) {
            setStockValue(stockvalue - 1)
        }
    }


    const updateStock = async () => {
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/product/update-stock/${id}`,
            method: "put",
            token: token,
            data: { stock: stockvalue }
        })

        if (result.error) {
            toast.error(result.error, { autoClose: 1000 })
        } else {
            toast.success("stock updated sucessfully ..", {
                autoClose: 1000
            })
        }
    }

    const handleConfirmDelete = async (id: string) => {
        setIsModalOpen(false)
        const result = await fetchDataFromApi({
            url: `http://localhost:8000/product/remove-product/${id}`,
            method: 'delete',
            token: token
        })
        if (result.error) {
            toast.error(result.error, {
                autoClose: 1000
            })
        } else {
            toast.success("product deleted sucessfully", { autoClose: 1000 });
            navigate('/admin/all-product');
        }
    }


    useEffect(() => {
        if (!token) {
            navigate('/login')
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

                                <div className="product_rating_container">
                                    <div className="rating_container_button">{produtDetails?.rating.rate} <i className="bi bi-star-fill star" /></div>
                                    <p className="product-rating-count">{produtDetails?.rating.count}  Ratings</p>
                                    {
                                        role !== 'admin' && <p className="product-rating-count text-primary">
                                            <Link to={`/rate-product/${id}`} style={{ textDecoration: "none" }}>
                                                Rate product
                                            </Link>
                                        </p>
                                    }
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
                                                <p> Available :
                                                    {
                                                        produtDetails.stock > 0 ? <span className="avialable"> In Stock</span> : <span className="text-danger">Out of  Stock</span>
                                                    }
                                                </p>

                                                <p>Sold By : <span className="avialable">{produtDetails.vendorId.name}</span></p>
                                            </>
                                        )
                                    }
                                </div>
                                <hr className="availablehr" />


                                {role === 'user' ? (

                                    <>
                                        <p className="last-cont-para">Select qunatity : </p>
                                        <div className="last-container">

                                            <div className="prodduct-quantity">
                                                <button className="quantity-button me-2" onClick={handleplusClick}> + </button>
                                                <span className="quantity-button text-primary">{quantity}</span>
                                                <button className="quantity-button ms-2" onClick={handleminusclick}> -</button>
                                            </div>
                                            <Button variant="contained" endIcon={<AddShoppingCartIcon />} onClick={addToCart}>
                                                ADD TO CART
                                            </Button>
                                        </div>
                                    </>
                                ) :
                                    (
                                        <>
                                            <div className="update-stock">
                                                <p className="update-stock-para">Update stock</p>
                                                <div className="prodduct-quantity">
                                                    <button className="quantity-button me-2" onClick={handleaddstock}> + </button>
                                                    <span className="quantity-button text-primary">{stockvalue} </span>
                                                    <button className="quantity-button ms-2" onClick={handlesubstractstock}> -</button>
                                                </div>
                                                <Button variant="contained" onClick={updateStock}>Update stock</Button>
                                            </div>
                                            <hr className="PE" />
                                            <Button variant="contained" color="error" className="PE" onClick={handleDeleteClick}>
                                                Delete product
                                            </Button>
                                            {produtDetails && (
                                                <ReusableModal
                                                    isOpen={isModalOpen}
                                                    onClose={handleCloseModal}
                                                    onConfirm={() => handleConfirmDelete(produtDetails._id)}
                                                    message="Are you sure to delete this Product from the Ishoap?"
                                                />
                                            )}
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    )
            }



        </>
    )
}