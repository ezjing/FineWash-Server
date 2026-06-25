const PaymentService = require("../services/payment_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");
const { MapPaymentResult } = require("../mappers/payment_mapper");

const SaveLogic1 = AsyncHandler(async (req, res) => {
  const result = await PaymentService.SaveLogic1(req.body);
  return Ok(res, MapPaymentResult(result));
});

module.exports = {
  SaveLogic1,
};
