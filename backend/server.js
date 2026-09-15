import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/connectDB.js";
import authroutes from "./src/routes/authRoute.js";
import productRoute from "./src/routes/productRoute.js";
import addressRoute from "./src/routes/addressRoute.js";
import cartRoute from "./src/routes/cartRoute.js";
import orderRoute from "./src/routes/orderRoute.js";
import wishlistRoute from "./src/routes/wishlistRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB Database
connectDB();

app.use("/auth", authroutes);
app.use("/product", productRoute);
app.use("/address", addressRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);
app.use("/cart", orderRoute); // Fallback for backward compatibility
app.use("/wishlist", wishlistRoute);

app.listen(process.env.PORT, (req, res) => {
  console.log(`server is running on: http://localhost:${process.env.PORT}`);
});

export default app;
