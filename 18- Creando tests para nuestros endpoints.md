# Creando tests para nuestros endpoints

- Instalar dependencias 

        npm i -D supertest mocha sinon proxyquire

    - supertest : levanta un servidor para simular las peticiones
    - mocha : para correr los asserts de los test        
    - sinon : para hacer stub y mocks
    - proxyquire : permite modificar peticiones para colocar los mocks

- Crear el script para correr los test en el package.json

```json

{
    //..
    "scripts":
        "test": "mocha --exit" // este por defecto buscara una carpeta llamada tets
    }
}
```

- Crear la carpeta llamada test en el directorio raiz.


- Antes de crear los test aplicaremos un concepto que se conoce como inversion de control
que en este caso es necesario para hacer los test.

Consiste en que cada ruta decide que instancia de la aplicacion usar, es decir hacia que servidor debe apuntar.

Para implementar lo primero es ir a la siguiente ruta dentro del proyecto

        routes/api/products.js

dentro de esta se debe hacer el siguiente cambio

```javascript
// JWT strategies
require('../../utils/auth/strategies/jwt');

function productsApi(app){
  // pasar todo el contenido dentro de esta funcion
}
```

- ahora se debe pasar la instancia del router dentro de la funcion
```javascript
function productsApi(app){
    const router = express.Router();
    app.use("api/products",router);  
}

// se exporta la function
modules.exports = productsApi;
```

- Luego se realiza el cambio en las rutas del index.js

```javascript
// routes
app.use("/products", productsRouter);
productsApiRouter(app) // <--------- el cambio
app.use("/api/auth", authApiRouter);
```


## Crear servidor de prueba

- Dentro de la carpeta utils crear un archivo llamado testServer.js, en este se creara 
e servidor de pruebas.

```javascript
const express = require('express');
const supertest = require('supertest');

function testServer(route){
    const app  = express();

    route(app);

    return supertest(app);
}

module.exports = testServer;
```

- Luego vamos a crear un Mock de productos en la siguiente ruta utils/mocks/products.js con el siguiente contenido

```javascript
const productsMock = [
  {
    name: "Brown t-shirt",
    price: "50",
    image:
      "https://images.unsplash.com/photo-1533025625706-f321868a1e6c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=924b11607083a7d154547c4853d3eaa5&auto=format&fit=crop&w=800&q=60",
    tags: ["expensive", "brown"]
  },
  {
    name: "White chair",
    price: "20",
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=bf884ad570b50659c5fa2dc2cfb20ecf&auto=format&fit=crop&w=800&q=60",
    tags: ["white", "cheap"]
  },
  {
    name: "White camera",
    price: "100",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=df4d2256d54f07d2d40ce7cda76c7ebf&auto=format&fit=crop&w=800&q=60",
    tags: ["expensive", "white"]
  },
  {
    name: "Black bike",
    price: "399",
    image:
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=53d820e6622fadd53b8638d60f468ccd&auto=format&fit=crop&w=800&q=60",
    tags: ["expensive", "black"]
  },
  {
    name: "Red shoes",
    price: "30",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0e44599932dce6b8440e26fb91e10a69&auto=format&fit=crop&w=800&q=60",
    tags: ["red", "expensive"]
  },
  {
    name: "Black headphones",
    price: "50",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f9f0fdc18a215ec725f8ca61dc6fcbdf&auto=format&fit=crop&w=800&q=60",
    tags: ["black", "expensive"]
  },
  {
    name: "Green plant",
    price: "10",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f845f73f09557d1a5d5b938de98e4392&auto=format&fit=crop&w=800&q=60",
    tags: ["green", "cheap"]
  },
  {
    name: "Red phone",
    price: "999",
    image:
      "https://images.unsplash.com/photo-1522273500616-6b4757e4c184?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=87a01c4351a5046d05b84894506fbb7d&auto=format&fit=crop&w=800&q=60",
    tags: ["red", "expensive"]
  },
  {
    name: "Brown boots",
    price: "90",
    image:
      "https://images.unsplash.com/photo-1521001750463-5f3e18f2da2d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=819e9dcb75b84114278a7163ff38a91c&auto=format&fit=crop&w=800&q=60",
    tags: ["brown", "expensive"]
  }
];

function filteredProductsMock(tag) {
  return productsMock.filter(product => product.tags.includes(tag));
}

class ProductsServiceMock {
  async getProducts() {
    return Promise.resolve(productsMock);
  }

  async createProduct() {
    return Promise.resolve("6bedb1267d1ca7f3053e2875");
  }
}

module.exports = {
  productsMock,
  filteredProductsMock,
  ProductsServiceMock
};
```

## Crear test de end-point

- Dentro de la carpeta test creada anteriormente debemos crear el archivo
routes.api.products.test.js y dentro de este el siguiente contenido

Mas informacion sobre la herramienta mocha para los test : https://mochajs.org/

```javascript
// para las validaciones
const assert = require("assert");
const proxyquire = require("proxyquire");


// Mocks
const {
  productsMock,
  ProductsServiceMock
} = require("../utils/mocks/products");

// Servidor de test
const testServer = require("../utils/testServer");


describe("routes - api - products", function() {
  /**
   * El primer parametro que recibe proxyquire es la ruta en la cual sequiere hacer el test
   * y luego dentro de las variables que existen en esa ruta que dependencia se quiere
   * cambiar por los mocks. En este caso se quiere hacer un mock de los servicios por lo que 
   * se pasa la ruta que esta utilizando la variable de services y se especifica por que la debe 
   * cambiar
  */
  const route = proxyquire("../routes/api/products", {
    "../../services/products": ProductsServiceMock
  });

  const request = testServer(route);

  // Pruebas de la ruta /products
  describe("GET /products", function() {
    it("should respond with status 200", function(done) {
      request.get("/api/products").expect(200, done);
    });

    it("should respond with content type json", function(done) {
      request.get("/api/products").expect("Content-type", /json/, done);
    });

    it("should respond with not error", function(done) {
      request.get("/api/products").end((err, res) => {
        assert.strictEqual(err, null);
        done();
      });
    });

    it("should respond with the list of products", function(done) {
      request.get("/api/products").end((err, res) => {
        assert.deepEqual(res.body, {
          data: productsMock,
          message: "products listed"
        });
        done();
      });
    });
  });
});
```


- Para correr los test seria con el siguiente comando

        npm t
        ò
        npm run test