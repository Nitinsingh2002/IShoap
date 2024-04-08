import mongoose from "mongoose";

const { Schema } = mongoose;

const adminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    }
});



const adminmodel = new mongoose.model('admins', adminSchema)
export default adminmodel;