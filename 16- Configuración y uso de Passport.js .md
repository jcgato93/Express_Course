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

- Crear en la siguiente estructura de carpetas  utils/auth/strategies/basic.js

```javascript
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('boom');
const bcrypt = require('bcrypt');
const MongoLib= require('../../../lib/mongo');

passport.use(
    new BasicStrategy(async function(username,password, cb){
        const mongoDB = MongoLib();

        try {
            // Retorna de la base de datos el usuario con ese mismo username
            const [user] = await mongoDB.getAll("users", { username });

            // Si no retorna ningun usuario de la consulta 
            if(!user){
                return cb(boom.unauthorized(), false);
            }

            // Si el password no concuerda con el que retorna la base de datos
            if(!await bcrypt.compare(passport, user.password)){
                return cb(boom.unauthorized(),false);
            }

            // Si el usuario y el password concuerdan retorna el usuario
            return cb(null,user);

        } catch (error) {
            return cb(error)
        }
    })
)
```


- Crear end-point que rotorne un web token

En la carpeta routes/api crearemos un nuevo archivo con el nombre auth.js

```javascript
const express = require('express');
const passport = require('passport');
const boom = require('boom');
const jwt = require('jsonwebtoken');
const api = express.Router();
const { config } = require('../../config/index');

// Basic strategy
require('../../utils/auth/strategies/basic');


api.post("/token",async function(req, res, next){
    passport.authenticate("basic",function(error,user){
        try {
            if(error || !user){
                next(boom.unauthorized());
            }

            req.login(user, { session: false }, async function(error){
                if(error){
                    next(error);
                }

                const payload = { sub: user.username, email: user.email };

                const token = jwt.sign(payload, config.authJwtSecret, {
                    expiresIn: "15m"
                });

                return res.status(200).json({ access_token: token })
            })
        } catch (error) {
            next(error);
        }
    })(req,res,next);
})

module.exports = api;
```

- Añadir la ruta al index.js
```javascript
const authApiRouter  = require('./routes/api/auth');

// routes
 //...
app.use("/api/auth", authApiRouter);
```

- Por ultimo para verificar que todo functiona correctamente corremos el servidor 
y luego con una herramienta como postman hacer una peticion con un header de authorization basic
donde colocaremos el username y el password apuntando a la siguiente url:

        {{url}}/api/auth/token

este debe de retornar un json con el "access_token"        

