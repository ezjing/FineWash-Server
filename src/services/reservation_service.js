const { Reservation, Vehicle } = require("../models");
const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");
const ReservationRepository = require("../repositories/reservation_repository");

const SearchLogic1 = async (memIdx) => {
  return Reservation.findAll({
    where: { mem_idx: memIdx },
    include: [{ model: Vehicle, as: "vehicle" }],
    order: [["create_date", "DESC"]],
  });
};

const SearchLogic2 = async (memIdx, resvIdx) => {
  return ReservationRepository.FindByIdWithVehicle(resvIdx, {
    mem_idx: memIdx,
  });
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
    bus_mst_idx,
    imp_uid,
    merchant_uid,
    payment_amount,
  } = body;

  const userId = memIdx?.toString() || "system";

  return Reservation.create({
    mem_idx: memIdx,
    veh_idx: vehicleId,
    bus_mst_idx: bus_mst_idx,
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
};

const SaveLogic2 = async (memIdx, resvIdx) => {
  const booking = await ReservationRepository.FindById(resvIdx, {
    mem_idx: memIdx,
  });

  if (booking.contract_yn === "N") {
    ThrowFromCode(CODES.RESERVATION.ALREADY_CANCELLED);
  }

  booking.contract_yn = "N";
  await booking.save();
  return booking;
};

const SaveLogic3 = async (resvIdx) => {
  const booking = await ReservationRepository.FindById(resvIdx);

  if (booking.contract_yn === "N") {
    ThrowFromCode(CODES.RESERVATION.ALREADY_REJECTED);
  }

  booking.contract_yn = "N";
  await booking.save();
  return booking;
};

const SaveLogic4 = async (resvIdx, body = {}) => {
  const { date, time } = body;
  const booking = await ReservationRepository.FindById(resvIdx);

  if (booking.contract_yn === "N") {
    ThrowFromCode(CODES.RESERVATION.ALREADY_REJECTED);
  }
  if (booking.contract_yn === "C") {
    ThrowFromCode(CODES.RESERVATION.ALREADY_COMPLETED);
  }
  if (booking.contract_yn === "Y") {
    ThrowFromCode(CODES.RESERVATION.ALREADY_APPROVED);
  }

  booking.contract_yn = "Y";
  if (date) booking.date = date;
  if (time) booking.time = time;
  await booking.save();
  return booking;
};

module.exports = {
  SearchLogic1,
  SearchLogic2,
  SaveLogic1,
  SaveLogic2,
  SaveLogic3,
  SaveLogic4,
};
