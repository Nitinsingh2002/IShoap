import { cartRepository } from "./cart.repository.js";




export class cartControlller {
    constructor() {
        this.cartRepository = new cartRepository()
    }


    async addToCart(req, res, next) {
        try {
            const userId = req.userId;
            const productId = req.params.productId;
            const quantity = req.body.quantity;

            await this.cartRepository.addCart(userId, productId, quantity);
            return res.status(201).send("item is added to cart")

        } catch (error) {
            next(error)
        }
    }


    async updateCart(req, res, next) {
        try {
            const userId = req.userId;
            const id = req.params.id;
            const quantity = req.body.quantity;
            await this.cartRepository.upateCartItem(userId, id, parseInt(quantity))
            return res.status(200).send("product updated sucessfully")
        } catch (error) {
            next(error)
        }
    }

    async deleteCartItem(req, res, next) {
        try {
            const userId = req.userId;
            const id = req.params.id
            await this.cartRepository.deleteCart(userId, id)
            return res.status(200).send('Cart item deleted')
        } catch (error) {
            next(error)
        }
    }

    async getCart(req, res, next) {
        try {
            const userId = req.userId;
            const result = await this.cartRepository.get(userId)
            return res.status(200).send(result)
        } catch (error) {
            next(error)
        }
    }
}
