import mongoose from 'mongoose';

const { Schema } = mongoose;

const pendingproductSchema = new Schema({
    name: {
        type: String,
        minLength: [5, "Product name can't be less than 5 characters"],
        maxLength: [100, "Product name can't be more than 100 characters"],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be a non-negative number"]
    },
    description: String,


    stock: {
        type: Number,
        min: [0, "Stock can't be less than 0"],
        validate: {
            validator: Number.isInteger,
            message: "Stock must be an integer value"
        }
    },
    image: [String],
    // image: {
    //     type: String,
    //     required: true
    // },
    vendorId: {
        type: mongoose.Types.ObjectId,
        ref: 'vendor'
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'categories'
    }
});


const pendingProductModel = mongoose.model("pendingproduct", pendingproductSchema);
export default pendingProductModel;