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
const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");
const {
  GeocodeAddressKakao,
  ToNumberOrNull,
  HaversineDistanceKm,
} = require("../utils/geo");
const {
  FindOwnedBusiness,
  FindOwnedRoom,
} = require("../repositories/business_repository");

/** 위경도 직접 입력 또는 주소 지오코딩으로 좌표 결정 */
const ResolveCoordinates = async (latitude, longitude, address) => {
  let lat = ToNumberOrNull(latitude);
  let lng = ToNumberOrNull(longitude);
  if (lat == null || lng == null) {
    try {
      const geo = await GeocodeAddressKakao(address);
      lat = geo.lat;
      lng = geo.lng;
    } catch {
      lat = null;
      lng = null;
    }
  }
  return { lat, lng };
};

const SaveLogic1 = async (memIdx, body = {}) => {
  const {
    businessNumber,
    companyName,
    phone,
    email,
    address,
    addressDetail,
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
  const addrDetail = String(addressDetail ?? "").trim();

  if (!bn || !cn || !ph || !addr) {
    ThrowFromCode(CODES.BUSINESS.REQUIRED_FIELDS);
  }

  const { lat, lng } = await ResolveCoordinates(latitude, longitude, addr);

  return BusinessMaster.create({
    mem_idx: memIdx,
    business_number: bn,
    company_name: cn,
    phone: ph,
    email: email != null ? String(email).trim() : null,
    address: addr,
    address_detail: addrDetail,
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
  const business = await FindOwnedBusiness(memIdx, busMstIdx);

  const {
    businessNumber,
    companyName,
    phone,
    email,
    address,
    addressDetail,
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
  if (addressDetail != null) {
    const trimmed = String(addressDetail).trim();
    payload.address_detail = trimmed.length === 0 ? null : trimmed;
  }
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
    ThrowFromCode(CODES.BUSINESS.EMPTY_BUSINESS_NUMBER);
  }
  if ("company_name" in payload && !payload.company_name) {
    ThrowFromCode(CODES.BUSINESS.EMPTY_COMPANY_NAME);
  }
  if ("phone" in payload && !payload.phone) {
    ThrowFromCode(CODES.BUSINESS.EMPTY_PHONE);
  }
  if ("address" in payload && !payload.address) {
    ThrowFromCode(CODES.BUSINESS.EMPTY_ADDRESS);
  }

  const addressChanged = "address" in payload;
  const latProvided = "latitude" in payload;
  const lngProvided = "longitude" in payload;
  if (addressChanged && (!latProvided || !lngProvided)) {
    try {
      const geo = await GeocodeAddressKakao(payload.address);
      payload.latitude = geo.lat;
      payload.longitude = geo.lng;
    } catch {
      if (!latProvided) delete payload.latitude;
      if (!lngProvided) delete payload.longitude;
    }
  }

  await business.update(payload);
  return business;
};

const SearchLogic1 = async (memIdx, busDtlIdx) => {
  const room = await FindOwnedRoom(memIdx, busDtlIdx);

  const reservations = await Reservation.findAll({
    where: { bus_mst_idx: room.bus_mst_idx },
    order: [["create_date", "DESC"]],
  });
  const totalRevenue = reservations.reduce(
    (sum, r) => sum + (Number(r.payment_amount) || 0),
    0,
  );

  return { room, reservations, totalRevenue };
};

const SaveLogic3 = async (memIdx, body = {}) => {
  const { busMstIdx, roomName, startDate, endDate, activeYn } = body;

  if (!busMstIdx || !roomName || String(roomName).trim() === "") {
    ThrowFromCode(CODES.BUSINESS.ROOM_REQUIRED_FIELDS);
  }

  await FindOwnedBusiness(memIdx, busMstIdx);

  return BusinessDetail.create({
    bus_mst_idx: busMstIdx,
    room_name: String(roomName).trim(),
    active_yn: activeYn === "N" ? "N" : "Y",
    start_date: startDate || null,
    end_date: endDate || null,
  });
};

const SaveLogic4 = async (memIdx, busDtlIdx, body = {}) => {
  const room = await FindOwnedRoom(memIdx, busDtlIdx);

  const { roomName, startDate, endDate, activeYn } = body;
  const payload = {};
  if (roomName != null) payload.room_name = String(roomName).trim();
  if (activeYn != null) payload.active_yn = activeYn === "N" ? "N" : "Y";
  if (startDate != null) payload.start_date = startDate || null;
  if (endDate != null) payload.end_date = endDate || null;

  if ("room_name" in payload && !payload.room_name) {
    ThrowFromCode(CODES.BUSINESS.EMPTY_ROOM_NAME);
  }

  if ("start_date" in payload && "end_date" in payload) {
    if (payload.start_date && payload.end_date) {
      const s = new Date(payload.start_date);
      const e = new Date(payload.end_date);
      if (!Number.isNaN(s.getTime()) && !Number.isNaN(e.getTime()) && e < s) {
        ThrowFromCode(CODES.BUSINESS.INVALID_PERIOD);
      }
    }
  }

  await room.update(payload);
  return room;
};

const SaveLogic5 = async (memIdx, busDtlIdx) => {
  const room = await FindOwnedRoom(memIdx, busDtlIdx);

  const reservationCount = await Reservation.count({
    where: { bus_mst_idx: room.bus_mst_idx },
  });

  if (reservationCount > 0) {
    await room.update({ active_yn: "N" });
    return { deleted: false, room };
  }

  await room.destroy();
  return { deleted: true };
};

const SearchLogic2 = async (memIdx) => {
  return BusinessMaster.findAll({
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

  if (!business) ThrowFromCode(CODES.BUSINESS.NOT_FOUND_BUSINESS);
  return business;
};

const SearchLogic4 = async (latitude, longitude, limit = 20) => {
  const userLat = ToNumberOrNull(latitude);
  const userLng = ToNumberOrNull(longitude);
  if (userLat == null || userLng == null) {
    ThrowFromCode(CODES.BUSINESS.MISSING_COORDINATES);
  }

  const safeLimit = Number.isFinite(Number(limit))
    ? Math.max(1, Math.min(200, Number(limit)))
    : 20;

  const rows = await BusinessMaster.findAll({
    where: {
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

  return (rows || [])
    .map((b) => {
      const lat = ToNumberOrNull(b.latitude);
      const lng = ToNumberOrNull(b.longitude);
      if (lat == null || lng == null) return null;

      const distanceKmRaw = HaversineDistanceKm(userLat, userLng, lat, lng);
      const distanceKm = Math.round(distanceKmRaw * 10) / 10;
      const details = Array.isArray(b.businessDetails) ? b.businessDetails : [];

      return {
        busMstIdx: b.bus_mst_idx,
        companyName: b.company_name,
        address: b.address,
        addressDetail: b.address_detail,
        businessType: b.business_type,
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
};

const SaveLogic6 = async (memIdx, busMstIdx) => {
  const business = await BusinessMaster.findOne({
    where: { bus_mst_idx: busMstIdx, mem_idx: memIdx },
    include: [
      { model: BusinessDetail, as: "businessDetails", required: false },
    ],
  });

  if (!business) ThrowFromCode(CODES.BUSINESS.NOT_FOUND_BUSINESS);

  const roomIds = (business.businessDetails || []).map((r) => r.bus_dtl_idx);
  if (roomIds.length > 0) {
    const resvCount = await Reservation.count({
      where: { bus_mst_idx: busMstIdx },
    });
    if (resvCount > 0) {
      ThrowFromCode(CODES.BUSINESS.DELETE_HAS_RESERVATIONS);
    }
  }

  await sequelize.transaction(async (t) => {
    const schMstRows = await ScheduleMaster.findAll({
      attributes: ["sch_mst_idx"],
      where: { bus_mst_idx: busMstIdx },
      transaction: t,
    });
    const schMstIds = schMstRows.map((row) => row.sch_mst_idx);
    if (schMstIds.length > 0) {
      await ScheduleDetail.destroy({
        where: { sch_mst_idx: { [Op.in]: schMstIds } },
        transaction: t,
      });
    }
    await ScheduleMaster.destroy({
      where: { bus_mst_idx: busMstIdx },
      transaction: t,
    });

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
