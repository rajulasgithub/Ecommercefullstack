import express from "express";
import { body } from "express-validator";
import checkauth from "../middleware/checkauth.js";
import { checkRole } from "../middleware/authorize.js";
import { uploadCompanyLogo, uploadProfileImage } from "../middleware/upload.js";
import { handleValidationErrors } from "../middleware/validateResult.js";
import { GENDERS } from "../model/user.js";
import {
  signup,
  login,
  viewProfile,
  viewAllUsers,
  deleteUser,
  updateUser,
  companySignup,
  viewCompanies,
  viewSingleCompany,
  deleteCompany,
  updateCompany,
  googleLogin,
  googleCompanyLogin,
  forgotPassword,
  resetPassword,
  verifyOtp,
  updateOwnProfile,
  generateProfileBio,
} from "../controllers/authController.js";

const authroutes = express.Router();

// Shared Password Validation Rules for Signup
const passwordValidationRules = body("password")
  .notEmpty().withMessage("Password is required")
  .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
  .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
  .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
  .matches(/[0-9]/).withMessage("Password must contain at least one number")
  .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character");

// User Signup Validation Rules
const signupValidation = [
  body("email").trim().isEmail().withMessage("Please provide a valid email address"),
  passwordValidationRules,
  body("firstName").trim().notEmpty().withMessage("First name is required").isLength({ min: 2, max: 50 })
  .withMessage("First name must be between 2 and 50 characters").matches(/^[A-Za-z\s]+$/).withMessage("First name should only contain letters"),
  body("lastName")
    .trim()
    .notEmpty().withMessage("Last name is required")
    .isLength({ min: 1, max: 50 }).withMessage("Last name must be between 1 and 50 characters")
    .matches(/^[A-Za-z\s]+$/).withMessage("Last name should only contain letters"),
  body("number")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^[0-9]+$/).withMessage("Phone number must contain only digits")
    .isLength({ min: 10, max: 10 }).withMessage("Phone number must be exactly 10 digits"),
  body("gender")
    .trim()
    .notEmpty().withMessage("Gender is required")
    .isIn(GENDERS).withMessage("Please select a valid gender option"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("district").trim().notEmpty().withMessage("District is required"),
  body("place").trim().notEmpty().withMessage("Place is required"),
  body("pincode")
    .trim()
    .notEmpty()
    .withMessage("Pincode is required")
    .matches(/^[0-9]{6}$/)
    .withMessage("Pincode must be exactly 6 digits"),
  handleValidationErrors,
];

// User/Company Login Validation Rules
const loginValidation = [
  body("email").trim().isEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Company Signup Validation Rules
const companySignupValidation = [
  body("email").trim().isEmail().withMessage("Please provide a valid email address"),
  passwordValidationRules,
  body("companyName").trim().notEmpty().withMessage("Company name is required"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("district").trim().notEmpty().withMessage("District is required"),
  body("pincode")
    .trim()
    .notEmpty()
    .withMessage("Pincode is required")
    .matches(/^[0-9]{6}$/)
    .withMessage("Pincode must be exactly 6 digits"),
  body("contactNumber")
    .trim()
    .notEmpty().withMessage("Contact number is required")
    .matches(/^[0-9]+$/).withMessage("Contact number must contain only digits")
    .isLength({ min: 10, max: 10 }).withMessage("Contact number must be exactly 10 digits"),
  body("regNumber")
    .trim()
    .notEmpty().withMessage("Registration number is required"),
  body("gstNumber")
    .trim()
    .notEmpty().withMessage("GST number is required")
    .toUpperCase()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/).withMessage("Please enter a valid 15-digit GSTIN (e.g. 22AAAAA0000A1Z5)"),
  handleValidationErrors,
];

// User Signup
authroutes.post('/signup', uploadProfileImage.single("image"), signupValidation, signup);

// Company / Seller Signup
authroutes.post('/companysignup', uploadCompanyLogo.single("image"), companySignupValidation, companySignup);

// User/Company Login
authroutes.post('/login', loginValidation, login);

// Google Login (User)
authroutes.post('/google', googleLogin);

// Google Login/Signup (Company / Seller)
authroutes.post('/google-company', googleCompanyLogin);

// Forgot / Reset Password
authroutes.post('/forgot-password', forgotPassword);
authroutes.post('/verify-otp', verifyOtp);
authroutes.post('/reset-password', resetPassword);

// Profile Bio Generation (Protected)
authroutes.post('/generate-bio', checkauth, generateProfileBio);

// View Logged In Profile (User or Seller)
authroutes.get('/viewinfo', checkauth, viewProfile);

// Update Logged In Profile (User or Seller, supporting profile picture upload)
authroutes.put('/updateprofile', checkauth, uploadProfileImage.single("image"), updateOwnProfile);


// View All Users (Admin Only)
authroutes.get('/view', checkauth, checkRole("admin"), viewAllUsers);

// Delete User (Admin Only)
authroutes.delete('/delete/:id', checkauth, checkRole("admin"), deleteUser);

// Update Profile
authroutes.put('/update/:id', checkauth, updateUser);



// View All Companies (Admin, Seller)
authroutes.get('/viewcompany', checkauth, checkRole("admin", "seller"), viewCompanies);

// View Single Company
authroutes.get('/viewonecompany/:id', checkauth, viewSingleCompany);

// Delete Company (Admin, Seller)
authroutes.delete('/deletecompany/:id', checkauth, checkRole("admin", "seller"), deleteCompany);

// Update Company Info (Admin, Seller)
authroutes.put('/updatecompany/:id', checkauth, checkRole("admin", "seller"), updateCompany);

export default authroutes;
