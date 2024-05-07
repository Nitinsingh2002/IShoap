


export interface PendingProduct {
    name: string,
    description: string,
    price: number | null,
    stock: number | null,
    image: string[],
    vendorId?: string,
    categoryId: string
}