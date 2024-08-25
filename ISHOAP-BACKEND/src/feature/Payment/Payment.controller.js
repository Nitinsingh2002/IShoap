import { instance } from "../../../index.js";
import PaymentRepository from "./Payment.repository.js";



export default class PaymentController {
   constructor() {
      this.PaymentRepository = new PaymentRepository();
   }


   async checkout(req, res, next) {
      try {
         const options = {
            amount: Number(req.body.ammount * 100),     //ammount in smallest currency unit
            currency: "INR"
         };

         //creating  payment  order
         const order = await instance.orders.create(options);
         console.log(order);

         res.status(200).send(order);

      } catch (error) {
         console.error("Error creating order:", error);
         res.status(500).send({ error: "Failed to create order" });
      }
   }


   async paymentVerification(req, res, next) {
      try {

         res.status(200).json({ sucess: true })
      } catch (error) {
         console.log(error, "error in payment verification");
      }
   }


}