import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  prdName: { type: String, required: true, trim: true },
  image: { type: [String], required: true },
  prize: { type: Number, required: true },
  size: { type: String, required: true, trim: true },
  material: { type: String, required: true, trim: true },
  status: { type: Number, required: true },
});

const productDB = mongoose.model("Product", productSchema);
export default productDB;
