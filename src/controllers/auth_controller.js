const AuthService = require("../services/auth_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");

const SaveLogic1 = AsyncHandler(async (req, res) => {
  const { user, token } = await AuthService.SaveLogic1(req.body);
  return Ok(
    res,
    {
      message: "회원가입이 완료되었습니다.",
      token,
      user: {
        id: user.mem_idx,
        userId: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    },
    201,
  );
});

const SaveLogic2 = AsyncHandler(async (req, res) => {
  const { user, token } = await AuthService.SaveLogic2(req.body);
  return Ok(res, {
    message: "로그인 성공",
    token,
    user: {
      memIdx: user.mem_idx,
      busMstIdx: user.bus_mst_idx,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      socialType: user.social_type,
      socialId: user.social_id,
      memberType: user.member_type,
      createdDate: user.create_date,
      updatedDate: user.update_date,
    },
  });
});

const SearchLogic1 = AsyncHandler(async (req, res) => {
  const user = await AuthService.SearchLogic1(req.user.memIdx);
  return Ok(res, {
    user: {
      memIdx: user.mem_idx,
      busMstIdx: user.bus_mst_idx,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      socialType: user.social_type,
      socialId: user.social_id,
      memberType: user.member_type,
      createdDate: user.create_date,
      updatedDate: user.update_date,
    },
  });
});

module.exports = {
  SaveLogic1,
  SaveLogic2,
  SearchLogic1,
};
