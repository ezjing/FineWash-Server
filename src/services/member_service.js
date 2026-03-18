const { Member } = require("../models");

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
    const err = new Error("NOT_FOUND_MEMBER");
    err.statusCode = 404;
    throw err;
  }

  return await Member.findByPk(memIdx);
};

const SaveLogic2 = async (memIdx, body) => {
  const { currentPassword, newPassword } = body || {};
  const user = await Member.scope("withPassword").findByPk(memIdx);
  if (!user) {
    const err = new Error("NOT_FOUND_MEMBER");
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const err = new Error("INVALID_CURRENT_PASSWORD");
    err.statusCode = 400;
    throw err;
  }

  user.password = newPassword;
  await user.save();
  return true;
};

module.exports = {
  SaveLogic1,
  SaveLogic2,
};

