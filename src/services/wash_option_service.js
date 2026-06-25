const { sequelize } = require("../config/db");
const {
  WashOptionMaster,
  WashOptionDetail,
} = require("../models");
const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");
const { AssertBusinessOwner, FindById } = require("../repositories/business_repository");
const WashOptionRepository = require("../repositories/wash_option_repository");
const QueryRepository = require("../repositories/query_repository");

const normalizeMstInput = (body = {}) => ({
  option_name: body.option_name ?? body.optionName ?? null,
  vehicle_type: body.vehicle_type ?? body.vehicleType ?? null,
  seq:
    body.seq != null && String(body.seq).trim() !== "" ? Number(body.seq) : 0,
  value1:
    body.value1 != null && String(body.value1).trim() !== ""
      ? Number(body.value1)
      : null,
  value2:
    body.value2 != null && String(body.value2).trim() !== ""
      ? Number(body.value2)
      : null,
});

const normalizeDtlInput = (body = {}) => ({
  option_name: body.option_name ?? body.optionName ?? null,
  vehicle_type: body.vehicle_type ?? body.vehicleType ?? null,
  seq:
    body.seq != null && String(body.seq).trim() !== "" ? Number(body.seq) : 0,
  value1:
    body.value1 != null && String(body.value1).trim() !== ""
      ? Number(body.value1)
      : null,
  value2:
    body.value2 != null && String(body.value2).trim() !== ""
      ? Number(body.value2)
      : null,
});

const mstDetailsInclude = {
  model: WashOptionDetail,
  as: "washOptionDetails",
  required: false,
};

const SearchLogic1 = async (memIdx, query = {}) => {
  const { woptMstIdx, busMstIdx, optionName, vehicleType, limit, offset } =
    query;

  const where = {};
  if (woptMstIdx != null && String(woptMstIdx).trim() !== "")
    where.wopt_mst_idx = Number(woptMstIdx);
  if (busMstIdx != null && String(busMstIdx).trim() !== "")
    where.bus_mst_idx = Number(busMstIdx);
  if (optionName != null && String(optionName).trim() !== "")
    where.option_name = String(optionName).trim();
  if (vehicleType != null && String(vehicleType).trim() !== "")
    where.vehicle_type = String(vehicleType).trim();

  if (where.bus_mst_idx != null) {
    await AssertBusinessOwner(memIdx, where.bus_mst_idx);
  }

  return QueryRepository.FindAndCount(WashOptionMaster, {
    where,
    limit,
    offset,
    order: [
      ["seq", "ASC"],
      ["wopt_mst_idx", "ASC"],
    ],
    include: [mstDetailsInclude],
  });
};

const SaveLogic1 = async (memIdx, body = {}) => {
  if (body.bus_mst_idx == null && body.busMstIdx == null) {
    ThrowFromCode(CODES.WASH_OPTION.MISSING_BUS_MST_IDX);
  }

  const busMstIdx = body.bus_mst_idx ?? body.busMstIdx;
  await AssertBusinessOwner(memIdx, busMstIdx);

  const fields = normalizeMstInput(body);
  return QueryRepository.Upsert(WashOptionMaster, "wopt_mst_idx", {
    ...fields,
    bus_mst_idx: Number(busMstIdx),
    create_id: String(memIdx),
    update_id: String(memIdx),
  });
};

const SaveLogic2 = async (memIdx, woptMstIdx, body = {}) => {
  await WashOptionRepository.FindOwnedMaster(memIdx, woptMstIdx);

  const fields = normalizeMstInput(body);
  return QueryRepository.Upsert(WashOptionMaster, "wopt_mst_idx", {
    ...fields,
    wopt_mst_idx: Number(woptMstIdx),
    update_id: String(memIdx),
  });
};

