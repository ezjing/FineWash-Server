const { Op } = require("sequelize");
const {
  sequelize,
  BusinessMaster,
  BusinessDetail,
  Reservation,
  ScheduleMaster,
  ScheduleDetail,
  WashOptionMaster,
  WashOptionDetail,
  Member,
} = require("../models");
const { AppError } = require("../utils/app_error");
const CODES = require("../utils/error_codes");
const {
  GeocodeAddressKakao,
  ToNumberOrNull,
  HaversineDistanceKm,
} = require("../utils/geo");

const SaveLogic1 = async (memIdx, body = {}) => {
  const {
    businessNumber,
    companyName,
    phone,
    email,
    address,
    latitude,
    longitude,
    businessType,
    depositYn,
    depositAmount,
    remark,
  } = body;

  const bn = String(businessNumber ?? "").trim();
  const cn = String(companyName ?? "").trim();
  const ph = String(phone ?? "").trim();
  const addr = String(address ?? "").trim();

  if (!bn || !cn || !ph || !addr) {
    throw new AppError(
      CODES.BUSINESS.REQUIRED_FIELDS.code,
      CODES.BUSINESS.REQUIRED_FIELDS.status,
      CODES.BUSINESS.REQUIRED_FIELDS.message,
    );
  }

  // 위경도 입력 정책
  // 1) latitude/longitude가 들어오면 그대로 저장
  // 2) 없으면 (주소가 있고, 서버 키가 있으면) 지오코딩 시도 — 실패해도 사업장 등록 자체는 가능
  let lat = ToNumberOrNull(latitude);
  let lng = ToNumberOrNull(longitude);
  if (lat == null || lng == null) {
    try {
      const geo = await GeocodeAddressKakao(addr);
      lat = geo.lat;
      lng = geo.lng;
    } catch (e) {
      // 운영/관리 UX상: 지오코딩 실패가 치명적이면 여기서 throw로 바꾸면 됨
      lat = null;
      lng = null;
    }
  }

  return await BusinessMaster.create({
    mem_idx: memIdx,
    business_number: bn,
    company_name: cn,
    phone: ph,
    email: email != null ? String(email).trim() : null,
    address: addr,
    latitude: lat,
    longitude: lng,
    business_type: businessType != null ? String(businessType).trim() : null,
    deposit_yn: depositYn === "Y" ? "Y" : "N",
    deposit_amount:
      depositAmount != null && !Number.isNaN(Number(depositAmount))
        ? Number(depositAmount)
        : 0,
    remark: remark != null ? String(remark) : null,
    create_id: String(memIdx),
    update_id: String(memIdx),
  });
};

