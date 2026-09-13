import mongoose from "mongoose";
import productDB from "../model/product.js";
import cartDB from "../model/cart.js";

// Add Product (Vendor / Admin)
export const addProduct = async (req, res) => {
  try {
    const data = {
      loginId: req.userData?.loginId,
      prdName: req.body.prdName,
      description: req.body.description || "",
      category: req.body.category || "Women",
      style: req.body.style || "Casual Wear",
      image: req.files ? req.files.map((file) => file.path) : [],
      prize: req.body.prize,
      size: req.body.size,
      stock: req.body.stock || "In Stock",
      material: req.body.material,
      status: "active",
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
    const { search, category, style, minPrice, maxPrice, page, limit } = req.query;

    const query = {
      status: { $nin: ["deleted", "Deleted", "DELETED"], $not: /^deleted$/i }
    };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { prdName: searchRegex },
        { description: searchRegex },
        { material: searchRegex },
        { category: searchRegex },
        { style: searchRegex }
      ];
    }

    if (category && category.trim() !== '') {
      query.category = category.trim();
    }

    if (style && style.trim() !== '') {
      query.style = style.trim();
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceQuery = {};
      if (minPrice !== undefined && minPrice !== '' && !isNaN(minPrice)) {
        priceQuery.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '' && !isNaN(maxPrice)) {
        priceQuery.$lte = Number(maxPrice);
      }
      if (Object.keys(priceQuery).length > 0) {
        query.prize = priceQuery;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 8);
    const skip = (pageNum - 1) * limitNum;

    const total = await productDB.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / limitNum));

    const result = await productDB
      .find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
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

// View Seller Products (Seller / Company / Admin)
export const getSellerProducts = async (req, res) => {
  try {
    const userLoginId = req.userData?.loginId;
    if (!userLoginId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Unauthorized: Seller login required",
      });
    }

    const { search, category, style, minPrice, maxPrice, page, limit } = req.query;

    const query = {
      loginId: userLoginId,
      status: { $nin: ["deleted", "Deleted", "DELETED"], $not: /^deleted$/i }
    };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { prdName: searchRegex },
        { description: searchRegex },
        { material: searchRegex },
        { category: searchRegex },
        { style: searchRegex }
      ];
    }

    if (category && category.trim() !== '') {
      query.category = category.trim();
    }

    if (style && style.trim() !== '') {
      query.style = style.trim();
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceQuery = {};
      if (minPrice !== undefined && minPrice !== '' && !isNaN(minPrice)) {
        priceQuery.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '' && !isNaN(maxPrice)) {
        priceQuery.$lte = Number(maxPrice);
      }
      if (Object.keys(priceQuery).length > 0) {
        query.prize = priceQuery;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 8);
    const skip = (pageNum - 1) * limitNum;

    const total = await productDB.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / limitNum));

    const result = await productDB
      .find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
      message: "Seller products fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while fetching seller products",
    });
  }
};

// View Single Product (Public)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid product ID format",
      });
    }

    const result = await productDB.findOne({
      _id: id,
      status: { $nin: ["deleted", "Deleted", "DELETED"], $not: /^deleted$/i }
    });
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
        message: "Product not found or has been removed",
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
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid product ID format",
      });
    }

    const product = await productDB.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }

    const userRole = req.userData?.role;
    const userLoginId = req.userData?.loginId;

    // Authorization check: Admin can delete any product; Seller can ONLY delete products created by them.
    if (userRole !== "admin") {
      if (!userLoginId || !product.loginId || product.loginId.toString() !== userLoginId.toString()) {
        return res.status(403).json({
          success: false,
          error: true,
          message: "Unauthorized: You can only delete products created by you",
        });
      }
    }

    const productData = { status: "deleted" };
    const cartData = { status: 0 };
    await cartDB.updateMany({ prdId: id }, { $set: cartData });
    const prdresult = await productDB.updateOne(
      { _id: id },
      { $set: productData }
    );

    return res.status(200).json({
      success: true,
      error: false,
      data: prdresult,
      message: "Product soft deleted successfully",
    });
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
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid product ID format",
      });
    }

    const oldData = await productDB.findOne({ _id: id });
    if (!oldData) {
      return res.status(404).json({ success: false, error: true, message: "Product not found" });
    }

    const userRole = req.userData?.role;
    const userLoginId = req.userData?.loginId;

    // Authorization check: Admin can update any product; Seller can ONLY update products created by them.
    if (userRole !== "admin") {
      if (!userLoginId || !oldData.loginId || oldData.loginId.toString() !== userLoginId.toString()) {
        return res.status(403).json({
          success: false,
          error: true,
          message: "Unauthorized: You can only update products created by you",
        });
      }
    }

    const data = {
      prdName: req.body.prdName || oldData.prdName,
      description: req.body.description !== undefined ? req.body.description : oldData.description,
      category: req.body.category || oldData.category,
      style: req.body.style || oldData.style,
      image: req.files && req.files.length > 0 ? req.files.map((file) => file.path) : oldData.image,
      prize: req.body.prize || oldData.prize,
      size: req.body.size || oldData.size,
      stock: req.body.stock !== undefined ? String(req.body.stock) : oldData.stock,
      material: req.body.material || oldData.material,
    };

    const result = await productDB.updateOne(
      { _id: id },
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
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid product ID format",
      });
    }

    const product = await productDB.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }

    const userRole = req.userData?.role;
    const userLoginId = req.userData?.loginId;

    // Authorization check: Admin can update any product status; Seller can ONLY update status of products created by them.
    if (userRole !== "admin") {
      if (!userLoginId || !product.loginId || product.loginId.toString() !== userLoginId.toString()) {
        return res.status(403).json({
          success: false,
          error: true,
          message: "Unauthorized: You can only update status of products created by you",
        });
      }
    }

    const data = { status: req.params.value };
    const result = await productDB.updateOne(
      { _id: id },
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

// Delete All Products (Vendor / Admin)
export const deleteAllProducts = async (req, res) => {
  try {
    const userRole = req.userData?.role;
    const userLoginId = req.userData?.loginId;
    const productData = { status: "deleted" };
    const cartData = { status: 0 };

    if (userRole === "admin") {
      await cartDB.updateMany({}, { $set: cartData });
      const result = await productDB.updateMany({}, { $set: productData });
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "All products deleted successfully",
      });
    } else {
      if (!userLoginId) {
        return res.status(401).json({
          success: false,
          error: true,
          message: "Unauthorized",
        });
      }
      const sellerProducts = await productDB.find({ loginId: userLoginId });
      const productIds = sellerProducts.map((p) => p._id);
      await cartDB.updateMany({ prdId: { $in: productIds } }, { $set: cartData });
      const result = await productDB.updateMany({ loginId: userLoginId }, { $set: productData });
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "Your products deleted successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while deleting all products",
    });
  }
};
