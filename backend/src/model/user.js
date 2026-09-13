import mongoose from "mongoose";

export const GENDERS = ["Male", "Female", "Other"];

const userSchema = new mongoose.Schema({
  loginId: { type: mongoose.Types.ObjectId, ref: "login" },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  number: { type: Number, required: true },
  gender: { type: String, required: true, enum: GENDERS, trim: true },
  state: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  pincode: { type: Number, required: true },
  place: { type: String, required: true, trim: true },
  role: { type: String, required: true, default: "user", trim: true },
});

const userDB = mongoose.model("User", userSchema);
export default userDB;
