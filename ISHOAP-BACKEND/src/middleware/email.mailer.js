import ValidationError from "../../Error/validation.error";
import { sendWelcomeEmail } from "../config/nodemailer";


export const emailMiddleware = (req, res, next) => {
    const { email, firstName } = req.body;

    if (email && firstName) {
        sendWelcomeEmail(email, firstName);
    } else {
        throw new ValidationError(" please provide name and and email", 422);
    }

    next();
}