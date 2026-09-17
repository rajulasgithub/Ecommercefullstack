import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  loginId: { type: mongoose.Types.ObjectId, ref: "login" },
  image: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  pincode: { type: Number, required: true },
  contactNumber: { type: Number, required: true },
  regNumber: { type: Number, required: true },
  gstNumber: { type: Number, required: true },
  role: { type: String, required: true, default: "seller", trim: true },
  bio: { type: String, trim: true, default: "" },
});

const companyDB = mongoose.model("Company", companySchema);
export default companyDB;
