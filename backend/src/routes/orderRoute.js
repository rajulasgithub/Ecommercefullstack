import express from "express";
import checkauth from "../middleware/checkauth.js";
import { checkRole } from "../middleware/authorize.js";
import {
  getCompanyOrders,
  getUserOrders,
  checkoutCart,
  updateDeliveryDate,
  updateOrderStatus,
  cancelOrder,
  viewOrders,
  rejectOrder,
} from "../controllers/orderController.js";

const orderRoute = express.Router();

// View Company Orders (Seller / Admin)
orderRoute.get("/viewcartcmpny", checkauth, checkRole("seller", "admin"), getCompanyOrders);

// View Orders for Logged-In User
orderRoute.get("/vieworderuser", checkauth, checkRole("user"), getUserOrders);

// Checkout / Place Order (User)
orderRoute.put("/updatecart", checkauth, checkRole("user"), checkoutCart);

// Update Delivery Date (Seller / Admin)
orderRoute.put("/updatedeliverydate/:id", checkauth, checkRole("seller", "admin"), updateDeliveryDate);

// Update Order Status (Seller / Admin)
orderRoute.put("/updatecartstatus/:id/:value", checkauth, checkRole("seller", "admin"), updateOrderStatus);

// Cancel Order (User)
orderRoute.put("/cancelorder/:id", checkauth, checkRole("user"), cancelOrder);

// View Orders (User)
orderRoute.get("/vieworder", checkauth, checkRole("user"), viewOrders);

// Reject Order (Seller / Admin)
orderRoute.put("/rejectorder/:id", checkauth, checkRole("seller", "admin"), rejectOrder);

export default orderRoute;
