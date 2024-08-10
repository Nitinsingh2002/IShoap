import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
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
    rating: {
        rate: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
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
        ref: 'Category'
    },
    ratingsDetails: [{
        type: mongoose.Types.ObjectId,
        ref: 'ratings'
    }]
});


const ProductModel = mongoose.model("products", productSchema);
export default ProductModel;