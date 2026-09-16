import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import loginDB from "../model/login.js";
import userDB from "../model/user.js";
import companyDB from "../model/company.js";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import sendEmail from "../utils/sendEmail.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "dummy-google-client-id");

dotenv.config();

// User Signup
export const signup = async (req, res) => {
  let loginresult = null;
  try {
    const { email, password, firstName, lastName, number, gender, state, district, pincode, place } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Email and password are required"
      });
    }

    const existingUser = await loginDB.findOne({ email, role: "user" });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "A user account with this email address already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const loginData = {
      email,
      password: hashedPassword,
      role: "user",
    };

    loginresult = await loginDB(loginData).save();

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

      // Send Welcome Email
      sendEmail({
        to: email,
        subject: "Welcome to TrendLife!",
        template: "userSignup",
        context: {
          name: firstName ? `${firstName} ${lastName || ''}`.trim() : "Valued Customer",
          email: email,
          role: "User"
        }
      }).catch((e) => console.error("Signup email send error:", e.message));

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
      if (loginresult && loginresult._id) {
        await loginDB.deleteOne({ _id: loginresult._id }).catch(() => {});
      }
      return res.status(400).json({
        success: false,
        error: true,
        message: "Registration failed",
      });
    }
  } catch (error) {
    if (loginresult && loginresult._id) {
      await loginDB.deleteOne({ _id: loginresult._id }).catch(() => {});
    }
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
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "All fields are required",
      });
    }

    let user = null;
    if (role) {
      user = await loginDB.findOne({ email, role });
    } else {
      const candidates = await loginDB.find({ email });
      if (candidates.length === 1) {
        user = candidates[0];
      } else if (candidates.length > 1) {
        for (const candidate of candidates) {
          let isMatch = await bcrypt.compare(password, candidate.password).catch(() => false);
          if (!isMatch && candidate.password === password) {
            isMatch = true;
          }
          if (isMatch) {
            user = candidate;
            break;
          }
        }
      }
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid email or password",
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

// Google Login / Signup
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Google token is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || "dummy-google-client-id",
    });
    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    let user = await loginDB.findOne({ email });

    if (!user) {
      // Create new account automatically for Google users
      const randomPassword = Math.random().toString(36).slice(-10) + "Aa1!";
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const loginData = { email, password: hashedPassword, role: "user" };
      user = await loginDB(loginData).save();

      const signupData = {
        loginId: user._id,
        firstName: given_name || "User",
        lastName: family_name || "",
        role: "user",
      };
      await userDB(signupData).save();

      // Send Welcome Email for Google Signup
      sendEmail({
        to: email,
        subject: "Welcome to TrendLife!",
        template: "userSignup",
        context: {
          name: given_name ? `${given_name} ${family_name || ''}`.trim() : "Valued Customer",
          email: email,
          role: "User"
        }
      }).catch((e) => console.error("Google signup email send error:", e.message));
    }

    const secret = process.env.JWT_SECRET || "encryptkey";
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";

    const jwtToken = jwt.sign(
      {
        loginId: user._id,
        role: user.role,
        email: user.email,
      },
      secret,
      { expiresIn }
    );

    return res.status(200).json({
      success: true,
      error: false,
      message: "Google login successful",
      loginId: user._id,
      role: user.role,
      token: jwtToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Something went wrong during Google login",
    });
  }
};

