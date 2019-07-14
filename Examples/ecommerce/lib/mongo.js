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