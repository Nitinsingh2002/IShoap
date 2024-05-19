import { Button } from '@mui/material';
import { ProductDetails } from '../../contract/productDetails.contract';
import './adminProductCard.css';
import { ReusableModal } from '../Resuable-modal/ReuasbleModal';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';


interface AdmincardProps {
    productList: ProductDetails[];
    deleteProduct: (id: string) => void;
    updateProduct: (id: string) => void;
    disabled: boolean;
}

export const AdminProductCard = ({ productList, deleteProduct, updateProduct, disabled }: AdmincardProps) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [deletedProductId, setDeleteProductId] = useState<string>();

    const handleDeleteClick = (id: string): void => {
        console.log("handle delete function called")
        setIsModalOpen(true);
        setDeleteProductId(id);
    };

    const handleCloseModal = (): void => {
        console.log('close modal function called')
        setIsModalOpen(false);
        setDeleteProductId("");
    };


    const handleConfirmDelete = (): void => {
        console.log("confirm delete function called")
        if (deletedProductId) {
            deleteProduct(deletedProductId);
        }
        setIsModalOpen(false);
        setDeleteProductId('');
    };

    
    return (
        <>
            <ToastContainer />

            {
                productList.map((product) => (
                    <div key={product._id} className='admin-product-container'>

                        <div className='admin-product-img'>
                            <img src={`http://localhost:8000/images/${product.image[0]}`} />
                        </div>

                        <div className='admin-product-details'>
                            <h5 className='admin-product-name'>{product.name}</h5>
                            <div><span className='fw-bold admin-price'>Price : </span>
                                <span className='actual-price'>{product.price.toLocaleString('en-In', { style: 'currency', currency: 'INR' })}</span>
                            </div>

                            <div>
                                Available :
                                {
                                    product.stock > 0 ? <span > In Stock</span> : <span className="text-danger">Out of  Stock</span>
                                }
                            </div>

                            <div>
                                Rating : <span>{product.rating.rate} <span className='bi bi-star-fill' style={{ color: 'yellow' }}></span></span>
                            </div>

                        </div>

                        <div className='admin-product-operation'>
                            <div>
                                <Button variant='outlined'>Update</Button>
                            </div>
                            <div>
                                <Button variant='outlined' color='error' onClick={() => { handleDeleteClick(product._id) }}>Delete</Button>

                            </div>

                        </div>


                    </div>


                ))
            }

            <ReusableModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={() => { handleConfirmDelete() }}
                message="Are you sure to delete this item from Ishoap?"
            />
        </>
    )
}