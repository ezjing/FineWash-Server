const { BusinessMaster, BusinessDetail } = require("../models");
const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

/** 본인 소유 사업장 조회 — 없으면 NOT_FOUND_BUSINESS */
const FindOwnedBusiness = async (memIdx, busMstIdx) => {
  const business = await BusinessMaster.findOne({
    where: { bus_mst_idx: busMstIdx, mem_idx: memIdx },
  });
  if (!business) ThrowFromCode(CODES.BUSINESS.NOT_FOUND_BUSINESS);
  return business;
};

/** 본인 소유 사업장 권한 검증 — 없으면 FORBIDDEN_BUSINESS (스케줄/옵션 등) */
const AssertBusinessOwner = async (memIdx, busMstIdx) => {
  const business = await BusinessMaster.findOne({
    where: { bus_mst_idx: busMstIdx, mem_idx: memIdx },
  });
  if (!business) ThrowFromCode(CODES.BUSINESS.FORBIDDEN);
  return business;
};

/** 공개 API용 사업장 존재 여부 확인 */
const FindById = async (busMstIdx) => {
  const business = await BusinessMaster.findOne({
    where: { bus_mst_idx: Number(busMstIdx) },
  });
  if (!business) ThrowFromCode(CODES.BUSINESS.NOT_FOUND_BUSINESS);
  return business;
};

/** 본인 소유 룸(DTL) 조회 — BusinessMaster include로 소유권 검증 */
const FindOwnedRoom = async (memIdx, busDtlIdx) => {
  const room = await BusinessDetail.findOne({
    where: { bus_dtl_idx: busDtlIdx },
    include: [
      {
        model: BusinessMaster,
        as: "businessMaster",
        where: { mem_idx: memIdx },
        required: true,
      },
    ],
  });
  if (!room) ThrowFromCode(CODES.BUSINESS.NOT_FOUND_ROOM);
  return room;
};

module.exports = {
  FindOwnedBusiness,
  AssertBusinessOwner,
  FindById,
  FindOwnedRoom,
};
