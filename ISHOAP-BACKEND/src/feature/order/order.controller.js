import orderRepository from "./order.repository.js";



export default class orderController {
    constructor() {
        this.orderRepository = new orderRepository()
    }


    async addOrder(req, res, next) {
        try {
            const userId = req.userId
            const products = req.body.products;
            const addressId = req.body.addressId;
            const paymentId = req.body.paymentId;
            const result = await this.orderRepository.add(userId, products, addressId, paymentId);
            return res.status(201).send(result._id);
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

    async getCurrentOrderId(req, res, next) {
        try {
            console.log("function reach at controller")
            const { orderId } = req.params;
            console.log("orderId",orderId);


            const result = await this.orderRepository.getCurrentOrder(orderId);
            return res.status(200).send(result);
        } catch (error) {
            next(error)
        }
    }
}