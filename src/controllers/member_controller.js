const MemberService = require("../services/member_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");
const { ToMemberUpdateDto } = require("../mappers/member_mapper");

const SaveLogic1 = AsyncHandler(async (req, res) => {
  const user = await MemberService.SaveLogic1(req.user.memIdx, req.body);
  return Ok(res, {
    message: "프로필이 업데이트되었습니다.",
    user: ToMemberUpdateDto(user),
  });
});

const SaveLogic2 = AsyncHandler(async (req, res) => {
  await MemberService.SaveLogic2(req.user.memIdx, req.body);
  return Ok(res, { message: "비밀번호가 변경되었습니다." });
});

module.exports = {
  SaveLogic1,
  SaveLogic2,
};
