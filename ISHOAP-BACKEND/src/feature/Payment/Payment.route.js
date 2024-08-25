import express from 'express';
import PaymentController from './Payment.controller.js';

const paymentControler = new PaymentController();
const paymentRouter = express.Router();


paymentRouter.post("/checkout", (req, res, next) => {
    paymentControler.checkout(req, res, next);
})

paymentRouter.post("/paymentverification", (req, res, next) => {
    paymentControler.paymentVerification(req, res, next);
})


export default paymentRouter;