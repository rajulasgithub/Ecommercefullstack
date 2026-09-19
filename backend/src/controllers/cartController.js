import cartDB from "../model/cart.js";
import productDB from "../model/product.js";
import { httpError } from "../utils/httpError.js";

// Add to Cart (User)
export const addToCart = async (req, res) => {
  try {
    const product = await productDB.findOne({ _id: req.body.productId });
    if (!product) {
      return httpError(res, 404, "Product not found");
    }

    if (String(product.loginId) === String(req.userData.loginId)) {
      return httpError(res, 403, "You cannot add your own product to the cart");
    }

    const existingItem = await cartDB.findOne({
      loginId: req.userData.loginId,
      prdId: req.body.productId,
      status: 1,
    });

    if (existingItem) {
      existingItem.quantity += 1;
      const result = await existingItem.save();
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "Cart quantity increased",
      });
    }

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
    return httpError(res, 500, "Server error while adding to cart", { errorMessage: error.message });
  }
};

// View Cart (User)
export const getCart = async (req, res) => {
  try {
    const rawResult = await cartDB
      .find({ loginId: req.userData.loginId, status: 1 })
      .populate("prdId");

    const result = rawResult.filter((item) => {
      if (!item.prdId) return false;
      const prodStatus = String(item.prdId.status || '').toLowerCase();
      return prodStatus !== 'deleted';
    });

    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Cart viewed successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while viewing cart", { errorMessage: error.message });
  }
};

// Increase Cart Quantity (User)
export const increaseCartQuantity = async (req, res) => {
  try {
    const oldData = await cartDB.findOne({ _id: req.params.id, loginId: req.userData.loginId });
    if (!oldData) {
      return httpError(res, 404, "Cart item not found");
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
    return httpError(res, 500, "Server error while updating cart item", { errorMessage: error.message });
  }
};

// Decrease Cart Quantity (User)
export const decreaseCartQuantity = async (req, res) => {
  try {
    const oldData = await cartDB.findOne({ _id: req.params.id, loginId: req.userData.loginId });
    if (!oldData) {
      return httpError(res, 404, "Cart item not found");
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
    return httpError(res, 500, "Server error while updating cart item", { errorMessage: error.message });
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
      return httpError(res, 404, "Cart item not found or already removed");
    }
  } catch (error) {
    return httpError(res, 500, "Server error while deleting cart item", { errorMessage: error.message });
  }
};
