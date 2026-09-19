import addressDB from "../model/address.js";
import User from "../model/user.js";
import { httpError } from "../utils/httpError.js";

// Add Address (User)
export const addAddress = async (req, res) => {
  try {
    const data = {
      loginId: req.userData.loginId,
      address: req.body.address,
      state: req.body.state,
      district: req.body.district,
      pincode: req.body.pincode,
      BuildingNumber: req.body.BuildingNumber,
    };

    const result = await addressDB(data).save();
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Address added successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Failed to add address", { errorMessage: error.message });
  }
};

// Get Address (User)
export const getAddress = async (req, res) => {
  try {
    const data = await addressDB.findOne({ loginId: req.userData.loginId });
    if (data) {
      return res.status(200).json({
        success: true,
        error: false,
        data: data,
        message: "Address found",
      });
    } else {
      return httpError(res, 404, "Address not found");
    }
  } catch (error) {
    return httpError(res, 500, "Failed to retrieve address", { errorMessage: error.message });
  }
};

// Update Address (User)
export const updateAddress = async (req, res) => {
  try {
    const data = {
      address: req.body.address,
      state: req.body.state,
      district: req.body.district,
      pincode: req.body.pincode,
      BuildingNumber: req.body.BuildingNumber,
    };
    const result = await addressDB.updateOne({ loginId: req.userData.loginId }, { $set: data });
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Address updated successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Failed to update address", { errorMessage: error.message });
  }
};

// Change Delivery Address & Contact (User)
export const changeDeliveryAddress = async (req, res) => {
  try {
    const signup = await User.findOne({ loginId: req.userData.loginId });
    const address = await addressDB.findOne({ loginId: req.userData.loginId });

    const signupdata = {
      firstName: req.body.firstName || (signup ? signup.firstName : ""),
      lastName: req.body.lastName || (signup ? signup.lastName : ""),
      number: req.body.number || (signup ? signup.number : ""),
    };
    const addressdata = {
      address: req.body.address || (address ? address.address : ""),
      state: req.body.state || (address ? address.state : ""),
      district: req.body.district || (address ? address.district : ""),
      pincode: req.body.pincode || (address ? address.pincode : ""),
      BuildingNumber: req.body.BuildingNumber || (address ? address.BuildingNumber : ""),
    };

    let resulttwo = await addressDB.updateOne({ loginId: req.userData.loginId }, { $set: addressdata });
    let resultone = await User.updateOne({ loginId: req.userData.loginId }, { $set: signupdata });

    return res.status(200).json({
      success: true,
      error: false,
      message: "Delivery details updated successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Failed to update delivery address", { errorMessage: error.message });
  }
};
