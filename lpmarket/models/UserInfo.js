const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Create Schema
const UserSchema = new Schema({
  UserId: {
    type: String
  },
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true
  },
  DateCreated: {
    type: String,
    required: true
  },
  PhoneNumber: {
    type: String,
    required: true
  }
  
});
module.exports = UserInfo = mongoose.model("UserInfo", UserSchema);