const SaveLogic2 = async (memIdx, busMstIdx, body = {}) => {
  const business = await BusinessMaster.findOne({
    where: { bus_mst_idx: busMstIdx, mem_idx: memIdx },
  });
  if (!business) {
    throw new AppError(
      CODES.BUSINESS.NOT_FOUND_BUSINESS.code,
      CODES.BUSINESS.NOT_FOUND_BUSINESS.status,
      CODES.BUSINESS.NOT_FOUND_BUSINESS.message,
    );
  }

  const {
    businessNumber,
    companyName,
    phone,
    email,
    address,
    latitude,
    longitude,
    businessType,
    depositYn,
    depositAmount,
    remark,
  } = body;

  const payload = {};
  if (businessNumber != null)
    payload.business_number = String(businessNumber).trim();
  if (companyName != null) payload.company_name = String(companyName).trim();
  if (phone != null) payload.phone = String(phone).trim();
  if (email != null) payload.email = String(email).trim();
  if (address != null) payload.address = String(address).trim();
  if (latitude != null) payload.latitude = ToNumberOrNull(latitude);
  if (longitude != null) payload.longitude = ToNumberOrNull(longitude);
  if (businessType != null) payload.business_type = String(businessType).trim();
  if (depositYn != null) payload.deposit_yn = depositYn === "Y" ? "Y" : "N";
  if (depositAmount != null && !Number.isNaN(Number(depositAmount))) {
    payload.deposit_amount = Number(depositAmount);
  }
  if (remark != null) payload.remark = String(remark);
  payload.update_id = String(memIdx);

  if ("business_number" in payload && !payload.business_number) {
    throw new AppError(
      CODES.BUSINESS.EMPTY_BUSINESS_NUMBER.code,
      CODES.BUSINESS.EMPTY_BUSINESS_NUMBER.status,
      CODES.BUSINESS.EMPTY_BUSINESS_NUMBER.message,
    );
  }
  if ("company_name" in payload && !payload.company_name) {
    throw new AppError(
      CODES.BUSINESS.EMPTY_COMPANY_NAME.code,
      CODES.BUSINESS.EMPTY_COMPANY_NAME.status,
      CODES.BUSINESS.EMPTY_COMPANY_NAME.message,
    );
  }
  if ("phone" in payload && !payload.phone) {
    throw new AppError(
      CODES.BUSINESS.EMPTY_PHONE.code,
      CODES.BUSINESS.EMPTY_PHONE.status,
      CODES.BUSINESS.EMPTY_PHONE.message,
    );
  }
  if ("address" in payload && !payload.address) {
    throw new AppError(
      CODES.BUSINESS.EMPTY_ADDRESS.code,
      CODES.BUSINESS.EMPTY_ADDRESS.status,
      CODES.BUSINESS.EMPTY_ADDRESS.message,
    );
  }

  // 주소가 변경됐고 위경도는 별도로 안 줬으면: 서버 지오코딩으로 자동 갱신 시도
  const addressChanged = "address" in payload;
  const latProvided = "latitude" in payload;
  const lngProvided = "longitude" in payload;
  if (addressChanged && (!latProvided || !lngProvided)) {
    try {
      const geo = await GeocodeAddressKakao(payload.address);
      payload.latitude = geo.lat;
      payload.longitude = geo.lng;
    } catch (e) {
      // 기존 좌표 유지(혹은 null) 정책: 여기서는 강제 실패시키지 않음
      if (!latProvided) delete payload.latitude;
      if (!lngProvided) delete payload.longitude;
    }
  }

  await business.update(payload);
  return business;
};

const SearchLogic1 = async (memIdx, busDtlIdx) => {
  const room = await BusinessDetail.findOne({
    where: { bus_dtl_idx: busDtlIdx },
    include: [
      {
        model: BusinessMaster,
        as: "businessMaster",
        where: { mem_idx: memIdx },
        required: true,
      },
      {
        model: Reservation,
        as: "reservations",
        required: false,
      },
    ],
  });

  if (!room) {
    throw new AppError(
      CODES.BUSINESS.NOT_FOUND_ROOM.code,
      CODES.BUSINESS.NOT_FOUND_ROOM.status,
      CODES.BUSINESS.NOT_FOUND_ROOM.message,
    );
  }

  const reservations = (room.reservations || []).sort(
    (a, b) => new Date(b.create_date) - new Date(a.create_date),
  );
  const totalRevenue = reservations.reduce(
    (sum, r) => sum + (Number(r.payment_amount) || 0),
    0,
  );

  return { room, reservations, totalRevenue };
};

const SaveLogic3 = async (memIdx, body = {}) => {
  const { busMstIdx, roomName, startDate, endDate, activeYn } = body;

  if (!busMstIdx || !roomName || String(roomName).trim() === "") {
    throw new AppError(
      CODES.BUSINESS.ROOM_REQUIRED_FIELDS.code,
      CODES.BUSINESS.ROOM_REQUIRED_FIELDS.status,
      CODES.BUSINESS.ROOM_REQUIRED_FIELDS.message,
    );
  }

  const business = await BusinessMaster.findOne({
    where: { bus_mst_idx: busMstIdx, mem_idx: memIdx },
  });
  if (!business) {
    throw new AppError(
      CODES.BUSINESS.NOT_FOUND_BUSINESS.code,
      CODES.BUSINESS.NOT_FOUND_BUSINESS.status,
      CODES.BUSINESS.NOT_FOUND_BUSINESS.message,
    );
  }

  return await BusinessDetail.create({
    bus_mst_idx: busMstIdx,
    room_name: String(roomName).trim(),
    active_yn: activeYn === "N" ? "N" : "Y",
    start_date: startDate || null,
    end_date: endDate || null,
  });
};

