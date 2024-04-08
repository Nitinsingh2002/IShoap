import jwt from 'jsonwebtoken';


const jwtauth = (req, res, next) => {
    const token = req.headers["authorization"]

    if (!token) {
        return res.status(401).send("Unauthorized acess");
    }

    try {
        const secretKey = process.env.JWT_SECRET_KEY_CODE
        const payload = jwt.verify(token, secretKey);
        req.userId = payload.userId;
        req.email = payload.email,
        req.name = payload.name
        next();
    } catch (error) {
        return res.status(401).send("Unauthorized acess");
    }
}

export default jwtauth;