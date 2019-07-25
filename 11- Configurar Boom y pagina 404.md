# Configurando Boom y página 404

Boom es una libreria del ecosistema de hapi.js que permite mostrar errores de una manera
mucho mas amigable

- API de boom
    https://github.com/hapijs/boom/blob/HEAD/API.md

- npm 
    npm i @hapi/boom
    https://www.npmjs.com/package/@hapi/boom

Boom nos brinda metodos los cuales ya retornan la informacion basica de un error
sin que el programador deba recordar los codigos http.


## Implementación

- Instalar la dependencia de boom

        npm i -S @hapi/boom   ó  npm i boom  (deprecated)


- Luego se implementa en el errorHandlers


```javascript
const { config } = require('../../config');

const boom = require('boom');
const isRequestAJAXOrApi = require('../../utils/isRequestAJAXOrApi');


/**
 * si esta en desarrollo incluir el stack de errores
 */
function withErrorStack(err,stack){
    if(config.dev){
        return {... err,stack}
    }
}


function logErrors(err,req,res,next){
    console.log(err.stack);
    next(err)
}

function wrapErrors(err,req,res,next){
    // Verifica si no es un error con el formato de boom
    if(!err.isBoom){
        next(boom.badImplementation(err));
    }

    // si ya esta con el formato de boom simplemente lo pasa al siguiente middleware
    next(err);
}

function clientErrorHandler(err,req,res,next){

    const{
        output : { statusCode, payload } // estraer de un error de boom
    } = err;

    // catch errors for AJAX request or an error ocurrs while streaming
    if(isRequestAJAXOrApi(req) || res.headersSent){
        res.status(statusCode).json(withErrorStack(payload,err.stack));
    }else{
        next(err)
    }
}


function errorHandler(err,req,res,next){
    const{
        output : { statusCode, payload } // estraer de un error de boom
    } = err;


    res.status(statusCode);
    res.render("error",withErrorStack(payload,err.stack));
}

module.exports = {
    logErrors,
    wrapErrors,
    clientErrorHandler,
    errorHandler
}
```


- Ahora implementarlo en el middleware de validationHandler
```javascript
'use strict'
const Joi = require('joi');

const boom = require('boom');

function validate(data,schema){
    const { error } = Joi.validate(data,schema);
    return error;
}


function validationHandler(schema,check="body"){
    return function(req,res,next){
        const error = validate(req[check],schema);
        error ? next(boom.badRequest(error)) : next();
    };
}

module.exports = validationHandler;
```

- Crear la funcion isRequestAJAXOrApi en la carpeta utils

```javascript
// verificar si la peticion es AJAX o espera una pagina html
function isRequestAJAXOrApi(req){
    return !req.accepts("html") || req.xhr;
}

module.exports =  isRequestAJAXOrApi;
```


- Ahora en el index.js  

```javascript

const {
logErrors,
wrapErrors, //<---------------
clientErrorHandler,
errorHandler
} = require('./utils/middlewares/errorsHandlers');


// error handlers
app.use(logErrors);
app.use(wrapErrors);  //<-------------
app.use(clientErrorHandler);
app.use(errorHandler);
```


## Implementar la pagina de error

Express por convencion indica que la ultima ruta es la pagina de error 
y puesto que si llego hasta ese punto es por que no encontro ninguna coincidencia 
con ninguna otra ruta 

- implementacion 
```javascript
const isRequestAJAXOrApi = require('./utils/isRequestAJAXOrApi')
const boom = require('boom');

// Not found response
app.use(function(req,res,next){
  if(isRequestAJAXOrApi(req)){
    const {
      output : {statusCode,  payload}
    } = boom.notFound();

    res.status(statusCode).json(payload)
  }

  res.status(404).render("404");
})

```


- Por ultimo debemos crear nuestra pagina 404 en la carpeta views

```pug
extends layout

block content
      .container.main-content
        h1.title 404 Not found!
```