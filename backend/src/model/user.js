import mongoose from "mongoose";

export const GENDERS = ["Male", "Female", "Other"];

const userSchema = new mongoose.Schema({
  loginId: { type: mongoose.Types.ObjectId, ref: "Login", required: true },
  firstName: {
    type: String, required: true, trim: true, minLength: 2,
    maxLength: 50, match: /^[A-Za-z\s]+$/
  },
  lastName: {
    type: String, required: true, trim: true, minLength: 1,
    maxLength: 50, match: /^[A-Za-z\s]+$/
  },
  number: {
    type: String, required: true, trim: true, minLength: 10,
    maxLength: 10, match: /^[0-9]+$/
  },
  gender: { type: String, required: true, enum: GENDERS, trim: true },
  state: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true, match: /^[0-9]{6}$/ },
  place: { type: String, required: true, trim: true },
  role: { type: String, required: true, default: "user", trim: true },
  image: { type: String, trim: true },
  image: { type: String, trim: true, default: "" },
  bio: { type: String, trim: true, default: "" },
});

const User = mongoose.model("User", userSchema);
export default User;
