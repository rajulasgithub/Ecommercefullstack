import express from "express";
import { body } from "express-validator";
import checkauth from "../middleware/checkauth.js";
import { checkRole } from "../middleware/authorize.js";
import { uploadProductImage } from "../middleware/upload.js";
import { handleValidationErrors } from "../middleware/validateResult.js";
import {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  updateProductStatus,
  deleteAllProducts,
} from "../controllers/productController.js";

const productRoute = express.Router();

// Add Product Validation Rules
const addProductValidation = [
  body("prdName").trim().notEmpty().withMessage("Product name is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("style").trim().notEmpty().withMessage("Style is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("prize").trim().notEmpty().isNumeric().withMessage("Price must be a valid number"),
  body("stock").trim().notEmpty().isNumeric().withMessage("Stock quantity must be a valid number"),
  body("size").trim().notEmpty().withMessage("Product size is required"),
  body("material").trim().notEmpty().withMessage("Material is required"),
  handleValidationErrors,
];

// Add Product (Seller / Admin)
productRoute.post(
  "/addproduct",
  checkauth,
  checkRole("seller", "admin"),
  uploadProductImage.array("image", 5),
  addProductValidation,
  addProduct
);

// View Products (Public)
productRoute.get("/viewproduct", getAllProducts);

// View Single Product (Public)
productRoute.get("/viewone/:id", getProductById);

// Soft Delete Product (Seller / Admin)
productRoute.put("/deleteproduct/:id", checkauth, checkRole("seller", "admin"), deleteProduct);

// Update Product (Seller / Admin)
productRoute.put(
  "/updateproduct/:id",
  checkauth,
  checkRole("seller", "admin"),
  uploadProductImage.array("image", 5),
  updateProduct
);

// Update Product Status (Seller / Admin)
productRoute.put("/updateproductstatus/:id/:value", checkauth, checkRole("seller", "admin"), updateProductStatus);

// Soft Delete All Products (Seller / Admin)
productRoute.put("/deleteallproduct", checkauth, checkRole("seller", "admin"), deleteAllProducts);

export default productRoute;
