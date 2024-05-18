import adminRepository from "./admin.repository.js";
import jwt from 'jsonwebtoken'


export default class adminController {

    constructor() {
        this.adminRepository = new adminRepository()
    }

    async adminLogin(req, res, next) {
        try {
            const { email, password } = req.body;

            const admin = await this.adminRepository.adminSignIn(email);


            
            if (password === admin.password) {
                const token = jwt.sign({
                    userId: admin.id,
                    email: admin.email,
                    name: admin.name
                },
                    process.env.JWT_SECRET_KEY_CODE,
                    {
                        expiresIn: '4h'
                    }
                )
                return res.status(201).send(token);
            } else {
                return res.status(403).send("Incorrect credentails")
            }

        } catch (error) {
            next(error)
        }
    }



}