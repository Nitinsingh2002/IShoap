import ApplicationError from "../../../Error/application.error.js";
import CategoryModel from "./category.schema.js";
import NotFoundError from '../../../Error/notFound.error.js';
import ValidationError from '../../../Error/validation.error.js'
import adminmodel from "../admin/admin.schema.js";
import mongoose from "mongoose";
export default class categoryRepository {


    async addcat(name, adminId) {
        try {
            const admin = await adminmodel.findById(adminId);

            // validate producrt 


            if (!admin) {
                throw new NotFoundError("you are not authorized to add category")
            } else {
                const newcategory = new CategoryModel({
                    name: name,
                })
                const result = await newcategory.save();
                return result;
            }

        } catch (error) {

            if (error instanceof mongoose.Error.ValidationError) {
                const firstErrorMessage = Object.values(error.errors)[0].message;
                throw new ValidationError(firstErrorMessage, 422);
            } else if (error.code === 11000) {
                throw new ValidationError('category with same name already peresent', 422)
            }
            else if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong inaading category", 503);
            }
        }
    }


    async deletecat(id, adminId) {
        try {
            const admin = await adminmodel.findById(adminId);
            if (!admin) {
                throw new NotFoundError("you are not authorized to delete category")
            } else {
                const result = await CategoryModel.deleteOne({ _id: id })
                if (result.deletedCount === 1) {
                    return result;
                } else {
                    throw new NotFoundError("categoty not found")
                }
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in deleteing category", 503)
            }
        }
    }


    async updatecat(id, adminId, name) {
        try {
            const admin = await adminmodel.findById(adminId);
            if (!admin) {
                throw new NotFoundError("you are not authorized to delete category")
            } else {

                const tobeupdatedNamee = await CategoryModel.findById(id)
                if (!tobeupdatedNamee) {
                    throw new NotFoundError("category not found")
                }
                const result = await CategoryModel.updateOne({ _id: id }, { name: name })
                if (result) {
                    return result
                } else {
                    throw new NotFoundError("category not found")
                }
            }

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in deleteing category", 503)
            }
        }
    }

    async getallcat() {
        try {
            const result = CategoryModel.find().exec();
            return result;
        } catch (error) {
            throw new ApplicationError("something went wrong in getting category", 503)
        }
    }

    async fetchallproductsRealtedTocategory(id) {
        try {

            const category = await CategoryModel.findById(id).populate('products').exec()

            if (!category) {
                throw new NotFoundError("category not found")
            }
            return category;

        } catch (error) {
            console.log(error)
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in getting category", 503)
            }

        }
    }


    async getcategoryDetails(id, adminId) {
        try {
            const admin = await adminmodel.findById(adminId);
            if (!admin) {
                throw new NotFoundError("you are not authorized to delete category")
            } const result = await CategoryModel.findById(id);
              if(!result){
                throw new NotFoundError("category details not found")
              }else{
                return result;
              }

            } catch (error) {
                if (error instanceof NotFoundError) {
                    throw new NotFoundError(error.message)
                } else {
                    throw new ApplicationError("something went wrong in getting category", 503)
                }
            }
        }
}