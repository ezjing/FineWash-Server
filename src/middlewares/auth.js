const jwt = require("jsonwebtoken");
const { ToAppError } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(ToAppError(CODES.AUTH.MISSING_TOKEN));
    }

    const token = authHeader.split(" ")[1];

    const isDev = process.env.NODE_ENV === "development";
    if (isDev && token.startsWith("mock_dev_token_")) {
      req.user = { memIdx: 1, userId: "dev_user" };
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default-secret-key",
    );

    req.user = {
      memIdx: decoded.memIdx || decoded.userId,
      userId: decoded.userId,
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(ToAppError(CODES.AUTH.TOKEN_EXPIRED));
    }
    return next(ToAppError(CODES.AUTH.INVALID_TOKEN));
  }
};

module.exports = authMiddleware;
