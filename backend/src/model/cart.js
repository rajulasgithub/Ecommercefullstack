import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
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
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: Number,
      default: 1,
    },

    date: {
      type: String,
      trim: true,
    },

    time: {
      type: String,
      trim: true,
    },

    shippingAddress: {
      address: { type: String, trim: true },
      state: { type: String, trim: true },
      district: { type: String, trim: true },
      pincode: { type: Number },
      BuildingNumber: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

const cartDB = mongoose.model("Cart", cartSchema);

export default cartDB;