// Google Login / Signup for Seller / Company
export const googleCompanyLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Google token is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || "dummy-google-client-id",
    });
    const payload = ticket.getPayload();
    const { email, name, given_name, family_name, picture } = payload;

    let user = await loginDB.findOne({ email, role: "seller" });

    if (!user) {
      const existingAny = await loginDB.findOne({ email });
      if (existingAny && existingAny.role !== "seller") {
        return res.status(400).json({
          success: false,
          error: true,
          message: `This email is already registered as a ${existingAny.role}. Please log in using your registered credentials.`,
        });
      }

      const randomPassword = Math.random().toString(36).slice(-10) + "Aa1!";
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const loginData = { email, password: hashedPassword, role: "seller" };
      user = await loginDB(loginData).save();

      const companyName = name || (given_name ? `${given_name} ${family_name || ''}`.trim() : "Seller Company");

      const companyData = {
        loginId: user._id,
        companyName,
        image: picture || "",
        role: "seller",
      };
      await companyDB(companyData).save();

      sendEmail({
        to: email,
        subject: "Welcome to TrendLife Seller Network!",
        template: "userSignup",
        context: {
          name: companyName,
          email: email,
          role: "Seller"
        }
      }).catch((e) => console.error("Google company signup email send error:", e.message));
    }

    const secret = process.env.JWT_SECRET || "encryptkey";
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";

    const jwtToken = jwt.sign(
      {
        loginId: user._id,
        role: user.role,
        email: user.email,
      },
      secret,
      { expiresIn }
    );

    return res.status(200).json({
      success: true,
      error: false,
      message: "Google seller login successful",
      loginId: user._id,
      role: user.role,
      token: jwtToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Something went wrong during Google seller login",
    });
  }
};


// View Logged-In User / Seller Profile
export const viewProfile = async (req, res) => {
  try {
    const loginUser = await loginDB.findById(req.userData.loginId).select('-password');
    if (!loginUser) {
      return res.status(404).json({ success: false, error: true, message: "Account not found" });
    }

    const userRole = String(req.userData.role || '').toLowerCase();
    if (userRole === "seller" || userRole === "company") {
      const company = await companyDB.findOne({ loginId: req.userData.loginId });
      if (company) {
        return res.status(200).json({
          success: true,
          error: false,
          data: {
            ...company.toObject(),
            email: loginUser.email,
            role: loginUser.role,
          },
          message: "Seller profile loaded successfully",
        });
      }
    }

    // Default: Customer Profile
    const user = await userDB.findOne({ loginId: req.userData.loginId });
    if (user) {
      return res.status(200).json({
        success: true,
        error: false,
        data: {
          ...user.toObject(),
          email: loginUser.email,
          role: loginUser.role,
        },
        message: "User profile loaded successfully",
      });
    }

    return res.status(404).json({
      success: false,
      error: true,
      message: "Profile details not found",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Error fetching profile",
    });
  }
};

