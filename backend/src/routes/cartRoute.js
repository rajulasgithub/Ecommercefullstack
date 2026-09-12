import express from "express";
import { body } from "express-validator";
import checkauth from "../middleware/checkauth.js";
import { checkRole } from "../middleware/authorize.js";
import { handleValidationErrors } from "../middleware/validateResult.js";
import {
  addToCart,
  getCart,
  getCompanyOrders,
  getUserOrders,
  increaseCartQuantity,
  decreaseCartQuantity,
  deleteCartItem,
  checkoutCart,
  updateDeliveryDate,
  updateOrderStatus,
  cancelOrder,
  viewOrders,
  rejectOrder,
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

// View Company Orders (Seller / Admin)
cartRoute.get("/viewcartcmpny", checkauth, checkRole("seller", "admin"), getCompanyOrders);

// View Orders for Logged-In User
cartRoute.get("/vieworderuser", checkauth, checkRole("user"), getUserOrders);

// Increase Cart Quantity (User)
cartRoute.put("/incrcart/:id", checkauth, checkRole("user"), increaseCartQuantity);

// Decrease Cart Quantity (User)
cartRoute.put("/decrcart/:id", checkauth, checkRole("user"), decreaseCartQuantity);

// Delete Cart Item (User)
cartRoute.get("/delcartitem/:id", checkauth, checkRole("user"), deleteCartItem);
cartRoute.delete("/delcartitem/:id", checkauth, checkRole("user"), deleteCartItem);

// Checkout / Place Order (User)
cartRoute.put("/updatecart", checkauth, checkRole("user"), checkoutCart);

// Update Delivery Date (Seller / Admin)
cartRoute.put("/updatedeliverydate/:id", checkauth, checkRole("seller", "admin"), updateDeliveryDate);

// Update Order Status (Seller / Admin)
cartRoute.put("/updatecartstatus/:id/:value", checkauth, checkRole("seller", "admin"), updateOrderStatus);

// Cancel Order (User)
cartRoute.put("/cancelorder/:id", checkauth, checkRole("user"), cancelOrder);

// View Orders (User)
cartRoute.get("/vieworder", checkauth, checkRole("user"), viewOrders);

// Reject Order (Seller / Admin)
cartRoute.put("/rejectorder/:id", checkauth, checkRole("seller", "admin"), rejectOrder);

export default cartRoute;
