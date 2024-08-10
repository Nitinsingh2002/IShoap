
import jwtauth from '../../middleware/jwt.middleware.js'
import express from 'express';
import { cartControlller } from './cart.controller.js';
const CartControlller = new cartControlller;
const cartRoutes = express.Router();

cartRoutes.post("/add/:productId", (req, res, next) => {
    CartControlller.addToCart(req, res, next)
})

cartRoutes.delete("/delete/:id", jwtauth, (req, res, next) => {
    CartControlller.deleteCartItem(req, res, next)
})

cartRoutes.put("/update/:id", jwtauth, (req, res, next) => {
    CartControlller.updateCart(req, res, next)
})

cartRoutes.get("/get", jwtauth, (req, res, next) => {
    CartControlller.getCart(req, res, next)
})



export default cartRoutes;