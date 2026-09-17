import express from "express";
import checkauth from "../middleware/checkauth.js";
import {
  addReview,
  checkEligibility,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const reviewRoute = express.Router();

// Public: View product reviews & ratings
reviewRoute.get("/product/:productId", getProductReviews);

// Authenticated: Check if logged-in user can review a product
reviewRoute.get("/eligibility/:productId", checkauth, checkEligibility);

// Authenticated: Submit a review for a purchased product
reviewRoute.post("/add", checkauth, addReview);

// Authenticated: Update an existing review
reviewRoute.put("/update/:reviewId", checkauth, updateReview);

// Authenticated: Delete an existing review
reviewRoute.delete("/delete/:reviewId", checkauth, deleteReview);

export default reviewRoute;
