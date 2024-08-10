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
            console.log(error)
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






    async updateProduct(adminId, id, name, price, description, stock,) {
        try {

            if (!name || !price || !description || !stock) {
                throw new ValidationError('Please fill all the fields');
            }
            const admin = await adminmodel.findById(adminId);
            if (!admin) {
                throw new NotFoundError("admin not found")
            }

            const product = await ProductModel.findById(id)
            if (!product) {
                throw new NotFoundError("product not found")
            }

            const result = await ProductModel.updateOne({ _id: id }, {
                name: name,
                price: price,
                description: description,
                stock: stock
            })

            if (result.acknowledged === true) {
                return result;
            } else {
                throw new NotFoundError("Failed to update product or you are not authorized")
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else if (error instanceof ValidationError) {
                throw new ValidationError(error.message, 422);
            } else {
                throw new ApplicationError("something went wrong in updating product", 503)
            }
        }
    }








    async fetchDeatails(id) {
        try {
            const product = await ProductModel.findById(id, { ratingsDetails: 0 }).populate('vendorId', { name: 1 });
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
            const allProducts = await ProductModel.find({}, { ratingsDetails: 0 }).populate('categoryId').exec()
            return allProducts;
        } catch (error) {
            console.log(error)
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




    async modifiedStock(productId, stock) {
        try {
            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new NotFoundError("product not found");
            }
            const result = await ProductModel.updateOne({ _id: productId }, {
                stock: stock
            })
            if (result.acknowledged === true) {
                return result;
            } else {
                throw new ValidationError("Failed to update product or you are not authorized")
            }

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message);
            } else if (error instanceof ValidationError) {
                throw new NotFoundError(error.message, 422)
            } else {
                throw new ApplicationError('something went wrong in updating product');
            }
        }
    }


    async allPending(adminId) {
        try {
            const admin = await adminmodel.findById(adminId);
            if (!admin) {
                throw new NotFoundError("you are not authorized")
            } else {
                const result = await pendingProductModel.find({}).exec();
                return result;
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in fetching details of pending product", 503);
            }
        }
    }

    async singlePending(adminId, id) {
        try {
            const admin = await adminmodel.findById(adminId);
            if (!admin) {
                throw new NotFoundError("you are not authorized")
            }

            const product = await pendingProductModel.findById(id).populate('vendorId', { name: 1, _id: 1 }).exec();
            if (!product) {
                throw new NotFoundError("product not found")
            } else {
                return product;
            }

        } catch (error) {
            console.log(error);
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in fetching details of pending product", 503);
            }
        }
    }





    async seraching(query, minprice, maxPrice) {
        try {

            // Escape special characters in the query
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Replace spaces with \s* to match any whitespace characters
            // and handle the specific case where digits follow directly after letters
            const modifiedQuery = escapedQuery
                .replace(/\s+/g, '\\s*')  // Allow flexible spaces
                .replace(/(\D)(\d)/g, '$1\\s*$2')  // Allow optional spaces between non-digits and digits
                .replace(/(\d)(\D)/g, '$1\\s*$2');  // Allow optional spaces between digits and non-digits

            // Construct regex pattern to match the modified query with case insensitive flag
            const regexPattern = new RegExp(modifiedQuery, 'i');

            let filterQuery = { name: { $regex: regexPattern } };

            // Add minprice condition to the filter query if provided
            if (minprice !== undefined) {
                filterQuery.price = { ...filterQuery.price, $gte: minprice };
            }

            // Add maxPrice condition to the filter query if provided
            if (maxPrice !== undefined) {
                filterQuery.price = { ...filterQuery.price, $lte: maxPrice };
            }


            // Find products matching the regex
            let result = await ProductModel.find(filterQuery);

            if (result.length === 0) {
                // No exact match found, performing fallback search
                // Extract keywords from the query for the fallback search
                //split the query when space comes eg hello who are you   => ["hello", "who", "are","you"] and after that we apply filter function which filter keyword which length is greater then 2 in this all 4 so keyword is ["hello", "who","are","you"]
                const keywords = query.split(/\s+/).filter(word => word.length > 2); // Filter out very short words

                if (keywords.length > 0) {
                    // Create a regex pattern to match any of the keywords   eg-> hello | who | are |you
                    const fallbackPattern = new RegExp(keywords.join('|'), 'i');

                    filterQuery.name = { $regex: fallbackPattern };

                    // Perform the fallback search using the keywords
                    result = await ProductModel.find(filterQuery);

                    if (result.length === 0) {
                        throw new NotFoundError("No product found");
                    }
                } else {
                    throw new NotFoundError("No product found");
                }
            }

            return result;
        }
        catch (error) {

            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in fecthing product", 503)
            }
        }
    }
}