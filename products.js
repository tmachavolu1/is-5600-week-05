const fs = require('fs').promises;
const path = require('path');
const cuid = require('cuid');
const db = require('./db');

const productsFile = path.join(__dirname, 'data/full-products.json');

// Define our Product Model
const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: { type: String },
  alt_description: { type: String },
  likes: { type: Number, required: true },
  urls: {
    regular: { type: String, required: true },
    small: { type: String, required: true },
    thumb: { type: String, required: true },
  },
  links: {
    self: { type: String, required: true },
    html: { type: String, required: true },
  },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    portfolio_url: { type: String },
    username: { type: String, required: true },
  },
  tags: [
    {
      title: { type: String, required: true },
    },
  ],
});

/**
 * List products
 * @param {*} options
 * @returns {Promise<Array>}
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, tag } = options;

  const query = tag
    ? {
        tags: {
          $elemMatch: {
            title: tag,
          },
        },
      }
    : {};

  const products = await Product.find(query)
    .sort({ _id: 1 })
    .skip(Number(offset))
    .limit(Number(limit));

  return products;
}

/**
 * Get a single product
 * @param {string} _id
 * @returns {Promise<object>}
 */
async function get(_id) {
  const product = await Product.findById(_id);
  return product;
}

/**
 * Create a new product
 * @param {object} fields
 * @returns {Promise<object>}
 */
async function create(fields) {
  const product = await new Product(fields).save();
  return product;
}

/**
 * Edit a product
 * @param {string} _id
 * @param {object} change
 * @returns {Promise<object>}
 */
async function edit(_id, change) {
  const product = await Product.findByIdAndUpdate(_id, change, { new: true });

  if (!product) {
    throw new Error(`Product with id ${_id} not found`);
  }

  return product;
}

/**
 * Delete a product
 * @param {String} _id
 * @returns {Promise<Object>}
 */
async function destroy(_id) {
  const result = await Product.deleteOne({ _id });

  if (result.deletedCount === 0) {
    throw new Error(`Product with id ${_id} not found`);
  }

  return { success: true };
}

module.exports = {
  list,
  get,
  create,
  edit,
  destroy,
};
