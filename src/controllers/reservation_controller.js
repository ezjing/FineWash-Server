const ReservationService = require("../services/reservation_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");
const {
  MapReservation,
  MapReservationStatus,
  MapApprovedReservation,
} = require("../mappers/reservation_mapper");

const SearchLogic1 = AsyncHandler(async (req, res) => {
  const bookings = await ReservationService.SearchLogic1(req.user.memIdx);
  return Ok(res, {
    reservations: Array.isArray(bookings) ? bookings.map(MapReservation) : [],
  });
});

const SearchLogic2 = AsyncHandler(async (req, res) => {
  const booking = await ReservationService.SearchLogic2(
    req.user.memIdx,
    req.params.id,
  );
  return Ok(res, { reservation: MapReservation(booking) });
});

const SaveLogic1 = AsyncHandler(async (req, res) => {
  const booking = await ReservationService.SaveLogic1(req.user.memIdx, req.body);
  return Ok(
    res,
    {
      message: "예약이 완료되었습니다.",
      reservation: MapReservation(booking),
    },
    201,
  );
});

const SaveLogic2 = AsyncHandler(async (req, res) => {
  const booking = await ReservationService.SaveLogic2(
    req.user.memIdx,
    req.params.id,
  );
  return Ok(res, {
    message: "예약이 취소되었습니다.",
    reservation: MapReservationStatus(booking),
  });
});

const SaveLogic3 = AsyncHandler(async (req, res) => {
  const booking = await ReservationService.SaveLogic3(req.params.id);
  return Ok(res, {
    message: "예약이 거절되었습니다.",
    reservation: MapReservationStatus(booking),
  });
});

const SaveLogic4 = AsyncHandler(async (req, res) => {
  const booking = await ReservationService.SaveLogic4(req.params.id, req.body);
  return Ok(res, {
    message: "예약이 승인되었습니다.",
    reservation: MapApprovedReservation(booking),
  });
});

module.exports = {
  SearchLogic1,
  SearchLogic2,
  SaveLogic1,
  SaveLogic2,
  SaveLogic3,
  SaveLogic4,
};
