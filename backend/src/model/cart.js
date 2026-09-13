import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  loginId: { type: mongoose.Types.ObjectId, ref: "login" },
  prdId: { type: mongoose.Types.ObjectId, ref: "productlist" },
  quantity: { type: Number, required: true },
  status: { type: Number, required: true },
  date: { type: String, trim: true },
  time: { type: String, trim: true },
  deliveryDate: { type: String, trim: true },
  payment: { type: String, trim: true },
});

const cartDB = mongoose.model("Cart", cartSchema);
export default cartDB;