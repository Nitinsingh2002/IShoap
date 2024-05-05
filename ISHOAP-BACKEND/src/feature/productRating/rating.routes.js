import express from 'express'
import ratingController from './rating.controller.js';



const ratingRoutes = express.Router();
const RatingController = new ratingController();



ratingRoutes.post("/add-rating/product/:id", (req, res, next) => {
    RatingController.addRating(req, res, next)
})

ratingRoutes.delete("/remove-rating/:id/product/:pid", (req, res, next) => {
    RatingController.deleteRating(req, res, next)
})

ratingRoutes.put("/upadte-rating/:id/product/:pid", (req, res, next) => {
    RatingController.updateRating(req, res, next)
})

ratingRoutes.get("/get-rating/:productId",(req,res,next) =>{
    RatingController.getRating(req,res,next);
})
export default ratingRoutes;