import express from 'express';
import { mongoConnection } from './src/config/mongoose.js';
import userRoutes from './src/feature/User/user.route.js';
import cors from 'cors';
import NotFoundError from './Error/notFound.error.js';
import ValidationError from './Error/validation.error.js';
import ApplicationError from './Error/application.error.js';
import adminRouter from './src/feature/admin/admin.routes.js';
import vendorRoutes from './src/feature/vendor/vendor.routes.js';
import categoryRoutes from './src/feature/ProductCategory/category.routes.js';
import jwtauth from './src/middleware/jwt.middleware.js';
import prdocutRoutes from './src/feature/products/product.route.js';
import ratingRoutes from './src/feature/productRating/rating.routes.js'
import cartRoutes from './src/feature/cart/cart.route.js';
import orderRoutes from './src/feature/order/order.routes.js';
import passport from 'passport';

import './src/config/google.js'
import './src/config/github.js'






const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());



app.use("/user", userRoutes);
app.use("/admin", adminRouter);
app.use("/category", categoryRoutes);
app.use("/vendor", vendorRoutes)
app.use("/product", prdocutRoutes);
app.use("/rating", jwtauth, ratingRoutes)
app.use("/cart",jwtauth,cartRoutes);
app.use("/order",jwtauth,orderRoutes)

app.get("/", (req, res) => {
    return res.send("welcome to Ishoap api");
})


app.use('/images', express.static('public/images'));


app.use((error, req, res, next) => {
  
    if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof ApplicationError) {
        return res.status(error.code).send(error.message);
    } else {
        return res.status(500).send("Something went wrong. Please try again later.");
    }
});

app.use((req, res) => {
    return res.status(401).send("resource not found");
})

const port = 8000;
app.listen(port, async () => {

    console.log(`server is running on port number :${port}`)
    await mongoConnection();
})