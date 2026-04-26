module.exports = {
  COMMON: {
    INTERNAL: {
      code: "COMMON.INTERNAL",
      status: 500,
      message: "서버 오류가 발생했습니다.",
    },
    NOT_FOUND: {
      code: "COMMON.NOT_FOUND",
      status: 404,
      message: "요청한 리소스를 찾을 수 없습니다.",
    },
    FORBIDDEN: {
      code: "COMMON.FORBIDDEN",
      status: 403,
      message: "권한이 없습니다.",
    },
    BAD_REQUEST: {
      code: "COMMON.BAD_REQUEST",
      status: 400,
      message: "요청값이 올바르지 않습니다.",
    },
  },
  AUTH: {
    DUPLICATE_EMAIL: {
      code: "AUTH.DUPLICATE_EMAIL",
      status: 400,
      message: "이미 등록된 이메일입니다.",
    },
    INVALID_LOGIN: {
      code: "AUTH.INVALID_LOGIN",
      status: 401,
      message: "이메일 또는 비밀번호가 올바르지 않습니다.",
    },
    MEMBER_NOT_FOUND: {
      code: "AUTH.MEMBER_NOT_FOUND",
      status: 404,
      message: "사용자를 찾을 수 없습니다.",
    },
  },
  MEMBER: {
    MEMBER_NOT_FOUND: {
      code: "MEMBER.MEMBER_NOT_FOUND",
      status: 404,
      message: "사용자를 찾을 수 없습니다.",
    },
    INVALID_CURRENT_PASSWORD: {
      code: "MEMBER.INVALID_CURRENT_PASSWORD",
      status: 400,
      message: "현재 비밀번호가 올바르지 않습니다.",
    },
  },
  VEHICLE: {
    DUPLICATE_VEHICLE_NUMBER: {
      code: "VEHICLE.DUPLICATE_VEHICLE_NUMBER",
      status: 400,
      message: "이미 등록된 차량 번호입니다.",
    },
    NOT_FOUND_VEHICLE: {
      code: "VEHICLE.NOT_FOUND_VEHICLE",
      status: 404,
      message: "차량을 찾을 수 없습니다.",
    },
  },
  RESERVATION: {
    NOT_FOUND_RESERVATION: {
      code: "RESERVATION.NOT_FOUND_RESERVATION",
      status: 404,
      message: "예약을 찾을 수 없습니다.",
    },
    ALREADY_CANCELLED: {
      code: "RESERVATION.ALREADY_CANCELLED",
      status: 400,
      message: "이미 취소된 예약입니다.",
    },
  },
  BUSINESS: {
    REQUIRED_FIELDS: {
      code: "BUSINESS.REQUIRED_FIELDS",
      status: 400,
      message: "사업자번호, 사업장명, 전화번호, 주소는 필수입니다.",
    },
    NOT_FOUND_BUSINESS: {
      code: "BUSINESS.NOT_FOUND_BUSINESS",
      status: 404,
      message: "사업장을 찾을 수 없습니다.",
    },
    EMPTY_BUSINESS_NUMBER: {
      code: "BUSINESS.EMPTY_BUSINESS_NUMBER",
      status: 400,
      message: "사업자번호는 빈 값일 수 없습니다.",
    },
    EMPTY_COMPANY_NAME: {
      code: "BUSINESS.EMPTY_COMPANY_NAME",
      status: 400,
      message: "사업장명은 빈 값일 수 없습니다.",
    },
    EMPTY_PHONE: {
      code: "BUSINESS.EMPTY_PHONE",
      status: 400,
      message: "전화번호는 빈 값일 수 없습니다.",
    },
    EMPTY_ADDRESS: {
      code: "BUSINESS.EMPTY_ADDRESS",
      status: 400,
      message: "주소는 빈 값일 수 없습니다.",
    },
    ROOM_REQUIRED_FIELDS: {
      code: "BUSINESS.ROOM_REQUIRED_FIELDS",
      status: 400,
      message: "사업장 ID와 룸 이름은 필수입니다.",
    },
    NOT_FOUND_ROOM: {
      code: "BUSINESS.NOT_FOUND_ROOM",
      status: 404,
      message: "룸을 찾을 수 없습니다.",
    },
    EMPTY_ROOM_NAME: {
      code: "BUSINESS.EMPTY_ROOM_NAME",
      status: 400,
      message: "룸 이름은 빈 값일 수 없습니다.",
    },
    INVALID_PERIOD: {
      code: "BUSINESS.INVALID_PERIOD",
      status: 400,
      message: "종료일자는 시작일자 이후여야 합니다.",
    },
    DELETE_HAS_RESERVATIONS: {
      code: "BUSINESS.DELETE_HAS_RESERVATIONS",
      status: 400,
      message: "예약 내역이 있는 사업장은 삭제할 수 없습니다.",
    },
  },
  PRODUCT: {
    NOT_FOUND_PRODUCT: {
      code: "PRODUCT.NOT_FOUND_PRODUCT",
      status: 404,
      message: "상품을 찾을 수 없습니다.",
    },
  },
  WASH_OPTION: {
    FORBIDDEN_BUSINESS: {
      code: "WASH_OPTION.FORBIDDEN_BUSINESS",
      status: 403,
      message: "해당 사업장에 대한 권한이 없습니다.",
    },
    MISSING_BUS_MST_IDX: {
      code: "WASH_OPTION.MISSING_BUS_MST_IDX",
      status: 400,
      message: "busMstIdx는 필수입니다.",
    },
    NOT_FOUND_MASTER: {
      code: "WASH_OPTION.NOT_FOUND_MASTER",
      status: 404,
      message: "세차 옵션(MST)을 찾을 수 없습니다.",
    },
    FORBIDDEN_MASTER: {
      code: "WASH_OPTION.FORBIDDEN_MASTER",
      status: 403,
      message: "해당 세차 옵션에 대한 권한이 없습니다.",
    },
    MISSING_WOPT_MST_IDX: {
      code: "WASH_OPTION.MISSING_WOPT_MST_IDX",
      status: 400,
      message: "woptMstIdx는 필수입니다.",
    },
    NOT_FOUND_DETAIL: {
      code: "WASH_OPTION.NOT_FOUND_DETAIL",
      status: 404,
      message: "세차 옵션(DTL)을 찾을 수 없습니다.",
    },
  },
};
