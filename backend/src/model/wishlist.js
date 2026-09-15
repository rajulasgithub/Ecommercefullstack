import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    loginId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      required: true,
    },
    prdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    }
  },
  { timestamps: true }
);

const wishlistDB = mongoose.model("wishlist", wishlistSchema);

export default wishlistDB;
