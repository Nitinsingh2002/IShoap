import ApplicationError from "../../../Error/application.error.js";
import NotFoundError from "../../../Error/notFound.error.js";
import OrderModel from "../order/order.schema.js";
import PaymentModel from "./Payment.Schema.js";



export default class PaymentRepository {
    async addPayment(razorpay_payment_id, razorpay_order_id, razorpay_signature) {
        try {
            const payment = new PaymentModel({
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature
            })
            await payment.save();
            return;

        } catch (error) {
            throw new ApplicationError("something went wrong in adding payment", 503);
        }
    }


    async updatePayment(orderId, razorpay_order_id) {
        try {


            const paymentDetails = await PaymentModel.findOne({ razorpay_order_id: razorpay_order_id });
            if (!paymentDetails) {
                throw new NotFoundError("payment details not found");
            }

            const updateResult = await OrderModel.findByIdAndUpdate(orderId, {
                paymentStatus: 'completed',
                PaymentId: paymentDetails._id
            });

            if (!updateResult) {

                throw new Error("Order update failed");
            }
            return;

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in updating order", 503);
            }
        }
    }


    async deleteOrderDetails(orderId) {
        try {
            
            const orderDetails = await OrderModel.findByIdAndDelete(orderId)
            if (!orderDetails) {
                throw new NotFoundError("order not found");
            }
            return;
        } catch (error) {
            console.log(error)
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in deleting order");
            }
        }
    }
}