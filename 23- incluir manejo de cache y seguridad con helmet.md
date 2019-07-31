# Añadiendo manejo de cache y seguridad con helmet



- Lo primero sera crear el siguiente archivo utils/cacheResponse.js

```javascript
const { config } = require('../config');

function cacheResponse(res,seconds){
    // Verificar que se esta en produccion para utilizar el cache
    if(!config.dev){
        res.set("Cache-Control",`public, max-age=${seconds}`)
    }
}

module.exports = cacheResponse;
```

- Crear el archivo time.js en la carpeta utils con el siguiente contenido

```javascript
const FIVE_MINUTES_IN_SECONDS = 300;
const SIXTY_MINUTES_IN_SECONDS = 3600;

module.exports = {
    FIVE_MINUTES_IN_SECONDS,
    SIXTY_MINUTES_IN_SECONDS
}
```

## Implementar el cache

- Como ejemplo de esta guia vamos al archivo routes/api/products.js

```javascript

const cacheResponse = require('../../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../../utils/time');

router.get("/", async function(req, res, next) {
  cacheResponse(res, FIVE_MINUTES_IN_SECONDS

    // other implementations
}

router.get("/:productId", async function(req, res, next) {
  cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
    // other implementations
}

```



## Implementar helmet

helmet : https://helmetjs.github.io/

helmet lo que hace es agregar unos headers de seguridad

- instalar dependencia

        npm i -S helmet


- Agregar helmet al index.js

```javascript
const helmet = require('helmet');

/*
 * Se debe colocar como primer middleware
 */
//middleware
app.use(helmet());
```