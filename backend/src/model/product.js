import mongoose from "mongoose";

export const MATERIALS = [
  "Cotton",
  "Silk",
  "Georgette",
  "Polyester",
  "Wool",
  "Linen",
  "Denim",
  "Velvet",
  "Chiffon",
  "Satin",
  "Rayon",
  "Blend",
  "Other"
];

export const STYLES = [
  "Casual Wear",
  "Party Wear",
  "Ethnic Wear",
  "Formal Wear",
  "Wedding Wear",
  "Sportswear"
];

const productSchema = new mongoose.Schema({
  loginId: { type: mongoose.Schema.Types.ObjectId, ref: "login" },
  prdName: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true, default: "", minlength: 10, maxlength: 1000 },
  category: { type: String, required: true, trim: true, enum: ["Men", "Women", "Kids", "Unisex"] },
  style: {
    type: String,
    required: true,
    trim: true,
    enum: STYLES,
  },
  image: { type: [String], required: true },
  prize: { type: Number, required: true, min: [0.01, "Price must be greater than 0"] },
  size: { type: String, required: true, trim: true },
  stock: { type: String, required: true, trim: true },
  material: {
    type: String,
    required: true,
    trim: true,
    enum: MATERIALS
  },
  status: { type: String, required: true, trim: true, default: "active" },
});

const productDB = mongoose.model("Product", productSchema);
export default productDB;
