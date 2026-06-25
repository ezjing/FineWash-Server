const MapPaymentResult = (result) => ({
  verified: result.verified,
  message: result.message,
  payment: result.payment,
});

module.exports = {
  MapPaymentResult,
};
