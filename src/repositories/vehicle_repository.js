const { Op } = require("sequelize");
const { Vehicle } = require("../models");
const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const FindOwned = async (memIdx, vehIdx) => {
  const vehicle = await Vehicle.findOne({
    where: { veh_idx: vehIdx, mem_idx: memIdx },
  });
  if (!vehicle) ThrowFromCode(CODES.VEHICLE.NOT_FOUND_VEHICLE);
  return vehicle;
};

const AssertUniqueNumber = async (
  memIdx,
  vehicleNumber,
  excludeVehIdx = null,
) => {
  const where = { mem_idx: memIdx, vehicle_number: vehicleNumber };
  if (excludeVehIdx != null) {
    where.veh_idx = { [Op.ne]: excludeVehIdx };
  }
  const existing = await Vehicle.findOne({ where });
  if (existing) ThrowFromCode(CODES.VEHICLE.DUPLICATE_VEHICLE_NUMBER);
};

const UpdateOwned = async (memIdx, vehIdx, updateData) => {
  const [updatedCount] = await Vehicle.update(updateData, {
    where: { veh_idx: vehIdx, mem_idx: memIdx },
  });
  if (updatedCount === 0) ThrowFromCode(CODES.VEHICLE.NOT_FOUND_VEHICLE);
  return Vehicle.findByPk(vehIdx);
};

const DeleteOwned = async (memIdx, vehIdx) => {
  const deletedCount = await Vehicle.destroy({
    where: { veh_idx: vehIdx, mem_idx: memIdx },
  });
  if (deletedCount === 0) ThrowFromCode(CODES.VEHICLE.NOT_FOUND_VEHICLE);
};

module.exports = {
  FindOwned,
  AssertUniqueNumber,
  UpdateOwned,
  DeleteOwned,
};
