import ProductModel from "./product.schema.js";
import adminmodel from '../admin/admin.schema.js'
import NotFoundError from "../../../Error/notFound.error.js";
import ValidationError from "../../../Error/validation.error.js";
import ApplicationError from "../../../Error/application.error.js";
import vendorModel from '../vendor/vendor.schema.js'
import CategoryModel from "../ProductCategory/category.schema.js"
import fs, { promises } from 'fs';
import path from "path";
import ratingModel from "../productRating/rating.schema.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import pendingProductModel from "../vendor/pending.product.schema.js";


const __dirname = path.resolve(path.dirname(''));


export default class productRepository {



    async addProduct(name, price, description, stock, vendorId, categoryId, image, adminId) {
        try {
            const admin = await adminmodel.findById(adminId);
            if (!admin) {
                throw new NotFoundError("you are unauthorized to add a product")
            }

            const vendor = await vendorModel.findById(vendorId);
            if (!vendor) {
                throw new NotFoundError("vendor not found")
            }

            const category = await CategoryModel.findById(categoryId)
            if (!category) {
                throw new NotFoundError("category not found")
            }

            const newProduct = ({
                name: name,
                price: price,
                description: description,
                stock: stock,
                vendorId: vendorId,
                categoryId: categoryId,
                image: image
            })

            const result = new ProductModel(newProduct);
            const savedresult = await result.save();
            await CategoryModel.updateOne({ _id: categoryId }, { $push: { products: savedresult.id } })
            return savedresult;

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            }
            else if (error instanceof mongoose.Error.ValidationError) {
                const firstErrorMessage = Object.values(error.errors)[0].message;
                throw new ValidationError(firstErrorMessage, 422);
            } else {
                throw new ApplicationError("Something went wrong in adding product", 503);
            }
        }
    }



    async deleteProduct(adminId, productId) {
        try {
            const admin = await adminmodel.findById(adminId);
            if (!admin) {
                throw new NotFoundError("You are not authorized to delete this product");
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new NotFoundError("Product not found");
            }

            // Delete product images
            await Promise.all(product.image.map(async (imageName) => {
                const filePath = path.resolve(__dirname, 'public', 'images', imageName);
                await fs.promises.unlink(filePath);
            }));

            // Delete the product
            const result = await ProductModel.findByIdAndDelete(productId);
            if (!result) {
                throw new NotFoundError("Failed to delete product");
            }

            // Remove the product from the category
            await CategoryModel.updateOne({ _id: product.categoryId }, { $pull: { products: productId } });

            return result;
        } catch (error) {
            console.error(error);
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message);
            } else {
                throw new ApplicationError("Something went wrong in deleting product", 503);
            }
        }
    }






    async updateProduct(adminId, id, name, price, description, stock, vendorId, categoryId, image) {
        try {
            const admin = await adminmodel.findById(adminId);
            if (!admin) {
                throw new NotFoundError("admin not found")
            }

            const product = await ProductModel.findById(id)
            if (!product) {
                throw new NotFoundError("product not found")
            } else {
                await Promise.all(product.image.map(async (imageName) => {
                    const filePath = path.resolve(__dirname, 'public', 'images', imageName)
                    await fs.promises.unlink(filePath);
                }))
            }

            const result = await ProductModel.updateOne({ _id: id }, {
                name: name,
                price: price,
                description: description,
                stock: stock,
                vendorId: vendorId,
                categoryId: categoryId,
                image: image
            })

            if (result.acknowledged === 1) {
                return result;
            } else {
                throw new NotFoundError("Failed to update product or you are not authorized")
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in updating product", 503)
            }
        }
    }








    async fetchDeatails(id) {
        try {
            const product = await ProductModel.findById(id, { ratingsDetails: 0 });
            if (!product) {
                throw new NotFoundError("product not found")
            } else {

                return product
            }
        } catch (error) {
            console.log(error)
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in fetching product details", 503)
            }
        }
    }


    async fetchall() {
        try {
            const allProducts = await ProductModel.find({}, { ratingsDetails: 0 }).exec()
            return allProducts;
        } catch (error) {
            throw new ApplicationError("something went wrong in fetching all products", 503)
        }
    }


    async getAproval(adminId, id) {
        try {
            const admin = await adminmodel.findById(adminId)
            if (!admin) {
                throw new NotFoundError("You are not authorized to add a product")
            }

            const vendoProduct = await pendingProductModel.findById(id);
            if (!vendoProduct) {
                throw new NotFoundError("Product not found. Unable to add the product")
            }

            const result = new ProductModel({
                name: vendoProduct.name,
                price: vendoProduct.price,
                description: vendoProduct.description,
                stock: vendoProduct.stock,
                vendorId: vendoProduct.vendorId,
                categoryId: vendoProduct.categoryId,
                image: vendoProduct.image
            })

            const savedResult = await result.save()
            await pendingProductModel.deleteOne({ _id: id })

            return savedResult;

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            }
            else if (error instanceof mongoose.Error.ValidationError) {
                const firstErrorMessage = Object.values(error.errors)[0].message;
                throw new ValidationError(firstErrorMessage, 422);
            } else {
                throw new ApplicationError("Something went wrong in adding product", 503);
            }
        }
    }


    async getdecline(adminId, id) {
        try {
            const admin = await adminmodel.findById(adminId)
            if (!admin) {
                throw new NotFoundError("You are not authorized to add a product")
            }

            const vendoProduct = await pendingProductModel.findById(id);
            if (!vendoProduct) {
                throw new NotFoundError("Product not found. Unable to add the product")
            }
            const result = await pendingProductModel.deleteOne({ _id: id })

            if (result.deletedCount === 1) {
                return result
            } else {
                throw new NotFoundError("Unable to delete this product")
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in deleting product", 503)
            }
        }
    }


    async filterProduct(minprice, maxPrice, category) {
        try {
         


            let filterQuery = {}
            if (minprice !== undefined) {
                filterQuery.price = { $gte: parseInt(minprice) };
            }


            if (maxPrice !== undefined) {
                filterQuery.price = { ...filterQuery.price, $lte: parseInt(maxPrice) };
            }

            if (category !== undefined) {
                const categoryData = await CategoryModel.findById(category)
                if (!categoryData) {
                    throw new NotFoundError("category not found")
                }
                filterQuery.categoryId = category
            }

            const products = await ProductModel.find(filterQuery);
            return products;



        } catch (error) {
         
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in filtering product", 503)
            }
        }
    }
}