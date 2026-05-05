const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth");
const validateRequest = require("../middlewares/validateRequest");
const AuthController = require("../controllers/auth_controller");

const router = express.Router();

// 회원가입
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("이름은 필수입니다."),
    body("email").isEmail().withMessage("올바른 이메일 형식이 아닙니다."),
    body("phone").notEmpty().withMessage("전화번호는 필수입니다."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("비밀번호는 6자 이상이어야 합니다."),
  ],
  validateRequest,
  AuthController.SaveLogic1,
);

// 로그인
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("올바른 이메일 형식이 아닙니다."),
    body("password").notEmpty().withMessage("비밀번호를 입력해주세요."),
  ],
  validateRequest,
  AuthController.SaveLogic2,
);

// 현재 사용자 정보 조회
router.get("/me", authMiddleware, AuthController.SearchLogic1);

module.exports = router;
