import mongoose from "mongoose";

export const GENDERS = ["Male", "Female", "Other"];

const userSchema = new mongoose.Schema({
  loginId: { type: mongoose.Types.ObjectId, ref: "login" },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  number: { type: Number, required: true },
  gender: { type: String, required: true, enum: GENDERS },
  state: { type: String, required: true },
  district: { type: String, required: true },
  pincode: { type: Number, required: true },
  place: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
});

const userDB = mongoose.model("User", userSchema);
export default userDB;
