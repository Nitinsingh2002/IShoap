import productRepository from "./product.repository.js";



export default class productController {

    constructor() {
        this.productRepository = new productRepository()
    }



    async add(req, res, next) {
        try {
            const adminId = req.userId;
            const { name, price, description, stock, vendorId, categoryId } = req.body;
            const images = req.files.map(file => file.filename);
            await this.productRepository.addProduct(name, price, description, stock, vendorId, categoryId, images, adminId)
            return res.status(201).send("Product added sucessfully..")

        } catch (error) {
            next(error)
        }
    }


    async delete(req, res, next) {
        try {
            const adminId = req.userId;
            const id = req.params.id
            await this.productRepository.deleteProduct(adminId, id);
            return res.status(200).send("product deleted sucessfuly");
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const adminId = req.userId
            const id = req.params.id
            const { name, price, description, stock } = req.body
            await this.productRepository.updateProduct(adminId, id, name, price, description, stock)
            return res.status(200).send("product updated sucessfully")
        } catch (error) {
            next(error)
        }
    }

    async fetch(req, res, next) {
        try {
            const id = req.params.id;
            const result = await this.productRepository.fetchDeatails(id);
            return res.status(200).send(result);
        } catch (error) {
            next(error)
        }
    }


    async getAll(req, res, next) {
        try {
            const result = await this.productRepository.fetchall();
            return res.status(200).send(result)
        } catch (error) {
            next(error)
        }

    }

    async aproval(req, res, next) {
        try {
            const adminId = req.userId;
            const id = req.params.id
            await this.productRepository.getAproval(adminId, id);
            return res.status(201).send("product added sucessfully")
        } catch (error) {
            next(error)
        }
    }




    async decline(req, res, next) {
        try {
            const adminId = req.userId;
            const id = req.params.id
            await this.productRepository.getdecline(adminId, id);
            return res.status(200).send("product deleted sucessfully")
        } catch (error) {
            next(error)
        }
    }


    async filter(req, res, next) {
        try {
            const { minprice, maxPrice, category } = req.query
            const result = await this.productRepository.filterProduct(minprice, maxPrice, category)
            return res.status(200).send(result)
        } catch (error) {

            next(error)
        }
    }


    async updateStock(req, res, next) {
        try {
            const { stock } = req.body;
            const productId = req.params.id;;
            await this.productRepository.modifiedStock(productId, stock);
            return res.status(201).send("Stock updated sucessfully");
        } catch (error) {
            next(error)
        }
    }

    async getAllPendingProduct(req, res, next) {
        try {
            const adminId = req.userId;
            const result = await this.productRepository.allPending(adminId);
            return res.status(201).send(result);

        } catch (error) {
            next(error)
        }
    }

    async getsinglePending(req, res, next) {
        try {
            const id = req.params.id;
            const adminId = req.userId;
            const result = await this.productRepository.singlePending(adminId, id);
            return res.status(201).send(result);

        } catch (error) {
            next(error)
        }
    }


    // implement serach box functionality
    async serach(req, res, next) {
        try {
            const { minprice, maxPrice } = req.body;
            const { query } = req.query;
            const result = await this.productRepository.seraching(query, minprice, maxPrice);
            return res.status(201).send(result);
        } catch (error) {
            next(error)
        }
    }
}

