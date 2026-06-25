const WashOptionService = require("../services/wash_option_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");
const {
  MapMstRow,
  MapDtlRow,
  MapMstWithDetails,
} = require("../mappers/wash_option_mapper");

const SearchLogic1 = AsyncHandler(async (req, res) => {
  const result = await WashOptionService.SearchLogic1(
    req.user.memIdx,
    req.query,
  );
  return Ok(res, {
    count: result.count,
    rows: (result.rows || []).map(MapMstWithDetails),
  });
});

const SaveLogic1 = AsyncHandler(async (req, res) => {
  const saved = await WashOptionService.SaveLogic1(
    req.user.memIdx,
    req.body || {},
  );
  return Ok(res, { row: MapMstRow(saved) }, 201);
});

const SaveLogic2 = AsyncHandler(async (req, res) => {
  const saved = await WashOptionService.SaveLogic2(
    req.user.memIdx,
    req.params.woptMstIdx,
    req.body || {},
  );
  return Ok(res, { row: MapMstRow(saved) });
});

const SearchLogic2 = AsyncHandler(async (req, res) => {
  const result = await WashOptionService.SearchLogic2(
    req.user.memIdx,
    req.query,
  );
  return Ok(res, {
    count: result.count,
    rows: (result.rows || []).map(MapDtlRow),
  });
});

const SearchLogic3 = AsyncHandler(async (req, res) => {
  const result = await WashOptionService.SearchLogic3(req.query);
  return Ok(res, {
    count: result.count,
    rows: (result.rows || []).map(MapMstWithDetails),
  });
});

const SaveLogic3 = AsyncHandler(async (req, res) => {
  const saved = await WashOptionService.SaveLogic3(
    req.user.memIdx,
    req.body || {},
  );
  return Ok(res, { row: MapDtlRow(saved) }, 201);
});

const SaveLogic4 = AsyncHandler(async (req, res) => {
  const saved = await WashOptionService.SaveLogic4(
    req.user.memIdx,
    req.params.woptDtlIdx,
    req.body || {},
  );
  return Ok(res, { row: MapDtlRow(saved) });
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
