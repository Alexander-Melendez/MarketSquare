const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create Schema
const ProductSchema = new Schema({
  UserId: {
    type: String
  },
  DateListed: {
    type: String,
    required: true
  },
  ProductCategory: {
    type: String
  },
  ProductDescription: {
    type: String,
    required: true
  },
  ProductID: {
    type: Number
  },
  ProductName: {
    type: String,
    required: true
  },
  ProductPrice: {
    type: Number
  },
  Email: {
    type: String,
    required: true
  },
});
module.exports = ProductInfo = mongoose.model('ProductInfo', ProductSchema);