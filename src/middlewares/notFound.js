const { Fail } = require("../utils/response");
const { ToAppError } = require("../utils/app_error");
const ERROR_CODES = require("../utils/error_codes");

const notFound = (req, res) => {
  const err = ToAppError(ERROR_CODES.COMMON.NOT_FOUND);
  return Fail(res, err.statusCode, err.message, { code: err.code });
};

module.exports = notFound;
