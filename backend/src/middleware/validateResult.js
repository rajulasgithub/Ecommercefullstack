import { validationResult } from "express-validator";

/**
 * Reusable middleware to inspect express-validator results
 * and return structured 400 Bad Request responses on validation failures.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: true,
      errors: errors.array(),
      message: errors.array()[0].msg,
    });
  }
  next();
};
