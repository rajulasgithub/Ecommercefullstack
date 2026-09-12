import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  loginId: { type: mongoose.Types.ObjectId, ref: "login" },
  prdId: { type: mongoose.Types.ObjectId, ref: "productlist" },
  quantity: { type: Number, required: true },
  status: { type: Number, required: true },
  date: { type: String },
  time: { type: String },
  deliveryDate: { type: String },
  payment: { type: String },
});

const cartDB = mongoose.model("cartlist", cartSchema);
export default cartDB;