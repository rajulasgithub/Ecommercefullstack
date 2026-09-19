import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Login from "../model/login.js";
import User from "../model/user.js";
import Company from "../model/company.js";
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

    const existingUser = await Login.findOne({ email, role: "user" });
    if (existingUser) {
      return httpError(res, 400, "A user account with this email address already exists");
    }
    else{
    const hashedPassword = await bcrypt.hash(password, 10);

    const loginData = {
      email,
      password: hashedPassword,
      role: "user",
    };

    loginresult = await Login(loginData).save();

    let imageUrl = "";
    if (req.file) {
      imageUrl = req.file.path || req.file.filename;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

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
      image: imageUrl,
    };

    const signupresult = await User(signupData).save();
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
        await Login.deleteOne({ _id: loginresult._id }).catch(() => {});
      }
      return httpError(res, 400, "Registration failed");
    }
      
    }

    
  } catch (error) {
    if (loginresult && loginresult._id) {
      await Login.deleteOne({ _id: loginresult._id }).catch(() => {});
    }
    return httpError(res, 500, "Internal server error during registration", { errorMessage: error.message });
  }
};

// User/Company Login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return httpError(res, 400, "All fields are required");
    }

    let user = null;
    if (role) {
      user = await Login.findOne({ email, role });
    } else {
      const candidates = await Login.find({ email });
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
      return httpError(res, 400, "Invalid email or password");
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
      return httpError(res, 400, "Invalid email or password");
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
    return httpError(res, 500, "Something went wrong during login", { errorMessage: error.message });
  }
};

// Google Login / Signup
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return httpError(res, 400, "Google token is required");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || "dummy-google-client-id",
    });
    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture } = payload;

    let user = await Login.findOne({ email });

    if (!user) {
      // Create new account automatically for Google users
      const randomPassword = Math.random().toString(36).slice(-10) + "Aa1!";
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const loginData = { email, password: hashedPassword, role: "user" };
      user = await Login(loginData).save();

      const signupData = {
        loginId: user._id,
        firstName: given_name || "User",
        lastName: family_name || "N/A",
        number: 0,
        gender: "Other",
        state: "N/A",
        district: "N/A",
        pincode: 0,
        place: "N/A",
        role: "user",
        image: picture || "",
      };
      await User(signupData).save();

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
    return httpError(res, 500, "Something went wrong during Google login", { errorMessage: error.message });
  }
};

// Google Login / Signup for Seller / Company
export const googleCompanyLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return httpError(res, 400, "Google token is required");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || "dummy-google-client-id",
    });
    const payload = ticket.getPayload();
    const { email, name, given_name, family_name, picture } = payload;

    let user = await Login.findOne({ email, role: "seller" });

    if (!user) {
      const existingAny = await Login.findOne({ email });
      if (existingAny && existingAny.role !== "seller") {
        return httpError(res, 400, `This email is already registered as a ${existingAny.role}. Please log in using your registered credentials.`);
      }

      const randomPassword = Math.random().toString(36).slice(-10) + "Aa1!";
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const loginData = { email, password: hashedPassword, role: "seller" };
      user = await Login(loginData).save();

      const companyName = name || (given_name ? `${given_name} ${family_name || ''}`.trim() : "Seller Company");

      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const companyData = {
        loginId: user._id,
        companyName,
        image: picture || "default_logo.png",
        state: "N/A",
        district: "N/A",
        pincode: 0,
        contactNumber: 0,
        regNumber: `REG-${Date.now()}-${randomDigits}`,
        gstNumber: `22AAAAA${randomDigits}A1Z5`,
        role: "seller",
      };
      await Company(companyData).save();

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
    return httpError(res, 500, "Something went wrong during Google seller login", { errorMessage: error.message });
  }
};


