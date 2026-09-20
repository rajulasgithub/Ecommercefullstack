import express from "express";
import checkauth from "../middleware/checkauth.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const notificationRoute = express.Router();

notificationRoute.get("/", checkauth, getNotifications);
notificationRoute.put("/read-all", checkauth, markAllAsRead);
notificationRoute.put("/read/:id", checkauth, markAsRead);
notificationRoute.delete("/:id", checkauth, deleteNotification);

export default notificationRoute;
