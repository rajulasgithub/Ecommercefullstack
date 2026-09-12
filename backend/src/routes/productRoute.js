const express = require("express");
const checkauth = require("../middleware/checkauth");
const { checkRole } = require("../middleware/authorize");
const { uploadProductImage } = require("../middleware/upload");
const ROLES = require("../config/roles");
const {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  updateProductStatus,
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
} = require("../controllers/productController");

const productRoute = express.Router();

// Add Product (Vendor / Admin)
productRoute.post(
  "/addproduct",
  checkauth,
  checkRole(ROLES.COMPANY, ROLES.ADMIN),
  uploadProductImage.array("image", 5),
  addProduct
);

// View Products (Public)
productRoute.get("/viewproduct", getAllProducts);

// View Single Product (Public)
productRoute.get("/viewone/:id", getProductById);

// Soft Delete Product (Vendor / Admin)
productRoute.put("/deleteproduct/:id", checkauth, checkRole(ROLES.COMPANY, ROLES.ADMIN), deleteProduct);

// Update Product (Vendor / Admin)
productRoute.put(
  "/updateproduct/:id",
  checkauth,
  checkRole(ROLES.COMPANY, ROLES.ADMIN),
  uploadProductImage.array("image", 5),
  updateProduct
);

// Update Product Status (Vendor / Admin)
productRoute.put("/updateproductstatus/:id/:value", checkauth, checkRole(ROLES.COMPANY, ROLES.ADMIN), updateProductStatus);

// Add to Cart (User)
productRoute.post("/addtocart", checkauth, checkRole(ROLES.USER), addToCart);

// View Cart (User)
productRoute.get("/viewcart", checkauth, checkRole(ROLES.USER), getCart);

// View Company Orders (Vendor / Admin)
productRoute.get("/viewcartcmpny", checkauth, checkRole(ROLES.COMPANY, ROLES.ADMIN), getCompanyOrders);

// View Orders for Logged-In User
productRoute.get("/vieworderuser", checkauth, checkRole(ROLES.USER), getUserOrders);

// Increase Cart Quantity (User)
productRoute.put("/incrcart/:id", checkauth, checkRole(ROLES.USER), increaseCartQuantity);

// Decrease Cart Quantity (User)
productRoute.put("/decrcart/:id", checkauth, checkRole(ROLES.USER), decreaseCartQuantity);

// Delete Cart Item (User)
productRoute.get("/delcartitem/:id", checkauth, checkRole(ROLES.USER), deleteCartItem);
productRoute.delete("/delcartitem/:id", checkauth, checkRole(ROLES.USER), deleteCartItem);

// Checkout / Place Order (User)
productRoute.put("/updatecart", checkauth, checkRole(ROLES.USER), checkoutCart);

// Update Delivery Date (Vendor / Admin)
productRoute.put("/updatedeliverydate/:id", checkauth, checkRole(ROLES.COMPANY, ROLES.ADMIN), updateDeliveryDate);

// Update Order Status (Vendor / Admin)
productRoute.put("/updatecartstatus/:id/:value", checkauth, checkRole(ROLES.COMPANY, ROLES.ADMIN), updateOrderStatus);

// Cancel Order (User)
productRoute.put("/cancelorder/:id", checkauth, checkRole(ROLES.USER), cancelOrder);

// View Orders (User)
productRoute.get("/vieworder", checkauth, checkRole(ROLES.USER), viewOrders);

// Reject Order (Vendor / Admin)
productRoute.put("/rejectorder/:id", checkauth, checkRole(ROLES.COMPANY, ROLES.ADMIN), rejectOrder);

module.exports = productRoute;
