const { Model, default: mongoose } = require("mongoose");
const Product = require("../models/productModel.js");

const createProduct = async (req, res) => {
  const {
    title,
    category,
    productCondition,
    description,
    sellingPrice,
    rentPrice,
    available,
    isNegotiable,
    userId,
  } = req.body;

  if (
    (!title ||
      !category ||
      !productCondition ||
      !description ||
      !sellingPrice ||
      !available ||
      (available !== "rent" && !sellingPrice) ||
      (available !== "sell" && !rentPrice) ||
      !isNegotiable,
    !userId)
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing Details",
    });
  }

  try {
    const newProduct = new Product({
      title,
      category,
      productCondition,
      description,
      sellingPrice: sellingPrice ? sellingPrice : 0,
      rentPrice: rentPrice ? rentPrice : 0,
      available,
      isNegotiable,
      sellerId: userId,
    });

    console.log(newProduct);

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 30, 50);
    const cursor = req.query.cursor;

    const query = {};
    if (cursor) {
      query.createdAt = {
        $lt: new Date(cursor),
      };
    }

    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.condition) {
      query.productCondition = req.query.condition;
    }
    if (req.query.available) {
      query.available = req.query.available;
    }
    if (req.query.isSold) {
      query.isSold = req.query.isSold;
    }
    if (req.query.sellerId) {
      query.sellerId = req.query.sellerId;
    }
    if (req.query.priceMax) {
      query.sellingPrice = {
        $lte: parseInt(req.query.priceMax),
      };
      if (req.query.available !== "sell") {
        query.rentPrice = {
          $lte: parseInt(req.query.priceMax),
        };
      }
    }

    if (req.query.priceMin) {
      query.sellingPrice = {
        $gte: parseInt(req.query.priceMin),
      };
      if (req.query.available !== "sell") {
        query.rentPrice = {
          $gte: parseInt(req.query.priceMin),
        };
      }
    }

    if (req.query.search) {
      query.title = new RegExp(req.query.search, "i"); // case-insensitive search
    }

    const docs = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasNext = docs.length > limit;
    const data = hasNext ? docs.slice(0, limit) : docs;
    const nextCursor = hasNext
      ? data[data.length - 1].createdAt.toISOString()
      : null;

    res.status(200).json({ success: true, data, nextCursor, hasNext });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const { userId } = req.body;
    if (product.sellerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this resource.",
      });
    }

    const allowedFields = [
      "category",
      "productCondition",
      "description",
      "sellingPrice",
      "rentPrice",
      "available",
      "isNegotiable",
      "isSold",
    ];

    function filterObject(obj, allowedFields) {
      const filtered = {};
      Object.keys(obj).forEach((key) => {
        if (allowedFields.includes(key)) {
          filtered[key] = obj[key];
        }
      });
      return filtered;
    }
    const filteredBody = filterObject(req.body, allowedFields);

    const productUpdated = await Product.findByIdAndUpdate(
      productId,
      { $set: filteredBody },
      { new: true, runValidators: true }
    );

    if (!productUpdated)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    if (product.sellerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this resource.",
      });
    }
    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
