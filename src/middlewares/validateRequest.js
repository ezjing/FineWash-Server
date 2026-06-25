const { validationResult } = require("express-validator");
const { ToAppError } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const firstMessage =
    errors.array()?.[0]?.msg || CODES.COMMON.BAD_REQUEST.message;
  return next(
    ToAppError(CODES.COMMON.BAD_REQUEST, firstMessage, {
      validation: errors.array(),
    }),
  );
};

module.exports = validateRequest;
