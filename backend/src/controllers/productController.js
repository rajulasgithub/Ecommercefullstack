import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import productDB from "../model/product.js";
import cartDB from "../model/cart.js";
import Login from "../model/login.js";
import Company from "../model/company.js";
import User from "../model/user.js";
import sendEmail from "../utils/sendEmail.js";
import { httpError } from "../utils/httpError.js";
import { GoogleGenAI } from "@google/genai";

const getSellerInfo = async (loginId) => {
  try {
    if (!loginId) return { email: null, sellerName: "Seller" };
    const loginUser = await Login.findById(loginId);
    if (!loginUser) return { email: null, sellerName: "Seller" };

    let sellerName = "Seller";
    const company = await Company.findOne({ loginId });
    if (company && company.companyName) {
      sellerName = company.companyName;
    } else {
      const user = await User.findOne({ loginId });
      if (user && user.firstName) {
        sellerName = `${user.firstName} ${user.lastName || ''}`.trim();
      }
    }
    return { email: loginUser.email, sellerName };
  } catch (e) {
    return { email: null, sellerName: "Seller" };
  }
};

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
      // Send Product Added email to seller
      getSellerInfo(req.userData?.loginId).then(({ email, sellerName }) => {
        if (email) {
          sendEmail({
            to: email,
            subject: `Product Added: ${result.prdName}`,
            template: "productAdded",
            context: {
              sellerName,
              prdName: result.prdName,
              prize: result.prize,
              category: result.category,
              style: result.style,
              stock: result.stock,
            }
          });
        }
      }).catch((e) => console.error("Product added email error:", e.message));

      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "Product added successfully",
      });
    } else {
      return httpError(res, 400, "Failed to add product");
    }
  } catch (error) {
    return httpError(res, 500, "Server error while adding product", { errorMessage: error.message });
  }
};

// View Products (Public)
export const getAllProducts = async (req, res) => {
  try {
    const { search, category, style, minPrice, maxPrice, page, limit, excludeLoginId } = req.query;

    const query = {
      status: { $nin: ["deleted", "Deleted", "DELETED"], $not: /^deleted$/i }
    };

    // Exclude products added by the currently logged-in seller
    let sellerToExclude = excludeLoginId;

    if (!sellerToExclude && req.headers.authorization) {
      try {
        const authHeader = req.headers.authorization;
        let token = authHeader;
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.split(' ')[1];
        } else if (authHeader.includes(' ')) {
          token = authHeader.split(' ')[1];
        }
        if (token) {
          const secret = process.env.JWT_SECRET || "encryptkey";
          const decoded = jwt.verify(token, secret);
          if (decoded && decoded.loginId) {
            sellerToExclude = decoded.loginId;
          }
        }
      } catch (e) {
        // Token invalid or expired, ignore for public view
      }
    }

    if (sellerToExclude && mongoose.Types.ObjectId.isValid(sellerToExclude)) {
      query.loginId = { $ne: sellerToExclude };
    }

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
    return httpError(res, 500, "Server error while fetching products", { errorMessage: error.message });
  }
};

// View Seller Products (Seller / Company / Admin)
export const getSellerProducts = async (req, res) => {
  try {
    const userLoginId = req.userData?.loginId;
    if (!userLoginId) {
      return httpError(res, 401, "Unauthorized: Seller login required");
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
    return httpError(res, 500, "Server error while fetching seller products", { errorMessage: error.message });
  }
};

// View Single Product (Public)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return httpError(res, 400, "Invalid product ID format");
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
      return httpError(res, 404, "Product not found or has been removed");
    }
  } catch (error) {
    return httpError(res, 500, "Server error while fetching product details", { errorMessage: error.message });
  }
};

