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
cartRoute.post("/addtocart", checkauth, checkRole("user"), addToCartValidation, addToCart);

// View Cart (User)
cartRoute.get("/viewcart", checkauth, checkRole("user"), getCart);

// Increase Cart Quantity (User)
cartRoute.put("/incrcart/:id", checkauth, checkRole("user"), increaseCartQuantity);

// Decrease Cart Quantity (User)
cartRoute.put("/decrcart/:id", checkauth, checkRole("user"), decreaseCartQuantity);

// Delete Cart Item (User)
cartRoute.get("/delcartitem/:id", checkauth, checkRole("user"), deleteCartItem);
cartRoute.delete("/delcartitem/:id", checkauth, checkRole("user"), deleteCartItem);

export default cartRoute;
