const VehicleService = require("../services/vehicle_service");
const { Ok, Fail } = require("../utils/response");
const { HandleControllerError } = require("../utils/controller_error");

const SearchLogic1 = async (req, res) => {
  try {
    const vehicles = await VehicleService.SearchLogic1(req.user.memIdx);
    return Ok(res, {
      vehicles: vehicles.map((v) => ({
        id: v.veh_idx,
        vehIdx: v.veh_idx,
        vehicleType: v.vehicle_type,
        model: v.model,
        vehicleNumber: v.vehicle_number,
        color: v.color,
        year: v.year,
        remark: v.remark,
        memIdx: v.mem_idx,
        createdDate: v.create_date ? v.create_date.toISOString() : null,
        updateDate: v.update_date ? v.update_date.toISOString() : null,
      })),
    });
  } catch (error) {
    console.error("Get vehicles error:", error);
    return HandleControllerError(res, error, "차량 목록 조회 중 오류가 발생했습니다.");
  }
};

const SaveLogic1 = async (req, res) => {
  try {
    const vehicle = await VehicleService.SaveLogic1(req.user.memIdx, req.body);
    return Ok(
      res,
      {
      message: "차량이 등록되었습니다.",
      vehicle: {
        id: vehicle.veh_idx,
        vehIdx: vehicle.veh_idx,
        vehicleType: vehicle.vehicle_type,
        model: vehicle.model,
        vehicleNumber: vehicle.vehicle_number,
        color: vehicle.color,
        year: vehicle.year,
        remark: vehicle.remark,
        memIdx: vehicle.mem_idx,
        createdDate: vehicle.create_date ? vehicle.create_date.toISOString() : null,
        updateDate: vehicle.update_date ? vehicle.update_date.toISOString() : null,
      },
      },
      201,
    );
  } catch (error) {
    console.error("Create vehicle error:", error);
    return HandleControllerError(res, error, "차량 등록 중 오류가 발생했습니다.");
  }
};

const SaveLogic2 = async (req, res) => {
  try {
    const vehicle = await VehicleService.SaveLogic2(
      req.user.memIdx,
      req.params.id,
      req.body,
    );
    return Ok(res, {
      message: "차량 정보가 수정되었습니다.",
      vehicle: {
        id: vehicle.veh_idx,
        vehIdx: vehicle.veh_idx,
        memIdx: vehicle.mem_idx,
        vehicleType: vehicle.vehicle_type,
        model: vehicle.model,
        vehicleNumber: vehicle.vehicle_number,
        color: vehicle.color,
        year: vehicle.year,
        remark: vehicle.remark,
        createdDate: vehicle.create_date ? vehicle.create_date.toISOString() : null,
        updateDate: vehicle.update_date ? vehicle.update_date.toISOString() : null,
      },
    });
  } catch (error) {
    console.error("Update vehicle error:", error);
    return HandleControllerError(res, error, "차량 수정 중 오류가 발생했습니다.");
  }
};

const SaveLogic3 = async (req, res) => {
  try {
    await VehicleService.SaveLogic3(req.user.memIdx, req.params.id);
    return Ok(res, {
      message: "차량이 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    return HandleControllerError(res, error, "차량 삭제 중 오류가 발생했습니다.");
  }
};

module.exports = {
  SearchLogic1,
  SaveLogic1,
  SaveLogic2,
  SaveLogic3,
};

