# API resful

Express tiene una manera muy sencilla para la creacion de API´s


- index.js
```javascript
const express = require('express')
const app = express();

// Rutas de productos
const productsRouters= require('./API resful/routes/products');

app.use('/api/products',productsRouters);

app.get('/', function (req, res, next) {
    res.send('Hello world')
});




const server = app.listen(8000, () => {
    console.log(`Listening http://localhost:${server.address().port}`);
});
```

- routes/products.js
```javascript
const express = require('express');
const router = express.Router();

const productsMock = [
    { name: 'product1', price:'2000'},
    { name: 'product2', price:'3000'}
]

router.get('/',function(req,res){
    const { query } = req.query;

    res.status(200).json({
        data: productsMock,
        message: 'products listed'
    })
});

router.get('/:productId',function(req,res){
    const{ productId } = req.params;

    res.status(200).json({
        data: productsMock[0],
        message: 'product retrived'
    })
});

router.post('/',function(req,res){
    const { body } = req.body;

    res.status(201).json({
        data: productsMock[0],
        message: 'products listed'
    })
});

router.put('/:productId',function(req,res){
    const{ productId } = req.params;
    
    res.status(200).json({
        data: productsMock,
        message: 'product update'
    })
});


module.exports = router;
```

- luego en el index.js importamos la configuracion de rutas de products

```javascript
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const productsRouter = require('./routes/views/products');
const productsApiRouter = require('./routes/api/products');

// app
const app = express();

// middlewares
app.use(bodyParser.json());


// routes
app.use("/products", productsRouter);
app.use("/api/products", productsApiRouter);

// redirect
app.get('/', function(req, res) {
  res.redirect('/products');
});

// server
const server = app.listen(8000, function() {
  console.log(`Listening http://localhost:${server.address().port}`);
});
```
