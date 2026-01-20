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
    
    // 개발 환경: Mock 토큰 허용 (실제 운영 환경에서는 제거해야 함)
    if (token.startsWith("mock_dev_token_")) {
      // Mock 토큰에서 memIdx 추출 시도
      // 실제로는 항상 memIdx 1을 사용 (개발용)
      req.user = {
        memIdx: 1,
        userId: "dev_user",
      };
      console.log("개발 환경: Mock 토큰 사용");
      return next();
    }

    // 실제 JWT 토큰 검증
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
