import express from 'express';
import PaymentController from './Payment.controller.js';
import jwtauth from '../../middleware/jwt.middleware.js';


const paymentControler = new PaymentController();
const paymentRouter = express.Router();


paymentRouter.post("/checkout", (req, res, next) => {
    paymentControler.checkout(req, res, next);
})

paymentRouter.post("/verify/:orderId", (req, res, next) => {
    paymentControler.paymentVerification(req, res, next);
})



//delete order when payment fail or when we cant able to get orderDetails for payment
paymentRouter.delete("/remove/order/:orderId", (req, res, next) => {
    paymentControler.deleteOrder(req, res, next)
})




export default paymentRouter;