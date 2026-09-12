import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import loginDB from "../model/login.js";
import userDB from "../model/user.js";
import companyDB from "../model/company.js";
import dotenv from "dotenv";

dotenv.config();

// User Signup
export const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, number, gender, state, district, pincode, place } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Email and password are required"
      });
    }

    const existingUser = await loginDB.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Email address is already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const loginData = {
      email,
      password: hashedPassword,
      role: "user",
    };

    const loginresult = await loginDB(loginData).save();

    const signupData = {
      loginId: loginresult._id,
      firstName,
      lastName,
      number,
      gender,
      state,
      district,
      pincode,
      place,
      role: "user",
    };

    const signupresult = await userDB(signupData).save();
    if (signupresult) {
      const secret = process.env.JWT_SECRET || "encryptkey";
      const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
      const token = jwt.sign(
        { loginId: loginresult._id, role: "user", email: loginresult.email },
        secret,
        { expiresIn }
      );

      return res.status(200).json({
        success: true,
        error: false,
        data: signupresult,
        token: token,
        role: "user",
        loginId: loginresult._id,
        message: "Successfully registered user",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Registration failed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Internal server error during registration",
    });
  }
};

// User/Company Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "All fields are required",
      });
    }

    const user = await loginDB.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Email does not exist",
      });
    }

    // Support bcrypt comparison with fallback to plaintext (for old test data)
    let isPasswordMatch = await bcrypt.compare(password, user.password).catch(() => false);
    if (!isPasswordMatch && user.password === password) {
      isPasswordMatch = true;
      // Upgrade stored password to hash transparently
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid email or password",
      });
    }

    const secret = process.env.JWT_SECRET || "encryptkey";
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    const token = jwt.sign(
      {
        loginId: user._id,
        role: user.role,
        email: user.email
      },
      secret,
      { expiresIn }
    );

    return res.status(200).json({
      success: true,
      error: false,
      message: "Login successful",
      loginId: user._id,
      role: user.role,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Something went wrong during login",
    });
  }
};

// View Profile (Logged In User)
export const viewProfile = async (req, res) => {
  try {
    const result = await userDB.findOne({ loginId: req.userData.loginId });
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "Profile loaded successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User profile not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Error fetching user profile",
    });
  }
};

// View All Users (Admin Only)
export const viewAllUsers = async (req, res) => {
  try {
    const result = await userDB.find().populate('loginId', 'email role');
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Users list loaded successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Error fetching users",
    });
  }
};

// Delete User (Admin Only)
export const deleteUser = async (req, res) => {
  try {
    const result = await userDB.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      return res.status(200).json({
        success: true,
        error: false,
        message: "User deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        error: true,
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Error deleting user",
    });
  }
};

// Update Profile
export const updateUser = async (req, res) => {
  try {
    const targetUser = await userDB.findOne({ _id: req.params.id });
    if (!targetUser) {
      return res.status(404).json({ success: false, error: true, message: "User profile not found" });
    }

    // Verify ownership or Admin role ("admin")
    if (targetUser.loginId.toString() !== req.userData.loginId && req.userData.role !== "admin") {
      return res.status(403).json({ success: false, error: true, message: "Forbidden. Cannot update another user's profile." });
    }

    const data = {
      firstName: req.body.firstName || targetUser.firstName,
      lastName: req.body.lastName || targetUser.lastName,
      number: req.body.number || targetUser.number,
      gender: req.body.gender || targetUser.gender,
      state: req.body.state || targetUser.state,
      district: req.body.district || targetUser.district,
      pincode: req.body.pincode || targetUser.pincode,
      place: req.body.place || targetUser.place,
    };

    const result = await userDB.updateOne({ _id: req.params.id }, { $set: data });
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "User profile updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Error updating profile",
    });
  }
};

// Company / Seller Signup
export const companySignup = async (req, res) => {
  try {
    const { email, password, companyName, state, district, pincode, contactNumber, regNumber, gstNumber } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Email and password are required",
      });
    }

    const existing = await loginDB.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const logindata = {
      email,
      password: hashedPassword,
      role: "seller",
    };
    const loginresult = await loginDB(logindata).save();

    const data = {
      loginId: loginresult._id,
      image: req.file ? req.file.path || req.file.filename : "",
      companyName,
      state,
      district,
      pincode,
      contactNumber,
      regNumber,
      gstNumber,
      role: "seller",
    };

    const result = await companyDB(data).save();
    const secret = process.env.JWT_SECRET || "encryptkey";
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign(
      { loginId: loginresult._id, role: "seller", email: loginresult.email },
      secret,
      { expiresIn }
    );

    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      token: token,
      role: "seller",
      loginId: loginresult._id,
      message: "Company registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Company registration failed",
    });
  }
};

// View All Companies (Admin/Seller)
export const viewCompanies = async (req, res) => {
  try {
    const result = await companyDB.find().populate('loginId', 'email role');
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Companies retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Error fetching companies",
    });
  }
};

// View Single Company
export const viewSingleCompany = async (req, res) => {
  try {
    const result = await companyDB.findOne({ _id: req.params.id });
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "Company details loaded",
      });
    } else {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Company not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Error fetching company",
    });
  }
};

// Delete Company (Admin/Seller)
export const deleteCompany = async (req, res) => {
  try {
    const company = await companyDB.findOne({ _id: req.params.id });
    if (!company) {
      return res.status(404).json({ success: false, error: true, message: "Company not found" });
    }

    if (company.loginId.toString() !== req.userData.loginId && req.userData.role !== "admin") {
      return res.status(403).json({ success: false, error: true, message: "Forbidden. Cannot delete another company." });
    }

    await companyDB.deleteOne({ _id: req.params.id });
    await loginDB.deleteOne({ _id: company.loginId });

    return res.status(200).json({
      success: true,
      error: false,
      message: "Company deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Error deleting company",
    });
  }
};

// Update Company Info
export const updateCompany = async (req, res) => {
  try {
    const olddata = await companyDB.findOne({ _id: req.params.id });
    if (!olddata) {
      return res.status(404).json({ success: false, error: true, message: "Company not found" });
    }

    if (olddata.loginId.toString() !== req.userData.loginId && req.userData.role !== "admin") {
      return res.status(403).json({ success: false, error: true, message: "Forbidden. Cannot update another company." });
    }

    const data = {
      companyName: req.body.companyName || olddata.companyName,
      state: req.body.state || olddata.state,
      district: req.body.district || olddata.district,
      pincode: req.body.pincode || olddata.pincode,
      contactNumber: req.body.contactNumber || olddata.contactNumber,
      regNumber: req.body.regNumber || olddata.regNumber,
      gstNumber: req.body.gstNumber || olddata.gstNumber,
    };

    const result = await companyDB.updateOne({ _id: req.params.id }, { $set: data });
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Company updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Error updating company",
    });
  }
};
