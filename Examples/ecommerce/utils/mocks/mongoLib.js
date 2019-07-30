const { productsMock, filteredProductsMock } = require("./products");
const sinon = require("sinon");

/**
 * este crea una funcion que no hace nada
 * pero que tiene ciertos atributos que permiten registrar 
 * cuando se llama y cuando no
 */
const getAllStub = sinon.stub(); 

// mock query
const tagQuery = { tags: { $in: ["expensive"] } };

// Este sirve para cuando se pasen ciertos argumento retorne o resulva algo especifico
getAllStub.withArgs("products").resolves(productsMock);

// Este se ejecutara cuando se pase "products" y tagQuery por parametro
getAllStub
  .withArgs("products", tagQuery)
  .resolves(filteredProductsMock("expensive"));

const createStub = sinon.stub().resolves("6bedb1267d1ca7f3053e2875");

class MongoLibMock {
  getAll(collection, query) {
    return getAllStub(collection, query);
  }

  create(collection, data) {
    return createStub(collection, data);
  }
}

module.exports = {
  getAllStub,
  createStub,
  MongoLibMock
};