import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  prdName: { type: String, required: true },
  image: { type: [String], required: true },
  prize: { type: Number, required: true },
  size: { type: String, required: true },
  material: { type: String, required: true },
  status: { type: Number, required: true },
});

const productDB = mongoose.model("productlist", productSchema);
export default productDB;
