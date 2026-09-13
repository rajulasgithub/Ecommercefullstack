import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  prdName: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true, default: "" },
  category: { type: String, required: true, trim: true, enum: ["Men", "Women", "Kids", "Unisex"], default: "Women" },
  style: { type: String, required: true, trim: true, default: "Casual Wear" },
  image: { type: [String], required: true },
  prize: { type: Number, required: true },
  size: { type: String, required: true, trim: true },
  stock: { type: Number, required: true, default: 0 },
  material: { type: String, required: true, trim: true },
  status: { type: Number, required: true, default: 0 },
});

const productDB = mongoose.model("Product", productSchema);
export default productDB;
