const { Reservation, Vehicle } = require("../models");
const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const FindById = async (resvIdx, extraWhere = {}) => {
  const booking = await Reservation.findOne({
    where: { resv_idx: resvIdx, ...extraWhere },
  });
  if (!booking) ThrowFromCode(CODES.RESERVATION.NOT_FOUND_RESERVATION);
  return booking;
};

const FindByIdWithVehicle = async (resvIdx, extraWhere = {}) => {
  const booking = await Reservation.findOne({
    where: { resv_idx: resvIdx, ...extraWhere },
    include: [{ model: Vehicle, as: "vehicle" }],
  });
  if (!booking) ThrowFromCode(CODES.RESERVATION.NOT_FOUND_RESERVATION);
  return booking;
};

module.exports = {
  FindById,
  FindByIdWithVehicle,
};
