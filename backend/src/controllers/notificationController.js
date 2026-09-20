import Notification from "../model/notification.js";
import { httpError } from "../utils/httpError.js";

// Get notifications for logged-in user/seller
export const getNotifications = async (req, res) => {
  try {
    const loginId = req.userData?.loginId;
    if (!loginId) {
      return httpError(res, 401, "Unauthorized");
    }

    const notifications = await Notification.find({ loginId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ loginId, read: false });

    return res.status(200).json({
      success: true,
      error: false,
      data: notifications,
      unreadCount,
      message: "Notifications fetched successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while fetching notifications", { errorMessage: error.message });
  }
};

// Mark single notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const loginId = req.userData?.loginId;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, loginId },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      return httpError(res, 404, "Notification not found");
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: notification,
      message: "Notification marked as read",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while marking notification as read", { errorMessage: error.message });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const loginId = req.userData?.loginId;

    await Notification.updateMany({ loginId, read: false }, { $set: { read: true } });

    return res.status(200).json({
      success: true,
      error: false,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while marking all notifications as read", { errorMessage: error.message });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const loginId = req.userData?.loginId;

    await Notification.deleteOne({ _id: id, loginId });

    return res.status(200).json({
      success: true,
      error: false,
      message: "Notification deleted",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while deleting notification", { errorMessage: error.message });
  }
};
