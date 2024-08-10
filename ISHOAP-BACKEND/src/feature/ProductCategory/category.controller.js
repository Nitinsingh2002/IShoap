import categoryRepository from "./category.repository.js";



export default class categoryController {
    constructor() {
        this.categoryRepository = new categoryRepository();
    }


    async addcategory(req, res, next) {
        try {
            const adminId = req.userId;
            const { name } = req.body;
            await this.categoryRepository.addcat(name, adminId);
            return res.status(201).send("category addded sucessfully..")
        } catch (error) {
            next(error)
        }
    }


    async deletecategory(req, res, next) {
        try {
            const adminId = req.userId;
            const id = req.params.id;
            await this.categoryRepository.deletecat(id, adminId)
            return res.status(200).send("category deleted sucessfully..");
        } catch (error) {
            next(error)
        }
    }

    async updatecategory(req, res, next) {
        try {
            const adminId = req.userId;
            const id = req.params.id;
            const { name } = req.body
            await this.categoryRepository.updatecat(id, adminId, name)
            return res.status(200).send("category name upadted sucessfully");
        } catch (error) {
            next(error)
        }
    }

    async getcategory(req, res, next) {
        try {
            const result = await this.categoryRepository.getallcat();
            return res.status(200).send(result)
        } catch (error) {
            next(error)
        }
    }

    async getproductsrelatedTocategory(req, res, next) {
        try {
            const id = req.params.id
            const result = await this.categoryRepository.fetchallproductsRealtedTocategory(id)
            return res.status(200).send(result);
        } catch (error) {
            next(error)
        }
    }


    async getSingleCategory(req, res, next) {
        try {
            const adminId = req.userId;
            const id = req.params.id;
            const resut = await this.categoryRepository.getcategoryDetails(id,adminId);
            return res.status(201).send(resut);
        } catch (error) {
            next(error)
        }
    }
}