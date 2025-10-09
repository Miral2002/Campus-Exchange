const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const productRouter = express.Router();

productRouter.post("/", authMiddleware, createProduct);
productRouter.get("/", authMiddleware, getAllProducts);
productRouter.get("/:id", authMiddleware, getProductById);
productRouter.put("/:id", authMiddleware, updateProduct);
productRouter.delete("/:id", authMiddleware, deleteProduct);

module.exports = productRouter;
