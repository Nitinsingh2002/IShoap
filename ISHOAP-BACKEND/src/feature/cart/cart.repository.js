import { mongoose } from 'mongoose'
import ApplicationError from '../../../Error/application.error.js'
import NotFoundError from '../../../Error/notFound.error.js'
import ValidationError from '../../../Error/validation.error.js'
import userModel from '../User/user.schema.js'
import ProductModel from '../products/product.schema.js'
import cartModel from './cart.schema.js'


export class cartRepository {

    async addCart(userId, productId, quantity) {
        try {

            const user = await userModel.findById(userId)
            if (!user) {
                throw new NotFoundError("you are not authorized to add a product to cart")
            }

            const product = await ProductModel.findById(productId)
            if (!product) {
                throw new NotFoundError("Product not found to add to cart")
            }

            let cartItem = await cartModel.findOne({ userId: userId, productId: productId });

            if (cartItem) {
                cartItem.quantity += quantity;
                if (cartItem.quantity > 5) {
                    throw new ValidationError("You can't add more than 5 items of this product")
                }
                cartItem.totalPrice = product.price * cartItem.quantity;
                await cartItem.save();
                return cartItem;
            } else {
                const newCartItem = new cartModel({
                    userId: userId,
                    productId: productId,
                    quantity: quantity,
                    totalPrice: product.price * quantity,
                    createdAt: Date.now()
                })
                const savedResult = await newCartItem.save();
                return savedResult;
            }

        } catch (error) {
            console.log(error)
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else if (error instanceof mongoose.Error.ValidationError) {
                const firstErrorMessage = Object.values(error.errors)[0].message;
                throw new ValidationError(firstErrorMessage, 422);
            } else if (error instanceof ValidationError) {
                throw new ValidationError(error.message, 422)
            }
            else {
                throw new ApplicationError("Something went wrong adding product to cart", 503)
            }
        }
    }


    async upateCartItem(userId, id, quantity) {
        try {
            const user = await userModel.findById(userId)
            if (!user) {
                throw new NotFoundError("you are not authorized to update cart item")
            }

            if (!Number.isInteger(quantity) || quantity <= 0) {
                throw new ValidationError("Quantity must be a positive integer.", 400);
            }

            const cartItem = await cartModel.findById(id);
            if (!cartItem) {
                throw new NotFoundError("Cart item not found to update");
            }


            const product = await ProductModel.findById(cartItem.productId)
            if (!product) {
                throw new NotFoundError("product not found");
            }

            const totalPrice = product.price * quantity;

            const result = await cartModel.updateOne({ _id: id }, {
                quantity: quantity,
                totalPrice: totalPrice
            }
            )
            if (result.acknowledged === true) {
                return result
            } else {
                throw new NotFoundError("cart not found to update")
            }
        } catch (error) {
            console.log(error)
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else if (error instanceof ValidationError) {
                throw new ValidationError(error.message, error.code)
            }
            else {
                throw new ApplicationError("something went wrong in updating product in cartItem", 503)
            }
        }
    }

    async deleteCart(userId, id) {
        try {
            const user = await userModel.findById(userId)
            if (!user) {
                throw new NotFoundError("user not found")
            }

            const result = await cartModel.deleteOne({ _id: id });
            if (result.deletedCount === 1) {
                return result
            } else {
                throw new NotFoundError("cart item not found")
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in deleting cart item", 503)
            }
        }
    }

    async get(userId) {
        try {
            const user = await userModel.findById(userId)
            if (!user) {
                throw new NotFoundError("user not found")
            }

            const result = await cartModel.find({ userId: userId }).populate('productId').exec();
            return result;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in getting cart item", 503)
            }
        }
    }

}