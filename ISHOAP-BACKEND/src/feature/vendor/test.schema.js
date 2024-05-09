import mongoose from "mongoose";

const { Schema } = mongoose;

const testSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const testModel = mongoose.model('test', testSchema);

export default testModel;