const SearchLogic2 = async (memIdx, query = {}) => {
  const { woptDtlIdx, woptMstIdx, optionName, vehicleType, limit, offset } =
    query;

  const where = {};
  if (woptDtlIdx != null && String(woptDtlIdx).trim() !== "")
    where.wopt_dtl_idx = Number(woptDtlIdx);
  if (woptMstIdx != null && String(woptMstIdx).trim() !== "")
    where.wopt_mst_idx = Number(woptMstIdx);
  if (optionName != null && String(optionName).trim() !== "")
    where.option_name = String(optionName).trim();
  if (vehicleType != null && String(vehicleType).trim() !== "")
    where.vehicle_type = String(vehicleType).trim();

  if (where.wopt_mst_idx != null) {
    await WashOptionRepository.FindMasterByOwner(memIdx, where.wopt_mst_idx);
  }

  return QueryRepository.FindAndCount(WashOptionDetail, {
    where,
    limit,
    offset,
    order: [
      ["seq", "ASC"],
      ["wopt_dtl_idx", "ASC"],
    ],
  });
};

const SaveLogic3 = async (memIdx, body = {}) => {
  const woptMstIdx = body.wopt_mst_idx ?? body.woptMstIdx;
  if (woptMstIdx == null || String(woptMstIdx).trim() === "") {
    ThrowFromCode(CODES.WASH_OPTION.MISSING_WOPT_MST_IDX);
  }

  await WashOptionRepository.FindMasterByOwner(memIdx, woptMstIdx);

  const fields = normalizeDtlInput(body);
  return QueryRepository.Upsert(WashOptionDetail, "wopt_dtl_idx", {
    ...fields,
    wopt_mst_idx: Number(woptMstIdx),
    create_id: String(memIdx),
    update_id: String(memIdx),
  });
};

const SaveLogic4 = async (memIdx, woptDtlIdx, body = {}) => {
  await WashOptionRepository.FindOwnedDetail(memIdx, woptDtlIdx);

  const fields = normalizeDtlInput(body);
  return QueryRepository.Upsert(WashOptionDetail, "wopt_dtl_idx", {
    ...fields,
    wopt_dtl_idx: Number(woptDtlIdx),
    update_id: String(memIdx),
  });
};

const DeleteLogic1 = async (memIdx, woptMstIdx) => {
  const existing = await WashOptionRepository.FindOwnedMaster(
    memIdx,
    woptMstIdx,
  );

  await sequelize.transaction(async (transaction) => {
    await WashOptionDetail.destroy({
      where: { wopt_mst_idx: woptMstIdx },
      transaction,
    });
    await existing.destroy({ transaction });
  });
};

const DeleteLogic2 = async (memIdx, woptDtlIdx) => {
  const existing = await WashOptionRepository.FindOwnedDetail(
    memIdx,
    woptDtlIdx,
  );
  await existing.destroy();
};

const SearchLogic3 = async (query = {}) => {
  const { busMstIdx, optionName, vehicleType, limit, offset } = query;

  if (busMstIdx == null || String(busMstIdx).trim() === "") {
    ThrowFromCode(CODES.COMMON.BAD_REQUEST, "busMstIdx가 필요합니다.");
  }

  await FindById(busMstIdx, "사업장을 찾을 수 없습니다.");

  const where = { bus_mst_idx: Number(busMstIdx) };
  if (optionName != null && String(optionName).trim() !== "")
    where.option_name = String(optionName).trim();
  if (vehicleType != null && String(vehicleType).trim() !== "")
    where.vehicle_type = String(vehicleType).trim();

  return QueryRepository.FindAndCount(WashOptionMaster, {
    where,
    limit,
    offset,
    order: [
      ["seq", "ASC"],
      ["wopt_mst_idx", "ASC"],
    ],
    include: [mstDetailsInclude],
  });
};

module.exports = {
  SearchLogic1,
  SearchLogic2,
  SearchLogic3,
  SaveLogic1,
  SaveLogic2,
  SaveLogic3,
  SaveLogic4,
  DeleteLogic1,
  DeleteLogic2,
};
