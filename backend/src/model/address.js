import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  loginId: { type: mongoose.Types.ObjectId, ref: "login" },
  address: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  pincode: { type: Number, required: true },
  BuildingNumber: { type: Number, required: true },
});

const addressDB = mongoose.model("addresslist", addressSchema);
export default addressDB;