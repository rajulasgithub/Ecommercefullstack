import addressDB from "../model/address.js";
import userDB from "../model/user.js";

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
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Failed to add address",
    });
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
      return res.status(404).json({
        success: false,
        error: true,
        message: "Address not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Failed to retrieve address",
    });
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
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Failed to update address",
    });
  }
};

// Change Delivery Address & Contact (User)
export const changeDeliveryAddress = async (req, res) => {
  try {
    const signup = await userDB.findOne({ loginId: req.userData.loginId });
    const address = await addressDB.findOne({ loginId: req.userData.loginId });

    const signupdata = {
      firstname: req.body.firstname || (signup ? signup.firstname : ""),
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
    let resultone = await userDB.updateOne({ loginId: req.userData.loginId }, { $set: signupdata });

    return res.status(200).json({
      success: true,
      error: false,
      message: "Delivery details updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Failed to update delivery address",
    });
  }
};
