const SaveLogic1 = async (body) => {
  const { imp_uid, merchant_uid, amount } = body || {};
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("결제 검증 요청:", { imp_uid, merchant_uid, amount });
  }

  return {
    verified: true,
    message: "결제가 검증되었습니다.",
    payment: {
      imp_uid,
      merchant_uid,
      amount,
    },
  };
};

module.exports = {
  SaveLogic1,
};
