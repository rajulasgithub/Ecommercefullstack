const express = require("express");
const checkauth = require("../middleware/checkauth");
const { checkRole } = require("../middleware/authorize");
const { uploadCompanyLogo } = require("../middleware/upload");
const {
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
} = require("../controllers/authController");

const authroutes = express.Router();

// User Signup
authroutes.post('/signup', signup);

// User/Company Login
authroutes.post('/login', login);

// View Profile (Logged In User)
authroutes.get('/viewinfo', checkauth, viewProfile);

// View All Users (Admin Only)
authroutes.get('/view', checkauth, checkRole("admin"), viewAllUsers);

// Delete User (Admin Only)
authroutes.delete('/delete/:id', checkauth, checkRole("admin"), deleteUser);

// Update Profile
authroutes.put('/update/:id', checkauth, updateUser);

// Company / Seller Signup
authroutes.post('/companysignup', uploadCompanyLogo.single("image"), companySignup);

// View All Companies (Admin, Seller)
authroutes.get('/viewcompany', checkauth, checkRole("admin", "seller"), viewCompanies);

// View Single Company
authroutes.get('/viewonecompany/:id', checkauth, viewSingleCompany);

// Delete Company (Admin, Seller)
authroutes.delete('/deletecompany/:id', checkauth, checkRole("admin", "seller"), deleteCompany);

// Update Company Info (Admin, Seller)
authroutes.put('/updatecompany/:id', checkauth, checkRole("admin", "seller"), updateCompany);

module.exports = authroutes;
