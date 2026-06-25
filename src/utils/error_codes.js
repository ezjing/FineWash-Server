/**
 * API 공통 에러 코드 정의
 *
 * 구조: { code, status, message }
 * - 서비스/저장소: ThrowFromCode(CODES.DOMAIN.KEY)
 * - 미들웨어: next(ToAppError(CODES.DOMAIN.KEY))
 */
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
    MISSING_TOKEN: {
      code: "AUTH.MISSING_TOKEN",
      status: 401,
      message: "인증 토큰이 필요합니다.",
    },
    INVALID_TOKEN: {
      code: "AUTH.INVALID_TOKEN",
      status: 401,
      message: "유효하지 않은 토큰입니다.",
    },
    TOKEN_EXPIRED: {
      code: "AUTH.TOKEN_EXPIRED",
      status: 401,
      message: "토큰이 만료되었습니다.",
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
    ALREADY_REJECTED: {
      code: "RESERVATION.ALREADY_REJECTED",
      status: 400,
      message: "이미 거절된 예약입니다.",
    },
    ALREADY_COMPLETED: {
      code: "RESERVATION.ALREADY_COMPLETED",
      status: 400,
      message: "이미 완료된 예약입니다.",
    },
    ALREADY_APPROVED: {
      code: "RESERVATION.ALREADY_APPROVED",
      status: 400,
      message: "이미 승인된 예약입니다.",
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
    FORBIDDEN: {
      code: "BUSINESS.FORBIDDEN",
      status: 403,
      message: "해당 사업장에 대한 권한이 없습니다.",
    },
    MISSING_COORDINATES: {
      code: "BUSINESS.MISSING_COORDINATES",
      status: 400,
      message: "lat/lng(또는 latitude/longitude)가 필요합니다.",
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
  SCHEDULE: {
    MISSING_BUS_MST_IDX: {
      code: "SCHEDULE.MISSING_BUS_MST_IDX",
      status: 400,
      message: "busMstIdx는 필수입니다.",
    },
    MISSING_SCH_MST_IDX: {
      code: "SCHEDULE.MISSING_SCH_MST_IDX",
      status: 400,
      message: "schMstIdx는 필수입니다.",
    },
    MISSING_SCOPE: {
      code: "SCHEDULE.MISSING_SCOPE",
      status: 400,
      message: "schMstIdx 또는 busMstIdx는 필수입니다.",
    },
    MISSING_YEAR_MONTH: {
      code: "SCHEDULE.MISSING_YEAR_MONTH",
      status: 400,
      message: "year, month는 필수입니다.",
    },
    MISSING_SCHEDULE_DATE: {
      code: "SCHEDULE.MISSING_SCHEDULE_DATE",
      status: 400,
      message: "scheduleDate는 필수입니다.",
    },
    MISSING_OVERTIME_HOURS: {
      code: "SCHEDULE.MISSING_OVERTIME_HOURS",
      status: 400,
      message: "연장근무는 시작/종료 시간이 필요합니다.",
    },
    NOT_FOUND_MASTER: {
      code: "SCHEDULE.NOT_FOUND_MASTER",
      status: 404,
      message: "스케줄(MST)을 찾을 수 없습니다.",
    },
    NOT_FOUND_DETAIL: {
      code: "SCHEDULE.NOT_FOUND_DETAIL",
      status: 404,
      message: "스케줄(DTL)을 찾을 수 없습니다.",
    },
  },
  PRODUCT: {
    NOT_FOUND_PRODUCT: {
      code: "PRODUCT.NOT_FOUND_PRODUCT",
      status: 404,
      message: "상품을 찾을 수 없습니다.",
    },
  },
  GEO: {
    REQUIRED_ADDRESS: {
      code: "GEO.REQUIRED_ADDRESS",
      status: 400,
      message: "address는 필수입니다.",
    },
    MISSING_API_KEY: {
      code: "GEO.MISSING_API_KEY",
      status: 500,
      message: "서버 지오코딩 키(KAKAO_REST_API_KEY)가 설정되지 않았습니다.",
    },
    FETCH_UNAVAILABLE: {
      code: "GEO.FETCH_UNAVAILABLE",
      status: 500,
      message: "현재 런타임에서 fetch를 사용할 수 없습니다(Node 18+ 권장).",
    },
    PROVIDER_ERROR: {
      code: "GEO.PROVIDER_ERROR",
      status: 502,
      message: "지오코딩 요청이 실패했습니다.",
    },
    NOT_FOUND: {
      code: "GEO.NOT_FOUND",
      status: 400,
      message: "주소를 좌표로 변환할 수 없습니다(지오코딩 결과 없음).",
    },
  },
  PAYMENT: {
    MISSING_VERIFY_FIELDS: {
      code: "PAYMENT.MISSING_VERIFY_FIELDS",
      status: 400,
      message: "결제 검증에 필요한 정보가 부족합니다.",
    },
    VERIFICATION_FAILED: {
      code: "PAYMENT.VERIFICATION_FAILED",
      status: 400,
      message: "결제 검증에 실패했습니다.",
    },
  },
  WASH_OPTION: {
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
