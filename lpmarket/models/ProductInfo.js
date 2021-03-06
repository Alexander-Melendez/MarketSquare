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
  ProductCondition: {
    type: String,
    required: true
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
  ProductCity: {
    type: String
  },
  ProductState: {
    type: String
  },
  ContactInfo: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  ProductImages: {
    type:[String], 
    required: true //did not test with this uncommented
  }
});
module.exports = ProductInfo = mongoose.model('ProductInfo', ProductSchema, 'ProductInfo');