const express = require("express");
const checkauth = require("../middleware/checkauth");
const { checkRole } = require("../middleware/authorize");
const { uploadProductImage } = require("../middleware/upload");
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

// Add Product (Seller / Admin)
productRoute.post(
  "/addproduct",
  checkauth,
  checkRole("seller", "admin"),
  uploadProductImage.array("image", 5),
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

// Add to Cart (User)
productRoute.post("/addtocart", checkauth, checkRole("user"), addToCart);

// View Cart (User)
productRoute.get("/viewcart", checkauth, checkRole("user"), getCart);

// View Company Orders (Seller / Admin)
productRoute.get("/viewcartcmpny", checkauth, checkRole("seller", "admin"), getCompanyOrders);

// View Orders for Logged-In User
productRoute.get("/vieworderuser", checkauth, checkRole("user"), getUserOrders);

// Increase Cart Quantity (User)
productRoute.put("/incrcart/:id", checkauth, checkRole("user"), increaseCartQuantity);

// Decrease Cart Quantity (User)
productRoute.put("/decrcart/:id", checkauth, checkRole("user"), decreaseCartQuantity);

// Delete Cart Item (User)
productRoute.get("/delcartitem/:id", checkauth, checkRole("user"), deleteCartItem);
productRoute.delete("/delcartitem/:id", checkauth, checkRole("user"), deleteCartItem);

// Checkout / Place Order (User)
productRoute.put("/updatecart", checkauth, checkRole("user"), checkoutCart);

// Update Delivery Date (Seller / Admin)
productRoute.put("/updatedeliverydate/:id", checkauth, checkRole("seller", "admin"), updateDeliveryDate);

// Update Order Status (Seller / Admin)
productRoute.put("/updatecartstatus/:id/:value", checkauth, checkRole("seller", "admin"), updateOrderStatus);

// Cancel Order (User)
productRoute.put("/cancelorder/:id", checkauth, checkRole("user"), cancelOrder);

// View Orders (User)
productRoute.get("/vieworder", checkauth, checkRole("user"), viewOrders);

// Reject Order (Seller / Admin)
productRoute.put("/rejectorder/:id", checkauth, checkRole("seller", "admin"), rejectOrder);

module.exports = productRoute;