// View Logged-In User / Seller Profile
export const viewProfile = async (req, res) => {
  try {
    const loginUser = await Login.findById(req.userData.loginId).select('-password');
    if (!loginUser) {
      return httpError(res, 404, "Account not found");
    }

    const userRole = String(req.userData.role || '').toLowerCase();
    if (userRole === "seller" || userRole === "company") {
      const company = await Company.findOne({ loginId: req.userData.loginId });
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
    const user = await User.findOne({ loginId: req.userData.loginId });
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

    return httpError(res, 404, "Profile details not found");
  } catch (error) {
    return httpError(res, 500, "Error fetching profile", { errorMessage: error.message });
  }
};

// Update Logged-In User / Seller Profile
export const updateOwnProfile = async (req, res) => {
  try {
    const loginId = req.userData.loginId;
    const userRole = String(req.userData.role || '').toLowerCase();

    const loginUser = await Login.findById(loginId);
    if (!loginUser) {
      return httpError(res, 404, "Account not found");
    }

    if (userRole === "seller" || userRole === "company") {
      const targetCompany = await Company.findOne({ loginId });
      if (!targetCompany) {
        return httpError(res, 404, "Seller company profile not found");
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

      await Company.updateOne({ loginId }, { $set: updateData });
      const updatedCompany = await Company.findOne({ loginId });

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
      const targetUser = await User.findOne({ loginId });
      if (!targetUser) {
        return httpError(res, 404, "User profile not found");
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
        bio: req.body.bio !== undefined ? req.body.bio : targetUser.bio,
      };

      if (req.file) {
        updateData.image = req.file.path || req.file.filename;
      } else if (req.body.image !== undefined) {
        updateData.image = req.body.image;
      }

      await User.updateOne({ loginId }, { $set: updateData });
      const updatedUser = await User.findOne({ loginId });

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
    return httpError(res, 500, "Server error while updating profile", { errorMessage: error.message });
  }
};


// View All Users (Admin Only)
export const viewAllUsers = async (req, res) => {
  try {
    const result = await User.find().populate('loginId', 'email role');
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Users list loaded successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Error fetching users", { errorMessage: error.message });
  }
};

// Delete User (Admin Only)
export const deleteUser = async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      return res.status(200).json({
        success: true,
        error: false,
        message: "User deleted successfully",
      });
    } else {
      return httpError(res, 404, "User not found");
    }
  } catch (error) {
    return httpError(res, 500, "Error deleting user", { errorMessage: error.message });
  }
};

// Update Profile
export const updateUser = async (req, res) => {
  try {
    const targetUser = await User.findOne({ _id: req.params.id });
    if (!targetUser) {
      return httpError(res, 404, "User profile not found");
    }

    // Verify ownership or Admin role ("admin")
    if (targetUser.loginId.toString() !== req.userData.loginId && req.userData.role !== "admin") {
      return httpError(res, 403, "Forbidden. Cannot update another user's profile.");
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

    const result = await User.updateOne({ _id: req.params.id }, { $set: data });
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "User profile updated successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Error updating profile", { errorMessage: error.message });
  }
};

// Company / Seller Signup
export const companySignup = async (req, res) => {
  let loginresult = null;
  try {
    const { email, password, companyName, state, district, pincode, contactNumber, regNumber, gstNumber } = req.body;

    if (!email || !password) {
      return httpError(res, 400, "Email and password are required");
    }

    const existing = await Login.findOne({ email, role: "seller" });
    if (existing) {
      return httpError(res, 400, "A seller account with this email address already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const logindata = {
      email,
      password: hashedPassword,
      role: "seller",
    };
    loginresult = await Login(logindata).save();

    const data = {
      loginId: loginresult._id,
      image: req.file ? req.file.path || req.file.filename : "",
      companyName,
      state,
      district,
      pincode,
      contactNumber,
      regNumber: regNumber ? String(regNumber).trim() : "",
      gstNumber: gstNumber ? String(gstNumber).trim().toUpperCase() : "",
      role: "seller",
    };

    const result = await Company(data).save();
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
      await Login.deleteOne({ _id: loginresult._id }).catch(() => {});
    }
    return httpError(res, 500, "Company registration failed", { errorMessage: error.message });
  }
};

// View All Companies (Admin/Seller)
export const viewCompanies = async (req, res) => {
  try {
    const result = await Company.find().populate('loginId', 'email role');
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Companies retrieved successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Error fetching companies", { errorMessage: error.message });
  }
};

// View Single Company
export const viewSingleCompany = async (req, res) => {
  try {
    const result = await Company.findOne({ _id: req.params.id });
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "Company details loaded",
      });
    } else {
      return httpError(res, 404, "Company not found");
    }
  } catch (error) {
    return httpError(res, 500, "Error fetching company", { errorMessage: error.message });
  }
};

