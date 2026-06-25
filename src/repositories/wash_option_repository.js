const {
  WashOptionMaster,
  WashOptionDetail,
  BusinessMaster,
} = require("../models");
const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const businessMasterInclude = (memIdx) => ({
  model: BusinessMaster,
  as: "businessMaster",
  where: { mem_idx: memIdx },
  required: true,
});

const FindOwnedMaster = async (
  memIdx,
  woptMstIdx,
  errorCode = CODES.WASH_OPTION.NOT_FOUND_MASTER,
) => {
  const master = await WashOptionMaster.findByPk(woptMstIdx, {
    include: [businessMasterInclude(memIdx)],
  });
  if (!master) ThrowFromCode(errorCode);
  return master;
};

const FindMasterByOwner = async (memIdx, woptMstIdx) => {
  const master = await WashOptionMaster.findOne({
    where: { wopt_mst_idx: woptMstIdx },
    include: [businessMasterInclude(memIdx)],
  });
  if (!master) ThrowFromCode(CODES.WASH_OPTION.FORBIDDEN_MASTER);
  return master;
};

const FindOwnedDetail = async (memIdx, woptDtlIdx) => {
  const detail = await WashOptionDetail.findByPk(woptDtlIdx, {
    include: [
      {
        model: WashOptionMaster,
        as: "washOptionMaster",
        required: true,
        include: [businessMasterInclude(memIdx)],
      },
    ],
  });
  if (!detail) ThrowFromCode(CODES.WASH_OPTION.NOT_FOUND_DETAIL);
  return detail;
};

module.exports = {
  FindOwnedMaster,
  FindMasterByOwner,
  FindOwnedDetail,
};
