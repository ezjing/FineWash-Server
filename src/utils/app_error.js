class AppError extends Error {
  constructor(code, statusCode, message, meta) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.meta = meta;
  }
}

const IsAppError = (err) => {
  return !!err && (err instanceof AppError || err.name === "AppError");
};

/** error_codes 객체 항목으로 AppError 인스턴스 생성 (미들웨어용, throw 없음) */
const ToAppError = (codeObj, messageOverride, meta) => {
  return new AppError(
    codeObj.code,
    codeObj.status,
    messageOverride ?? codeObj.message,
    meta,
  );
};

/** error_codes 객체 항목으로 AppError를 throw */
const ThrowFromCode = (codeObj, messageOverride, meta) => {
  throw ToAppError(codeObj, messageOverride, meta);
};

module.exports = {
  AppError,
  IsAppError,
  ToAppError,
  ThrowFromCode,
};
