const express = require("express");
const { body } = require("express-validator");
const validateRequest = require("../middlewares/validateRequest");
const PaymentController = require("../controllers/payment_controller");

const router = express.Router();

// 포트원 결제 검증 API
// 실제 운영 시에는 포트원 REST API를 사용하여 서버에서 검증해야 함
router.post(
  "/verify",
  [
    body("imp_uid").notEmpty().withMessage("결제 고유번호가 필요합니다."),
    body("merchant_uid").notEmpty().withMessage("주문 고유번호가 필요합니다."),
    body("amount").isInt({ min: 1 }).withMessage("결제 금액이 필요합니다."),
  ],
  validateRequest,
  PaymentController.SaveLogic1,
);

module.exports = router;
