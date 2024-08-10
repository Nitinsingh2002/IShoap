import ApplicationError from "../../../Error/application.error.js";
import NotFoundError from "../../../Error/notFound.error.js";
import ValidationError from "../../../Error/validation.error.js";
import userModel from "../User/user.schema.js";
import ProductModel from "../products/product.schema.js";
import OrderModel from "./order.schema.js";

export default class orderRepository {


    async add(userId, products) {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                throw new NotFoundError("User not found to place order.");
            }

            let totalPrice = 0;
            for (const product of products) {

                const { productId, quantity } = product;


                const productDetails = await ProductModel.findById(productId);
                if (!productDetails) {
                    throw new NotFoundError(`Product with ID ${productId} not found.`);
                }
                if (productDetails.stock < quantity) {
                    throw new NotFoundError(`Not enough stock available for product with ID ${productId}.`);
                }
                productDetails.stock -= quantity;

                await productDetails.save();

                const subtotal = productDetails.price * quantity;

                totalPrice += subtotal;
            }
            const order = new OrderModel({
                userId: userId,
                products: products,
                totalPrice: totalPrice
            });

            const savedOrder = await order.save();
            return savedOrder;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else if (error instanceof mongoose.Error.ValidationError) {
                const firstErrorMessage = Object.values(error.errors)[0].message;
                throw new ValidationError(firstErrorMessage, 422);
            } else {
                throw new ApplicationError("something went wrong in placing order", 503)
            }

        }
    }



    async getOrder(userId) {
        try {
            const user = await userModel.findById(userId)
            if (!user) {
                throw new NotFoundError("you are not authorized to see order")
            }

            const result = await OrderModel.find({ userId: userId }).populate({
                path: 'userId',
                select: '-password'
            }).populate('products.productId');
            return result;
        } catch (error) {
            console.log(error)
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in fetching all order", 503)
            }
        }
    }

}