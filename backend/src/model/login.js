import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const loginDB = mongoose.model("Login", loginSchema);
export default loginDB;