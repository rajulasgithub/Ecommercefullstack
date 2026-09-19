import wishlistDB from "../model/wishlist.js";
import productDB from "../model/product.js";
import { httpError } from "../utils/httpError.js";

// Add to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const product = await productDB.findOne({ _id: req.body.productId });
    if (!product) {
      return httpError(res, 404, "Product not found");
    }

    if (String(product.loginId) === String(req.userData.loginId)) {
      return httpError(res, 403, "You cannot add your own product to your wishlist");
    }

    const existingItem = await wishlistDB.findOne({
      loginId: req.userData.loginId,
      prdId: req.body.productId,
    });

    if (existingItem) {
      return httpError(res, 409, "Product is already in your wishlist");
    }

    const data = {
      loginId: req.userData.loginId,
      prdId: req.body.productId,
    };

    const result = await wishlistDB(data).save();
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Product added to wishlist",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while adding to wishlist", { errorMessage: error.message });
  }
};

// View Wishlist
export const getWishlist = async (req, res) => {
  try {
    const rawResult = await wishlistDB
      .find({ loginId: req.userData.loginId })
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
      message: "Wishlist viewed successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while viewing wishlist", { errorMessage: error.message });
  }
};

// Remove from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const result = await wishlistDB.deleteOne({
      _id: req.params.id,
      loginId: req.userData.loginId,
    });
    if (result.deletedCount > 0) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "Item removed from wishlist successfully",
      });
    } else {
      return httpError(res, 404, "Wishlist item not found or already removed");
    }
  } catch (error) {
    return httpError(res, 500, "Server error while removing from wishlist", { errorMessage: error.message });
  }
};
