const ReservationService = require("../services/reservation_service");
const { Ok, Fail } = require("../utils/response");
const { HandleControllerError } = require("../utils/controller_error");

const SearchLogic1 = async (req, res) => {
  try {
    const bookings = await ReservationService.SearchLogic1(req.user.memIdx);
    return Ok(res, {
      reservations: bookings.map((b) => ({
        id: b.resv_idx,
        resvIdx: b.resv_idx,
        mainOption: b.main_option,
        midOption: b.mid_option,
        subOption: b.sub_option,
        vehicleId: b.veh_idx,
        vehIdx: b.veh_idx,
        vehicleLocation: b.vehicle_location,
        contractYn: b.contract_yn,
        date: b.date,
        time: b.time,
        createdAt: b.create_date,
        createdDate: b.create_date,
        vehicle: b.vehicle
          ? {
              id: b.vehicle.veh_idx,
              vehicleType: b.vehicle.vehicle_type,
              model: b.vehicle.model,
              vehicleNumber: b.vehicle.vehicle_number,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return HandleControllerError(res, error, "예약 목록 조회 중 오류가 발생했습니다.");
  }
};

const SearchLogic2 = async (req, res) => {
  try {
    const booking = await ReservationService.SearchLogic2(
      req.user.memIdx,
      req.params.id,
    );
    return Ok(res, {
      reservation: {
        id: booking.resv_idx,
        resvIdx: booking.resv_idx,
        mainOption: booking.main_option,
        midOption: booking.mid_option,
        subOption: booking.sub_option,
        vehicleId: booking.veh_idx,
        vehIdx: booking.veh_idx,
        vehicleLocation: booking.vehicle_location,
        contractYn: booking.contract_yn,
        date: booking.date,
        time: booking.time,
        createdAt: booking.create_date,
        createdDate: booking.create_date,
        vehicle: booking.vehicle
          ? {
              id: booking.vehicle.veh_idx,
              vehicleType: booking.vehicle.vehicle_type,
              model: booking.vehicle.model,
              vehicleNumber: booking.vehicle.vehicle_number,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Get booking error:", error);
    return HandleControllerError(res, error, "예약 조회 중 오류가 발생했습니다.");
  }
};

const SaveLogic1 = async (req, res) => {
  try {
    const booking = await ReservationService.SaveLogic1(req.user.memIdx, req.body);
    return Ok(
      res,
      {
      message: "예약이 완료되었습니다.",
      reservation: {
        id: booking.resv_idx,
        resvIdx: booking.resv_idx,
        mainOption: booking.main_option,
        midOption: booking.mid_option,
        subOption: booking.sub_option,
        vehicleId: booking.veh_idx,
        vehIdx: booking.veh_idx,
        vehicleLocation: booking.vehicle_location,
        contractYn: booking.contract_yn,
        date: booking.date,
        time: booking.time,
        createdAt: booking.create_date,
        createdDate: booking.create_date,
      },
      },
      201,
    );
  } catch (error) {
    console.error("Create booking error:", error);
    return HandleControllerError(res, error, "예약 생성 중 오류가 발생했습니다.");
  }
};

const SaveLogic2 = async (req, res) => {
  try {
    const booking = await ReservationService.SaveLogic2(req.user.memIdx, req.params.id);
    return Ok(res, {
      message: "예약이 취소되었습니다.",
      reservation: {
        id: booking.resv_idx,
        resvIdx: booking.resv_idx,
        contractYn: booking.contract_yn,
      },
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return HandleControllerError(res, error, "예약 취소 중 오류가 발생했습니다.");
  }
};

module.exports = {
  SearchLogic1,
  SearchLogic2,
  SaveLogic1,
  SaveLogic2,
};

