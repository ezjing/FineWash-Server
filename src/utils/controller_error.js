const { Fail } = require("./response");
const { IsAppError } = require("./app_error");

const HandleControllerError = (res, err, fallbackMessage) => {
  if (IsAppError(err)) {
    return Fail(res, err.statusCode || 500, err.message, { code: err.code, meta: err.meta });
  }

  const message = fallbackMessage || "서버 오류가 발생했습니다.";
  return Fail(res, 500, message);
};

module.exports = {
  HandleControllerError,
};

