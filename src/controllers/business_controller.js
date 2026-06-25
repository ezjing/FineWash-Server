const BusinessService = require("../services/business_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");
const {
  MapRoom,
  MapBusinessReservation,
  MapBusiness,
} = require("../mappers/business_mapper");

const SaveLogic1 = AsyncHandler(async (req, res) => {
  const created = await BusinessService.SaveLogic1(
    req.user.memIdx,
    req.body || {},
  );
  return Ok(
    res,
    { business: MapBusiness({ ...created, businessDetails: [] }) },
    201,
  );
});

const SaveLogic2 = AsyncHandler(async (req, res) => {
  const business = await BusinessService.SaveLogic2(
    req.user.memIdx,
    req.params.busMstIdx,
    req.body || {},
  );
  return Ok(res, {
    business: MapBusiness({ ...business, businessDetails: [] }),
  });
});

const SearchLogic1 = AsyncHandler(async (req, res) => {
  const { room, reservations, totalRevenue } =
    await BusinessService.SearchLogic1(req.user.memIdx, req.params.busDtlIdx);

  return Ok(res, {
    room: MapRoom(room),
    reservations: Array.isArray(reservations)
      ? reservations.map(MapBusinessReservation)
      : [],
    totalRevenue,
  });
});

const SaveLogic3 = AsyncHandler(async (req, res) => {
  const room = await BusinessService.SaveLogic3(
    req.user.memIdx,
    req.body || {},
  );
  return Ok(res, { room: MapRoom(room) }, 201);
});

const SaveLogic4 = AsyncHandler(async (req, res) => {
  const room = await BusinessService.SaveLogic4(
    req.user.memIdx,
    req.params.busDtlIdx,
    req.body || {},
  );
  return Ok(res, { room: MapRoom(room) });
});

const SaveLogic5 = AsyncHandler(async (req, res) => {
  const result = await BusinessService.SaveLogic5(
    req.user.memIdx,
    req.params.busDtlIdx,
  );

  if (result.deleted === false) {
    return Ok(res, {
      deleted: false,
      message: "예약 내역이 있어 삭제할 수 없어 비활성 처리했습니다.",
      room: MapRoom(result.room),
    });
  }

  return Ok(res, { deleted: true });
});

const SearchLogic2 = AsyncHandler(async (req, res) => {
  const businesses = await BusinessService.SearchLogic2(req.user.memIdx);
  return Ok(res, {
    businesses: Array.isArray(businesses)
      ? businesses.map((b) => MapBusiness(b, { includeUpdatedAt: false }))
      : [],
  });
});

const SearchLogic3 = AsyncHandler(async (req, res) => {
  const business = await BusinessService.SearchLogic3(
    req.user.memIdx,
    req.params.id,
  );
  return Ok(res, { business: MapBusiness(business) });
});

const SaveLogic6 = AsyncHandler(async (req, res) => {
  await BusinessService.SaveLogic6(req.user.memIdx, req.params.busMstIdx);
  return Ok(res, { deleted: true });
});

const SearchLogic4 = AsyncHandler(async (req, res) => {
  const { lat, lng, latitude, longitude, limit } = req.query || {};
  const businesses = await BusinessService.SearchLogic4(
    lat ?? latitude,
    lng ?? longitude,
    limit,
  );
  return Ok(res, { businesses });
});

module.exports = {
  SaveLogic1,
  SaveLogic2,
  SearchLogic1,
  SaveLogic3,
  SaveLogic4,
  SaveLogic5,
  SaveLogic6,
  SearchLogic2,
  SearchLogic3,
  SearchLogic4,
};
