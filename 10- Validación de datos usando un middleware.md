# Validación de datos usando un middleware

Este nos ayuda por ejemplo a validar que el esquema de datos en las peticiones 
concuerde con lo esperado.

- Lo primero sera crear un nuevo middleware 

utils/middlewares/validationHandler.js

```javascript
'use strict'

function validate(data,schema){
    return false;
}


function validationHandler(schema,check="body"){
    return function(req,res,next){
        const error = validate(req[check],schema);
        error ? next(new Error(error)) : next();
    };
}

module.exports = validationHandler;
```

# Qué es Joi y Boom y cómo configurar Joi

Son librerias que vienen del ecosistema de hapi.js que se podria considerar la competencia de express.js

- Joi : Es un validador de objectos y sus esquemas
- Boom : Simplemente permite enviar errores de una manera mas agradable

## Configuracion de Joi

- Lo primero es instalar joi como dependencia 

        npm i -S joi

- Crear la carpeta de los schemas

        utils/schemas

- Ejemplo de uso se joi:

```javascript
const   Joi = require('joi');


const productIdSchema = Joi.string().regex(/^[0-9a-fA-f]{24}$/);
const productTagSchema = Joi.array().items(Joi.strict().max(10));


const createProductSchema = {
    name: Joi.string().max(50).required(),
    price: Joi.number().min(1).max(100000),
    image: Joi.string().required(),
    tags: productTagSchema
}

const updateProductSchema ={
    name: Joi.string().max(50),
    price: Joi.number().min(1),
    image: Joi.string(),
    tags: productTagSchema
}

module.exports = {
    productIdSchema,
    productTagSchema,
    createProductSchema,
    updateProductSchema
}
```

## Implementar validaciones con los schemas

ya que tengamos creados los schemas debemos implementar la validacion en el middleware de 
validationHandlers.js

```javascript
const Joi = require('joi');

function validate(data,schema){
    const { error } = Joi.validate(data,schema);
    return error;
}
```

- Ahora se debe agregar en las rutas del api para validar los schemas
en el caso del ejemplo del ecommerce que esta en este proyecto estaria 
en  routes/api/products.js

```javascript
const { createProductSchema,
productIdSchema,
productTagSchema,
updateProductSchema } = require('../../utils/schemas/products');

const validation = require('../../utils/middlewares/validationHandler');

// Validando el body solamente
router.post("/", validation(createProductSchema), async function(req, res, next) {
  const { body: product } = req;

  console.log("req", req.body);

  try {
    const createdProduct = await productService.createProduct({ product });

    res.status(201).json({
      data: createdProduct,
      message: "product created"
    });
  } catch (err) {
    next(err);
  }
});

// validando en body y los params
router.put("/:productId", 
validation({ productId: productIdSchema }, "params"), 
validation(updateProductSchema),
async function (req, res, next) {
  
  const { productId } = req.params;
  const { body: product } = req;

  console.log("req", req.params, req.body);

  try {
    const updatedProduct = await productService.updateProduct({
      productId,
      product
    });
    res.status(200).json({
      data: updatedProduct,
      message: "product updated"
    });
  } catch (err) {
    next(err);
  }
});
```