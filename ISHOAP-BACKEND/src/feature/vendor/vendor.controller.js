import vendorRepository from "./vendor.repository.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { sendWelcomeEmail } from "../../config/nodemailer.js";

export default class vendorController {
    constructor() {
        this.vendorRepository = new vendorRepository();
    }


    async register(req, res, next) {
        try {
            const { name, email, password, mobile } = req.body
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.vendorRepository.Registervendor(name, email, hashedPassword, mobile);
            return res.send("Vendor registered sucessfully..");
        } catch (error) {
            next(error)
        }
    }


    async login(req, res, next) {
        try {

            const { email, password } = req.body;

            const vendor = await this.vendorRepository.VendorLogin(email);

            const match = await bcrypt.compare(password, vendor.password)
            if (match) {
                const token = jwt.sign({
                    userId: vendor.id,
                    email: vendor.email,
                    name: vendor.name
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

    async getall(req, res, next) {
        try {
            const adminId = req.userId;
            const result = await this.vendorRepository.fetchall(adminId);
            return res.status(200).send(result)
        } catch (error) {
            next(error)
        }
    }


    async update(req, res, next) {
        try {
            const vendorId = req.userId;
            const { name, email, mobile } = req.body
            await this.vendorRepository.vendorUpdate(vendorId, name, email, mobile)
            return res.status(200).send("details updated sucessfully")

        } catch (error) {
            next(error)
        }
    }

    async addproduct(req, res, next) {
        try {
            const vendorId = req.userId
            const { name, price, description, stock, categoryId } = req.body
            console.log(name, price, description, stock, categoryId);
            const image = req.files.map(file => file.filename)
            console.log("image", image)
            await this.vendorRepository.productadd(vendorId, name, price, description, stock, categoryId, image);


            const from = process.env.COMPANY_GMAIL;
            const adminEmail = process.env.ADMIN_GMAIL_ID;
            const subject = "New Product Added by Vendor for Verification";
            const adminName = process.env.ADMIN_NAME
            const text = `Hello ${adminName},\n\nPlease check the pending product section. A new product has been added by a vendor and is awaiting your verification.\n\nBest Regards,\nIshoap Team`;
            sendWelcomeEmail(from, adminEmail, subject, text)

            return res.status(201).send('The product is awaiting approval from the administrator.')


        } catch (error) {
            next(error)
        }
    }



    async getSingleVendordetails(req, res, next) {
        try {
            const userId = req.userId;
            const result = await this.vendorRepository.getvendorDetails(userId);
            return res.status(201).send(result);
        } catch (error) {
            next(error)
        }
    }


    async getProduct(req, res, next) {
        try {
            const vendorid = req.userId;

            const result = await this.vendorRepository.getAllproductsofVendor(vendorid);
            return res.status(201).send(result)
        } catch (error) {
            next(error)
        }
    }

}