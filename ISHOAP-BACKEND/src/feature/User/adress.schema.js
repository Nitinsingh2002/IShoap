import mongoose from "mongoose";
import { Schema } from "mongoose";

export const addressSchema = new Schema({
    customerId: {
        type: mongoose.Types.ObjectId,
        ref: 'customers'
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name is too short"],
        maxlength: [40, "Name is too long"]
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }, postalCode: {
        type: String,
        required: true,
        minlength: [6, "Postal code must be 6 characters long"],
        maxlength: [6, "Postal code must be 6 characters long"]
    }, mobile: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Mobile number must be 10 digits long']

    },


})


const addressModel = new mongoose.model('Address', addressSchema);
export default addressModel;