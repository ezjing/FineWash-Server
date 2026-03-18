const MemberService = require("../services/member_service");
const { Ok, Fail } = require("../utils/response");

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
    if (error.statusCode === 404) {
      return Fail(res, 404, "사용자를 찾을 수 없습니다.");
    }
    console.error("Update profile error:", error);
    return Fail(res, 500, "프로필 업데이트 중 오류가 발생했습니다.");
  }
};

const SaveLogic2 = async (req, res) => {
  try {
    await MemberService.SaveLogic2(req.user.memIdx, req.body);
    return Ok(res, {
      message: "비밀번호가 변경되었습니다.",
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return Fail(res, 404, "사용자를 찾을 수 없습니다.");
    }
    if (error.statusCode === 400) {
      return Fail(res, 400, "현재 비밀번호가 올바르지 않습니다.");
    }
    console.error("Change password error:", error);
    return Fail(res, 500, "비밀번호 변경 중 오류가 발생했습니다.");
  }
};

module.exports = {
  SaveLogic1,
  SaveLogic2,
};

