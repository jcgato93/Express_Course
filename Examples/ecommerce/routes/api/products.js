const express = require("express");

const ProductsService = require("../../services/products");
const passport = require('passport');

const { createProductSchema,
productIdSchema,
productTagSchema,
updateProductSchema } = require('../../utils/schemas/products');
const validation = require('../../utils/middlewares/validationHandler');

const cacheResponse = require('../../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../../utils/time');

// JWT strategies
require('../../utils/auth/strategies/jwt');

function productsApi(app){
const router = express.Router();
app.use("api/products",router);
const productService = new ProductsService();

router.get("/", async function(req, res, next) {
  cacheResponse(res, FIVE_MINUTES_IN_SECONDS)

  const { tags } = req.query;

  console.log("req", req.query);

  try {
    const products = await productService.getProducts({ tags });

    res.status(200).json({
      data: products,
      message: "products listed"
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:productId", async function(req, res, next) {
  cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
  const { productId } = req.params;

  console.log("req", req.params);

  try {
    const product = await productService.getProduct({ productId });

    res.status(200).json({
      data: product,
      message: "product retrieved"
    });
  } catch (err) {
    next(err);
  }
});

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

router.put("/:productId",
passport.authenticate('jwt',{ session: false }),
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

router.delete("/:productId",
 passport.authenticate('jwt',{ session: false }),
 async function(req, res, next) {
  const { productId } = req.params;

  console.log("req", req.params);

  try {
    const deletedProduct = await productService.deleteProduct({ productId });

    res.status(200).json({
      data: deletedProduct,
      message: "product deleted"
    });
  } catch (err) {
    next(err);
  }
});

  
}

module.exports = productsApi;