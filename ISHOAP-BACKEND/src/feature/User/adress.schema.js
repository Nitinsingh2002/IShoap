import mongoose from "mongoose";
import { Schema } from "mongoose";

export const addressSchema = new Schema({
    customerId: {
        type: mongoose.Types.ObjectId,
        ref: 'customers'
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
    }
})


const addressModel = new mongoose.model('Address', addressSchema);
export default addressModel;