const path = require('path');
const Products = require('./products');
const Orders = require('./orders');
const autoCatch = require('./lib/auto-catch');

/**
 * Get a product
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function getProduct(req, res, next) {
  console.log('request body:', req.body);
  const product = await Products.get(req.params.id);
  res.json(product);
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
  console.log('request body:', req.body);
  const product = await Products.create(req.body);
  res.json(product);
}

/**
 * Edit a product
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
async function editProduct(req, res, next) {
  console.log(req.body);
  const change = req.body;
  const product = await Products.edit(req.params.id, change);
  res.json(product);
}

/**
 * Delete a product
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function deleteProduct(req, res, next) {
  await Products.destroy(req.params.id);
  res.json({ success: true });
}

/**
 * Create a new order
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function createOrder(req, res, next) {
  const order = await Orders.create(req.body);
  res.json(order); // Fixed typo: `orders` → `order`
}

/**
 * Edit an order
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function editOrder(req, res, next) {
  try {
    const updatedOrder = await Orders.edit(req.params.id, req.body);
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an order
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function deleteOrder(req, res, next) {
  try {
    await Orders.destroy(req.params.id);
    res.status(204).send(); // No-content response
  } catch (error) {
    next(error);
  }
}

/**
 * List orders
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function listOrders(req, res, next) {
  const { offset = 0, limit = 25, productId, status } = req.query;

  const orders = await Orders.list({
    offset: Number(offset),
    limit: Number(limit),
    productId,
    status,
  });

  res.json(orders);
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  createOrder,
  listOrders,
  editOrder,
  deleteOrder,
});
