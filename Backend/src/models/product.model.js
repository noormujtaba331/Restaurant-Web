const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  details: { type: String,},
  price: { type: Number,},
  image: { type: String },
  category: { type: String },
  time: { type: String, default: "15-20m" },
  sizes: { type: String, default: "S,M, L" },
  SPrice: {type: Number},
  MPrice: {type: Number},
  LPrice: {type: Number},
});

module.exports = mongoose.model("Product", productSchema);