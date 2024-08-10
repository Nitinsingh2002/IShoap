import mongoose from "mongoose";
import ApplicationError from "../../../Error/application.error.js";
import NotFoundError from "../../../Error/notFound.error.js";
import ValidationError from "../../../Error/validation.error.js";
import userModel from "../User/user.schema.js";
import productModel from "../products/product.schema.js";
import ratingModel from "./rating.schema.js";
import ProductModel from "../products/product.schema.js";
import { ObjectId } from "mongodb";


export default class ratingRepsitory {


    async add(userId, productId, rating) {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                throw new NotFoundError("user not found")
            }

            const product = await productModel.findById(productId);
            if (!product) {
                throw new NotFoundError("product not found")
            }

            const existingRating = await ratingModel.findOne({ productId: productId, userId: userId });
            if (existingRating) {
                throw new ValidationError("you already rated this product", 403)
            }

            const result = new ratingModel({
                rating: rating,
                productId: productId,
                userId: userId
            })

            const savedResult = await result.save();

            await ProductModel.updateOne({ _id: productId }, {
                $push: { ratingsDetails: savedResult._id }
            })

            const ratingAggegrate = await ratingModel.aggregate([{
                $match: { productId: new ObjectId(productId) }
            }, {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    ratingCount: { $sum: 1 }
                }
            }
            ])

            const { averageRating, ratingCount } = ratingAggegrate[0] || { averageRating: 0, ratingCount: 0 };
            product.rating.rate = averageRating;
            product.rating.count = ratingCount;
            await product.save();

            return savedResult;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else if (error instanceof mongoose.Error.ValidationError) {
                const firstErrorMessage = Object.values(error.errors)[0].message;
                throw new ValidationError(firstErrorMessage, 422);
            } else if (error instanceof ValidationError) {
                throw new ValidationError(error.message, error.code)
            }
            else {
                throw new ApplicationError("something went wrong in rating product", 503)
            }
        }
    }




    async delete(userId, ratingId, productId) {
        try {
            const user = await userModel.findById(userId);

            if (!user) {
                throw new NotFoundError("user not found")
            }

            const product = await productModel.findById(productId);
            if (!product) {
                throw new NotFoundError("product not found")
            }

            const rating = await ratingModel.findById(ratingId)
            if (!rating) {
                throw new NotFoundError("rating not found")
            }
            const result = await ratingModel.deleteOne({ _id: ratingId, userId: userId, productId: productId })
            await ProductModel.updateOne({ _id: productId }, {
                $pull: { ratingsDetails: ratingId }
            })

            const ratingAggegrate = await ratingModel.aggregate([{
                $match: { productId: new ObjectId(productId) }
            }, {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    ratingCount: { $sum: 1 }
                }
            }
            ])

            const { averageRating, ratingCount } = ratingAggegrate[0] || { averageRating: 0, ratingCount: 0 };
            product.rating.rate = averageRating;
            product.rating.count = ratingCount;
            await product.save();

            if (result.deletedCount === 1) {
                return result
            } else {
                throw new NotFoundError("error in finding rating or you are unauthorized")
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("Something went wrong in in deleting rating", 503)
            }
        }
    }



    async update(id, userId, productId, rating) {
        try {
            const user = await userModel.findById(userId);

            if (!user) {
                throw new NotFoundError("user not found")
            }

            const product = await productModel.findById(productId);
            if (!product) {
                throw new NotFoundError("product not found")
            }

            const result = await ratingModel.updateOne({ _id: id, productId: productId, userId: userId }, { rating: rating })

            const ratingAggegrate = await ratingModel.aggregate([{
                $match: { productId: new ObjectId(productId) }
            }, {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    ratingCount: { $sum: 1 }
                }
            }
            ])

            const { averageRating, ratingCount } = ratingAggegrate[0] || { averageRating: 0, ratingCount: 0 };
            product.rating.rate = averageRating;
            product.rating.count = ratingCount;
            await product.save();

            if (result.acknowledged === true) {
                return result
            } else {
                throw new NotFoundError("rating not found or you are unauthorized")
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else if (error instanceof mongoose.Error.ValidationError) {
                const firstErrorMessage = Object.values(error.errors)[0].message;
                throw new ValidationError(firstErrorMessage, 422);
            } else {
                throw new ApplicationError("something went wrong in updating rating", 503)
            }
        }
    }


    async get(userId, productId) {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                throw new NotFoundError("Product not found")
            }
            const user = await userModel.findById(userId);
            if (!user) {
                throw new NotFoundError("User not found");
            }
            const getRating = ratingModel.findOne({ userId: userId, productId: productId });
            return getRating;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in fetching rating details");
            }
        }
    }

}

