const jwt = require("jsonwebtoken");
const { Member } = require("../models");
const { AppError } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const generateToken = (memIdx) => {
  return jwt.sign({ memIdx }, process.env.JWT_SECRET || "default-secret-key", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const SaveLogic1 = async (body) => {
  const { name, email, phone, password, user_id, address, address_detail } = body || {};

  const existingUser = await Member.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError(
      CODES.AUTH.DUPLICATE_EMAIL.code,
      CODES.AUTH.DUPLICATE_EMAIL.status,
      CODES.AUTH.DUPLICATE_EMAIL.message,
    );
  }

  const fullAddress = `${address} ${address_detail}`;
  const user = await Member.create({
    name,
    email,
    phone,
    password,
    address: fullAddress,
    user_id,
  });

  const token = generateToken(user.mem_idx);
  return { user, token };
};

const SaveLogic2 = async (body) => {
  const { email, password } = body || {};

  const user = await Member.scope("withPassword").findOne({
    where: { email },
  });
  if (!user) {
    throw new AppError(
      CODES.AUTH.INVALID_LOGIN.code,
      CODES.AUTH.INVALID_LOGIN.status,
      CODES.AUTH.INVALID_LOGIN.message,
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError(
      CODES.AUTH.INVALID_LOGIN.code,
      CODES.AUTH.INVALID_LOGIN.status,
      CODES.AUTH.INVALID_LOGIN.message,
    );
  }

  const token = generateToken(user.mem_idx);
  return { user, token };
};

const SearchLogic1 = async (memIdx) => {
  const user = await Member.findByPk(memIdx);
  if (!user) {
    throw new AppError(
      CODES.AUTH.MEMBER_NOT_FOUND.code,
      CODES.AUTH.MEMBER_NOT_FOUND.status,
      CODES.AUTH.MEMBER_NOT_FOUND.message,
    );
  }
  return user;
};

module.exports = {
  SaveLogic1,
  SaveLogic2,
  SearchLogic1,
};

