import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  loginId: { type: mongoose.Types.ObjectId, ref: "login" },
  address: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  pincode: { type: Number, required: true },
  BuildingNumber: { type: Number, required: true },
});

const addressDB = mongoose.model("Address", addressSchema);
export default addressDB;