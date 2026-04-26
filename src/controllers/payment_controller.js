const PaymentService = require("../services/payment_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");

const SaveLogic1 = AsyncHandler(async (req, res) => {
  const result = await PaymentService.SaveLogic1(req.body);
  return Ok(res, { verified: result.verified, message: result.message, payment: result.payment });
});

module.exports = {
  SaveLogic1,
};
