

export  interface IProduct {
    _id: string
    name: string
    description: string
    price: number
    stock: number
    rating: { rate: number, count: number }
    image: string[]
    vendorId: string
    categoryId: {
        name: string; 
    };
}