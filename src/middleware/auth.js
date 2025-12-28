const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "인증 토큰이 필요합니다.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default-secret-key"
    );

    // memIdx로 통일 (기존 userId와 호환)
    req.user = {
      memIdx: decoded.memIdx || decoded.userId,
      userId: decoded.userId, // 하위 호환성
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "토큰이 만료되었습니다.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "유효하지 않은 토큰입니다.",
    });
  }
};

module.exports = authMiddleware;
