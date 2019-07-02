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