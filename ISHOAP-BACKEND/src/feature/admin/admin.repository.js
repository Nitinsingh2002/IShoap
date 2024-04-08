import mongoose from "mongoose";
import ApplicationError from "../../../Error/application.error.js";
import NotFoundError from "../../../Error/notFound.error.js";

import adminmodel from "./admin.schema.js";





export default class adminRepository {

    async adminSignIn(email) {
        try {
            const admin = await adminmodel.findOne({ email: email })
            if (admin) {
                return admin;
            } else {
                throw new NotFoundError("Admin not found");
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundError(error.message)
            } else {
                throw new ApplicationError("something went wrong in login", 503)
            }
        }
    }



}