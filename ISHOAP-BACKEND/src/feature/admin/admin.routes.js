import express from 'express'
import adminController from './admin.controller.js';


const adminRouter = express.Router();
const AdminController = new adminController();

adminRouter.post("/login", (req, res, next) => {
    AdminController.adminLogin(req, res, next)
})



export default adminRouter;