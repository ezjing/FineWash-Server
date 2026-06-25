const { Member } = require("../models");
const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const FindById = async (memIdx, errorCode = CODES.MEMBER.MEMBER_NOT_FOUND) => {
  const user = await Member.findByPk(memIdx);
  if (!user) ThrowFromCode(errorCode);
  return user;
};

const FindByIdWithPassword = async (
  memIdx,
  errorCode = CODES.MEMBER.MEMBER_NOT_FOUND,
) => {
  const user = await Member.scope("withPassword").findByPk(memIdx);
  if (!user) ThrowFromCode(errorCode);
  return user;
};

const FindByEmail = async (email, { withPassword = false } = {}) => {
  const scope = withPassword ? "withPassword" : null;
  const query = scope ? Member.scope(scope) : Member;
  return query.findOne({ where: { email } });
};

const AssertEmailAvailable = async (email) => {
  const existing = await FindByEmail(email);
  if (existing) ThrowFromCode(CODES.AUTH.DUPLICATE_EMAIL);
};

module.exports = {
  FindById,
  FindByIdWithPassword,
  FindByEmail,
  AssertEmailAvailable,
};
