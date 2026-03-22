const { Vehicle } = require("../models");
const { AppError } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const SearchLogic1 = async (memIdx) => {
  return await Vehicle.findAll({
    where: { mem_idx: memIdx },
    order: [["create_date", "DESC"]],
  });
};

const SaveLogic1 = async (memIdx, body) => {
  const { vehicle_type, model, vehicle_number, color, year, remark } = body || {};

  const existingVehicle = await Vehicle.findOne({
    where: {
      mem_idx: memIdx,
      vehicle_number: vehicle_number,
    },
  });
  if (existingVehicle) {
    throw new AppError(
      CODES.VEHICLE.DUPLICATE_VEHICLE_NUMBER.code,
      CODES.VEHICLE.DUPLICATE_VEHICLE_NUMBER.status,
      CODES.VEHICLE.DUPLICATE_VEHICLE_NUMBER.message,
    );
  }

  return await Vehicle.create({
    mem_idx: memIdx,
    vehicle_type,
    model,
    vehicle_number,
    color: color || null,
    year: year || null,
    remark: remark || null,
  });
};

const SaveLogic2 = async (memIdx, vehIdx, body) => {
  const { vehicle_type, model, vehicle_number, color, year, remark } = body || {};
  const updateData = {};

  if (vehicle_type !== undefined) updateData.vehicle_type = vehicle_type;
  if (model !== undefined) updateData.model = model;
  if (vehicle_number !== undefined) updateData.vehicle_number = vehicle_number;
  if (color !== undefined) updateData.color = color;
  if (year !== undefined) updateData.year = year;
  if (remark !== undefined) updateData.remark = remark;

  const [updatedCount] = await Vehicle.update(updateData, {
    where: { veh_idx: vehIdx, mem_idx: memIdx },
  });
  if (updatedCount === 0) {
    throw new AppError(
      CODES.VEHICLE.NOT_FOUND_VEHICLE.code,
      CODES.VEHICLE.NOT_FOUND_VEHICLE.status,
      CODES.VEHICLE.NOT_FOUND_VEHICLE.message,
    );
  }

  return await Vehicle.findByPk(vehIdx);
};

const SaveLogic3 = async (memIdx, vehIdx) => {
  const deletedCount = await Vehicle.destroy({
    where: { veh_idx: vehIdx, mem_idx: memIdx },
  });
  if (deletedCount === 0) {
    throw new AppError(
      CODES.VEHICLE.NOT_FOUND_VEHICLE.code,
      CODES.VEHICLE.NOT_FOUND_VEHICLE.status,
      CODES.VEHICLE.NOT_FOUND_VEHICLE.message,
    );
  }
  return true;
};

module.exports = {
  SearchLogic1,
  SaveLogic1,
  SaveLogic2,
  SaveLogic3,
};

