const { BusinessMaster, BusinessDetail, Reservation } = require("../models");

const SaveLogic1 = async (memIdx, body = {}) => {
  const {
    businessNumber,
    companyName,
    phone,
    email,
    address,
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
    const err = new Error("MISSING_REQUIRED");
    err.statusCode = 400;
    throw err;
  }

  return await BusinessMaster.create({
    mem_idx: memIdx,
    business_number: bn,
    company_name: cn,
    phone: ph,
    email: email != null ? String(email).trim() : null,
    address: addr,
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
    const err = new Error("NOT_FOUND_BUSINESS");
    err.statusCode = 404;
    throw err;
  }

  const {
    businessNumber,
    companyName,
    phone,
    email,
    address,
    businessType,
    depositYn,
    depositAmount,
    remark,
  } = body;

  const payload = {};
  if (businessNumber != null) payload.business_number = String(businessNumber).trim();
  if (companyName != null) payload.company_name = String(companyName).trim();
  if (phone != null) payload.phone = String(phone).trim();
  if (email != null) payload.email = String(email).trim();
  if (address != null) payload.address = String(address).trim();
  if (businessType != null) payload.business_type = String(businessType).trim();
  if (depositYn != null) payload.deposit_yn = depositYn === "Y" ? "Y" : "N";
  if (depositAmount != null && !Number.isNaN(Number(depositAmount))) {
    payload.deposit_amount = Number(depositAmount);
  }
  if (remark != null) payload.remark = String(remark);
  payload.update_id = String(memIdx);

  if ("business_number" in payload && !payload.business_number) {
    const err = new Error("EMPTY_BUSINESS_NUMBER");
    err.statusCode = 400;
    throw err;
  }
  if ("company_name" in payload && !payload.company_name) {
    const err = new Error("EMPTY_COMPANY_NAME");
    err.statusCode = 400;
    throw err;
  }
  if ("phone" in payload && !payload.phone) {
    const err = new Error("EMPTY_PHONE");
    err.statusCode = 400;
    throw err;
  }
  if ("address" in payload && !payload.address) {
    const err = new Error("EMPTY_ADDRESS");
    err.statusCode = 400;
    throw err;
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
    const err = new Error("NOT_FOUND_ROOM");
    err.statusCode = 404;
    throw err;
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
    const err = new Error("MISSING_ROOM_REQUIRED");
    err.statusCode = 400;
    throw err;
  }

  const business = await BusinessMaster.findOne({
    where: { bus_mst_idx: busMstIdx, mem_idx: memIdx },
  });
  if (!business) {
    const err = new Error("NOT_FOUND_BUSINESS");
    err.statusCode = 404;
    throw err;
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
    const err = new Error("NOT_FOUND_ROOM");
    err.statusCode = 404;
    throw err;
  }

  const { roomName, startDate, endDate, activeYn } = body;
  const payload = {};
  if (roomName != null) payload.room_name = String(roomName).trim();
  if (activeYn != null) payload.active_yn = activeYn === "N" ? "N" : "Y";
  if (startDate != null) payload.start_date = startDate || null;
  if (endDate != null) payload.end_date = endDate || null;

  if ("room_name" in payload && !payload.room_name) {
    const err = new Error("EMPTY_ROOM_NAME");
    err.statusCode = 400;
    throw err;
  }

  if ("start_date" in payload && "end_date" in payload) {
    if (payload.start_date && payload.end_date) {
      const s = new Date(payload.start_date);
      const e = new Date(payload.end_date);
      if (!Number.isNaN(s.getTime()) && !Number.isNaN(e.getTime()) && e < s) {
        const err = new Error("INVALID_PERIOD");
        err.statusCode = 400;
        throw err;
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
    const err = new Error("NOT_FOUND_ROOM");
    err.statusCode = 404;
    throw err;
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
    include: [{ model: BusinessDetail, as: "businessDetails", required: false }],
    order: [["create_date", "DESC"]],
  });
};

const SearchLogic3 = async (memIdx, busMstIdx) => {
  const business = await BusinessMaster.findOne({
    where: { bus_mst_idx: busMstIdx, mem_idx: memIdx },
    include: [{ model: BusinessDetail, as: "businessDetails", required: false }],
  });

  if (!business) {
    const err = new Error("NOT_FOUND_BUSINESS");
    err.statusCode = 404;
    throw err;
  }
  return business;
};

module.exports = {
  SaveLogic1,
  SaveLogic2,
  SearchLogic1,
  SaveLogic3,
  SaveLogic4,
  SaveLogic5,
  SearchLogic2,
  SearchLogic3,
};

