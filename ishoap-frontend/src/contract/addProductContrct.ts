
export interface AddAdminProduct {
    name: string,
    description: string,
    price: number | string,
    stock: number | string,
    image: string[]
    vendorId: string,
    categoryId: string,
}