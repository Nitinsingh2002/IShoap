import mongoose from "mongoose";

const { Schema } = mongoose;

const vendorSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, "First name cannot be less than 3 characters"],
        maxlength: [30, "First name cannot be more than 30 characters"]
    },
    email: {
        type: String,
        required: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
        unique: [true, "Email already registered"]
    },
    password: {
        type: String
    },
    mobile: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Mobile number must be 10 digits long']
    }
});

const vendorModel = new mongoose.model("vendor",vendorSchema)

export default  vendorModel;
