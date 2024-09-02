import mongoose from "mongoose";
import ApplicationError from "../../../Error/application.error.js";
import NotFoundError from "../../../Error/notFound.error.js";
import ValidationError from "../../../Error/validation.error.js";
import userModel from "./user.schema.js";
import adminmodel from '../admin/admin.schema.js'
import addressModel from "./adress.schema.js";

export default class userRepository {

    async RegisterCustomer(firstName, lastname, email, hashedPassword, mobile, Gender, DateOfBirth) {
        try {
            const USER = new userModel({
                name: {
                    firstName: firstName,
                    lastName: lastname
                },
                email: email,
                password: hashedPassword,
                mobile: mobile,
                gender: Gender,
                dateOfBirth: DateOfBirth
            });
            const savedUser = await USER.save();
            return savedUser;
        }
        catch (error) {
            console.log(error);
            if (error.code === 11000) {
                throw new ValidationError("Email already registered", 422);
            } else if (error instanceof mongoose.Error.ValidationError) {
                const firstErrorMessage = Object.values(error.errors)[0].message;
                throw new ValidationError(firstErrorMessage, 422);
            } else {
                throw new ApplicationError("Something went wrong in adding user", 503);
            }
        }
    }


    async customerLogin(email) {
        try {

            const user = await userModel.findOne({ email: email });
            if (!user) {
                throw new NotFoundError("user not found");
            } else {
                return user;
            }

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("Something went wrong in user login ", 503)
            }
        }

    }


    async getAllcustomer(adminId) {
        try {
            const admin = await adminmodel.findById(adminId);
            if (!admin) {
                throw new NotFoundError("you are not authorized");
            } else {
                const users = await userModel.find({}, { name: 1, email: 1, gender: 1, dateOfBirth: 1, mobile: 1 }).exec();
                return users;
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("`Something went wrong in getting all user ", 503)
            }
        }
    }

    async addCustomeraddress(userId, address) {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                throw new NotFoundError("User not found")
            } else {
                const newAddress = new addressModel(address);
                const savedAddress = await newAddress.save();
                await userModel.updateOne({ _id: userId }, { $push: { addresses: savedAddress._id } });
                return savedAddress;
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            }
            else if (error instanceof mongoose.Error.ValidationError) {
                const firstErrorMessage = Object.values(error.errors)[0].message;
                throw new ValidationError(firstErrorMessage, 422);
            } else {
                throw new ApplicationError("Something went wrong in adding address", 503)
            }
        }
    }


    async getCustomerAddress(userId) {
        try {
            const user = await userModel.findById(userId)
            if (!user) {
                throw new NotFoundError("user not found");
            } else {
                const address = await addressModel.find({ customerId: userId }, { name: 1, street: 1, city: 1, country: 1, postalCode: 1, state: 1, mobile: 1 }).exec()
                return address;
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in getting customer address", 503)
            }
        }
    }

    async deleteCustomeradress(userId, id) {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                throw new NotFoundError("user not found");
            } else {
                const deletedAddress = await addressModel.findByIdAndDelete(id);
                if (!deletedAddress) {
                    throw new NotFoundError("Address not found");
                }
                await userModel.updateOne({ _id: userId }, { $pull: { addresses: id } });
                return deletedAddress;
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in  deleting customer address", 503)
            }
        }
    }


    async updateCustomerAddress(userId, id, street, city, state, country, postalCode, mobile, name) {
        try {
            if (!street || !city || !state || !country || !postalCode || !mobile || !name) {
                throw new ValidationError("All fields are required");
            }
            const user = await userModel.findById(userId);
            if (!user) {
                throw new NotFoundError("user not found");
            } else {
                const address = await addressModel.updateOne({ _id: id }, {
                    street: street,
                    city: city,
                    postalCode: postalCode,
                    country: country,
                    state: state,
                    mobile: mobile,
                    name: name
                })

                if (!address) {
                    throw new NotFoundError("address not found")
                }
                return address;
            }

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else if (error instanceof ValidationError) {
                throw new ValidationError(error.message, 403)
            } else {
                throw new ApplicationError("Something went wrong in upadating address", 503)
            }
        }
    }

    async getoneUser(userid) {
        try {
            const user = await userModel.findById(userid).select("-password")
            if (!user) {
                throw new NotFoundError("User not found")
            } else {
                return user;
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("Something went wrong in fetching user details")
            }
        }
    }
}