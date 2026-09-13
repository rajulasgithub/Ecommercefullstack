import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, required: true, trim: true },
});

loginSchema.index({ email: 1, role: 1 }, { unique: true });

const loginDB = mongoose.model("Login", loginSchema);
export default loginDB;