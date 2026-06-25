const { Member } = require("../models");
const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");
const MemberRepository = require("../repositories/member_repository");

const SaveLogic1 = async (memIdx, body) => {
  const { name, phone, address, address_detail, gender } = body || {};
  const updateData = {};

  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (address !== undefined) updateData.address = address;
  if (address_detail !== undefined) updateData.address_detail = address_detail;
  if (gender !== undefined) updateData.gender = gender;

  const [updatedCount] = await Member.update(updateData, {
    where: { mem_idx: memIdx },
  });
  if (updatedCount === 0) ThrowFromCode(CODES.MEMBER.MEMBER_NOT_FOUND);

  return MemberRepository.FindById(memIdx);
};

const SaveLogic2 = async (memIdx, body) => {
  const { currentPassword, newPassword } = body || {};
  const user = await MemberRepository.FindByIdWithPassword(memIdx);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) ThrowFromCode(CODES.MEMBER.INVALID_CURRENT_PASSWORD);

  user.password = newPassword;
  await user.save();
  return true;
};

module.exports = {
  SaveLogic1,
  SaveLogic2,
};
