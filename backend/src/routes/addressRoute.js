import express from "express";
import { body } from "express-validator";
import checkauth from "../middleware/checkauth.js";
import { checkRole } from "../middleware/authorize.js";
import { handleValidationErrors } from "../middleware/validateResult.js";
import {
  addAddress,
  getAddress,
  updateAddress,
  changeDeliveryAddress,
} from "../controllers/addressController.js";

const addressRoute = express.Router();

// Address Validation Rules
const addressValidation = [
  body("address").trim().notEmpty().withMessage("Address field is required"),
  body("state").trim().notEmpty().withMessage("State field is required"),
  body("district").trim().notEmpty().withMessage("District field is required"),
  body("pincode").trim().notEmpty().withMessage("Pincode field is required"),
  body("BuildingNumber").trim().notEmpty().withMessage("Building number is required"),
  handleValidationErrors,
];

// Add Address (User role)
addressRoute.post('/addAddress', checkauth, checkRole("user", "seller", "company", "admin"), addressValidation, addAddress);

// Get Address (User role)
addressRoute.get('/getaddress', checkauth, checkRole("user", "seller", "company", "admin"), getAddress);

// Update Address (User role)
addressRoute.put('/updateaddress', checkauth, checkRole("user", "seller", "company", "admin"), addressValidation, updateAddress);

// Change Delivery Address & Contact (User role)
addressRoute.put('/changedeliveryaddress', checkauth, checkRole("user", "seller", "company", "admin"), changeDeliveryAddress);

export default addressRoute;
