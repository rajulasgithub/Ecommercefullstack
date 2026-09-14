import express from "express";
import { body } from "express-validator";
import checkauth from "../middleware/checkauth.js";
import { checkRole } from "../middleware/authorize.js";
import { handleValidationErrors } from "../middleware/validateResult.js";
import {
  addToCart,
  getCart,
  increaseCartQuantity,
  decreaseCartQuantity,
  deleteCartItem,
} from "../controllers/cartController.js";

const cartRoute = express.Router();

// Add to Cart Validation Rules
const addToCartValidation = [
  body("productId").trim().notEmpty().withMessage("Product ID is required"),
  handleValidationErrors,
];

// Add to Cart (User)
cartRoute.post("/addtocart", checkauth, checkRole("user", "seller", "company", "admin"), addToCartValidation, addToCart);

// View Cart (User)
cartRoute.get("/viewcart", checkauth, checkRole("user", "seller", "company", "admin"), getCart);

// Increase Cart Quantity (User)
cartRoute.put("/incrcart/:id", checkauth, checkRole("user", "seller", "company", "admin"), increaseCartQuantity);

// Decrease Cart Quantity (User)
cartRoute.put("/decrcart/:id", checkauth, checkRole("user", "seller", "company", "admin"), decreaseCartQuantity);

// Delete Cart Item (User)
cartRoute.get("/delcartitem/:id", checkauth, checkRole("user", "seller", "company", "admin"), deleteCartItem);
cartRoute.delete("/delcartitem/:id", checkauth, checkRole("user", "seller", "company", "admin"), deleteCartItem);

export default cartRoute;
