const jwt = require("jsonwebtoken");
const { Member } = require("../models");

const generateToken = (memIdx) => {
  return jwt.sign({ memIdx }, process.env.JWT_SECRET || "default-secret-key", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const SaveLogic1 = async (body) => {
  const { name, email, phone, password, user_id, address, address_detail } = body || {};

  const existingUser = await Member.findOne({ where: { email } });
  if (existingUser) {
    const err = new Error("DUPLICATE_EMAIL");
    err.statusCode = 400;
    throw err;
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
    const err = new Error("INVALID_LOGIN");
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error("INVALID_LOGIN");
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken(user.mem_idx);
  return { user, token };
};

const SearchLogic1 = async (memIdx) => {
  const user = await Member.findByPk(memIdx);
  if (!user) {
    const err = new Error("NOT_FOUND_MEMBER");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

module.exports = {
  generateToken,
  SaveLogic1,
  SaveLogic2,
  SearchLogic1,
};

