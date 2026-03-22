const { sequelize } = require("../config/db");
const {
  WashOptionMaster,
  WashOptionDetail,
  BusinessMaster,
} = require("../models");
const { AppError } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

/** API camelCase / DB snake_case 공통 입력 정규화 */
const normalizeMstInput = (body = {}) => ({
  option_name: body.option_name ?? body.optionName ?? null,
  vehicle_type: body.vehicle_type ?? body.vehicleType ?? null,
  seq:
    body.seq != null && String(body.seq).trim() !== ""
      ? Number(body.seq)
      : 0,
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
    body.seq != null && String(body.seq).trim() !== ""
      ? Number(body.seq)
      : 0,
  value1:
    body.value1 != null && String(body.value1).trim() !== ""
      ? Number(body.value1)
      : null,
  value2:
    body.value2 != null && String(body.value2).trim() !== ""
      ? Number(body.value2)
      : null,
});

/**
 * 내부 공통 조회 헬퍼
 * - `findAndCountAll` 기반
 * - where/limit/offset/order/include/transaction 그대로 실행
 */
const SearchInternal = async (model, params = {}) => {
  const { where, limit, offset, order, transaction, include } = params;
  return await model.findAndCountAll({
    where: where || {},
    include: include || undefined,
    limit: Number.isFinite(Number(limit)) ? Number(limit) : undefined,
    offset: Number.isFinite(Number(offset)) ? Number(offset) : undefined,
    order: Array.isArray(order) && order.length > 0 ? order : undefined,
    transaction,
  });
};

/**
 * 내부 공통 저장(업서트) 헬퍼
 * - pk 값이 있으면 update, 없으면 create
 * - payload/존재여부 에러는 공통 코드로 통일
 */
const SaveInternal = async (model, pkField, payload, options = {}) => {
  const { transaction } = options;
  if (!payload || typeof payload !== "object") {
    throw new AppError(
      CODES.COMMON.BAD_REQUEST.code,
      CODES.COMMON.BAD_REQUEST.status,
      CODES.COMMON.BAD_REQUEST.message,
    );
  }

  const pk = payload[pkField];
  if (pk !== undefined && pk !== null && pk !== "") {
    const row = await model.findByPk(pk, { transaction });
    if (!row) {
      throw new AppError(
        CODES.COMMON.NOT_FOUND.code,
        CODES.COMMON.NOT_FOUND.status,
        CODES.COMMON.NOT_FOUND.message,
      );
    }
    return await row.update(payload, { transaction });
  }
  return await model.create(payload, { transaction });
};

/**
 * SearchLogic1
 * 세차 옵션(MST) 목록 조회
 * - 조건: woptMstIdx/busMstIdx/optionName/vehicleType
 * - 페이징: limit/offset
 * - 권한: busMstIdx가 있으면 본인(memIdx) 사업장인지 검증
 * - include: `washOptionDetails`(DTL 목록) 포함
 */
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
    const business = await BusinessMaster.findOne({
      where: { bus_mst_idx: where.bus_mst_idx, mem_idx: memIdx },
    });
    if (!business) {
      throw new AppError(
        CODES.WASH_OPTION.FORBIDDEN_BUSINESS.code,
        CODES.WASH_OPTION.FORBIDDEN_BUSINESS.status,
        CODES.WASH_OPTION.FORBIDDEN_BUSINESS.message,
      );
    }
  }

  return await SearchInternal(WashOptionMaster, {
    where,
    limit,
    offset,
    order: [
      ["seq", "ASC"],
      ["wopt_mst_idx", "ASC"],
    ],
    include: [
      {
        model: WashOptionDetail,
        as: "washOptionDetails",
        required: false,
      },
    ],
  });
};

/**
 * SaveLogic1
 * 세차 옵션(MST) 신규 저장
 * - busMstIdx 필수 + 본인 사업장 권한 검증 후 create
 */
