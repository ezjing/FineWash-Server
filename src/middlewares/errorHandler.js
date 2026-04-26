const { Fail } = require("../utils/response");
const { IsAppError } = require("../utils/app_error");
const ERROR_CODES = require("../utils/error_codes");

const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === "development";

  // eslint-disable-next-line no-console
  console.error(err?.stack || err);

  if (IsAppError(err)) {
    return Fail(res, err.statusCode || 500, err.message, {
      code: err.code,
      meta: err.meta,
      error: isDev ? err.message : undefined,
    });
  }

  return Fail(
    res,
    500,
    ERROR_CODES?.COMMON?.INTERNAL?.message || "서버 오류가 발생했습니다.",
    { code: ERROR_CODES?.COMMON?.INTERNAL?.code, error: isDev ? err?.message : undefined },
  );
};

module.exports = errorHandler;
