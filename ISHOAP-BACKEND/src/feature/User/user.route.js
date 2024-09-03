import express from 'express'
import userController from './user.controller.js'
import jwtauth from '../../middleware/jwt.middleware.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import '../../config/google.js'

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




// google  authentication routes 
userRoutes.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

//calback url for google
userRoutes.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/login' }),
    function (req, res) {
        //setting cookie expiry time;
        const expirtTime = new Date();
        expirtTime.setHours(expirtTime.getHours() + 4)
        const tokenValue = req.user.token;
        res.cookie('token', tokenValue, {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            expires: expirtTime
        }).cookie('role', 'user', {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            expires: expirtTime
        }).redirect('http://localhost:3000/');
    });


// github authentication routes 
userRoutes.get('/auth/github', passport.authenticate('github'));

//callback url for github routes 
userRoutes.get('/auth/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: 'http://localhost:3000/login' }),
    (req, res) => {
        const expirtTime = new Date();
        expirtTime.setHours(expirtTime.getHours() + 4)
        const tokenValue = req.user.token;
        res.cookie('token', tokenValue, {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            expires: expirtTime
        }).cookie('role', 'user', {
            httpOnly: false,
            secure: false,
            sameSite: 'strict',
            expires: expirtTime
        }).redirect('http://localhost:3000/');
    }
);




//forgot password 
userRoutes.post("/forgot-password", (req, res, next) => {
    UserController.forgotPassword(req, res, next);
})

userRoutes.post("/reset-password/:token",(req,res,next)=>{
    UserController.resetPassword(req,res,next);
})


export default userRoutes;