// Update Logged-In User / Seller Profile
export const updateOwnProfile = async (req, res) => {
  try {
    const loginId = req.userData.loginId;
    const userRole = String(req.userData.role || '').toLowerCase();

    const loginUser = await loginDB.findById(loginId);
    if (!loginUser) {
      return res.status(404).json({ success: false, error: true, message: "Account not found" });
    }

    if (userRole === "seller" || userRole === "company") {
      const targetCompany = await companyDB.findOne({ loginId });
      if (!targetCompany) {
        return res.status(404).json({ success: false, error: true, message: "Seller company profile not found" });
      }

      const updateData = {
        companyName: req.body.companyName !== undefined ? req.body.companyName : targetCompany.companyName,
        state: req.body.state !== undefined ? req.body.state : targetCompany.state,
        district: req.body.district !== undefined ? req.body.district : targetCompany.district,
        pincode: req.body.pincode !== undefined ? req.body.pincode : targetCompany.pincode,
        contactNumber: req.body.contactNumber !== undefined ? req.body.contactNumber : targetCompany.contactNumber,
        regNumber: req.body.regNumber !== undefined ? req.body.regNumber : targetCompany.regNumber,
        gstNumber: req.body.gstNumber !== undefined ? req.body.gstNumber : targetCompany.gstNumber,
      };

      if (req.file) {
        updateData.image = req.file.path || req.file.filename;
      }

      await companyDB.updateOne({ loginId }, { $set: updateData });
      const updatedCompany = await companyDB.findOne({ loginId });

      return res.status(200).json({
        success: true,
        error: false,
        data: {
          ...updatedCompany.toObject(),
          email: loginUser.email,
          role: loginUser.role,
        },
        message: "Seller profile updated successfully",
      });
    } else {
      const targetUser = await userDB.findOne({ loginId });
      if (!targetUser) {
        return res.status(404).json({ success: false, error: true, message: "User profile not found" });
      }

      const updateData = {
        firstName: req.body.firstName !== undefined ? req.body.firstName : targetUser.firstName,
        lastName: req.body.lastName !== undefined ? req.body.lastName : targetUser.lastName,
        number: req.body.number !== undefined ? req.body.number : targetUser.number,
        gender: req.body.gender !== undefined ? req.body.gender : targetUser.gender,
        state: req.body.state !== undefined ? req.body.state : targetUser.state,
        district: req.body.district !== undefined ? req.body.district : targetUser.district,
        pincode: req.body.pincode !== undefined ? req.body.pincode : targetUser.pincode,
        place: req.body.place !== undefined ? req.body.place : targetUser.place,
      };

      await userDB.updateOne({ loginId }, { $set: updateData });
      const updatedUser = await userDB.findOne({ loginId });

      return res.status(200).json({
        success: true,
        error: false,
        data: {
          ...updatedUser.toObject(),
          email: loginUser.email,
          role: loginUser.role,
        },
        message: "Profile updated successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while updating profile",
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
  let loginresult = null;
  try {
    const { email, password, companyName, state, district, pincode, contactNumber, regNumber, gstNumber } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Email and password are required",
      });
    }

    const existing = await loginDB.findOne({ email, role: "seller" });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "A seller account with this email address already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const logindata = {
      email,
      password: hashedPassword,
      role: "seller",
    };
    loginresult = await loginDB(logindata).save();

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

    // Send Welcome Email for Seller/Company Signup
    sendEmail({
      to: email,
      subject: "Welcome to TrendLife Seller Network!",
      template: "userSignup",
      context: {
        name: companyName || "Valued Seller",
        email: email,
        role: "Seller"
      }
    }).catch((e) => console.error("Company signup email send error:", e.message));

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
    if (loginresult && loginresult._id) {
      await loginDB.deleteOne({ _id: loginresult._id }).catch(() => {});
    }
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

// Request Password Reset OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Email address is required",
      });
    }

    const user = await loginDB.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No account found with this email address",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = otpExpires;
    await user.save();

    let recipientName = "Valued User";
    if (user.role === "seller" || user.role === "company") {
      const company = await companyDB.findOne({ loginId: user._id });
      if (company && company.companyName) recipientName = company.companyName;
    } else {
      const profile = await userDB.findOne({ loginId: user._id });
      if (profile && profile.firstName) {
        recipientName = `${profile.firstName} ${profile.lastName || ''}`.trim();
      }
    }

    sendEmail({
      to: user.email,
      subject: "TrendLife - Password Reset OTP",
      template: "forgotPassword",
      context: {
        name: recipientName,
        email: user.email,
        otp,
      },
    }).catch((e) => console.error("Forgot password email send error:", e.message));

    return res.status(200).json({
      success: true,
      error: false,
      message: "Password reset OTP has been sent to your email address",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while processing forgot password request",
    });
  }
};

// Reset Password with OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Email, OTP code, and new password are required",
      });
    }

    const user = await loginDB.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Account not found",
      });
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp.trim()) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid OTP verification code",
      });
    }

    if (!user.resetPasswordExpires || new Date() > new Date(user.resetPasswordExpires)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "OTP code has expired. Please request a new password reset",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      error: false,
      message: "Password reset successfully. You can now log in with your new password",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while resetting password",
    });
  }
};

// Verify OTP Code Only
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Email address and OTP code are required",
      });
    }

    const user = await loginDB.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Account not found",
      });
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp.trim()) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid OTP verification code",
      });
    }

    if (!user.resetPasswordExpires || new Date() > new Date(user.resetPasswordExpires)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "OTP code has expired. Please request a new password reset",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "OTP code verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while verifying OTP code",
    });
  }
};


