interface ProductDetails {
    productId: string;
    quantity: number;
    _id: string; 
}


export default interface OrderDataContract {
    _id: string;
    userId: string;
    products: ProductDetails[];
    totalPrice: number;
    AddressId: string;
    paymentStatus: 'pending' | 'completed';
    createdAt: string;
    updatedAt: string;
    __v: number;
}
