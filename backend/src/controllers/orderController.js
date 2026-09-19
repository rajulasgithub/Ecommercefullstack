import cartDB from "../model/cart.js";
import addressDB from "../model/address.js";
import mongoose from "mongoose";
import { httpError } from "../utils/httpError.js";

// View Company Orders (Vendor / Admin)
export const getCompanyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const result = await cartDB.aggregate([
      { $match: { status: { $ne: 1 } } },
      {
        $lookup: {
          from: "addresses",
          localField: "loginId",
          foreignField: "loginId",
          as: "result",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "prdId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $lookup: {
          from: "users",
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
          firstName: { $first: "$info.firstName" },
          lastName: { $first: "$info.lastName" },
          number: { $first: "$info.number" },
          image: { $first: "$product.image" },
          prdName: { $first: "$product.prdName" },
          prize: { $first: "$product.prize" },
          size: { $first: "$product.size" },
          quantity: { $first: "$quantity" },
          status: { $first: "$status" },
          date: { $first: "$date" },
          address: { $first: { $ifNull: ["$shippingAddress.address", "$result.address"] } },
          state: { $first: { $ifNull: ["$shippingAddress.state", "$result.state"] } },
          district: { $first: { $ifNull: ["$shippingAddress.district", "$result.district"] } },
          pincode: { $first: { $ifNull: ["$shippingAddress.pincode", "$result.pincode"] } },
          BuildingNumber: { $first: { $ifNull: ["$shippingAddress.BuildingNumber", "$result.BuildingNumber"] } },
          createdAt: { $first: "$createdAt" },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const data = result[0]?.data || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;

    return res.status(200).json({
      success: true,
      error: false,
      data: data,
      totalCount: totalCount,
      message: "Orders list viewed successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while viewing company orders", { errorMessage: error.message });
  }
};

// View Seller Orders (Vendor specific)
export const getSellerOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: { status: { $ne: 1 } } },
      {
        $lookup: {
          from: "addresses",
          localField: "loginId",
          foreignField: "loginId",
          as: "result",
        },
      },
      {
        $lookup: {
          from: "products", // fixed to 'products'
          localField: "prdId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "loginId",
          foreignField: "loginId",
          as: "info",
        },
      },
      { $unwind: "$result" },
      { $unwind: "$product" },
      { $unwind: "$info" },
      {
        $match: {
          "product.loginId": new mongoose.Types.ObjectId(req.userData.loginId)
        }
      }
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "product.prdName": { $regex: search, $options: "i" } },
            { "info.firstName": { $regex: search, $options: "i" } }
          ]
        }
      });
    }

    pipeline.push(
      {
        $group: {
          _id: "$_id",
          loginId: { $first: "$loginId" },
          firstName: { $first: "$info.firstName" },
          lastName: { $first: "$info.lastName" },
          number: { $first: "$info.number" },
          image: { $first: "$product.image" },
          prdName: { $first: "$product.prdName" },
          prize: { $first: "$product.prize" },
          size: { $first: "$product.size" },
          quantity: { $first: "$quantity" },
          status: { $first: "$status" },
          date: { $first: "$date" },
          address: { $first: { $ifNull: ["$shippingAddress.address", "$result.address"] } },
          state: { $first: { $ifNull: ["$shippingAddress.state", "$result.state"] } },
          district: { $first: { $ifNull: ["$shippingAddress.district", "$result.district"] } },
          pincode: { $first: { $ifNull: ["$shippingAddress.pincode", "$result.pincode"] } },
          BuildingNumber: { $first: { $ifNull: ["$shippingAddress.BuildingNumber", "$result.BuildingNumber"] } },
          createdAt: { $first: "$createdAt" },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      }
    );

    const result = await cartDB.aggregate(pipeline);

    const data = result[0]?.data || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;

    return res.status(200).json({
      success: true,
      error: false,
      data: data,
      totalCount: totalCount,
      message: "Seller orders viewed successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while viewing seller orders", { errorMessage: error.message });
  }
};

// View Orders for Logged-In User
export const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { loginId: req.userData.loginId, status: { $ne: 1 } };
    const totalCount = await cartDB.countDocuments(query);
    
    const result = await cartDB
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("prdId");

    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      totalCount: totalCount,
      message: "User orders viewed successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while viewing user orders", { errorMessage: error.message });
  }
};

// Checkout / Place Order (User)
export const checkoutCart = async (req, res) => {
  try {
    const userAddress = await addressDB.findOne({ loginId: req.userData.loginId });
    if (!userAddress) {
      return httpError(res, 400, "Please save a shipping address before checking out.");
    }

    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const data = {
      status: 2,
      date: `${day}-${month}-${year}`,
      shippingAddress: {
        address: userAddress.address,
        state: userAddress.state,
        district: userAddress.district,
        pincode: userAddress.pincode,
        BuildingNumber: userAddress.BuildingNumber,
      }
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
    return httpError(res, 500, "Server error during checkout", { errorMessage: error.message });
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
    return httpError(res, 500, "Server error updating order status", { errorMessage: error.message });
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
    return httpError(res, 500, "Server error cancelling order", { errorMessage: error.message });
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
    return httpError(res, 500, "Server error viewing orders", { errorMessage: error.message });
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
    return httpError(res, 500, "Server error rejecting order", { errorMessage: error.message });
  }
};
