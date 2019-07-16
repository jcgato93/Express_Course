const { config } = require('../config');
const { MongoClient,ObjectId } = require('mongodb');

// esto con el fin de evitar problemas por caracteres especiales
const USER = encodeURIComponent (config.dbUser);
const PASSWORD = encodeURIComponent (config.dbPassword);
const DB_NAME = config.dbName;
const DB_HOST = config.dbHost;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}${DB_HOST}`;



class MongoLib {
    constructor(){        
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

    // Metodos generico
    getAll(collection,query){
        return this.connect().then(db=>{
            return db
            .collection(collection)
            .find(query)
            .toArray();
        });
    }

    getAll(collection, query) {
        return this.connect().then(db => {
          return db
            .collection(collection)
            .find(query)
            .toArray();
        });
      }
    
      get(collection, id) {
        return this.connect().then(db => {
          return db.collection(collection).findOne({ _id: ObjectId(id) });
        });
      }
    
      create(collection, data) {
        return this.connect()
          .then(db => {
            return db.collection(collection).insertOne(data);
          })
          .then(result => result.insertedId);
      }
    
      update(collection, id, data) {
        return this.connect()
          .then(db => {
            return db
              .collection(collection)
              .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
          })
          .then(result => result.upsertedId || id);
      }
    
      delete(collection, id) {
        return this.connect()
          .then(db => {
            return db.collection(collection).deleteOne({ _id: ObjectId(id) });
          })
          .then(() => id);
      }
}

module.exports = MongoLib;