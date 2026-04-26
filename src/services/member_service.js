const { Member } = require("../models");
const { AppError } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const SaveLogic1 = async (memIdx, body) => {
  const { name, phone, address, gender } = body || {};
  const updateData = {};

  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (address !== undefined) updateData.address = address;
  if (gender !== undefined) updateData.gender = gender;

  const [updatedCount] = await Member.update(updateData, {
    where: { mem_idx: memIdx },
  });
  if (updatedCount === 0) {
    throw new AppError(
      CODES.MEMBER.MEMBER_NOT_FOUND.code,
      CODES.MEMBER.MEMBER_NOT_FOUND.status,
      CODES.MEMBER.MEMBER_NOT_FOUND.message,
    );
  }

  return Member.findByPk(memIdx);
};

const SaveLogic2 = async (memIdx, body) => {
  const { currentPassword, newPassword } = body || {};
  const user = await Member.scope("withPassword").findByPk(memIdx);
  if (!user) {
    throw new AppError(
      CODES.MEMBER.MEMBER_NOT_FOUND.code,
      CODES.MEMBER.MEMBER_NOT_FOUND.status,
      CODES.MEMBER.MEMBER_NOT_FOUND.message,
    );
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError(
      CODES.MEMBER.INVALID_CURRENT_PASSWORD.code,
      CODES.MEMBER.INVALID_CURRENT_PASSWORD.status,
      CODES.MEMBER.INVALID_CURRENT_PASSWORD.message,
    );
  }

  user.password = newPassword;
  await user.save();
  return true;
};

module.exports = {
  SaveLogic1,
  SaveLogic2,
};
