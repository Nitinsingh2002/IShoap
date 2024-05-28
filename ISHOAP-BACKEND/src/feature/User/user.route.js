import express from 'express'
import userController from './user.controller.js'
import jwtauth from '../../middleware/jwt.middleware.js';


const UserController = new userController();
const userRoutes = express.Router();



userRoutes.post("/user-register", (req, res, next) => {
    UserController.addUser(req, res, next)
})

userRoutes.post("/user-login", (req, res, next) => {
    UserController.userLogin(req, res, next)
})


userRoutes.get("/all-users", jwtauth, (req, res, next) => {
    UserController.getAlluser(req, res, next)
})

userRoutes.post("/add-address", jwtauth, (req, res, next) => {
    UserController.addUserAdress(req, res, next);
})

userRoutes.get("/get-address", jwtauth, (req, res, next) => {
    UserController.getAddress(req, res, next)
})

userRoutes.delete("/remove-address/:id", jwtauth, (req, res, next) => {
    UserController.deleteUserAdress(req, res, next);
})


userRoutes.put("/update-address/:id", jwtauth, (req, res, next) => {
    UserController.updateUserAddress(req, res, next)
})


userRoutes.get("/fetchUserDetails", jwtauth, (req, res, next) => {
    UserController.getSingleUser(req, res, next)
})


export default userRoutes;