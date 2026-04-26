const { Fail } = require("../utils/response");
const ERROR_CODES = require("../utils/error_codes");

const notFound = (req, res) => {
  return Fail(
    res,
    ERROR_CODES.COMMON.NOT_FOUND.status,
    ERROR_CODES.COMMON.NOT_FOUND.message,
    { code: ERROR_CODES.COMMON.NOT_FOUND.code },
  );
};

module.exports = notFound;
