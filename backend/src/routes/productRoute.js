const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const productDB = require("../model/addproductsSchema");
const cartDB = require("../model/cartSchema");
const checkauth = require("../middleware/checkauth");
const { checkRole } = require("../middleware/authorize");
const ROLES = require("../config/roles");
require("dotenv").config();

const productRoute = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECKEY,
});

const storageImage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerceapp",
  },
});
const uploadImage = multer({ storage: storageImage });

// Add Product (Vendor / Admin)
productRoute.post(
  "/addproduct",
  checkauth,
  checkRole(ROLES.COMPANY, ROLES.ADMIN),
  uploadImage.array("image", 5),
  async (req, res) => {
    try {
      const data = {
        prdName: req.body.prdName,
        image: req.files ? req.files.map((file) => file.path) : [],
        prize: req.body.prize,
        size: req.body.size,
        material: req.body.material,
        status: 0,
      };

      const result = await productDB(data).save();
      if (result) {
        return res.status(200).json({
          success: true,
          error: false,
          data: result,
          message: "Product added successfully",
        });
      } else {
        return res.status(400).json({
          success: false,
          error: true,
          message: "Failed to add product",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        errorMessage: error.message,
        message: "Server error while adding product",
      });
    }
  }
);

// View Products (Public)
productRoute.get("/viewproduct", async (req, res) => {
  try {
    const result = await productDB.find();
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Products fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while fetching products",
    });
  }
});

// View Single Product (Public)
productRoute.get("/viewone/:id", async (req, res) => {
  try {
    const result = await productDB.findOne({ _id: req.params.id });
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "Product details fetched successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while fetching product details",
    });
  }
});

// Soft Delete Product (Vendor / Admin)
productRoute.put("/deleteproduct/:id", checkauth, checkRole(ROLES.COMPANY, ROLES.ADMIN), async (req, res) => {
  try {
    const data = { status: 6 };
    await cartDB.updateMany({ prdId: req.params.id }, { $set: data });
    const prdresult = await productDB.updateOne(
      { _id: req.params.id },
      { $set: data }
    );
    if (prdresult) {
      return res.status(200).json({
        success: true,
        error: false,
        data: prdresult,
        message: "Product soft deleted successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Failed to delete product",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while deleting product",
    });
  }
});

// Update Product (Vendor / Admin)
productRoute.put(
  "/updateproduct/:id",
  checkauth,
  checkRole(ROLES.COMPANY, ROLES.ADMIN),
  uploadImage.array("image", 5),
  async (req, res) => {
    try {
      const oldData = await productDB.findOne({ _id: req.params.id });
      if (!oldData) {
        return res.status(404).json({ success: false, error: true, message: "Product not found" });
      }

      const data = {
        prdName: req.body.prdName || oldData.prdName,
        image: req.files && req.files.length > 0 ? req.files.map((file) => file.path) : oldData.image,
        prize: req.body.prize || oldData.prize,
        size: req.body.size || oldData.size,
        material: req.body.material || oldData.material,
      };

      const result = await productDB.updateOne(
        { _id: req.params.id },
        { $set: data }
      );
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "Product updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        errorMessage: error.message,
        message: "Server error while updating product",
      });
    }
  }
);

// Update Product Status (Vendor / Admin)
productRoute.put("/updateproductstatus/:id/:value", checkauth, checkRole(ROLES.COMPANY, ROLES.ADMIN), async (req, res) => {
  try {
    const data = { status: req.params.value };
    const result = await productDB.updateOne(
      { _id: req.params.id },
      { $set: data }
    );
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Product status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while updating product status",
    });
  }
});

// Add to Cart (User)
productRoute.post("/addtocart", checkauth, checkRole(ROLES.USER), async (req, res) => {
  try {
    const data = {
      loginId: req.userData.loginId,
      prdId: req.body.productId,
      quantity: 1,
      status: 1,
    };

    const result = await cartDB(data).save();
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Product added to cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while adding to cart",
    });
  }
});

// View Cart (User)
productRoute.get("/viewcart", checkauth, checkRole(ROLES.USER), async (req, res) => {
  try {
    const result = await cartDB
      .find({ loginId: req.userData.loginId, status: 1 })
      .populate("prdId");
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Cart viewed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while viewing cart",
    });
  }
});

