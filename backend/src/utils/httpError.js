/**
 * Utility module to handle HTTP error responses consistently across controllers.
 */

export class HttpError extends Error {
  constructor(message, statusCode = 500, extra = {}) {
    super(message);
    this.statusCode = statusCode;
    this.extra = extra;
  }
}

/**
 * Sends a standardized HTTP error response.
 *
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {string} message - Error message
 * @param {Object} extra - Optional extra payload properties (e.g. errorMessage)
 */
export const httpError = (res, statusCode = 500, message = "Internal server error", extra = {}) => {
  return res.status(statusCode).json({
    success: false,
    error: true,
    message,
    ...extra,
  });
};

export default httpError;