// Soft Delete Product (Vendor / Admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return httpError(res, 400, "Invalid product ID format");
    }

    const product = await productDB.findById(id);
    if (!product) {
      return httpError(res, 404, "Product not found");
    }

    const userRole = req.userData?.role;
    const userLoginId = req.userData?.loginId;

    // Authorization check: Admin can delete any product; Seller can ONLY delete products created by them.
    if (userRole !== "admin") {
      if (!userLoginId || !product.loginId || product.loginId.toString() !== userLoginId.toString()) {
        return httpError(res, 403, "Unauthorized: You can only delete products created by you");
      }
    }

    const productData = { status: "deleted" };
    const cartData = { status: 0 };
    await cartDB.updateMany({ prdId: id }, { $set: cartData });
    const prdresult = await productDB.updateOne(
      { _id: id },
      { $set: productData }
    );

    // Send Product Deleted email to seller
    getSellerInfo(product.loginId || userLoginId).then(({ email, sellerName }) => {
      if (email) {
        sendEmail({
          to: email,
          subject: `Product Removed: ${product.prdName}`,
          template: "productDeleted",
          context: {
            sellerName,
            prdName: product.prdName,
            category: product.category,
          }
        });
      }
    }).catch((e) => console.error("Product deleted email error:", e.message));

    return res.status(200).json({
      success: true,
      error: false,
      data: prdresult,
      message: "Product soft deleted successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while deleting product", { errorMessage: error.message });
  }
};

// Update Product (Vendor / Admin)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return httpError(res, 400, "Invalid product ID format");
    }

    const oldData = await productDB.findOne({ _id: id });
    if (!oldData) {
      return httpError(res, 404, "Product not found");
    }

    const userRole = req.userData?.role;
    const userLoginId = req.userData?.loginId;

    // Authorization check: Admin can update any product; Seller can ONLY update products created by them.
    if (userRole !== "admin") {
      if (!userLoginId || !oldData.loginId || oldData.loginId.toString() !== userLoginId.toString()) {
        return httpError(res, 403, "Unauthorized: You can only update products created by you");
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

    // Send Product Updated email to seller
    getSellerInfo(oldData.loginId || userLoginId).then(({ email, sellerName }) => {
      if (email) {
        sendEmail({
          to: email,
          subject: `Product Updated: ${data.prdName}`,
          template: "productUpdated",
          context: {
            sellerName,
            prdName: data.prdName,
            prize: data.prize,
            category: data.category,
            stock: data.stock,
          }
        });
      }
    }).catch((e) => console.error("Product updated email error:", e.message));

    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Product updated successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while updating product", { errorMessage: error.message });
  }
};

// Update Product Status (Vendor / Admin)
export const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return httpError(res, 400, "Invalid product ID format");
    }

    const product = await productDB.findById(id);
    if (!product) {
      return httpError(res, 404, "Product not found");
    }

    const userRole = req.userData?.role;
    const userLoginId = req.userData?.loginId;

    // Authorization check: Admin can update any product status; Seller can ONLY update status of products created by them.
    if (userRole !== "admin") {
      if (!userLoginId || !product.loginId || product.loginId.toString() !== userLoginId.toString()) {
        return httpError(res, 403, "Unauthorized: You can only update status of products created by you");
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
    return httpError(res, 500, "Server error while updating product status", { errorMessage: error.message });
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
        return httpError(res, 401, "Unauthorized");
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
    return httpError(res, 500, "Server error while deleting all products", { errorMessage: error.message });
  }
};

// Generate AI Product Description (Seller / Admin)
export const generateProductDescription = async (req, res) => {
  try {
    const { prdName, category, style, material, size } = req.body;
    
    if (!prdName) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Product name is required to generate a description",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: true,
        message: "AI service is not configured (missing API key)",
      });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    const prompt = `Write a professional, engaging, and concise product description for an e-commerce clothing store.
    Product Details:
    - Name: ${prdName}
    - Category: ${category || 'Not specified'}
    - Style: ${style || 'Not specified'}
    - Material: ${material || 'Not specified'}
    - Size Options: ${size || 'Not specified'}
    
    The description should highlight the features and suggest how to style it. Keep it between 3 to 5 sentences. Do not use markdown, just plain text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const generatedText = response.text;

    return res.status(200).json({
      success: true,
      error: false,
      data: { description: generatedText.trim() },
      message: "Description generated successfully",
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while generating description",
    });
  }
};
