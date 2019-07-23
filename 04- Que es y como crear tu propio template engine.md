# Qué es y cómo crear tu propio template engine

- Un template engine es una implementación de software que nos permite mezclar datos con una plantilla o template con el fin de generar un documento que será renderizado en el navegador. Algunos de los template engines más conocidos son: Handlebars (para JavaScript), Twig y Blade (para Laravel / PHP), JSP (para Java) o Jinja (de python).

- Express nos permite crear nuestro propio template engine personalizado. Además permite el uso de múltiples engines según la extensión de los archivos que le hayamos indicado.

```javascript
app.engine('<extension>', function( filePath, options, callback ){});

app.set('views', '<directorio-de-vistas>');
app.set('view engine', '<extension>');
```

- Donde filePath indica la ruta del template, options indica las variables que vamos a mezclar con el template y callback será la función que mezcle la plantilla con las opciones para obtener el documento que será mostrado en el navegador.

- Algo importante que debemos notar es que en Node, los callbacks son ““error first””, por lo que el primer parámetro devuelto por las funciones por lo general serán siempre el objeto que contenga los detalles del error, si es que los hay.

- Además en el objeto options recibido en el callback del engine, no solo se pasan las variables que definimos en la llamada, sino otros datos como settings y locals que deberemos descartar cuando estamos creando nuestro propio engine, pero que, cuando trabajamos con los template engines predefinidos, ya es Node quien se encarga de manejarlos.


## Retornar una pagina rederizada

```javascript
const express = require('express')
const app = express();

// Funcion creada en otro archivo
const expressJsx = require('./expressJsx');

app.engine("jsx", expressJsx);
app.set('views','./views');
app.set('view engine','jsx');

app.get('/',function(req,res,next){
    res.render(index,{'helo':'hola','world':'mundo'})
})


const server = app.listen(8000,()=>{
    console.log(`Listening http://localhost:${server.address().port}`);
})

```