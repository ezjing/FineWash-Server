const { Vehicle } = require("../models");
const VehicleRepository = require("../repositories/vehicle_repository");

const SearchLogic1 = async (memIdx) => {
  return Vehicle.findAll({
    where: { mem_idx: memIdx },
    order: [["create_date", "DESC"]],
  });
};

const SaveLogic1 = async (memIdx, body) => {
  const { vehicle_type, model, vehicle_number, color, year, remark } =
    body || {};

  await VehicleRepository.AssertUniqueNumber(memIdx, vehicle_number);

  return Vehicle.create({
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
  const { vehicle_type, model, vehicle_number, color, year, remark } =
    body || {};
  const updateData = {};

  if (vehicle_type !== undefined) updateData.vehicle_type = vehicle_type;
  if (model !== undefined) updateData.model = model;
  if (vehicle_number !== undefined) {
    await VehicleRepository.AssertUniqueNumber(
      memIdx,
      vehicle_number,
      vehIdx,
    );
    updateData.vehicle_number = vehicle_number;
  }
  if (color !== undefined) updateData.color = color;
  if (year !== undefined) updateData.year = year;
  if (remark !== undefined) updateData.remark = remark;

  return VehicleRepository.UpdateOwned(memIdx, vehIdx, updateData);
};

const SaveLogic3 = async (memIdx, vehIdx) => {
  await VehicleRepository.DeleteOwned(memIdx, vehIdx);
  return true;
};

module.exports = {
  SearchLogic1,
  SaveLogic1,
  SaveLogic2,
  SaveLogic3,
};
