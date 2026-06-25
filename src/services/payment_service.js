const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const SaveLogic1 = async (body) => {
  const { imp_uid, merchant_uid, amount } = body || {};

  if (!imp_uid || !merchant_uid || amount == null) {
    ThrowFromCode(CODES.COMMON.BAD_REQUEST, "결제 검증에 필요한 정보가 부족합니다.");
  }

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("결제 검증 요청:", { imp_uid, merchant_uid, amount });
  }

  // TODO: 포트원 REST API로 서버 사이드 검증 연동
  return {
    verified: true,
    message: "결제가 검증되었습니다.",
    payment: { imp_uid, merchant_uid, amount },
  };
};

module.exports = {
  SaveLogic1,
};
