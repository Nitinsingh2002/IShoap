import express from 'express';
import productController from './product.controller.js';
import { uploadFile } from '../../middleware/muter.js';
import jwtauth from '../../middleware/jwt.middleware.js';
import imageValidationMiddleware from '../../middleware/imageVlidation.middleware.js';


const prdocutRoutes = express.Router();
const ProductController = new productController();


prdocutRoutes.post("/add-product", jwtauth, uploadFile.array('image', 4), imageValidationMiddleware, (req, res, next) => {
    ProductController.add(req, res, next)
})


prdocutRoutes.delete("/remove-product/:id", jwtauth, (req, res, next) => {
    ProductController.delete(req, res, next)
})


prdocutRoutes.put("/update-product/:id", jwtauth, (req, res, next) => {
    ProductController.update(req, res, next)
})


prdocutRoutes.get("/get-details/:id", (req, res, next) => {
    ProductController.fetch(req, res, next)
})

prdocutRoutes.get("/get-allproducts", (req, res, next) => {
    ProductController.getAll(req, res, next)
})


prdocutRoutes.post('/aproved/:id', jwtauth, (req, res, next) => {
    ProductController.aproval(req, res, next)
})

prdocutRoutes.post('/decline/:id', jwtauth, (req, res, next) => {
    ProductController.decline(req, res, next)
})

//to get all pending product 
prdocutRoutes.get('/getall-pendingProduct', jwtauth, (req, res, next) => {
    ProductController.getAllPendingProduct(req, res, next);
})

prdocutRoutes.get("/filter-product", (req, res, next) => {
    ProductController.filter(req, res, next)
})

prdocutRoutes.put('/update-stock/:id', jwtauth, (req, res, next) => {
    ProductController.updateStock(req, res, next)
})


prdocutRoutes.get('/pending-product/:id', jwtauth, (req, res, next) => {
    ProductController.getsinglePending(req, res, next)
})



// to serach box functionality


prdocutRoutes.get("/serach",(req,res,next)=>{
    ProductController.serach(req,res,next)
})

export default prdocutRoutes;




