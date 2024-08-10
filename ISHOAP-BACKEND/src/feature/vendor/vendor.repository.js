import mongoose from "mongoose";
import ValidationError from "../../../Error/validation.error.js";
import ApplicationError from "../../../Error/application.error.js";
import vendorModel from "./vendor.schema.js";
import NotFoundError from "../../../Error/notFound.error.js";
import adminmodel from "../admin/admin.schema.js";
import pendingProductModel from "./pending.product.schema.js";

import ProductModel from "../products/product.schema.js";


export default class vendorRepository {

    async Registervendor(name, email, hashedPassword, mobile) {
        try {
            const Vendor = new vendorModel({
                name: name,
                email: email,
                password: hashedPassword,
                mobile: mobile,
            });
            const savedVendor = await Vendor.save();
            return savedVendor;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new ValidationError("Email already registered", 422);
            } else if (error instanceof mongoose.Error.ValidationError) {
                const firstErrorMessage = Object.values(error.errors)[0].message;
                throw new ValidationError(firstErrorMessage, 422);
            } else {
                throw new ApplicationError("Something went wrong in adding Vendor", 503);
            }
        }
    }



    async VendorLogin(email) {
        try {
            if (!email) {
                throw new NotFoundError("please enter email")
            }
            const vendor = await vendorModel.findOne({ email: email })
            if (!vendor) {
                throw new NotFoundError("vendor not found")
            } else {
                return vendor;
            }
        } catch (error) {
            console.log(error)
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            }
            else {
                throw new ApplicationError("Something went wrong in vendor login", 503)
            }
        }
    }


    async fetchall(adminId) {
        try {
            const admin = await adminmodel.findById(adminId)
            if (!admin) {
                throw new NotFoundError("you are not authorized")
            } else {
                const allvendorDetails = await vendorModel.find({}, { password: 0 })
                return allvendorDetails
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            }
            else {
                throw new ApplicationError("Something went wrong  in fetching all vendor details", 503)
            }
        }
    }


    async vendorUpdate(vendorId, name, email, mobile) {
        try {
            if (!name || !email || !mobile) {
                throw new ValidationError("please fill details for each field", 403)
            }
            const vendor = await vendorModel.findById(vendorId)
            if (!vendor) {
                throw new NotFoundError("You are not authorizred to update details")
            }

            else {
                const password = vendor.password
                const result = await vendorModel.updateOne({ _id: vendorId }, {
                    name: name,
                    email: email,
                    mobie: mobile,
                    password: password
                })
                if (result.acknowledged === true) {
                    return result
                } else {
                    throw new NotFoundError("You are not authorizred to update details or vendor not found")
                }
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else if (error instanceof ValidationError) {
                throw new ValidationError(error.message, error.code)
            }
            else {
                throw new ApplicationError("Something went wrong  updating vendor details", 503)
            }
        }
    }




    async productadd(vendorId, name, price, description, stock, categoryId, image) {
        try {
            const vendor = await vendorModel.findById(vendorId);
            if (!vendor) {
                throw new NotFoundError("you are not authorized to add a product")
            }

            const result = new pendingProductModel({
                name: name,
                price: price,
                description: description,
                stock: stock,
                image: image,
                vendorId: vendorId,
                categoryId: categoryId
            })
            const savedProduct = await result.save();
            return savedProduct;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            }
            else if (error instanceof mongoose.Error.ValidationError) {
                const firstErrorMessage = Object.values(error.errors)[0].message;
                throw new ValidationError(firstErrorMessage, 422);
            } else {
                throw new ApplicationError("Something went wrong in adding Vendor", 503);
            }
        }
    }




    async getvendorDetails(userId) {
        try {
            const vendor = await vendorModel.findById(userId, { password: 0 });
            if (!vendor) {
                throw new NotFoundError("Vendor not found");
            }
            return vendor;

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError('something went wrong in fetching vendor details', 503);
            }

        }
    }


    async getAllproductsofVendor(vendorId) {
        try {
            const vendor = await vendorModel.findById(vendorId);
            if (!vendor) {
                throw new NotFoundError('Vendor not found');
            }
            const vendorProducts = await ProductModel.find({ vendorId: vendorId });
            if (!vendorProducts) {
                throw new NotFoundError('Products not found');
            } else {
                return vendorProducts;
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError('something went wrong in fetching product related to vendor', 503);
            }
        }
    }

}