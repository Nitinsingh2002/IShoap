import ratingRepsitory from "./rating.repository.js";


export default class ratingController {
    constructor() {
        this.ratingRepsitory = new ratingRepsitory();
    }

    async addRating(req, res, next) {
        try {
            const userId = req.userId;
            console.log("in", userId)
            const productId = req.params.id;
            const rating = req.body.rating
            await this.ratingRepsitory.add(userId, productId, rating)
            return res.status(201).send("rating added");
        } catch (error) {
            next(error)
        }
    }


    async deleteRating(req, res, next) {
        try {
            const userId = req.userId;
            const id = req.params.id;
            const productId = req.params.pid

            await this.ratingRepsitory.delete(userId, id, productId)
            return res.status(200).send("rating deleted sucessfully...")
        } catch (error) {
            next(error)
        }
    }


    async updateRating(req, res, next) {
        try {
            const userId = req.userId;
            const id = req.params.id;
            const productId = req.params.pid
            const rating = req.body.rating
          
            await this.ratingRepsitory.update(id, userId, productId, parseFloat(rating))
            return res.status(200).send("rating updated sucessfully");
        } catch (error) {
            next(error)
        }
    }

    async getRating(req, res, next) {
        try {
            const userId = req.userId;
            const productId = req.params.productId;
            const result = await this.ratingRepsitory.get(userId,productId);
            return res.status(201).send(result);
        } catch (error) {
            next(error);
        }
    }
}