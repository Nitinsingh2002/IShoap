import orderRepository from "./order.repository.js";



export default class orderController {
    constructor() {
        this.orderRepository = new orderRepository()
    }


    async addOrder(req, res, next) {
        try {
            const userId = req.userId
            const products = req.body.products;
            await this.orderRepository.add(userId, products);
            return res.status(201).send("order placed sucessfully")
        } catch (error) {
            next(error)
        }
    }


    async get(req, res, next) {
        try {
            const userId = req.userId;
            const result = await this.orderRepository.getOrder(userId)
            return res.status(200).send(result)
        } catch (error) {
            next(error)
        }
    }
}