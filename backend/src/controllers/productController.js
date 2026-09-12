import productDB from "../model/product.js";
import cartDB from "../model/cart.js";

// Add Product (Vendor / Admin)
export const addProduct = async (req, res) => {
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
};

// View Products (Public)
export const getAllProducts = async (req, res) => {
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
};

// View Single Product (Public)
export const getProductById = async (req, res) => {
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
};

// Soft Delete Product (Vendor / Admin)
export const deleteProduct = async (req, res) => {
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
};

// Update Product (Vendor / Admin)
export const updateProduct = async (req, res) => {
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
};

// Update Product Status (Vendor / Admin)
export const updateProductStatus = async (req, res) => {
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
};

// Add to Cart (User)
export const addToCart = async (req, res) => {
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
};

// View Cart (User)
export const getCart = async (req, res) => {
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
};

// View Company Orders (Vendor / Admin)
export const getCompanyOrders = async (req, res) => {
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
};

// View Orders for Logged-In User
export const getUserOrders = async (req, res) => {
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
};

// Increase Cart Quantity (User)
export const increaseCartQuantity = async (req, res) => {
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
};

// Decrease Cart Quantity (User)
export const decreaseCartQuantity = async (req, res) => {
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
};

// Delete Cart Item (User)
export const deleteCartItem = async (req, res) => {
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

// Checkout / Place Order (User)
export const checkoutCart = async (req, res) => {
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
};

// Update Delivery Date (Vendor / Admin)
export const updateDeliveryDate = async (req, res) => {
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
};

// Update Order Status (Vendor / Admin)
export const updateOrderStatus = async (req, res) => {
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
};

// Cancel Order (User)
export const cancelOrder = async (req, res) => {
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
};

// View Orders (User)
export const viewOrders = async (req, res) => {
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
};

// Reject Order (Vendor / Admin)
export const rejectOrder = async (req, res) => {
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
};
