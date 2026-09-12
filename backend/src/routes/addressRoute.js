const express = require("express");
const checkauth = require("../middleware/checkauth");
const { checkRole } = require("../middleware/authorize");
const {
  addAddress,
  getAddress,
  updateAddress,
  changeDeliveryAddress,
} = require("../controllers/addressController");

const addressRoute = express.Router();

// Add Address (User role)
addressRoute.post('/addAddress', checkauth, checkRole("user"), addAddress);

// Get Address (User role)
addressRoute.get('/getaddress', checkauth, checkRole("user"), getAddress);

// Update Address (User role)
addressRoute.put('/updateaddress', checkauth, checkRole("user"), updateAddress);

// Change Delivery Address & Contact (User role)
addressRoute.put('/changedeliveryaddress', checkauth, checkRole("user"), changeDeliveryAddress);

module.exports = addressRoute;
