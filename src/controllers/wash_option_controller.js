const WashOptionService = require("../services/wash_option_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");

const mapMstRow = (m) => ({
  woptMstIdx: m.wopt_mst_idx,
  busMstIdx: m.bus_mst_idx,
  optionName: m.option_name,
  vehicleType: m.vehicle_type,
  seq: m.seq,
  value1: m.value1,
  value2: m.value2,
  createId: m.create_id,
  createDate: m.create_date,
  updateId: m.update_id,
  updateDate: m.update_date,
});

const mapDtlRow = (d) => ({
  woptDtlIdx: d.wopt_dtl_idx,
  woptMstIdx: d.wopt_mst_idx,
  optionName: d.option_name,
  vehicleType: d.vehicle_type,
  seq: d.seq,
  value1: d.value1,
  value2: d.value2,
  createId: d.create_id,
  createDate: d.create_date,
  updateId: d.update_id,
  updateDate: d.update_date,
});

const SearchLogic1 = AsyncHandler(async (req, res) => {
  const result = await WashOptionService.SearchLogic1(req.user.memIdx, req.query);
  return Ok(res, {
    count: result.count,
    rows: (result.rows || []).map((m) => ({
      ...mapMstRow(m),
      details: (m.washOptionDetails || []).map(mapDtlRow),
    })),
  });
});

const SaveLogic1 = AsyncHandler(async (req, res) => {
  const saved = await WashOptionService.SaveLogic1(req.user.memIdx, req.body || {});
  return Ok(res, { row: mapMstRow(saved) }, 201);
});

const SaveLogic2 = AsyncHandler(async (req, res) => {
  const saved = await WashOptionService.SaveLogic2(
    req.user.memIdx,
    req.params.woptMstIdx,
    req.body || {},
  );
  return Ok(res, { row: mapMstRow(saved) });
});

const SearchLogic2 = AsyncHandler(async (req, res) => {
  const result = await WashOptionService.SearchLogic2(req.user.memIdx, req.query);
  return Ok(res, { count: result.count, rows: (result.rows || []).map(mapDtlRow) });
});

// 공개 조회: 제휴 세차장 옵션 조회 (인증 불필요)
const SearchLogic3 = AsyncHandler(async (req, res) => {
  const result = await WashOptionService.SearchLogic3(req.query);
  return Ok(res, {
    count: result.count,
    rows: (result.rows || []).map((m) => ({
      ...mapMstRow(m),
      details: (m.washOptionDetails || []).map(mapDtlRow),
    })),
  });
});

const SaveLogic3 = AsyncHandler(async (req, res) => {
  const saved = await WashOptionService.SaveLogic3(req.user.memIdx, req.body || {});
  return Ok(res, { row: mapDtlRow(saved) }, 201);
});

const SaveLogic4 = AsyncHandler(async (req, res) => {
  const saved = await WashOptionService.SaveLogic4(
    req.user.memIdx,
    req.params.woptDtlIdx,
    req.body || {},
  );
  return Ok(res, { row: mapDtlRow(saved) });
});

const DeleteLogic1 = AsyncHandler(async (req, res) => {
  await WashOptionService.DeleteLogic1(req.user.memIdx, req.params.woptMstIdx);
  return Ok(res, { deleted: true });
});

const DeleteLogic2 = AsyncHandler(async (req, res) => {
  await WashOptionService.DeleteLogic2(req.user.memIdx, req.params.woptDtlIdx);
  return Ok(res, { deleted: true });
});

module.exports = {
  SearchLogic1,
  SaveLogic1,
  SaveLogic2,
  SearchLogic2,
  SearchLogic3,
  SaveLogic3,
  SaveLogic4,
  DeleteLogic1,
  DeleteLogic2,
};
