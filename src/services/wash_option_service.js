const { WashOptionMaster, WashOptionDetail, BusinessMaster } = require("../models");

const SearchLogic1 = async (model, params = {}) => {
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

const SaveLogic1 = async (model, pkField, payload, options = {}) => {
  const { transaction } = options;
  if (!payload || typeof payload !== "object") throw new Error("payload is required");

  const pk = payload[pkField];
  if (pk !== undefined && pk !== null && pk !== "") {
    const row = await model.findByPk(pk, { transaction });
    if (!row) throw new Error(`${model?.name || "Row"} not found`);
    return await row.update(payload, { transaction });
  }
  return await model.create(payload, { transaction });
};

const SearchMasters = async (memIdx, query = {}) => {
  const { woptMstIdx, busMstIdx, optionName, vehicleType, limit, offset } = query;

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
      const err = new Error("FORBIDDEN_BUSINESS");
      err.statusCode = 403;
      throw err;
    }
  }

  return await SearchLogic1(WashOptionMaster, {
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

const CreateMaster = async (memIdx, body = {}) => {
  if (body.bus_mst_idx == null && body.busMstIdx == null) {
    const err = new Error("MISSING_BUS_MST_IDX");
    err.statusCode = 400;
    throw err;
  }

  const busMstIdx = body.bus_mst_idx ?? body.busMstIdx;
  const business = await BusinessMaster.findOne({
    where: { bus_mst_idx: busMstIdx, mem_idx: memIdx },
  });
  if (!business) {
    const err = new Error("FORBIDDEN_BUSINESS");
    err.statusCode = 403;
    throw err;
  }

  return await SaveLogic1(WashOptionMaster, "wopt_mst_idx", {
    ...body,
    bus_mst_idx: Number(busMstIdx),
    create_id: String(memIdx),
    update_id: String(memIdx),
  });
};

const UpdateMaster = async (memIdx, woptMstIdx, body = {}) => {
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
    const err = new Error("NOT_FOUND_MASTER");
    err.statusCode = 404;
    throw err;
  }

  return await SaveLogic1(WashOptionMaster, "wopt_mst_idx", {
    ...body,
    wopt_mst_idx: Number(woptMstIdx),
    update_id: String(memIdx),
  });
};

const SearchDetails = async (memIdx, query = {}) => {
  const { woptDtlIdx, woptMstIdx, optionName, vehicleType, limit, offset } = query;

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
      const err = new Error("FORBIDDEN_MASTER");
      err.statusCode = 403;
      throw err;
    }
  }

  return await SearchLogic1(WashOptionDetail, {
    where,
    limit,
    offset,
    order: [
      ["seq", "ASC"],
      ["wopt_dtl_idx", "ASC"],
    ],
  });
};

const CreateDetail = async (memIdx, body = {}) => {
  const woptMstIdx = body.wopt_mst_idx ?? body.woptMstIdx;
  if (woptMstIdx == null || String(woptMstIdx).trim() === "") {
    const err = new Error("MISSING_WOPT_MST_IDX");
    err.statusCode = 400;
    throw err;
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
    const err = new Error("FORBIDDEN_MASTER");
    err.statusCode = 403;
    throw err;
  }

  return await SaveLogic1(WashOptionDetail, "wopt_dtl_idx", {
    ...body,
    wopt_mst_idx: Number(woptMstIdx),
    create_id: String(memIdx),
    update_id: String(memIdx),
  });
};

const UpdateDetail = async (memIdx, woptDtlIdx, body = {}) => {
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
    const err = new Error("NOT_FOUND_DETAIL");
    err.statusCode = 404;
    throw err;
  }

  return await SaveLogic1(WashOptionDetail, "wopt_dtl_idx", {
    ...body,
    wopt_dtl_idx: Number(woptDtlIdx),
    update_id: String(memIdx),
  });
};

module.exports = {
  SearchLogic1,
  SaveLogic1,
  SearchMasters,
  CreateMaster,
  UpdateMaster,
  SearchDetails,
  CreateDetail,
  UpdateDetail,
};