// Delete Company (Admin/Seller)
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id });
    if (!company) {
      return httpError(res, 404, "Company not found");
    }

    if (company.loginId.toString() !== req.userData.loginId && req.userData.role !== "admin") {
      return httpError(res, 403, "Forbidden. Cannot delete another company.");
    }

    await Company.deleteOne({ _id: req.params.id });
    await Login.deleteOne({ _id: company.loginId });

    return res.status(200).json({
      success: true,
      error: false,
      message: "Company deleted successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Error deleting company", { errorMessage: error.message });
  }
};

// Update Company Info
export const updateCompany = async (req, res) => {
  try {
    const olddata = await Company.findOne({ _id: req.params.id });
    if (!olddata) {
      return httpError(res, 404, "Company not found");
    }

    if (olddata.loginId.toString() !== req.userData.loginId && req.userData.role !== "admin") {
      return httpError(res, 403, "Forbidden. Cannot update another company.");
    }

    const data = {
      companyName: req.body.companyName || olddata.companyName,
      state: req.body.state || olddata.state,
      district: req.body.district || olddata.district,
      pincode: req.body.pincode || olddata.pincode,
      contactNumber: req.body.contactNumber || olddata.contactNumber,
      regNumber: req.body.regNumber ? String(req.body.regNumber).trim() : olddata.regNumber,
      gstNumber: req.body.gstNumber ? String(req.body.gstNumber).trim().toUpperCase() : olddata.gstNumber,
    };

    const result = await Company.updateOne({ _id: req.params.id }, { $set: data });
    return res.status(200).json({
      success: true,
      error: false,
      data: result,
      message: "Company updated successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Error updating company", { errorMessage: error.message });
  }
};

// Request Password Reset OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return httpError(res, 400, "Email address is required");
    }

    const user = await Login.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return httpError(res, 404, "No account found with this email address");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = otpExpires;
    await user.save();

    let recipientName = "Valued User";
    if (user.role === "seller" || user.role === "company") {
      const company = await Company.findOne({ loginId: user._id });
      if (company && company.companyName) recipientName = company.companyName;
    } else {
      const profile = await User.findOne({ loginId: user._id });
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
    return httpError(res, 500, "Server error while processing forgot password request", { errorMessage: error.message });
  }
};

// Reset Password with OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return httpError(res, 400, "Email, OTP code, and new password are required");
    }

    const user = await Login.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return httpError(res, 404, "Account not found");
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp.trim()) {
      return httpError(res, 400, "Invalid OTP verification code");
    }

    if (!user.resetPasswordExpires || new Date() > new Date(user.resetPasswordExpires)) {
      return httpError(res, 400, "OTP code has expired. Please request a new password reset");
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
    return httpError(res, 500, "Server error while resetting password", { errorMessage: error.message });
  }
};

// Verify OTP Code Only
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return httpError(res, 400, "Email address and OTP code are required");
    }

    const user = await Login.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return httpError(res, 404, "Account not found");
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp.trim()) {
      return httpError(res, 400, "Invalid OTP verification code");
    }

    if (!user.resetPasswordExpires || new Date() > new Date(user.resetPasswordExpires)) {
      return httpError(res, 400, "OTP code has expired. Please request a new password reset");
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "OTP code verified successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while verifying OTP code", { errorMessage: error.message });
  }
};

// Generate AI Profile Bio
export const generateProfileBio = async (req, res) => {
  try {
    const userRole = String(req.userData.role || '').toLowerCase();
    const isSeller = userRole === "seller" || userRole === "company";
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: true,
        message: "AI service is not configured (missing API key)",
      });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    let prompt = "";

    if (isSeller) {
      const { companyName, state, district } = req.body;
      prompt = `Write a professional, engaging, and concise company bio for an e-commerce seller.
      Details:
      - Company Name: ${companyName || 'Not specified'}
      - Location: ${district || ''} ${state || ''}
      
      The bio should highlight trustworthiness and quality. Keep it between 3 to 4 sentences. Do not use markdown, just plain text.`;
    } else {
      const { firstName, lastName, state, place } = req.body;
      prompt = `Write a friendly, engaging, and concise personal bio for a shopper on an e-commerce platform.
      Details:
      - Name: ${firstName || 'User'} ${lastName || ''}
      - Location: ${place || ''} ${state || ''}
      
      The bio should reflect a love for shopping and discovering great products. Keep it between 2 to 3 sentences. Do not use markdown, just plain text.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const generatedText = response.text;

    return res.status(200).json({
      success: true,
      error: false,
      data: { bio: generatedText.trim() },
      message: "Bio generated successfully",
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "Server error while generating bio",
    });
  }
};
