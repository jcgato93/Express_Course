# Conexion a Mongodb en Express.js

- Lo primero es crear un archivo de configuracion seguro
para no dejar informacion fragil dentro del codigo

- Crear un archivo de ejemplo  .env.example
y dentro de este lo siguiente

        // CONFIG
        PORT = 8000

        // MONGO
        DB_USER = 
        DB_PASSWORD =
        DB_HOST =
        DB_PORT =
        DB_NAME =

esto solo con el fin de dar un ejemplo de como se deben crear los archivo de configuracion.

Luego si se debe crear el .env con la informacion real que se utilizara


- Luego se crea una carpeta llamada config y dentro de esta un archivo index.js

- Instalar la libreria dotenv para leer el archivo de configuración

            npm i -S dotenv

luego en el archivo config/index.js

```javascript
// pasa la informacion del archivo .env y las variables de entorno
require('dotenv').config();

const config ={
    // verifica que no este en entorno de produccion
    dev: process.env.NODE_ENV !== "production",

    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME
}

module.exports = { config };
```

- Agregar al gitignore el archivo .env

- Instalar la dependencia de mongodb

        npm i -S mongodb


- Luego se crea una carpeta con el nombre lib y dentro de esta un archivo mongo.js donde se tendra la configuracion de la conexion a la base de datos

```javascript
const { config } = require('../config');
const { MongoClient } = require('mongodb');

// esto con el fin de evitar problemas por caracteres especiales
const { config } = require('../config');
const { MongoClient } = require('mongodb');

// esto con el fin de evitar problemas por caracteres especiales
const USER = encodeURIComponent (config.dbUser);
const PASSWORD = encodeURIComponent (config.dbPassword);
const DB_NAME = config.dbName;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@cluster0-npsag.mongodb.net/test?retryWrites=true&w=majority`;



class MongoLib {
    constructor(){
        console.log (MONGO_URI, "url ------")
        this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
        this.dbName = DB_NAME;
    }

    connect(){
        return new Promise((resolve,reject)=>{
            this.client.connect(error=>{
                if(error){
                    reject(error);
                }

                console.log('Connected Successfuly');
                resolve(this.client.db(this.dbName));
            })
        })
    }

    // Metodo generico
    getAll(collection,query){
        return this.connect().then(db=>{
            return db
            .collection(collection)
            .find(query)
            .toArray();
        });
    }
}

module.exports = MongoLib;
```


## Utilizar mongo desde un servicio


```javascript
const MongoLib = require('../lib/mongo');


class ProductsService {
    constructor() {
        this.collection = 'products';
        this.mongoDB = new MongoLib();
    }

    async getProducts({ tags }) {
        // verificar si existen los tags y armar la consulta
        const query = tags && { tags : {$in:tags} };
        const produts = await this.mongoDB.getAll(this.collection, query);

        // si no retorna ningun producto la consulta entonces devuelve un array vacio
        return products || [];
    }
}
```