const SaveLogic4 = async (memIdx, busDtlIdx, body = {}) => {
  const room = await BusinessDetail.findOne({
    where: { bus_dtl_idx: busDtlIdx },
    include: [
      {
        model: BusinessMaster,
        as: "businessMaster",
        where: { mem_idx: memIdx },
        required: true,
      },
    ],
  });

  if (!room) {
    throw new AppError(
      CODES.BUSINESS.NOT_FOUND_ROOM.code,
      CODES.BUSINESS.NOT_FOUND_ROOM.status,
      CODES.BUSINESS.NOT_FOUND_ROOM.message,
    );
  }

  const { roomName, startDate, endDate, activeYn } = body;
  const payload = {};
  if (roomName != null) payload.room_name = String(roomName).trim();
  if (activeYn != null) payload.active_yn = activeYn === "N" ? "N" : "Y";
  if (startDate != null) payload.start_date = startDate || null;
  if (endDate != null) payload.end_date = endDate || null;

  if ("room_name" in payload && !payload.room_name) {
    throw new AppError(
      CODES.BUSINESS.EMPTY_ROOM_NAME.code,
      CODES.BUSINESS.EMPTY_ROOM_NAME.status,
      CODES.BUSINESS.EMPTY_ROOM_NAME.message,
    );
  }

  if ("start_date" in payload && "end_date" in payload) {
    if (payload.start_date && payload.end_date) {
      const s = new Date(payload.start_date);
      const e = new Date(payload.end_date);
      if (!Number.isNaN(s.getTime()) && !Number.isNaN(e.getTime()) && e < s) {
        throw new AppError(
          CODES.BUSINESS.INVALID_PERIOD.code,
          CODES.BUSINESS.INVALID_PERIOD.status,
          CODES.BUSINESS.INVALID_PERIOD.message,
        );
      }
    }
  }

  await room.update(payload);
  return room;
};

const SaveLogic5 = async (memIdx, busDtlIdx) => {
  const room = await BusinessDetail.findOne({
    where: { bus_dtl_idx: busDtlIdx },
    include: [
      {
        model: BusinessMaster,
        as: "businessMaster",
        where: { mem_idx: memIdx },
        required: true,
      },
    ],
  });

  if (!room) {
    throw new AppError(
      CODES.BUSINESS.NOT_FOUND_ROOM.code,
      CODES.BUSINESS.NOT_FOUND_ROOM.status,
      CODES.BUSINESS.NOT_FOUND_ROOM.message,
    );
  }

  const reservationCount = await Reservation.count({
    where: { bus_dtl_idx: room.bus_dtl_idx },
  });

  if (reservationCount > 0) {
    await room.update({ active_yn: "N" });
    return { deleted: false, room };
  }

  await room.destroy();
  return { deleted: true };
};

const SearchLogic2 = async (memIdx) => {
  return await BusinessMaster.findAll({
    where: { mem_idx: memIdx },
    include: [
      { model: BusinessDetail, as: "businessDetails", required: false },
    ],
    order: [["create_date", "DESC"]],
  });
};

const SearchLogic3 = async (memIdx, busMstIdx) => {
  const business = await BusinessMaster.findOne({
    where: { bus_mst_idx: busMstIdx, mem_idx: memIdx },
    include: [
      { model: BusinessDetail, as: "businessDetails", required: false },
    ],
  });

  if (!business) {
    throw new AppError(
      CODES.BUSINESS.NOT_FOUND_BUSINESS.code,
      CODES.BUSINESS.NOT_FOUND_BUSINESS.status,
      CODES.BUSINESS.NOT_FOUND_BUSINESS.message,
    );
  }
  return business;
};

/**
 * 좌표 기반 가까운 제휴 세차장 조회 (공개 API 용)
 * - 클라이언트가 전달한 lat/lng를 그대로 사용
 * - business_type=PARTNER + (latitude/longitude 있는 것)만 대상으로 거리 계산
 * - 활성 룸(active_yn='Y')이 1개 이상 있는 사업장만 내려줌(UX)
 */
