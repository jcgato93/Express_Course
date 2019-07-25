# Qué es un middleware y qué tipos existen

Un middleware no es nada más que una funcion que tiene 3 argumentos

```javascript
function(req,res,nex){
    next() // cuando se invoca llama al siguiente middleware
}
```

Piensa en los middlewares como una serie de capas que sirven generalmente para hacer modificaciones al req(reques) y al res(response) Object.
Se podrian hacer validaciones ,manejo de errores etc.

## Tipos de Middleware

- 3rd party
- Router level
- Application level
- Built-in
- Error-handing

Documentación en : https://expressjs.com/es/guide/using-middleware.html


los middlewares que actualmente sufren mantenimiento de express son los siguientes:

https://expressjs.com/en/resources/middleware.html

body-parser
compression
connect-rid
cookie-parser
cookie-session
cors
csurf
errorhandler
method-override
morgan
multer
response-time
serve-favicon
serve-index
serve-static
session
timeout
vhost