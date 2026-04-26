const express = require("express");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/auth");
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }
    return await MemberController.SaveLogic1(req, res);
  },
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }
    return await MemberController.SaveLogic2(req, res);
  },
);

module.exports = router;
