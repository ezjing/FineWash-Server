const { Op } = require("sequelize");
const {
  ScheduleMaster,
  ScheduleDetail,
  BusinessMaster,
} = require("../models");
const { AppError } = require("../utils/app_error");
const CODES = require("../utils/error_codes");

const yn = (value, fallback = "N") => {
  const v = value ?? fallback;
  return v === "Y" || v === true || v === "true" || v === 1 ? "Y" : "N";
};

const normalizeTime = (value) => {
  if (value == null || String(value).trim() === "") return null;
  const raw = String(value).trim();
  if (/^\d{2}:\d{2}$/.test(raw)) return `${raw}:00`;
  return raw;
};

const formatTimeForApi = (value) => {
  if (value == null) return null;
  const raw = String(value);
  return raw.length >= 5 ? raw.substring(0, 5) : raw;
};

const normalizeMstInput = (body = {}) => ({
  monday_yn: yn(body.monday_yn ?? body.mondayYn),
  tuesday_yn: yn(body.tuesday_yn ?? body.tuesdayYn),
  wednesday_yn: yn(body.wednesday_yn ?? body.wednesdayYn),
  thursday_yn: yn(body.thursday_yn ?? body.thursdayYn),
  friday_yn: yn(body.friday_yn ?? body.fridayYn),
  saturday_yn: yn(body.saturday_yn ?? body.saturdayYn),
  sunday_yn: yn(body.sunday_yn ?? body.sundayYn),
  start_time: normalizeTime(body.start_time ?? body.startTime),
  end_time: normalizeTime(body.end_time ?? body.endTime),
});

const normalizeDtlInput = (body = {}) => ({
  schedule_date: body.schedule_date ?? body.scheduleDate ?? null,
  holiday_yn: yn(body.holiday_yn ?? body.holidayYn),
  start_time: normalizeTime(body.start_time ?? body.startTime),
  end_time: normalizeTime(body.end_time ?? body.endTime),
});

const assertBusinessOwner = async (memIdx, busMstIdx) => {
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
  return business;
};

const assertMasterOwner = async (memIdx, schMstIdx) => {
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
  if (!master) {
    throw new AppError(
      CODES.COMMON.NOT_FOUND.code,
      CODES.COMMON.NOT_FOUND.status,
      CODES.COMMON.NOT_FOUND.message,
    );
  }
  return master;
};

const assertDetailOwner = async (memIdx, schDtlIdx) => {
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
  if (!detail) {
    throw new AppError(
      CODES.COMMON.NOT_FOUND.code,
      CODES.COMMON.NOT_FOUND.status,
      CODES.COMMON.NOT_FOUND.message,
    );
  }
  return detail;
};

