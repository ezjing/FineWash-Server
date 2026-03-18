const { Reservation, Vehicle } = require("../models");

const SearchLogic1 = async (memIdx) => {
  return await Reservation.findAll({
    where: { mem_idx: memIdx },
    include: [{ model: Vehicle, as: "vehicle" }],
    order: [["create_date", "DESC"]],
  });
};

const SearchLogic2 = async (memIdx, resvIdx) => {
  const booking = await Reservation.findOne({
    where: { resv_idx: resvIdx, mem_idx: memIdx },
    include: [{ model: Vehicle, as: "vehicle" }],
  });
  if (!booking) {
    const err = new Error("NOT_FOUND_RESERVATION");
    err.statusCode = 404;
    throw err;
  }
  return booking;
};

const SaveLogic1 = async (memIdx, body = {}) => {
  const {
    vehicleId,
    main_option,
    mid_option,
    sub_option,
    vehicle_location,
    date,
    time,
    bus_dtl_idx,
    imp_uid,
    merchant_uid,
    payment_amount,
  } = body;

  const userId = memIdx?.toString() || "system";

  console.log("예약 생성 요청 데이터:", {
    mem_idx: memIdx,
    veh_idx: vehicleId,
    bus_dtl_idx: bus_dtl_idx || null,
    main_option: main_option,
    mid_option: mid_option || null,
    sub_option: sub_option || null,
    vehicle_location: vehicle_location || null,
    date,
    time,
    imp_uid: imp_uid || null,
    merchant_uid: merchant_uid || null,
    payment_amount: payment_amount || null,
    create_id: userId,
    update_id: userId,
  });

  const booking = await Reservation.create({
    mem_idx: memIdx,
    veh_idx: vehicleId,
    bus_dtl_idx: bus_dtl_idx || null,
    main_option: main_option,
    mid_option: mid_option || null,
    sub_option: sub_option || null,
    vehicle_location: vehicle_location || null,
    date,
    time,
    contract_yn: "Y",
    imp_uid: imp_uid || null,
    merchant_uid: merchant_uid || null,
    payment_amount: payment_amount || null,
    create_id: userId,
    update_id: userId,
  });

  console.log("예약 생성 성공:", booking.resv_idx);
  return booking;
};

const SaveLogic2 = async (memIdx, resvIdx) => {
  const booking = await Reservation.findOne({
    where: { resv_idx: resvIdx, mem_idx: memIdx },
  });

  if (!booking) {
    const err = new Error("NOT_FOUND_RESERVATION");
    err.statusCode = 404;
    throw err;
  }

  if (booking.contract_yn === "N") {
    const err = new Error("ALREADY_CANCELLED");
    err.statusCode = 400;
    throw err;
  }

  booking.contract_yn = "N";
  await booking.save();
  return booking;
};

module.exports = {
  SearchLogic1,
  SearchLogic2,
  SaveLogic1,
  SaveLogic2,
};

