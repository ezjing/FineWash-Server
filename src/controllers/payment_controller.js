const PaymentService = require("../services/payment_service");
const { Ok, Fail } = require("../utils/response");

const SaveLogic1 = async (req, res) => {
  try {
    const result = await PaymentService.SaveLogic1(req.body);
    return Ok(res, {
      verified: result.verified,
      message: result.message,
      payment: result.payment,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return Fail(res, 500, "결제 검증 중 오류가 발생했습니다.", { verified: false });
  }
};

module.exports = {
  SaveLogic1,
};

