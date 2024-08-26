import express from 'express'
import orderController from './order.controller.js'


const orderRoutes = express.Router()
const OrderController = new orderController()

orderRoutes.post("/add-order", (req, res, next) => {
    OrderController.addOrder(req, res, next)
})


orderRoutes.get("/get-order", (req, res, next) => {
    OrderController.get(req, res, next)
})

orderRoutes.get("/get-currentOrder/:orderId", (req, res, next) => {
    OrderController.getCurrentOrderId(req, res, next);
})

export default orderRoutes;


