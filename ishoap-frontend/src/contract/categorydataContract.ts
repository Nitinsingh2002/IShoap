
export interface CategoryData {
    _id: string,
    name: String,
    products: [
        {
           
            rating?: {
                rate: number,
                count: number
            },
            _id: string,
            name: string,
            price: number,
            description: string,
            stock: number,
            image: string[],
            vendorId: string,
            categoryId: string,
            ratingsDetails: []
        }
    ]
}