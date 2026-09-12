import express from "express";
import checkauth from "../middleware/checkauth.js";
import { checkRole } from "../middleware/authorize.js";
import {
  addAddress,
  getAddress,
  updateAddress,
  changeDeliveryAddress,
} from "../controllers/addressController.js";

const addressRoute = express.Router();

// Add Address (User role)
addressRoute.post('/addAddress', checkauth, checkRole("user"), addAddress);

// Get Address (User role)
addressRoute.get('/getaddress', checkauth, checkRole("user"), getAddress);

// Update Address (User role)
addressRoute.put('/updateaddress', checkauth, checkRole("user"), updateAddress);

// Change Delivery Address & Contact (User role)
addressRoute.put('/changedeliveryaddress', checkauth, checkRole("user"), changeDeliveryAddress);

export default addressRoute;
