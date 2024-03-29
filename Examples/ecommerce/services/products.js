const productsMocks = require('../utils/mocks/products');
const MongoLib = require('../lib/mongo');


class ProductsService {
    constructor() {
        this.collection = 'products';
        this.mongoDB = new MongoLib();
    }

    async getProducts({ tags }) {
        // verificar si existen los tags y armar la consulta
        const query = tags && { tags : { $in:tags } };
        const produts = await this.mongoDB.getAll(this.collection, query);

        // si no retorna ningun producto la consulta entonces devuelve un array vacio
        return produts || [];
    }

    async getProduct({ productId }) {
        const product = await this.mongoDB.get(this.collection, productId);
        return product || {};
    }

    async createProduct({ product }) {
        const createProductId = await this.mongoDB.create(this.collection, product);

        return createProductId;
    }

    async updateProduct({ productId, product }) {
        const updateProductId = await this.mongoDB.update(
            this.collection,
            productId,
            product
        );

        return updateProductId;
    }

    async deleteProduct({ productId }) {
        const deletedProductId = await this.mongoDB.delete(
            this.collection,
            productId
        );

        return deletedProductId;
    }
}

module.exports = ProductsService;