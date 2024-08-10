

export interface ProductDetails {
    _id: string,
    name: string,
    price: number,
    description: string,
    stock: number,
    vendorId: {
        _id: string,
        name: string
    },
    categoryId: string,
    rating: {
        rate: number,
        count: number
    },
    image: string[],
    ratingDetails: string[]
}