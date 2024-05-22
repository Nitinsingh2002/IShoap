


export interface PendingProduct {
    _id?:string,
    name: string,
    description: string,
    price: number | undefined,
    stock: number | undefined,
    image: string[]
    vendorId?: string,
    categoryId: string
}