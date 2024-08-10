

export interface pending{

    _id:string,
    name: string,
    description: string,
    price: number ,
    stock: number ,
    image: string[]
    vendorId?: {
        _id:string,
        name:string
    },
    categoryId: string
}
