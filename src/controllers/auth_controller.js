const AuthService = require("../services/auth_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");
const {
  ToSignupUserDto,
  ToUserProfileDto,
} = require("../mappers/member_mapper");

const SaveLogic1 = AsyncHandler(async (req, res) => {
  const { user, token } = await AuthService.SaveLogic1(req.body);
  return Ok(
    res,
    {
      message: "회원가입이 완료되었습니다.",
      token,
      user: ToSignupUserDto(user),
    },
    201,
  );
});

const SaveLogic2 = AsyncHandler(async (req, res) => {
  const { user, token } = await AuthService.SaveLogic2(req.body);
  return Ok(res, {
    message: "로그인 성공",
    token,
    user: ToUserProfileDto(user),
  });
});

const SearchLogic1 = AsyncHandler(async (req, res) => {
  const user = await AuthService.SearchLogic1(req.user.memIdx);
  return Ok(res, { user: ToUserProfileDto(user) });
});

module.exports = {
  SaveLogic1,
  SaveLogic2,
  SearchLogic1,
};