const SaveLogic1 = async (memIdx, body = {}) => {
  if (body.bus_mst_idx == null && body.busMstIdx == null) {
    throw new AppError(
      CODES.WASH_OPTION.MISSING_BUS_MST_IDX.code,
      CODES.WASH_OPTION.MISSING_BUS_MST_IDX.status,
      CODES.WASH_OPTION.MISSING_BUS_MST_IDX.message,
    );
  }

  const busMstIdx = body.bus_mst_idx ?? body.busMstIdx;
  const business = await BusinessMaster.findOne({
    where: { bus_mst_idx: busMstIdx, mem_idx: memIdx },
  });
  if (!business) {
    throw new AppError(
      CODES.WASH_OPTION.FORBIDDEN_BUSINESS.code,
      CODES.WASH_OPTION.FORBIDDEN_BUSINESS.status,
      CODES.WASH_OPTION.FORBIDDEN_BUSINESS.message,
    );
  }

  const fields = normalizeMstInput(body);
  return await SaveInternal(WashOptionMaster, "wopt_mst_idx", {
    ...fields,
    bus_mst_idx: Number(busMstIdx),
    create_id: String(memIdx),
    update_id: String(memIdx),
  });
};

/**
 * SaveLogic2
 * 세차 옵션(MST) 수정 저장
 * - 대상 MST가 본인 사업장 소속인지 include로 권한 검증 후 update
 */
const SaveLogic2 = async (memIdx, woptMstIdx, body = {}) => {
  const existing = await WashOptionMaster.findByPk(woptMstIdx, {
    include: [
      {
        model: BusinessMaster,
        as: "businessMaster",
        where: { mem_idx: memIdx },
        required: true,
      },
    ],
  });
  if (!existing) {
    throw new AppError(
      CODES.WASH_OPTION.NOT_FOUND_MASTER.code,
      CODES.WASH_OPTION.NOT_FOUND_MASTER.status,
      CODES.WASH_OPTION.NOT_FOUND_MASTER.message,
    );
  }

  const fields = normalizeMstInput(body);
  return await SaveInternal(WashOptionMaster, "wopt_mst_idx", {
    ...fields,
    wopt_mst_idx: Number(woptMstIdx),
    update_id: String(memIdx),
  });
};

/**
 * SearchLogic2
 * 세차 옵션(DTL) 목록 조회
 * - 조건: woptDtlIdx/woptMstIdx/optionName/vehicleType
 * - 페이징: limit/offset
 * - 권한: woptMstIdx가 있으면 해당 MST가 본인 사업장 소속인지 검증
 */
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
    const master = await WashOptionMaster.findOne({
      where: { wopt_mst_idx: where.wopt_mst_idx },
      include: [
        {
          model: BusinessMaster,
          as: "businessMaster",
          where: { mem_idx: memIdx },
          required: true,
        },
      ],
    });
    if (!master) {
      throw new AppError(
        CODES.WASH_OPTION.FORBIDDEN_MASTER.code,
        CODES.WASH_OPTION.FORBIDDEN_MASTER.status,
        CODES.WASH_OPTION.FORBIDDEN_MASTER.message,
      );
    }
  }

  return await SearchInternal(WashOptionDetail, {
    where,
    limit,
    offset,
    order: [
      ["seq", "ASC"],
      ["wopt_dtl_idx", "ASC"],
    ],
  });
};

/**
 * SaveLogic3
 * 세차 옵션(DTL) 신규 저장
 * - woptMstIdx 필수 + 해당 MST 본인 사업장 권한 검증 후 create
 */
