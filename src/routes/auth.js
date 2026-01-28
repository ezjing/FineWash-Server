const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { Member } = require("../models");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// 토큰 생성 함수
const generateToken = (memIdx) => {
  return jwt.sign({ memIdx }, process.env.JWT_SECRET || "default-secret-key", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

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
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { name, email, phone, password, user_id, address, address_detail } =
        req.body;

      // 이메일 중복 확인
      const existingUser = await Member.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "이미 등록된 이메일입니다.",
        });
      }

      const fullAddress = `${address} ${address_detail}`;
      // 사용자 생성
      const user = await Member.create({
        name,
        email,
        phone,
        password,
        address: fullAddress,
        user_id,
      });

      // 토큰 생성
      const token = generateToken(user.mem_idx);

      res.status(201).json({
        success: true,
        message: "회원가입이 완료되었습니다.",
        token,
        user: {
          id: user.mem_idx,
          userId: user.user_id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        success: false,
        message: "회원가입 중 오류가 발생했습니다.",
      });
    }
  },
);

// 로그인
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("올바른 이메일 형식이 아닙니다."),
    body("password").notEmpty().withMessage("비밀번호를 입력해주세요."),
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

      const { email, password } = req.body;

      // 사용자 찾기 (비밀번호 포함)
      const user = await Member.scope("withPassword").findOne({
        where: { email },
      });

      // 개발 환경: 사용자가 없거나 비밀번호가 맞지 않으면 개발용 사용자로 로그인
      if (!user) {
        // 개발 환경에서는 항상 개발용 사용자로 로그인 허용
        if (process.env.NODE_ENV !== "production") {
          console.log("개발 환경: 사용자 없음, 개발용 사용자로 로그인");

          // 개발용 사용자 정보
          const devUser = {
            mem_idx: 1,
            user_id: "dev_user",
            name: "김민수",
            email: email || "dev@example.com",
            phone: "010-1234-5678",
          };

          // 개발용 토큰 생성
          const token = generateToken(devUser.mem_idx);

          return res.json({
            success: true,
            message: "로그인 성공 (개발 모드)",
            token,
            user: {
              id: devUser.mem_idx,
              userId: devUser.user_id,
              name: devUser.name,
              email: devUser.email,
              phone: devUser.phone,
            },
          });
        }

        // 운영 환경에서는 오류 반환
        return res.status(401).json({
          success: false,
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      }

      // 비밀번호 확인
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        // 개발 환경에서는 비밀번호가 맞지 않아도 개발용 사용자로 로그인 허용
        if (process.env.NODE_ENV !== "production") {
          console.log("개발 환경: 비밀번호 불일치, 개발용 사용자로 로그인");

          const devUser = {
            mem_idx: 1,
            user_id: "dev_user",
            name: "김민수",
            email: email || "dev@example.com",
            phone: "010-1234-5678",
          };

          const token = generateToken(devUser.mem_idx);

          return res.json({
            success: true,
            message: "로그인 성공 (개발 모드)",
            token,
            user: {
              id: devUser.mem_idx,
              userId: devUser.user_id,
              name: devUser.name,
              email: devUser.email,
              phone: devUser.phone,
            },
          });
        }

        return res.status(401).json({
          success: false,
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      }

      // 실제 사용자 로그인 성공
      const token = generateToken(user.mem_idx);

      res.json({
        success: true,
        message: "로그인 성공",
        token,
        user: {
          memIdx: user.mem_idx,
          busMstIdx: user.bus_mst_idx,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          gender: user.gender,
          socialType: user.social_type,
          socialId: user.social_id,
          memberType: user.member_type,
          createdDate: user.create_date,
          updatedDate: user.update_date,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "로그인 중 오류가 발생했습니다.",
      });
    }
  },
);

// 현재 사용자 정보 조회
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await Member.findByPk(req.user.memIdx);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      user: {
        memIdx: user.mem_idx,
        busMstIdx: user.bus_mst_idx,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        socialType: user.social_type,
        socialId: user.social_id,
        memberType: user.member_type,
        createdDate: user.create_date,
        updatedDate: user.update_date,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "사용자 정보 조회 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
