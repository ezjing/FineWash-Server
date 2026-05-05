const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth");
const validateRequest = require("../middlewares/validateRequest");
const MemberController = require("../controllers/member_controller");

const router = express.Router();

// 프로필 업데이트
router.put(
  "/profile",
  authMiddleware,
  [
    body("name").optional().notEmpty().withMessage("이름을 입력해주세요."),
    body("phone").optional().notEmpty().withMessage("전화번호를 입력해주세요."),
  ],
  validateRequest,
  MemberController.SaveLogic1,
);

// 비밀번호 변경
router.put(
  "/password",
  authMiddleware,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("현재 비밀번호를 입력해주세요."),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("새 비밀번호는 6자 이상이어야 합니다."),
  ],
  validateRequest,
  MemberController.SaveLogic2,
);

module.exports = router;
