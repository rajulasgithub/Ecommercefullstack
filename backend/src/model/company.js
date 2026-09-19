import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  loginId: { type: mongoose.Types.ObjectId, ref: "Login" },
  image: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true, match: /^[0-9]{6}$/ },
  contactNumber: {
    type: String, required: true,
    match: /^[0-9]+$/, minLength: 10, maxLength: 10
  },
  regNumber: { type: String, required: true, trim: true, unique: true },
  gstNumber: {
    type: String, required: true, trim: true, uppercase: true, unique: true,
    match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/
  },
  role: { type: String, required: true, default: "seller", trim: true },
  bio: { type: String, trim: true, default: "" },
});

const Company = mongoose.model("Company", companySchema);
export default Company;
