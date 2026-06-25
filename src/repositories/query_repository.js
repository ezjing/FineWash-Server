const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

/**
 * findAndCountAll 공통 래퍼
 */
const FindAndCount = async (model, params = {}) => {
  const { where, limit, offset, order, transaction, include } = params;
  return model.findAndCountAll({
    where: where || {},
    include: include || undefined,
    limit: Number.isFinite(Number(limit)) ? Number(limit) : undefined,
    offset: Number.isFinite(Number(offset)) ? Number(offset) : undefined,
    order: Array.isArray(order) && order.length > 0 ? order : undefined,
    transaction,
  });
};

/**
 * pk가 있으면 update, 없으면 create
 */
const Upsert = async (model, pkField, payload, options = {}) => {
  const { transaction } = options;
  if (!payload || typeof payload !== "object") {
    ThrowFromCode(CODES.COMMON.BAD_REQUEST);
  }

  const pk = payload[pkField];
  if (pk !== undefined && pk !== null && pk !== "") {
    const row = await model.findByPk(pk, { transaction });
    if (!row) ThrowFromCode(CODES.COMMON.NOT_FOUND);
    return row.update(payload, { transaction });
  }
  return model.create(payload, { transaction });
};

module.exports = {
  FindAndCount,
  Upsert,
};
