// pasa la informacion del archivo .env y las variables de entorno
require('dotenv').config();


const config = {
    // verifica que no este en entorno de produccion
    dev: process.env.NODE_ENV !== "production",

    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    dbHost: process.env.DB_HOST
};

module.exports = { config };