const { Reservation, Vehicle } = require("../models");
const { AppError } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const DebugLog = (...args) => {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

const SearchLogic1 = async (memIdx) => {
  return Reservation.findAll({
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
    throw new AppError(
      CODES.RESERVATION.NOT_FOUND_RESERVATION.code,
      CODES.RESERVATION.NOT_FOUND_RESERVATION.status,
      CODES.RESERVATION.NOT_FOUND_RESERVATION.message,
    );
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

  DebugLog("예약 생성 요청 데이터:", {
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

  DebugLog("예약 생성 성공:", booking.resv_idx);
  return booking;
};

const SaveLogic2 = async (memIdx, resvIdx) => {
  const booking = await Reservation.findOne({
    where: { resv_idx: resvIdx, mem_idx: memIdx },
  });

  if (!booking) {
    throw new AppError(
      CODES.RESERVATION.NOT_FOUND_RESERVATION.code,
      CODES.RESERVATION.NOT_FOUND_RESERVATION.status,
      CODES.RESERVATION.NOT_FOUND_RESERVATION.message,
    );
  }

  if (booking.contract_yn === "N") {
    throw new AppError(
      CODES.RESERVATION.ALREADY_CANCELLED.code,
      CODES.RESERVATION.ALREADY_CANCELLED.status,
      CODES.RESERVATION.ALREADY_CANCELLED.message,
    );
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
