const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new AppError(
          CODES.AUTH.MISSING_TOKEN.code,
          CODES.AUTH.MISSING_TOKEN.status,
          CODES.AUTH.MISSING_TOKEN.message,
        ),
      );
    }

    const token = authHeader.split(" ")[1];

    // 개발 환경에서만 Mock 토큰 허용
    const isDev = process.env.NODE_ENV === "development";
    if (isDev && token.startsWith("mock_dev_token_")) {
      req.user = {
        memIdx: 1,
        userId: "dev_user",
      };
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
      return next(
        new AppError(
          CODES.AUTH.TOKEN_EXPIRED.code,
          CODES.AUTH.TOKEN_EXPIRED.status,
          CODES.AUTH.TOKEN_EXPIRED.message,
        ),
      );
    }
    return next(
      new AppError(
        CODES.AUTH.INVALID_TOKEN.code,
        CODES.AUTH.INVALID_TOKEN.status,
        CODES.AUTH.INVALID_TOKEN.message,
      ),
    );
  }
};

module.exports = authMiddleware;
