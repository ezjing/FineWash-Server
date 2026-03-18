const AuthService = require("../services/auth_service");
const { Ok, Fail } = require("../utils/response");

const SaveLogic1 = async (req, res) => {
  try {
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
  } catch (error) {
    if (error.statusCode === 400) {
      return Fail(res, 400, "이미 등록된 이메일입니다.");
    }
    console.error("Signup error:", error);
    return Fail(res, 500, "회원가입 중 오류가 발생했습니다.");
  }
};

const SaveLogic2 = async (req, res) => {
  try {
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
  } catch (error) {
    if (error.statusCode === 401) {
      return Fail(res, 401, "이메일 또는 비밀번호가 올바르지 않습니다.");
    }
    console.error("Login error:", error);
    return Fail(res, 500, "로그인 중 오류가 발생했습니다.");
  }
};

const SearchLogic1 = async (req, res) => {
  try {
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
  } catch (error) {
    if (error.statusCode === 404) {
      return Fail(res, 404, "사용자를 찾을 수 없습니다.");
    }
    console.error("Get me error:", error);
    return Fail(res, 500, "사용자 정보 조회 중 오류가 발생했습니다.");
  }
};

module.exports = {
  SaveLogic1,
  SaveLogic2,
  SearchLogic1,
};

