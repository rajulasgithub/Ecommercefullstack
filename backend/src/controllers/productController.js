import productDB from "../model/product.js";
import cartDB from "../model/cart.js";

// Add Product (Vendor / Admin)
export const addProduct = async (req, res) => {
  try {
    const data = {
      prdName: req.body.prdName,
      description: req.body.description || "",
      category: req.body.category || "General",
      image: req.files ? req.files.map((file) => file.path) : [],
      prize: req.body.prize,
      size: req.body.size,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : 0,
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
      description: req.body.description !== undefined ? req.body.description : oldData.description,
      category: req.body.category || oldData.category,
      image: req.files && req.files.length > 0 ? req.files.map((file) => file.path) : oldData.image,
      prize: req.body.prize || oldData.prize,
      size: req.body.size || oldData.size,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : oldData.stock,
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

// Delete All Products (Vendor / Admin)
export const deleteAllProducts = async (req, res) => {
  try {
    const data = { status: 6 };
    await cartDB.updateMany({}, { $set: data });
    const result = await productDB.updateMany({}, { $set: data });
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "All products deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while deleting all products",
    });
  }
};
