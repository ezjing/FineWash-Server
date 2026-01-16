const express = require("express");
const { body, validationResult } = require("express-validator");

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
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { imp_uid, merchant_uid, amount } = req.body;

      // TODO: 실제 운영 시에는 포트원 REST API를 사용하여 검증
      // 현재는 개발 환경을 위한 간단한 검증 로직
      // 포트원 REST API 사용 예시:
      // const response = await axios.get(
      //   `https://api.iamport.kr/payments/${imp_uid}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${access_token}`,
      //     },
      //   }
      // );
      // const payment = response.data.response;
      // if (payment.status !== 'paid' || payment.amount !== amount) {
      //   return res.status(400).json({ success: false, verified: false });
      // }

      // 개발 환경: 간단한 검증 (실제 운영 시 반드시 포트원 API로 검증)
      console.log("결제 검증 요청:", { imp_uid, merchant_uid, amount });

      // 개발 환경에서는 항상 성공으로 처리
      // 실제 운영 시에는 위의 주석 처리된 코드를 사용하여 포트원 API로 검증
      res.json({
        success: true,
        verified: true,
        message: "결제가 검증되었습니다.",
        payment: {
          imp_uid,
          merchant_uid,
          amount,
        },
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({
        success: false,
        verified: false,
        message: "결제 검증 중 오류가 발생했습니다.",
      });
    }
  }
);

module.exports = router;
