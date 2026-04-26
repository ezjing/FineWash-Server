const BusinessService = require("../services/business_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");

const MapRoom = (room) => ({
  busDtlIdx: room.bus_dtl_idx,
  busMstIdx: room.bus_mst_idx,
  roomName: room.room_name,
  activeYn: room.active_yn,
  startDate: room.start_date,
  endDate: room.end_date,
});

const MapReservation = (r) => ({
  resvIdx: r.resv_idx,
  busDtlIdx: r.bus_dtl_idx,
  memIdx: r.mem_idx,
  vehIdx: r.veh_idx,
  mainOption: r.main_option,
  midOption: r.mid_option,
  subOption: r.sub_option,
  vehicleLocation: r.vehicle_location,
  contractYn: r.contract_yn,
  date: r.date,
  time: r.time,
  paymentAmount: r.payment_amount,
  createdDate: r.create_date,
  updateDate: r.update_date,
});

const MapBusinessDetail = (bd) => ({
  id: bd.bus_dtl_idx,
  busDtlIdx: bd.bus_dtl_idx,
  busMstIdx: bd.bus_mst_idx,
  roomName: bd.room_name,
  activeYn: bd.active_yn,
  startDate: bd.start_date,
  endDate: bd.end_date,
});

const MapBusiness = (b) => ({
  id: b.bus_mst_idx,
  busMstIdx: b.bus_mst_idx,
  memIdx: b.mem_idx,
  businessNumber: b.business_number,
  companyName: b.company_name,
  phone: b.phone,
  email: b.email,
  address: b.address,
  detailAddress: b.detail_address,
  latitude: b.latitude,
  longitude: b.longitude,
  businessType: b.business_type,
  depositYn: b.deposit_yn,
  depositAmount: b.deposit_amount,
  remark: b.remark,
  businessDetails: Array.isArray(b.businessDetails)
    ? b.businessDetails.map(MapBusinessDetail)
    : [],
  createdAt: b.create_date,
  updatedAt: b.update_date,
});

const SaveLogic1 = AsyncHandler(async (req, res) => {
  const created = await BusinessService.SaveLogic1(req.user.memIdx, req.body || {});
  return Ok(res, { business: MapBusiness({ ...created, businessDetails: [] }) }, 201);
});

const SaveLogic2 = AsyncHandler(async (req, res) => {
  const business = await BusinessService.SaveLogic2(
    req.user.memIdx,
    req.params.busMstIdx,
    req.body || {},
  );
  return Ok(res, { business: MapBusiness({ ...business, businessDetails: [] }) });
});

const SearchLogic1 = AsyncHandler(async (req, res) => {
  const { room, reservations, totalRevenue } = await BusinessService.SearchLogic1(
    req.user.memIdx,
    req.params.busDtlIdx,
  );

  return Ok(res, {
    room: MapRoom(room),
    reservations: Array.isArray(reservations) ? reservations.map(MapReservation) : [],
    totalRevenue,
  });
});

const SaveLogic3 = AsyncHandler(async (req, res) => {
  const room = await BusinessService.SaveLogic3(req.user.memIdx, req.body || {});
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
  const result = await BusinessService.SaveLogic5(req.user.memIdx, req.params.busDtlIdx);

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
      ? businesses.map((b) => {
          const mapped = MapBusiness(b);
          // 목록에서는 updatedAt이 필요 없으면 제거(가독성)
          // eslint-disable-next-line no-unused-vars
          const { updatedAt, ...rest } = mapped;
          return rest;
        })
      : [],
  });
});

const SearchLogic3 = AsyncHandler(async (req, res) => {
  const business = await BusinessService.SearchLogic3(req.user.memIdx, req.params.id);
  return Ok(res, { business: MapBusiness(business) });
});

const SaveLogic6 = AsyncHandler(async (req, res) => {
  await BusinessService.SaveLogic6(req.user.memIdx, req.params.busMstIdx);
  return Ok(res, { deleted: true });
});

// 좌표 기반 가까운 제휴 세차장 거리순 조회 (공개)
const SearchLogic4 = AsyncHandler(async (req, res) => {
  const { lat, lng, latitude, longitude, limit } = req.query || {};
  const userLat = lat ?? latitude;
  const userLng = lng ?? longitude;
  const businesses = await BusinessService.SearchLogic4(userLat, userLng, limit);
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
