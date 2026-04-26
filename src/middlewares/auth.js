const jwt = require("jsonwebtoken");
const { Fail } = require("../utils/response");
const { AppError } = require("../utils/app_error");
// error_codes에 AUTH 관련 토큰 코드가 없어서, middleware는 고정 code 문자열 사용

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Fail(res, 401, "인증 토큰이 필요합니다.", {
        code: "AUTH.MISSING_TOKEN",
      });
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
      return next(new AppError("AUTH.TOKEN_EXPIRED", 401, "토큰이 만료되었습니다."));
    }
    return next(
      new AppError("AUTH.INVALID_TOKEN", 401, "유효하지 않은 토큰입니다."),
    );
  }
};

module.exports = authMiddleware;
