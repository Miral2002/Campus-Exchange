const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    immutable: true,
    minlength: [1, "title cannot be empty"],
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Electronics",
      "Sports",
      "Clothing",
      "Textbooks",
      "Furniture",
      "Other",
    ],
  },
  productCondition: {
    type: String,
    required: true,
    enum: ["New", "Used - Like New", "Used - Good", "Used - Fair"],
  },
  description: {
    type: String,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  rentPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  available: {
    type: String,
    required: true,
    enum: ["rent", "sell", "both"],
  },
  isNegotiable: {
    type: Boolean,
    required: true,
    default: false,
  },
  sellerId: {
    type: String,
    required: true,
  },
  isSold: {
    type: Boolean,
    required: true,
    default: false,
  },
  imageIds: {
    type: [String],
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    immutable: true,
  },
});

module.exports = mongoose.model("product", productSchema);
