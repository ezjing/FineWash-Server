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

module.exports = {
  AppError,
  IsAppError,
};

