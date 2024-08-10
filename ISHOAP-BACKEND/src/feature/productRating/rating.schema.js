import mongoose from 'mongoose';
const { Schema } = mongoose;

const ratingSchema = new Schema({
    rating: {
        type: Number,
        required: true,
        min: [1, 'rating can not be less then 1'],
        max: [5, 'rating can not be more then 5']
    }, productId: {
        type: mongoose.Types.ObjectId,
        ref: 'products'
    }, userId: {
        type: mongoose.Types.ObjectId,
        ref: 'customers'
    }
})


const ratingModel = new mongoose.model("ratings", ratingSchema);
export default ratingModel;