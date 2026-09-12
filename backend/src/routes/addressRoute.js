const express = require("express");
const checkauth = require("../middleware/checkauth");
const { checkRole } = require("../middleware/authorize");
const ROLES = require("../config/roles");
const {
  addAddress,
  getAddress,
  updateAddress,
  changeDeliveryAddress,
} = require("../controllers/addressController");

const addressRoute = express.Router();

// Add Address (User)
addressRoute.post('/addAddress', checkauth, checkRole(ROLES.USER), addAddress);

// Get Address (User)
addressRoute.get('/getaddress', checkauth, checkRole(ROLES.USER), getAddress);

// Update Address (User)
addressRoute.put('/updateaddress', checkauth, checkRole(ROLES.USER), updateAddress);

// Change Delivery Address & Contact (User)
addressRoute.put('/changedeliveryaddress', checkauth, checkRole(ROLES.USER), changeDeliveryAddress);

module.exports = addressRoute;
