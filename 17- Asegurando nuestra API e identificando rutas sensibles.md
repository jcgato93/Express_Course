# Asegurando nuestra API e identificando rutas sensibles

- Crear el siguiente archivo utils/auth/strategies/jwt.js y en este debemos implementar algo
muy parecido a la estrategia "basic"

```javascript
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('boom');
const { config } = require('../../../config/index');
const MongoLib = require('../../../lib/mongo');

passport.use(
    new Strategy({
        secretOrKey : config.authJwtSecret,
        jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async function(tokenPayload, cb){
        const mongoDB = new MongoLib();

        try {
            const [user] = await mongoDB.getAll("users",{
                username: tokenPayload.sub
            });

            if(!user){
                return cb(boom.unauthorized(),false);
            }

            return cb(null,user);

        } catch (error) {
            return cb(error);
        }
    }
    )
)
```

- Agregar estrategia a las rutas

Ejemplo :  routes/api/products.js

```javascript
const passport = require('passport');

// JWT strategies
require('../../utils/auth/strategies/jwt');

outer.put("/:productId",
passport.authenticate('jwt',{ session: false }),
validation({ productId: productIdSchema }, "params"), 
validation(updateProductSchema),
async function (req, res, next) {
    ...
}
```


- Por ultimo, para vefiricar que todo esta funcionando correctamente debemos hacer una prueba
en las rutas donde se implemento la estrategia del jwt.

Nota : el siguiente ejemplo es utilizando la herramienta postmant

En postman en la parte inferior esta la pestaña "Test" donde colocaremos el siguiente script

```javascript
// El siguiente script debe ser colocado en la peticion del token
// Ej: {{url}}/api/auth/token
var jsonData = JSON.parse(responseBody);
postman.setEnviromentVariable("access_token", jsonData.access_token);
```
de este modo cada vez que se realice esta peticion cambiara la variable de entorno llamada "access_token" que se puede utilizar desde otras peticiones http con postman

- Ahora desde la peticion donde queremos realizar la prueba desde el postman en la pestaña de 
Authorization se debe cambiar el Typo por Bearer authorization y en el campo token la siguiente linea:

        {{access_token}}

De este modo cada que realizemos una peticion deberia ser exitosa a menos de que el token este vencido , por lo que deberas refrescar el token.

En el siguiente enlace encontraras como implementar el refresh_token

https://www.npmjs.com/package/passport-refresh-token

