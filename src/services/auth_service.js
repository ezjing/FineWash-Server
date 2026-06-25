const jwt = require("jsonwebtoken");
const { Member } = require("../models");
const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");
const MemberRepository = require("../repositories/member_repository");

const generateToken = (memIdx) => {
  return jwt.sign({ memIdx }, process.env.JWT_SECRET || "default-secret-key", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const SaveLogic1 = async (body) => {
  const {
    name,
    email,
    phone,
    password,
    user_id,
    address,
    address_detail,
    member_type,
  } = body || {};

  await MemberRepository.AssertEmailAvailable(email);

  const user = await Member.create({
    name,
    email,
    phone,
    password,
    address,
    address_detail,
    member_type,
    user_id,
  });

  const token = generateToken(user.mem_idx);
  return { user, token };
};

const SaveLogic2 = async (body) => {
  const { email, password } = body || {};

  const user = await MemberRepository.FindByEmail(email, {
    withPassword: true,
  });
  if (!user) ThrowFromCode(CODES.AUTH.INVALID_LOGIN);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) ThrowFromCode(CODES.AUTH.INVALID_LOGIN);

  const token = generateToken(user.mem_idx);
  return { user, token };
};

const SearchLogic1 = async (memIdx) => {
  return MemberRepository.FindById(memIdx, CODES.AUTH.MEMBER_NOT_FOUND);
};

module.exports = {
  SaveLogic1,
  SaveLogic2,
  SearchLogic1,
};
