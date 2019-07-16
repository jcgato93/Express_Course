const express = require("express");
const router = express.Router();
const ProductsService = require("../../services/products");
const productMocks = require("../../utils/mocks/products");

const productService = new ProductsService();

router.get("/", async function(req, res, next) {
  const { tags } = req.query;
  try {
    const products = await productService.getProducts({ tags });
    // push mocks
    products.push(...productMocks)
    res.render("products", { products });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
