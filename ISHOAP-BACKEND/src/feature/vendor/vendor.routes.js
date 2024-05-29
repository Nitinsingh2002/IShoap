import express from 'express';
import vendorController from './vendor.controller.js';
import jwtauth from '../../middleware/jwt.middleware.js';
import imageValidationMiddleware from '../../middleware/imageVlidation.middleware.js'
import { uploadFile } from '../../middleware/muter.js';



const VendorController = new vendorController();

const vendorRoutes = express.Router();

vendorRoutes.post("/register", (req, res, next) => {
    VendorController.register(req, res, next)
})

vendorRoutes.post("/login", (req, res, next) => {
    VendorController.login(req, res, next)
})

vendorRoutes.put('/update-details', jwtauth, (req, res, next) => {
    VendorController.update(req, res, next)
})

vendorRoutes.get("/get-vendor", jwtauth, (req, res, next) => {
    VendorController.getall(req, res, next);

})

vendorRoutes.post("/add-pendingProduct", jwtauth, uploadFile.array('image', 4), imageValidationMiddleware, (req, res, next) => {
    VendorController.addproduct(req, res, next)
})

vendorRoutes.get("/get-vendor-details", jwtauth, (req, res, next) => {
    VendorController.getSingleVendordetails(req, res, next);
})

vendorRoutes.get('/get-vendor-products', jwtauth, (req, res, next) => {
    VendorController.getProduct(req, res, next)
})






export default vendorRoutes;