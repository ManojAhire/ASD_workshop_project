const productDatabase = require("../database/productDatabase");

async function getProducts() {
  return productDatabase.getAll();
}

async function getProductById(productId) {
  const products = await productDatabase.getAll();
  return products.find((product) => product.id === productId) || null;
}

async function createProduct(productFields) {
  const products = await productDatabase.getAll();
  const highestId = products.reduce(
    (currentHighestId, product) => Math.max(currentHighestId, product.id),
    0
  );

  const product = { id: highestId + 1, ...productFields };
  products.push(product);

  await productDatabase.saveAll(products);
  return product;
}

async function updateProduct(productId, productFields, replace = false) {
  const products = await productDatabase.getAll();
  const productIndex = products.findIndex((product) => product.id === productId);

  if (productIndex === -1) {
    return null;
  }

  if (replace) {
    products[productIndex] = { id: productId, ...productFields };
  } else {
    products[productIndex] = {
      ...products[productIndex],
      ...productFields,
      id: productId,
    };
  }

  await productDatabase.saveAll(products);
  return products[productIndex];
}

async function deleteProduct(productId) {
  const products = await productDatabase.getAll();
  const productIndex = products.findIndex((product) => product.id === productId);

  if (productIndex === -1) {
    return false;
  }

  products.splice(productIndex, 1);
  await productDatabase.saveAll(products);
  return true;
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};