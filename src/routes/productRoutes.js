const express = require("express");
const productController = require("../controllers/productController");
const {
  cacheGetResponses,
  invalidateProductCache,
} = require("../middleware/productCache");

const router = express.Router();

router.get("/", cacheGetResponses, productController.getProducts);
router.get("/:id", cacheGetResponses, productController.getProductById);

router.post("/", invalidateProductCache, productController.createProduct);
router.put("/:id", invalidateProductCache, productController.replaceProduct);
router.patch("/:id", invalidateProductCache, productController.updateProduct);
router.delete("/:id", invalidateProductCache, productController.deleteProduct);

module.exports = router;