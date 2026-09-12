import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authroutes from "./src/routes/authRoute.js";
import productRoute from "./src/routes/productRoute.js";
import addressRoute from "./src/routes/addressRoute.js";
import cartRoute from "./src/routes/cartRoute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URL)
  .then((response) => {
    console.log("Database is connected");
    console.log(process.env.MONGO_URL);
  })
  .catch((error) => {
    console.log(error);
    console.log("Database not connected");
  });

app.use("/auth", authroutes);
app.use("/product", productRoute);
app.use("/address", addressRoute);
app.use("/cart", cartRoute);
app.use("/product", cartRoute); // Backward compatibility for frontend calls

app.listen(process.env.PORT, (req, res) => {
  console.log("server is running on: http://localhost:8080");
});

export default app;
