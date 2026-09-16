import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    loginId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Review comment must be at least 2 characters long"],
      maxlength: [1000, "Review comment cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Enforce single review per user per product
reviewSchema.index({ loginId: 1, productId: 1 }, { unique: true });

const reviewDB = mongoose.model("Review", reviewSchema);

export default reviewDB;
