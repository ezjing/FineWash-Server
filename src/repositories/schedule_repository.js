const {
  ScheduleMaster,
  ScheduleDetail,
  BusinessMaster,
} = require("../models");
const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const FindOwnedMaster = async (memIdx, schMstIdx) => {
  const master = await ScheduleMaster.findByPk(schMstIdx, {
    include: [
      {
        model: BusinessMaster,
        as: "businessMaster",
        where: { mem_idx: memIdx },
        required: true,
      },
    ],
  });
  if (!master) ThrowFromCode(CODES.COMMON.NOT_FOUND);
  return master;
};

const FindOwnedDetail = async (memIdx, schDtlIdx) => {
  const detail = await ScheduleDetail.findByPk(schDtlIdx, {
    include: [
      {
        model: ScheduleMaster,
        as: "scheduleMaster",
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
  if (!detail) ThrowFromCode(CODES.COMMON.NOT_FOUND);
  return detail;
};

module.exports = {
  FindOwnedMaster,
  FindOwnedDetail,
};
