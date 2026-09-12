import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const checkAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Access denied. No authorization token provided."
      });
    }

    let token = authHeader;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (authHeader.includes(' ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Access denied. Malformed token format."
      });
    }

    const secret = process.env.JWT_SECRET || "encryptkey";
    const decodeToken = jwt.verify(token, secret);

    req.userData = {
      loginId: decodeToken.loginId,
      role: decodeToken.role,
      email: decodeToken.email
    };
    next();
  } catch (error) {
    let message = "Authentication failed. Token is invalid or expired.";
    if (error.name === 'TokenExpiredError') {
      message = "Session expired. Please log in again.";
    }

    return res.status(401).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: message
    });
  }
};

export default checkAuth;
