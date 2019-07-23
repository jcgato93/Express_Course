# Manejo de errores usando un middleware

Una de las mejores forma de manejar errores en express es utilizar un middleware

```javascript
function errorHandle(err,req,res,next){
    res.status(err.status || 500);
    res.render("error",{error:err});
}
```

## Crear Middlewares personalizados 

- Por lo generar se suele crear en la siguiente ruta utils/middlewares

Ejemplo:

```javascript
const { config } = require('../../config');

function logErrors(err,req,res,next){
    console.log(err.stack);
    next(err)
}

function clientErrorHandler(err,req,res,next){
    // catch errors for AJAX request
    if(req.xhr){
        res.status(500).json({ err: err.message})
    }else{
        next(err)
    }
}


function errorHandler(err,req,res,next){
    // catch erros while streaming
    if(res.headersSent){
        next(err);
    }


    if(!config.dev){
        delete err.stact;
    }

    res.status(err.status || 500);
    res.render("error",{ error: err});
}

module.exports = {
    logErrors,
    clientErrorHandler,
    errorHandler
}
```

Luego debemos importarlos en el index.js de la aplicacion
estos middlewares de error siempre deben estar al final de las rutas

```javascript
// error handlers
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
```

luego si creamos la vista de error en la carpeta de vistas.
views/error.pug

Ejemplo


```pug
extends layout

block content
    .container.main-content
        article.message.is-danger
            .message-body
                h1.tittle.has-text-danger = error.message
                h2.subtitle.has-text-danger = error.status
                if error.stack
                    pre.content.is-small #{error.stack}
```
