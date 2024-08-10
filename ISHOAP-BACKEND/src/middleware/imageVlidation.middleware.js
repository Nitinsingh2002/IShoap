import fs from 'fs';
import path from 'path';
import ValidationError from "../../Error/validation.error.js";

const __dirname = path.resolve(path.dirname(''));


const imageValidationMiddleware = (req, res, next) => {
    console.log("in validation",req.files)
    if (!req.files || req.files.length !== 4) {

        req.files.forEach(file => {
            console.log(file)
            const filePath = path.resolve(__dirname, 'public', 'images', file.filename);  // path.resolve is used to concate all the path
            fs.unlinkSync(filePath);  // to delete a file
        });
        throw new ValidationError("Please add exactly 4 images", 400);
    }
    next();
};

export default imageValidationMiddleware;
