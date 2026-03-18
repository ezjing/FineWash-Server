const { Vehicle } = require("../models");

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
    const err = new Error("DUPLICATE_VEHICLE_NUMBER");
    err.statusCode = 400;
    throw err;
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
    const err = new Error("NOT_FOUND_VEHICLE");
    err.statusCode = 404;
    throw err;
  }

  return await Vehicle.findByPk(vehIdx);
};

const SaveLogic3 = async (memIdx, vehIdx) => {
  const deletedCount = await Vehicle.destroy({
    where: { veh_idx: vehIdx, mem_idx: memIdx },
  });
  if (deletedCount === 0) {
    const err = new Error("NOT_FOUND_VEHICLE");
    err.statusCode = 404;
    throw err;
  }
  return true;
};

module.exports = {
  SearchLogic1,
  SaveLogic1,
  SaveLogic2,
  SaveLogic3,
};

