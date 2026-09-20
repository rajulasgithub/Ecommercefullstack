import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    loginId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "login",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["product_deleted", "product_updated", "status_changed", "general"],
      default: "general",
    },
    actionBy: {
      type: String,
      default: "Admin",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("notification", notificationSchema);

export default Notification;
