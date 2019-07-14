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

    getProduct({ productId }) {
        return Promise.resolve(productsMocks[0]);
    }

    createProduct({ product }) {
        return Promise.resolve(productsMocks[0]);
    }

    updateProduct({ productId, product }) {
        return Promise.resolve(productsMocks[0]);
    }

    deleteProduct({ productId }) {
        return Promise.resolve(productsMocks[0]);
    }
}

module.exports = ProductsService;