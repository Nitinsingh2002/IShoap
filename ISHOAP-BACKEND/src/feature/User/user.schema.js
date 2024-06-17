import mongoose from "mongoose";
import { Schema } from "mongoose";

export const userSchema = new Schema({

    name: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, "First name cannot be less than 3 characters"],
            maxlength: [30, "First name cannot be more than 30 characters"]
        },
        lastName: {
            type: String,
           
          
            maxlength: [30, "Last name cannot be more than 30 characters"]
        }
    },
    email: {
        type: String,
        required: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
        unique: [true, "email already registered"]
    },
    password: {
        type: String,
    },
    addresses: [{
        type: mongoose.Types.ObjectId,
        ref: 'Address'
    }],
    mobile: {
        type: String,
        match: [/^\d{10}$/, 'Mobile number must be 10 digits long']

    },
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
        validate: {
            validator: function (value) {
                const today = new Date();
                const DOB = new Date(value);
                const age = today.getFullYear() - DOB.getFullYear();
                const minimumAge = 10;
                return age >= minimumAge;
            },
            message: "Age can't be less than 10 years"
        }
    }
});

const userModel = new mongoose.model('Customer', userSchema);
export default userModel;