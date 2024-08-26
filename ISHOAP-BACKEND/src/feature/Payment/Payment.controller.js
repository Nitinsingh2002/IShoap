import { instance } from "../../../index.js";
import PaymentRepository from "./Payment.repository.js";
import crypto from 'crypto';



export default class PaymentController {
   constructor() {
      this.PaymentRepository = new PaymentRepository();
   }



   async checkout(req, res, next) {
      try {
         const { amount } = req.body;
         const options = {
            amount: amount * 100,     //ammount in smallest currency unit
            currency: "INR"
         };

         //creating  payment  order
         const order = await instance.orders.create(options);
         res.status(200).send(order);

      } catch (error) {
         next(error);
      }
   }


   async paymentVerification(req, res, next) {
      try {
         //order id taken from db for saftey 
         const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
         const { orderId } = req.params;
         const secret = process.env.RAZOR_PAY_SECRET
         const generated_signature = crypto.createHmac('sha256', secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

         if (generated_signature === razorpay_signature) {
            await this.PaymentRepository.addPayment(razorpay_payment_id, razorpay_order_id, razorpay_signature);
            await this.PaymentRepository.updatePayment(orderId, razorpay_order_id);
            res.redirect('http://localhost:3000/order/sucessful');
         } else {
            res.redirect('http://localhost:3000/order/fail');
         }

      } catch (error) {
         next(error)
      }
   }


   async deleteOrder(req, res, next) {
      try {
         console.log("function reach here")
         const { orderId } = req.params;
         await this.PaymentRepository.deleteOrderDetails(orderId);
         return res.status(200).send("order deleted sucessfully");
      } catch (error) {
         console.log(error)
         next(error)
      }
   }

}