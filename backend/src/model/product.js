import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  prdName: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true, default: "", minlength: 10, maxlength: 1000 },
  category: { type: String, required: true, trim: true, enum: ["Men", "Women", "Kids", "Unisex"], default: "Women" },
  style: { type: String, required: true, trim: true, default: "Casual Wear" },
  image: { type: [String], required: true },
  prize: { type: Number, required: true, min: [0.01, "Price must be greater than 0"] },
  size: { type: String, required: true, trim: true },
  stock: { type: String, required: true, trim: true, default: "In Stock" },
  material: { type: String, required: true, trim: true },
  status: { type: String, required: true, trim: true, default: "active" },
});

const productDB = mongoose.model("Product", productSchema);
export default productDB;
