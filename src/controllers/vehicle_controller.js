const VehicleService = require("../services/vehicle_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");

const ToIsoOrNull = (value) => (value ? value.toISOString() : null);

const MapVehicle = (v) => ({
  id: v.veh_idx,
  vehIdx: v.veh_idx,
  vehicleType: v.vehicle_type,
  model: v.model,
  vehicleNumber: v.vehicle_number,
  color: v.color,
  year: v.year,
  remark: v.remark,
  memIdx: v.mem_idx,
  createdDate: ToIsoOrNull(v.create_date),
  updateDate: ToIsoOrNull(v.update_date),
});

const SearchLogic1 = AsyncHandler(async (req, res) => {
  const vehicles = await VehicleService.SearchLogic1(req.user.memIdx);
  return Ok(res, { vehicles: Array.isArray(vehicles) ? vehicles.map(MapVehicle) : [] });
});

const SaveLogic1 = AsyncHandler(async (req, res) => {
  const vehicle = await VehicleService.SaveLogic1(req.user.memIdx, req.body);
  return Ok(res, { message: "차량이 등록되었습니다.", vehicle: MapVehicle(vehicle) }, 201);
});

const SaveLogic2 = AsyncHandler(async (req, res) => {
  const vehicle = await VehicleService.SaveLogic2(req.user.memIdx, req.params.id, req.body);
  return Ok(res, { message: "차량 정보가 수정되었습니다.", vehicle: MapVehicle(vehicle) });
});

const SaveLogic3 = AsyncHandler(async (req, res) => {
  await VehicleService.SaveLogic3(req.user.memIdx, req.params.id);
  return Ok(res, { message: "차량이 삭제되었습니다." });
});

module.exports = {
  SearchLogic1,
  SaveLogic1,
  SaveLogic2,
  SaveLogic3,
};
