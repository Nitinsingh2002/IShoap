


export interface CartDetails {
    _id: string,
    userId: string,
    productId: {
        _id: string,
        name: string,
        price: number,
        description: string,
        stock: number,
        image: string[],
        vendorId: string,
        categoryId: string

    },
    quantity: number,
    totalPrice: number

}