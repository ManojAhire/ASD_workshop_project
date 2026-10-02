const productService = require("../services/productService");

function getProductId(idValue) {
  const productId = Number(idValue);

  if (!Number.isInteger(productId) || productId < 1) {
    return null;
  }

  return productId;
}

function hasValidProductFields(body, requireAllFields = false) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return false;
  }

  if (requireAllFields && (!Object.hasOwn(body, "name") || !Object.hasOwn(body, "price"))) {
    return false;
  }

  if (Object.hasOwn(body, "name") && (typeof body.name !== "string" || !body.name.trim())) {
    return false;
  }

  if (
    Object.hasOwn(body, "price") &&
    (typeof body.price !== "number" || !Number.isFinite(body.price))
  ) {
    return false;
  }

  return true;
}

function getProductFields(body) {
  const productFields = {};

  if (Object.hasOwn(body, "name")) {
    productFields.name = body.name.trim();
  }

  if (Object.hasOwn(body, "price")) {
    productFields.price = body.price;
  }

  return productFields;
}

async function getProducts(req, res, next) {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const productId = getProductId(req.params.id);

    if (productId === null) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await productService.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    if (!hasValidProductFields(req.body, true)) {
      return res.status(400).json({
        error: "Provide a non-empty name and a numeric price",
      });
    }

    const product = await productService.createProduct(getProductFields(req.body));
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

async function replaceProduct(req, res, next) {
  try {
    const productId = getProductId(req.params.id);

    if (productId === null) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    if (!hasValidProductFields(req.body, true)) {
      return res.status(400).json({
        error: "Provide a non-empty name and a numeric price",
      });
    }

    const product = await productService.updateProduct(
      productId,
      getProductFields(req.body),
      true
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const productId = getProductId(req.params.id);

    if (productId === null) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const hasName = req.body && Object.hasOwn(req.body, "name");
    const hasPrice = req.body && Object.hasOwn(req.body, "price");

    if (
      !hasValidProductFields(req.body) ||
      (!hasName && !hasPrice)
    ) {
      return res.status(400).json({
        error: "Provide a non-empty name or a numeric price to update",
      });
    }

    const product = await productService.updateProduct(
      productId,
      getProductFields(req.body)
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const productId = getProductId(req.params.id);

    if (productId === null) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const wasDeleted = await productService.deleteProduct(productId);

    if (!wasDeleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct,
};