// View Company Orders (Vendor / Admin)
productRoute.get("/viewcartcmpny", checkauth, checkRole(ROLES.COMPANY, ROLES.ADMIN), async (req, res) => {
  try {
    const result = await cartDB.aggregate([
      {
        $lookup: {
          from: "addresslists",
          localField: "loginId",
          foreignField: "loginId",
          as: "result",
        },
      },
      {
        $lookup: {
          from: "productlists",
          localField: "prdId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $lookup: {
          from: "registrations",
          localField: "loginId",
          foreignField: "loginId",
          as: "info",
        },
      },
      { $unwind: "$result" },
      { $unwind: "$product" },
      { $unwind: "$info" },
      {
        $group: {
          _id: "$_id",
          loginId: { $first: "$loginId" },
          firstname: { $first: "$info.firstname" },
          number: { $first: "$info.number" },
          image: { $first: "$product.image" },
          prdName: { $first: "$product.prdName" },
          prize: { $first: "$product.prize" },
          size: { $first: "$product.size" },
          quantity: { $first: "$quantity" },
          status: { $first: "$status" },
          date: { $first: "$date" },
          deliveryDate: { $first: "$deliveryDate" },
          payment: { $first: "$payment" },
          address: { $first: "$result.address" },
          state: { $first: "$result.state" },
          district: { $first: "$result.district" },
          pincode: { $first: "$result.pincode" },
          BuildingNumber: { $first: "$result.BuildingNumber" },
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Orders list viewed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while viewing company orders",
    });
  }
});

// View Orders for Logged-In User
productRoute.get("/vieworderuser", checkauth, checkRole(ROLES.USER), async (req, res) => {
  try {
    const result = await cartDB
      .find({ loginId: req.userData.loginId })
      .populate("prdId");
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "User orders viewed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while viewing user orders",
    });
  }
});

// Increase Cart Quantity (User)
productRoute.put("/incrcart/:id", checkauth, checkRole(ROLES.USER), async (req, res) => {
  try {
    const oldData = await cartDB.findOne({ _id: req.params.id, loginId: req.userData.loginId });
    if (!oldData) {
      return res.status(404).json({ success: false, error: true, message: "Cart item not found" });
    }

    const result = await cartDB.updateOne(
      { _id: req.params.id, loginId: req.userData.loginId },
      { $set: { quantity: oldData.quantity + 1 } }
    );
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Cart quantity increased",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while updating cart item",
    });
  }
});

// Decrease Cart Quantity (User)
productRoute.put("/decrcart/:id", checkauth, checkRole(ROLES.USER), async (req, res) => {
  try {
    const oldData = await cartDB.findOne({ _id: req.params.id, loginId: req.userData.loginId });
    if (!oldData) {
      return res.status(404).json({ success: false, error: true, message: "Cart item not found" });
    }

    const newQuantity = Math.max(1, oldData.quantity - 1);
    const result = await cartDB.updateOne(
      { _id: req.params.id, loginId: req.userData.loginId },
      { $set: { quantity: newQuantity } }
    );
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Cart quantity decreased",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while updating cart item",
    });
  }
});

// Delete Cart Item (User)
const deleteCartItemHandler = async (req, res) => {
  try {
    const result = await cartDB.deleteOne({
      _id: req.params.id,
      loginId: req.userData.loginId,
      status: 1
    });
    if (result.deletedCount > 0) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "Cart item deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Cart item not found or already removed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while deleting cart item",
    });
  }
};

productRoute.get("/delcartitem/:id", checkauth, checkRole(ROLES.USER), deleteCartItemHandler);
productRoute.delete("/delcartitem/:id", checkauth, checkRole(ROLES.USER), deleteCartItemHandler);

// Checkout / Place Order (User)
productRoute.put("/updatecart", checkauth, checkRole(ROLES.USER), async (req, res) => {
  try {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const data = {
      status: 2,
      date: `${day}-${month}-${year}`,
      deliveryDate: `${day + 5}-${month}-${year}`,
      payment: "Cash on Delivery",
    };
    const result = await cartDB.updateMany(
      { loginId: req.userData.loginId, status: 1 },
      { $set: data }
    );

    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Order placed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error during checkout",
    });
  }
});

// Update Delivery Date (Vendor / Admin)
productRoute.put("/updatedeliverydate/:id", checkauth, checkRole(ROLES.COMPANY, ROLES.ADMIN), async (req, res) => {
  try {
    const data = { deliveryDate: req.body.date };
    const result = await cartDB.updateOne(
      { _id: req.params.id },
      { $set: data }
    );
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Delivery date updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error updating delivery date",
    });
  }
});

// Update Order Status (Vendor / Admin)
productRoute.put("/updatecartstatus/:id/:value", checkauth, checkRole(ROLES.COMPANY, ROLES.ADMIN), async (req, res) => {
  try {
    const data = { status: req.params.value };
    const result = await cartDB.updateOne(
      { _id: req.params.id },
      { $set: data }
    );
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Order status updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error updating order status",
    });
  }
});

// Cancel Order (User)
productRoute.put("/cancelorder/:id", checkauth, checkRole(ROLES.USER), async (req, res) => {
  try {
    const data = { status: 3 };
    const result = await cartDB.updateOne(
      { _id: req.params.id, loginId: req.userData.loginId },
      { $set: data }
    );
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error cancelling order",
    });
  }
});

// View Orders (User)
productRoute.get("/vieworder", checkauth, checkRole(ROLES.USER), async (req, res) => {
  try {
    const result = await cartDB
      .find({ loginId: req.userData.loginId })
      .populate("prdId");
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Orders viewed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error viewing orders",
    });
  }
});

// Reject Order (Vendor / Admin)
productRoute.put("/rejectorder/:id", checkauth, checkRole(ROLES.COMPANY, ROLES.ADMIN), async (req, res) => {
  try {
    const data = { status: 3 };
    const result = await cartDB.updateOne(
      { _id: req.params.id },
      { $set: data }
    );
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Order rejected",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error rejecting order",
    });
  }
});

module.exports = productRoute;
