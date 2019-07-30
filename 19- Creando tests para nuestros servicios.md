# Creando tests para nuestros servicios

- Asi como las pruebas de los end-points utiliza mocks de los servicios, para nuestros 
servicios debemos utilizar mocks de la base de datos

- Primero vamos a crear el siguiente archivo utils/mocks/mongoLib.js

mas informacion sobre la libreria sinon : https://sinonjs.org/releases/latest/stubs/

```javascript
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
```

## Crear test de servicios

- Crear el siguiente archivo  test/services.products.test.js

```javascript
const assert = require("assert");
const proxyquire = require("proxyquire");

const {
  MongoLibMock,
  getAllStub,
  createStub
} = require("../utils/mocks/mongoLib");

const {
  productsMock,
  filteredProductsMock
} = require("../utils/mocks/products");

describe("services - products", function() {
  const ProductsService = proxyquire("../services/products", {
    "../lib/mongo": MongoLibMock
  });

  const productsService = new ProductsService();

  describe("when getProducts method is called", async function() {
    it(" should call the getAll MongoLib method", async function() {
      await productsService.getProducts({});
      assert.strictEqual(getAllStub.called, true);
    });

    it("should return an array of products", async function() {
      const result = await productsService.getProducts({});
      const expected = productsMock;
      assert.deepEqual(result, expected);
    });
  });

  describe("when getProducts method is called with tags", async function() {
    it("should all the getAll MongoLib method with tags args", async function() {
      await productsService.getProducts({ tags: ["expensive"] });
      const tagQuery = { tags: { $in: ["expensive"] } };
      assert.strictEqual(getAllStub.calledWith("products", tagQuery), true);
    });

    it("should return an array of products filtered by the tag", async function() {
      const result = await productsService.getProducts({ tags: ["expensive"] });
      const expected = filteredProductsMock("expensive");
      assert.deepEqual(result, expected);
    });
  });
});
```

- Finalmente podemos correr los test con el siguiente comando

        npm t
        ò
        npm run test