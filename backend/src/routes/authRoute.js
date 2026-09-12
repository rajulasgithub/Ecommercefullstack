import express from "express";
import { body } from "express-validator";
import checkauth from "../middleware/checkauth.js";
import { checkRole } from "../middleware/authorize.js";
import { uploadCompanyLogo } from "../middleware/upload.js";
import { handleValidationErrors } from "../middleware/validateResult.js";
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
} from "../controllers/authController.js";

const authroutes = express.Router();

// User Signup Validation Rules
const signupValidation = [
  body("email").trim().isEmail().withMessage("Please provide a valid email address"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("number").trim().notEmpty().withMessage("Phone number is required"),
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
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("companyName").trim().notEmpty().withMessage("Company name is required"),
  body("contactNumber").trim().notEmpty().withMessage("Contact number is required"),
  handleValidationErrors,
];

// User Signup
authroutes.post('/signup', signupValidation, signup);

// User/Company Login
authroutes.post('/login', loginValidation, login);

// View Profile (Logged In User)
authroutes.get('/viewinfo', checkauth, viewProfile);

// View All Users (Admin Only)
authroutes.get('/view', checkauth, checkRole("admin"), viewAllUsers);

// Delete User (Admin Only)
authroutes.delete('/delete/:id', checkauth, checkRole("admin"), deleteUser);

// Update Profile
authroutes.put('/update/:id', checkauth, updateUser);

// Company / Seller Signup
authroutes.post('/companysignup', uploadCompanyLogo.single("image"), companySignupValidation, companySignup);

// View All Companies (Admin, Seller)
authroutes.get('/viewcompany', checkauth, checkRole("admin", "seller"), viewCompanies);

// View Single Company
authroutes.get('/viewonecompany/:id', checkauth, viewSingleCompany);

// Delete Company (Admin, Seller)
authroutes.delete('/deletecompany/:id', checkauth, checkRole("admin", "seller"), deleteCompany);

// Update Company Info (Admin, Seller)
authroutes.put('/updatecompany/:id', checkauth, checkRole("admin", "seller"), updateCompany);

export default authroutes;