const SaveLogic3 = async (memIdx, body = {}) => {
  const woptMstIdx = body.wopt_mst_idx ?? body.woptMstIdx;
  if (woptMstIdx == null || String(woptMstIdx).trim() === "") {
    throw new AppError(
      CODES.WASH_OPTION.MISSING_WOPT_MST_IDX.code,
      CODES.WASH_OPTION.MISSING_WOPT_MST_IDX.status,
      CODES.WASH_OPTION.MISSING_WOPT_MST_IDX.message,
    );
  }

  const master = await WashOptionMaster.findOne({
    where: { wopt_mst_idx: woptMstIdx },
    include: [
      {
        model: BusinessMaster,
        as: "businessMaster",
        where: { mem_idx: memIdx },
        required: true,
      },
    ],
  });
  if (!master) {
    throw new AppError(
      CODES.WASH_OPTION.FORBIDDEN_MASTER.code,
      CODES.WASH_OPTION.FORBIDDEN_MASTER.status,
      CODES.WASH_OPTION.FORBIDDEN_MASTER.message,
    );
  }

  const fields = normalizeDtlInput(body);
  return await SaveInternal(WashOptionDetail, "wopt_dtl_idx", {
    ...fields,
    wopt_mst_idx: Number(woptMstIdx),
    create_id: String(memIdx),
    update_id: String(memIdx),
  });
};

/**
 * SaveLogic4
 * 세차 옵션(DTL) 수정 저장
 * - 대상 DTL이 본인 사업장 소속인지(MST→사업장) 권한 검증 후 update
 */
const SaveLogic4 = async (memIdx, woptDtlIdx, body = {}) => {
  const existing = await WashOptionDetail.findByPk(woptDtlIdx, {
    include: [
      {
        model: WashOptionMaster,
        as: "washOptionMaster",
        required: true,
        include: [
          {
            model: BusinessMaster,
            as: "businessMaster",
            where: { mem_idx: memIdx },
            required: true,
          },
        ],
      },
    ],
  });

  if (!existing) {
    throw new AppError(
      CODES.WASH_OPTION.NOT_FOUND_DETAIL.code,
      CODES.WASH_OPTION.NOT_FOUND_DETAIL.status,
      CODES.WASH_OPTION.NOT_FOUND_DETAIL.message,
    );
  }

  const fields = normalizeDtlInput(body);
  return await SaveInternal(WashOptionDetail, "wopt_dtl_idx", {
    ...fields,
    wopt_dtl_idx: Number(woptDtlIdx),
    update_id: String(memIdx),
  });
};

/**
 * DeleteLogic1 — MST 삭제 (하위 DTL 선삭제 후 MST 삭제)
 */
const DeleteLogic1 = async (memIdx, woptMstIdx) => {
  const existing = await WashOptionMaster.findByPk(woptMstIdx, {
    include: [
      {
        model: BusinessMaster,
        as: "businessMaster",
        where: { mem_idx: memIdx },
        required: true,
      },
    ],
  });
  if (!existing) {
    throw new AppError(
      CODES.WASH_OPTION.NOT_FOUND_MASTER.code,
      CODES.WASH_OPTION.NOT_FOUND_MASTER.status,
      CODES.WASH_OPTION.NOT_FOUND_MASTER.message,
    );
  }

  await sequelize.transaction(async (transaction) => {
    await WashOptionDetail.destroy({
      where: { wopt_mst_idx: woptMstIdx },
      transaction,
    });
    await existing.destroy({ transaction });
  });
};

/**
 * DeleteLogic2 — DTL 삭제
 */
const DeleteLogic2 = async (memIdx, woptDtlIdx) => {
  const existing = await WashOptionDetail.findByPk(woptDtlIdx, {
    include: [
      {
        model: WashOptionMaster,
        as: "washOptionMaster",
        required: true,
        include: [
          {
            model: BusinessMaster,
            as: "businessMaster",
            where: { mem_idx: memIdx },
            required: true,
          },
        ],
      },
    ],
  });
  if (!existing) {
    throw new AppError(
      CODES.WASH_OPTION.NOT_FOUND_DETAIL.code,
      CODES.WASH_OPTION.NOT_FOUND_DETAIL.status,
      CODES.WASH_OPTION.NOT_FOUND_DETAIL.message,
    );
  }
  await existing.destroy();
};

module.exports = {
  SearchLogic1,
  SearchLogic2,
  SaveLogic1,
  SaveLogic2,
  SaveLogic3,
  SaveLogic4,
  DeleteLogic1,
  DeleteLogic2,
};
