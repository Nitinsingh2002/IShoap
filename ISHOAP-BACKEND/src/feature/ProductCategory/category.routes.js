import express from 'express'

import categoryController from './category.controller.js';


const categoryRoutes = express.Router();
const CategoryController = new categoryController()

categoryRoutes.get("/get", (req, res, next) => {
    CategoryController.getcategory(req, res, next)
})

categoryRoutes.post("/add", (req, res, next) => {
    CategoryController.addcategory(req, res, next)
})

categoryRoutes.put("/update/:id", (req, res, next) => {
    CategoryController.updatecategory(req, res, next)
})

categoryRoutes.delete("/remove/:id", (req, res, next) => {
    CategoryController.deletecategory(req, res, next)
})

categoryRoutes.get("/get-category-products/:id", (req, res, next) => {
    CategoryController.getproductsrelatedTocategory(req, res, next)
})

categoryRoutes.get("/get-category/:id",(req,res,next)=>{
    CategoryController.getSingleCategory(req,res,next);
})

export default categoryRoutes;