const SearchLogic4 = async (latitude, longitude, limit = 20) => {
  const userLat = ToNumberOrNull(latitude);
  const userLng = ToNumberOrNull(longitude);
  if (userLat == null || userLng == null) {
    throw new AppError(
      CODES.BUSINESS.REQUIRED_FIELDS.code,
      CODES.BUSINESS.REQUIRED_FIELDS.status,
      "lat/lng(또는 latitude/longitude)가 필요합니다.",
    );
  }

  const safeLimit = Number.isFinite(Number(limit))
    ? Math.max(1, Math.min(200, Number(limit)))
    : 20;

  const rows = await BusinessMaster.findAll({
    where: {
      business_type: "PARTNER",
      latitude: { [Op.ne]: null },
      longitude: { [Op.ne]: null },
    },
    include: [
      {
        model: BusinessDetail,
        as: "businessDetails",
        required: true,
        where: { active_yn: "Y" },
      },
    ],
  });

  const mapped = (rows || [])
    .map((b) => {
      const lat = ToNumberOrNull(b.latitude);
      const lng = ToNumberOrNull(b.longitude);
      if (lat == null || lng == null) return null;

      const distanceKmRaw = HaversineDistanceKm(userLat, userLng, lat, lng);
      const distanceKm = Math.round(distanceKmRaw * 10) / 10; // 1 decimal for client display

      const details = Array.isArray(b.businessDetails) ? b.businessDetails : [];

      return {
        busMstIdx: b.bus_mst_idx,
        companyName: b.company_name,
        address: b.address,
        distanceKm,
        businessDetails: details.map((bd) => ({
          busDtlIdx: bd.bus_dtl_idx,
          roomName: bd.room_name,
          activeYn: bd.active_yn,
        })),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, safeLimit);

  return mapped;
};

/** 사업장(MST) 삭제 — 하위 룸·옵션·스케줄 정리, 예약이 있으면 불가 */
const SaveLogic6 = async (memIdx, busMstIdx) => {
  const business = await BusinessMaster.findOne({
    where: { bus_mst_idx: busMstIdx, mem_idx: memIdx },
    include: [
      { model: BusinessDetail, as: "businessDetails", required: false },
    ],
  });

  if (!business) {
    throw new AppError(
      CODES.BUSINESS.NOT_FOUND_BUSINESS.code,
      CODES.BUSINESS.NOT_FOUND_BUSINESS.status,
      CODES.BUSINESS.NOT_FOUND_BUSINESS.message,
    );
  }

  const roomIds = (business.businessDetails || []).map((r) => r.bus_dtl_idx);
  if (roomIds.length > 0) {
    const resvCount = await Reservation.count({
      where: { bus_dtl_idx: { [Op.in]: roomIds } },
    });
    if (resvCount > 0) {
      throw new AppError(
        CODES.BUSINESS.DELETE_HAS_RESERVATIONS.code,
        CODES.BUSINESS.DELETE_HAS_RESERVATIONS.status,
        CODES.BUSINESS.DELETE_HAS_RESERVATIONS.message,
      );
    }
  }

  await sequelize.transaction(async (t) => {
    if (roomIds.length > 0) {
      await ScheduleDetail.destroy({
        where: { bus_dtl_idx: { [Op.in]: roomIds } },
        transaction: t,
      });
      await ScheduleMaster.destroy({
        where: { bus_dtl_idx: { [Op.in]: roomIds } },
        transaction: t,
      });
    }

    const woptRows = await WashOptionMaster.findAll({
      attributes: ["wopt_mst_idx"],
      where: { bus_mst_idx: busMstIdx },
      transaction: t,
    });
    const woptMstIds = woptRows.map((row) => row.wopt_mst_idx);
    if (woptMstIds.length > 0) {
      await WashOptionDetail.destroy({
        where: { wopt_mst_idx: { [Op.in]: woptMstIds } },
        transaction: t,
      });
    }
    await WashOptionMaster.destroy({
      where: { bus_mst_idx: busMstIdx },
      transaction: t,
    });

    await BusinessDetail.destroy({
      where: { bus_mst_idx: busMstIdx },
      transaction: t,
    });

    await Member.update(
      { bus_mst_idx: null },
      { where: { bus_mst_idx: busMstIdx }, transaction: t },
    );

    await BusinessMaster.destroy({
      where: { bus_mst_idx: busMstIdx, mem_idx: memIdx },
      transaction: t,
    });
  });

  return { deleted: true };
};

module.exports = {
  SaveLogic1,
  SaveLogic2,
  SearchLogic1,
  SaveLogic3,
  SaveLogic4,
  SaveLogic5,
  SaveLogic6,
  SearchLogic2,
  SearchLogic3,
  SearchLogic4,
};
