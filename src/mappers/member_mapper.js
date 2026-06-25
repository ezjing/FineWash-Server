const ToSignupUserDto = (user) => ({
  id: user.mem_idx,
  userId: user.user_id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  memberType: user.member_type,
});

const ToUserProfileDto = (user) => ({
  memIdx: user.mem_idx,
  busMstIdx: user.bus_mst_idx,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  addressDetail: user.address_detail,
  gender: user.gender,
  socialType: user.social_type,
  socialId: user.social_id,
  memberType: user.member_type,
  createdDate: user.create_date,
  updatedDate: user.update_date,
});

const ToMemberUpdateDto = (user) => ({
  id: user.mem_idx,
  userId: user.user_id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  addressDetail: user.address_detail,
  gender: user.gender,
});

module.exports = {
  ToSignupUserDto,
  ToUserProfileDto,
  ToMemberUpdateDto,
};
