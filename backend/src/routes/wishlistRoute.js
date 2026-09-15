import express from "express";
import { body } from "express-validator";
import checkauth from "../middleware/checkauth.js";
import { checkRole } from "../middleware/authorize.js";
import { handleValidationErrors } from "../middleware/validateResult.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const wishlistRoute = express.Router();

// Add to Wishlist Validation Rules
const addToWishlistValidation = [
  body("productId").trim().notEmpty().withMessage("Product ID is required"),
  handleValidationErrors,
];

// Add to Wishlist
wishlistRoute.post("/add", checkauth, checkRole("user", "seller", "company", "admin"), addToWishlistValidation, addToWishlist);

// View Wishlist
wishlistRoute.get("/view", checkauth, checkRole("user", "seller", "company", "admin"), getWishlist);

// Remove from Wishlist
wishlistRoute.delete("/remove/:id", checkauth, checkRole("user", "seller", "company", "admin"), removeFromWishlist);

export default wishlistRoute;
