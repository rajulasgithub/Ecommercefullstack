const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  loginId: { type: mongoose.Types.ObjectId, ref: "login" },
  firstname: { type: String, required: true },
  number: { type: Number, required: true },
  gender: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  pincode: { type: Number, required: true },
  place: { type: String, required: true },
});

const userDB = mongoose.model("registration", userSchema);
module.exports = userDB;
