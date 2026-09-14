import cartDB from "../model/cart.js";
import addressDB from "../model/address.js";

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

// Checkout / Place Order (User)
export const checkoutCart = async (req, res) => {
  try {
    const userAddress = await addressDB.findOne({ loginId: req.userData.loginId });
    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please save a shipping address before checking out.",
      });
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
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error during checkout",
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
