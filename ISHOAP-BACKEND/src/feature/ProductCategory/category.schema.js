import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: [5, "Category name can't be less than 5 characters"],
        maxLength: [100, "Category name can't be more than 100 characters"]
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "products",
        validate: {
            validator: (value) => {
                return mongoose.Types.ObjectId.isValid(value);
            },
            message: 'Invalid product reference'
        }
    }]
});

const CategoryModel = mongoose.model('Category', categorySchema);

export default CategoryModel;
