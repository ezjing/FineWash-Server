const ReservationService = require("../services/reservation_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");

const MapVehicleSummary = (v) =>
  v
    ? {
        id: v.veh_idx,
        vehicleType: v.vehicle_type,
        model: v.model,
        vehicleNumber: v.vehicle_number,
      }
    : null;

const MapReservation = (b) => ({
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
  vehicle: MapVehicleSummary(b.vehicle),
});

const SearchLogic1 = AsyncHandler(async (req, res) => {
  const bookings = await ReservationService.SearchLogic1(req.user.memIdx);
  return Ok(res, {
    reservations: Array.isArray(bookings) ? bookings.map(MapReservation) : [],
  });
});

const SearchLogic2 = AsyncHandler(async (req, res) => {
  const booking = await ReservationService.SearchLogic2(req.user.memIdx, req.params.id);
  return Ok(res, { reservation: MapReservation(booking) });
});

const SaveLogic1 = AsyncHandler(async (req, res) => {
  const booking = await ReservationService.SaveLogic1(req.user.memIdx, req.body);
  return Ok(
    res,
    { message: "예약이 완료되었습니다.", reservation: MapReservation(booking) },
    201,
  );
});

const SaveLogic2 = AsyncHandler(async (req, res) => {
  const booking = await ReservationService.SaveLogic2(req.user.memIdx, req.params.id);
  return Ok(res, {
    message: "예약이 취소되었습니다.",
    reservation: { id: booking.resv_idx, resvIdx: booking.resv_idx, contractYn: booking.contract_yn },
  });
});

module.exports = {
  SearchLogic1,
  SearchLogic2,
  SaveLogic1,
  SaveLogic2,
};
