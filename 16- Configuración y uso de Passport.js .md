# Configuración y uso de Passport.js

- Lo primero sera instalar las dependencias del proyecto

        npm i -S passport passport-http passport-jwt jsonwebtoken bcrypt


- Luego añadir los campos necesarios de configuracion del JWT en el .env.example

        // AUTH
        AUTH_ADMIN_USERNAME  = 
        AUTH_ADMIN_PASSWORD = 
        AUTH_ADMIN_EMAIL = 
        AUTH_JWT_SECRET = 

- Agregar al archivo de configuracion  config/index.js

```javascript
// pasa la informacion del archivo .env y las variables de entorno
require('dotenv').config();


const config = {
    // verifica que no este en entorno de produccion
    dev: process.env.NODE_ENV !== "production",

    // ... otros campos de configuracion
    
    authAdminUsername: process.env.AUTH_ADMIN_USERNAME,
    authAdminPassword: process.env.AUTH_ADMIN_PASSWORD,
    authAdminEmail: process.env.AUTH_ADMIN_EMAIL,
    authJwtSecret: process.env.AUTH_JWT_SECRET
};

module.exports = { config };
```

- Crear en el directorio raiz una carpeta llamada scripts y dentro de esta la carpeta mongo, en esta se creara el archivo llamado seed-admin.js, sera un script de inicializacion de la base de datos.

seed-admin.js
```javascript
const bcrypt = require('bcrypt');
const chalk = require('chalk');
const MongoLib = require('../../lib/mongo');
const { config } = require('../../config/index');


// Retorna un objeto la estructura de un usuario
function buildAdminUser(password){
    return{
        password,
        username: config.authAdminUsername,
        email: config.authAdminEmail
    }
}

// Verifica si existe en usuario en la base de datos
async function hasAdminUser(mongoDB){
    const adminUser = await mongoDB.getAll('users',{
        username: config.authAdminUsername
    })

    return adminUser && adminUser.length;
}


// Crea la configuracion de usuario admin con el password hasheado
async function createAdminUser(mongoDB) {
    const hashedPassword = await bcrypt.hash(config.authAdminPassword, 10);
    const userId = await mongoDB.create("users", buildAdminUser(hashedPassword));
    return userId;
}


async function seedAdmin() {
    try {
      const mongoDB = new MongoLib();
  
      if (await hasAdminUser(mongoDB)) {
        console.log(chalk.yellow("Admin user already exists"));
        return process.exit(1);
      }
  
      const adminUserId = await createAdminUser(mongoDB);
      console.log(chalk.green("Admin user created with id:", adminUserId));
      return process.exit(0);
    } catch (error) {
      console.log(chalk.red(error));
      process.exit(1);
    }
  }
  
  seedAdmin();
```

- Luego ejecutaos el script desde la consola de node.js

        node scripts/mongo/seed-admin.js

este creara el usuario admin de si este no existe en la base de datos


## Autenticacion de usuarios

- Crear en la carpeta utils una carpeta llamada auth


