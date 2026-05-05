const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth");
const validateRequest = require("../middlewares/validateRequest");
const ReservationController = require("../controllers/reservation_controller");

const router = express.Router();

// 예약 목록 조회 (SearchLogic1)
router.get("/", authMiddleware, ReservationController.SearchLogic1);

// 예약 상세 조회
router.get("/:id", authMiddleware, ReservationController.SearchLogic2);

// 예약 생성 (SaveLogic1 - 출장세차, SaveLogic2 - 제휴세차장)
router.post(
  "/",
  authMiddleware,
  [
    body("vehicleId").notEmpty().withMessage("차량을 선택해주세요."),
    body("main_option").notEmpty().withMessage("예약 대옵션을 선택해주세요."),
    body("date").notEmpty().withMessage("날짜를 선택해주세요."),
    body("time").notEmpty().withMessage("시간을 선택해주세요."),
  ],
  validateRequest,
  ReservationController.SaveLogic1,
);

// 예약 취소 (contract_yn을 'N'으로 변경)
router.put("/:id/cancel", authMiddleware, ReservationController.SaveLogic2);

module.exports = router;
