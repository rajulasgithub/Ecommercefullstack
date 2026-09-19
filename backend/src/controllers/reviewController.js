import reviewDB from "../model/review.js";
import cartDB from "../model/cart.js";
import User from "../model/user.js";
import mongoose from "mongoose";
import { httpError } from "../utils/httpError.js";

// Add a Product Review (Verified Purchaser Only)
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const loginId = req.userData.loginId;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return httpError(res, 400, "Valid product ID is required");
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return httpError(res, 400, "Rating must be between 1 and 5 stars");
    }

    if (!comment || typeof comment !== "string" || !comment.trim()) {
      return httpError(res, 400, "Review comment is required");
    }

    // 1. Verify purchase eligibility
    const allUserOrders = await cartDB.find({
      $or: [
        { loginId: loginId },
        { loginId: mongoose.Types.ObjectId.isValid(loginId) ? new mongoose.Types.ObjectId(loginId) : loginId }
      ],
      $or: [
        { prdId: productId },
        { prdId: mongoose.Types.ObjectId.isValid(productId) ? new mongoose.Types.ObjectId(productId) : productId }
      ]
    });

    const purchase = allUserOrders.find((order) => {
      const s = String(order.status).trim().toLowerCase();
      return s !== "1" && s !== "3" && s !== "cancelled" && s !== "in cart";
    });

    if (!purchase) {
      return httpError(res, 403, "You can only submit a review for products you have successfully purchased.");
    }

    // 2. Check for duplicate review
    const existingReview = await reviewDB.findOne({
      $or: [
        { loginId: loginId },
        { loginId: mongoose.Types.ObjectId.isValid(loginId) ? new mongoose.Types.ObjectId(loginId) : loginId }
      ],
      $or: [
        { productId: productId },
        { productId: mongoose.Types.ObjectId.isValid(productId) ? new mongoose.Types.ObjectId(productId) : productId }
      ]
    });

    if (existingReview) {
      return httpError(res, 400, "You have already submitted a review for this product.");
    }

    // 3. Save review
    const newReview = new reviewDB({
      loginId,
      productId,
      rating: numRating,
      comment: comment.trim(),
    });

    await newReview.save();

    return res.status(201).json({
      success: true,
      error: false,
      data: newReview,
      message: "🎉 Thank you! Your review has been submitted successfully.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return httpError(res, 400, "You have already submitted a review for this product.");
    }
    return httpError(res, 500, "Server error while submitting review", { errorMessage: error.message });
  }
};

// Check if user can review a product
export const checkEligibility = async (req, res) => {
  try {
    const { productId } = req.params;
    const loginId = req.userData.loginId;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return httpError(res, 400, "Invalid product ID");
    }

    // Check if user has purchased this product (status not 1/in-cart and not 3/cancelled)
    const allUserOrders = await cartDB.find({
      $or: [
        { loginId: loginId },
        { loginId: mongoose.Types.ObjectId.isValid(loginId) ? new mongoose.Types.ObjectId(loginId) : loginId }
      ],
      $or: [
        { prdId: productId },
        { prdId: mongoose.Types.ObjectId.isValid(productId) ? new mongoose.Types.ObjectId(productId) : productId }
      ]
    });

    const purchase = allUserOrders.find((order) => {
      const s = String(order.status).trim().toLowerCase();
      return s !== "1" && s !== "3" && s !== "cancelled" && s !== "in cart";
    });

    const hasPurchased = !!purchase;

    // Check if user has already reviewed
    const existingReview = await reviewDB.findOne({
      $or: [
        { loginId: loginId },
        { loginId: mongoose.Types.ObjectId.isValid(loginId) ? new mongoose.Types.ObjectId(loginId) : loginId }
      ],
      $or: [
        { productId: productId },
        { productId: mongoose.Types.ObjectId.isValid(productId) ? new mongoose.Types.ObjectId(productId) : productId }
      ]
    });

    return res.status(200).json({
      success: true,
      error: false,
      canReview: hasPurchased && !existingReview,
      hasPurchased,
      alreadyReviewed: !!existingReview,
      userReview: existingReview,
      message: "Review eligibility checked successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Server error checking review eligibility", { errorMessage: error.message });
  }
};

// View Product Reviews (Public)
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return httpError(res, 400, "Invalid product ID");
    }

    const reviews = await reviewDB.find({ productId }).sort({ createdAt: -1 });

    // Populate user profile info for each review
    const enrichedReviews = await Promise.all(
      reviews.map(async (rev) => {
        const userObj = await User.findOne({ loginId: rev.loginId });
        return {
          _id: rev._id,
          productId: rev.productId,
          loginId: rev.loginId,
          rating: rev.rating,
          comment: rev.comment,
          createdAt: rev.createdAt,
          updatedAt: rev.updatedAt,
          user: userObj
            ? {
                firstName: userObj.firstName,
                lastName: userObj.lastName,
                image: userObj.image || "",
              }
            : { firstName: "Verified", lastName: "Buyer", image: "" },
        };
      })
    );

    const totalReviews = reviews.length;
    const ratingSum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : "0.0";

    const ratingDistribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    };

    return res.status(200).json({
      success: true,
      error: false,
      data: enrichedReviews,
      totalReviews,
      averageRating: parseFloat(averageRating),
      ratingDistribution,
      message: "Product reviews retrieved successfully",
    });
  } catch (error) {
    return httpError(res, 500, "Server error while fetching reviews", { errorMessage: error.message });
  }
};
