import wishlistDB from "../model/wishlist.js";
import productDB from "../model/product.js";

// Add to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const product = await productDB.findOne({ _id: req.body.productId });
    if (!product) {
      return res.status(404).json({ success: false, error: true, message: "Product not found" });
    }

    if (String(product.loginId) === String(req.userData.loginId)) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "You cannot add your own product to your wishlist",
      });
    }

    const existingItem = await wishlistDB.findOne({
      loginId: req.userData.loginId,
      prdId: req.body.productId,
    });

    if (existingItem) {
      return res.status(409).json({
        success: false,
        error: true,
        message: "Product is already in your wishlist",
      });
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
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while adding to wishlist",
    });
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
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while viewing wishlist",
    });
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
      return res.status(404).json({
        success: false,
        error: true,
        message: "Wishlist item not found or already removed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while removing from wishlist",
    });
  }
};
