const express = require("express");
const { body, validationResult } = require("express-validator");
const { Member } = require("../models");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// 프로필 업데이트
router.put(
  "/profile",
  authMiddleware,
  [
    body("name").optional().notEmpty().withMessage("이름을 입력해주세요."),
    body("phone")
      .optional()
      .notEmpty()
      .withMessage("전화번호를 입력해주세요."),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { name, phone, address, gender } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;
      if (gender !== undefined) updateData.gender = gender;

      const [updatedCount] = await Member.update(updateData, {
        where: { mem_idx: req.user.memIdx },
      });

      if (updatedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "사용자를 찾을 수 없습니다.",
        });
      }

      const user = await Member.findByPk(req.user.memIdx);

      res.json({
        success: true,
        message: "프로필이 업데이트되었습니다.",
        user: {
          id: user.mem_idx,
          userId: user.user_id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          gender: user.gender,
        },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "프로필 업데이트 중 오류가 발생했습니다.",
      });
    }
  }
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
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { currentPassword, newPassword } = req.body;

      const user = await Member.scope("withPassword").findByPk(
        req.user.memIdx
      );
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "사용자를 찾을 수 없습니다.",
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "현재 비밀번호가 올바르지 않습니다.",
        });
      }

      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: "비밀번호가 변경되었습니다.",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "비밀번호 변경 중 오류가 발생했습니다.",
      });
    }
  }
);

module.exports = router;

