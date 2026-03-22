const MemberService = require("../services/member_service");
const { Ok, Fail } = require("../utils/response");
const { HandleControllerError } = require("../utils/controller_error");

const SaveLogic1 = async (req, res) => {
  try {
    const user = await MemberService.SaveLogic1(req.user.memIdx, req.body);
    return Ok(res, {
      message: "프로필이 업데이트되었습니다.",
      user: {
        id: user.mem_idx,
        userId: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return HandleControllerError(res, error, "프로필 업데이트 중 오류가 발생했습니다.");
  }
};

const SaveLogic2 = async (req, res) => {
  try {
    await MemberService.SaveLogic2(req.user.memIdx, req.body);
    return Ok(res, {
      message: "비밀번호가 변경되었습니다.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return HandleControllerError(res, error, "비밀번호 변경 중 오류가 발생했습니다.");
  }
};

module.exports = {
  SaveLogic1,
  SaveLogic2,
};