const getMonthRange = (year, month) => {
  const y = Number(year);
  const m = Number(month);
  const startDate = `${y}-${String(m).padStart(2, "0")}-01`;
  const lastDay = new Date(y, m, 0).getDate();
  const endDate = `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { startDate, endDate };
};

/** SearchLogic1: 스케줄 MST 조회 (busMstIdx 필수) */
const SearchLogic1 = async (memIdx, query = {}) => {
  const busMstIdx = query.busMstIdx ?? query.bus_mst_idx;
  if (busMstIdx == null || String(busMstIdx).trim() === "") {
    throw new AppError(
      CODES.WASH_OPTION.MISSING_BUS_MST_IDX.code,
      CODES.WASH_OPTION.MISSING_BUS_MST_IDX.status,
      CODES.WASH_OPTION.MISSING_BUS_MST_IDX.message,
    );
  }

  await assertBusinessOwner(memIdx, Number(busMstIdx));

  const rows = await ScheduleMaster.findAll({
    where: { bus_mst_idx: Number(busMstIdx) },
    order: [["sch_mst_idx", "DESC"]],
  });

  return { count: rows.length, rows };
};

/** SaveLogic1: 스케줄 MST 생성 */
const SaveLogic1 = async (memIdx, body = {}) => {
  const busMstIdx = body.bus_mst_idx ?? body.busMstIdx;
  if (busMstIdx == null) {
    throw new AppError(
      CODES.WASH_OPTION.MISSING_BUS_MST_IDX.code,
      CODES.WASH_OPTION.MISSING_BUS_MST_IDX.status,
      CODES.WASH_OPTION.MISSING_BUS_MST_IDX.message,
    );
  }

  await assertBusinessOwner(memIdx, Number(busMstIdx));

  const fields = normalizeMstInput(body);
  return await ScheduleMaster.create({
    ...fields,
    bus_mst_idx: Number(busMstIdx),
    create_id: String(memIdx),
    update_id: String(memIdx),
  });
};

/** SaveLogic2: 스케줄 MST 수정 */
const SaveLogic2 = async (memIdx, schMstIdx, body = {}) => {
  const existing = await assertMasterOwner(memIdx, schMstIdx);
  const fields = normalizeMstInput(body);
  return await existing.update({
    ...fields,
    update_id: String(memIdx),
  });
};

/** DeleteLogic1: 스케줄 MST 삭제 */
const DeleteLogic1 = async (memIdx, schMstIdx) => {
  const existing = await assertMasterOwner(memIdx, schMstIdx);
  await ScheduleDetail.destroy({ where: { sch_mst_idx: schMstIdx } });
  await existing.destroy();
  return { deleted: true };
};

/** SearchLogic2: 스케줄 DTL 월별 조회 */
const SearchLogic2 = async (memIdx, query = {}) => {
  const { year, month } = query;
  let schMstIdx = query.schMstIdx ?? query.sch_mst_idx;

  if (schMstIdx == null) {
    const busMstIdx = query.busMstIdx ?? query.bus_mst_idx;
    if (busMstIdx == null) {
      throw new AppError(
        CODES.COMMON.BAD_REQUEST.code,
        CODES.COMMON.BAD_REQUEST.status,
        "schMstIdx 또는 busMstIdx는 필수입니다.",
      );
    }
    await assertBusinessOwner(memIdx, Number(busMstIdx));
    const master = await ScheduleMaster.findOne({
      where: { bus_mst_idx: Number(busMstIdx) },
      order: [["sch_mst_idx", "DESC"]],
    });
    if (!master) {
      return { count: 0, rows: [] };
    }
    schMstIdx = master.sch_mst_idx;
  } else {
    await assertMasterOwner(memIdx, Number(schMstIdx));
  }

  if (year == null || month == null) {
    throw new AppError(
      CODES.COMMON.BAD_REQUEST.code,
      CODES.COMMON.BAD_REQUEST.status,
      "year, month는 필수입니다.",
    );
  }

  const { startDate, endDate } = getMonthRange(year, month);
  const rows = await ScheduleDetail.findAll({
    where: {
      sch_mst_idx: Number(schMstIdx),
      schedule_date: { [Op.between]: [startDate, endDate] },
    },
    order: [["schedule_date", "ASC"]],
  });

  return { count: rows.length, rows, schMstIdx: Number(schMstIdx) };
};

/** SaveLogic3: 스케줄 DTL 생성 (동일 일자 있으면 수정) */
const SaveLogic3 = async (memIdx, body = {}) => {
  const schMstIdx = body.sch_mst_idx ?? body.schMstIdx;
  if (schMstIdx == null) {
    throw new AppError(
      CODES.COMMON.BAD_REQUEST.code,
      CODES.COMMON.BAD_REQUEST.status,
      "schMstIdx는 필수입니다.",
    );
  }

  await assertMasterOwner(memIdx, Number(schMstIdx));

  const fields = normalizeDtlInput(body);
  if (!fields.schedule_date) {
    throw new AppError(
      CODES.COMMON.BAD_REQUEST.code,
      CODES.COMMON.BAD_REQUEST.status,
      "scheduleDate는 필수입니다.",
    );
  }

  if (fields.holiday_yn === "Y") {
    fields.start_time = null;
    fields.end_time = null;
  } else if (!fields.start_time || !fields.end_time) {
    throw new AppError(
      CODES.COMMON.BAD_REQUEST.code,
      CODES.COMMON.BAD_REQUEST.status,
      "연장근무는 시작/종료 시간이 필요합니다.",
    );
  }

  const existing = await ScheduleDetail.findOne({
    where: {
      sch_mst_idx: Number(schMstIdx),
      schedule_date: fields.schedule_date,
    },
  });

  if (existing) {
    return await existing.update({
      ...fields,
      update_id: String(memIdx),
    });
  }

  return await ScheduleDetail.create({
    ...fields,
    sch_mst_idx: Number(schMstIdx),
    create_id: String(memIdx),
    update_id: String(memIdx),
  });
};

/** SaveLogic4: 스케줄 DTL 수정 */
const SaveLogic4 = async (memIdx, schDtlIdx, body = {}) => {
  const existing = await assertDetailOwner(memIdx, schDtlIdx);
  const fields = normalizeDtlInput(body);

  if (fields.schedule_date == null) {
    fields.schedule_date = existing.schedule_date;
  }

  if (fields.holiday_yn === "Y") {
    fields.start_time = null;
    fields.end_time = null;
  } else if (
    (fields.start_time == null && existing.start_time == null) ||
    (fields.end_time == null && existing.end_time == null)
  ) {
    throw new AppError(
      CODES.COMMON.BAD_REQUEST.code,
      CODES.COMMON.BAD_REQUEST.status,
      "연장근무는 시작/종료 시간이 필요합니다.",
    );
  }

  return await existing.update({
    ...fields,
    update_id: String(memIdx),
  });
};

/** DeleteLogic2: 스케줄 DTL 삭제 */
const DeleteLogic2 = async (memIdx, schDtlIdx) => {
  const existing = await assertDetailOwner(memIdx, schDtlIdx);
  await existing.destroy();
  return { deleted: true };
};

module.exports = {
  SearchLogic1,
  SaveLogic1,
  SaveLogic2,
  DeleteLogic1,
  SearchLogic2,
  SaveLogic3,
  SaveLogic4,
  DeleteLogic2,
  formatTimeForApi,
};
