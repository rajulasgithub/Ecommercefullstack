const express = require("express");
const checkauth = require("../middleware/checkauth");
const { checkRole } = require("../middleware/authorize");
const { uploadCompanyLogo } = require("../middleware/upload");
const ROLES = require("../config/roles");
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
authroutes.get('/view', checkauth, checkRole(ROLES.ADMIN), viewAllUsers);

// Delete User (Admin Only)
authroutes.delete('/delete/:id', checkauth, checkRole(ROLES.ADMIN), deleteUser);

// Update Profile
authroutes.put('/update/:id', checkauth, updateUser);

// Company Signup
authroutes.post('/companysignup', uploadCompanyLogo.single("image"), companySignup);

// View All Companies (Admin/Company)
authroutes.get('/viewcompany', checkauth, checkRole(ROLES.ADMIN, ROLES.COMPANY), viewCompanies);

// View Single Company
authroutes.get('/viewonecompany/:id', checkauth, viewSingleCompany);

// Delete Company (Admin/Company)
authroutes.delete('/deletecompany/:id', checkauth, checkRole(ROLES.ADMIN, ROLES.COMPANY), deleteCompany);

// Update Company Info
authroutes.put('/updatecompany/:id', checkauth, checkRole(ROLES.ADMIN, ROLES.COMPANY), updateCompany);

module.exports = authroutes;
