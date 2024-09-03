import userRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { sendWelcomeEmail } from "../../config/nodemailer.js";
import crypto from 'crypto';

export default class userController {
    constructor() {
        this.userRepository = new userRepository();
    }



    async addUser(req, res, next) {
        try {
            const { firstName, lastName, email, mobile, gender, password } = req.body
            const DateOfBirth = new Date(req.body.DateOfBirth)
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.userRepository.RegisterCustomer(firstName, lastName, email, hashedPassword, mobile, gender, DateOfBirth);

            let text;
            if (gender == 'male') {
                text = `Hello Mr.${firstName},\n\nWelcome to iShoap! We are delighted to have you join our community.\n\nBest Regards,\niShoap Team`;
            } else {
                text = `Hello Mrs. ${firstName},\n\nWelcome to iShoap! We are delighted to have you join our community.\n\nBest Regards,\niShoap Team`;
            }

            const COMPANY_GMAIL = process.env.COMPANY_GMAIL;
            const subject = 'Welcome to Ishoap';
            sendWelcomeEmail(COMPANY_GMAIL, email, subject, text);

            return res.send("user registered sucessfully");
        } catch (error) {
            console.log(error);

            next(error)
        }
    }


    async userLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await this.userRepository.customerLogin(email);


            const match = await bcrypt.compare(password, user.password)
            if (match) {
                const token = jwt.sign({
                    userId: user.id,
                    email: user.email,
                    name: user.name
                },
                    process.env.JWT_SECRET_KEY_CODE,
                    {
                        expiresIn: '4h'
                    }
                )
                return res.status(200).send(token);
            } else {
                return res.status(403).send("incorrect credentials");
            }
        } catch (error) {
            next(error)
        }
    }


    async getAlluser(req, res, next) {
        try {
            const adminId = req.userId;
            const result = await this.userRepository.getAllcustomer(adminId);
            return res.status(200).send(result);
        } catch (error) {
            next(error)
        }
    }

    async addUserAdress(req, res, next) {
        try {
            const userId = req.userId;
            const { street, city, state, postalCode, country, mobile, name } = req.body
            const address = ({
                customerId: userId,
                name: name,
                street: street,
                city: city,
                state: state,
                postalCode: postalCode,
                country: country,
                mobile: mobile
            })
            await this.userRepository.addCustomeraddress(userId, address);
            return res.status(201).send("address added sucessfully");
        } catch (error) {
            next(error)
        }
    }


    async getAddress(req, res, next) {
        try {
            const userId = req.userId;
            const result = await this.userRepository.getCustomerAddress(userId);
            return res.status(200).send(result)
        } catch (error) {
            next(error)
        }
    }


    async deleteUserAdress(req, res, next) {
        try {
            const userId = req.userId
            const id = req.params.id;
            await this.userRepository.deleteCustomeradress(userId, id);
            return res.status(200).send("adddress deleted sucessfully");
        } catch (error) {
            next(error)
        }
    }


    async updateUserAddress(req, res, next) {
        try {
            const userId = req.userId;
            const id = req.params.id;
            const { street, city, state, country, postalCode, mobile, name } = req.body
            await this.userRepository.updateCustomerAddress(userId, id, street, city, state, country, postalCode, mobile, name);
            return res.status(200).send("address updated sucessfully")
        } catch (error) {
            next(error)
        }
    }


    async getSingleUser(req, res, next) {
        try {
            const id = req.userId;
            const result = await this.userRepository.getoneUser(id);
            return res.status(200).send(result)
        } catch (error) {
            next(error)
        }
    }



    async forgotPassword(req, res, next) {
        try {

            const { email } = req.body
            const user = await this.userRepository.customerLogin(email);

            //genrate token for reset password
            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

            await this.userRepository.forgotpassword(user, hashedToken);
            const From = process.env.COMPANY_GMAIL
            const subject = "Email for password reset";
            const body = `You requested a password reset. Please click on the link below to reset your password:\n\n
           http://localhost:3000/reset-password/${resetToken}\n\n
    If you did not request this, please ignore this email.`

            sendWelcomeEmail(From, email, subject, body);
            return res.status(201).send("Please check your email ");


        } catch (error) {
            next(error)
        }
    }


    async resetPassword(req, res, next) {
        try {

            console.log("function called in backend")
            const { token } = req.params;
            const { password } = req.body;

            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.userRepository.findToken(hashedToken, hashedPassword);
            return res.status(200).send("Password changed sucessfully");

        } catch (error) {
            console.log(error)
            next(error)
        }
    }

}