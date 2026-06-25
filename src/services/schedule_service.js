const { Op } = require("sequelize");
const { ScheduleMaster, ScheduleDetail } = require("../models");
const { ThrowFromCode } = require("../utils/app_error");
const CODES = require("../utils/error_codes");
const { AssertBusinessOwner } = require("../repositories/business_repository");
const ScheduleRepository = require("../repositories/schedule_repository");
const { FormatTimeForApi, NormalizeTime } = require("../utils/time");

const yn = (value, fallback = "N") => {
  const v = value ?? fallback;
  return v === "Y" || v === true || v === "true" || v === 1 ? "Y" : "N";
};

const normalizeMstInput = (body = {}) => ({
  monday_yn: yn(body.monday_yn ?? body.mondayYn),
  tuesday_yn: yn(body.tuesday_yn ?? body.tuesdayYn),
  wednesday_yn: yn(body.wednesday_yn ?? body.wednesdayYn),
  thursday_yn: yn(body.thursday_yn ?? body.thursdayYn),
  friday_yn: yn(body.friday_yn ?? body.fridayYn),
  saturday_yn: yn(body.saturday_yn ?? body.saturdayYn),
  sunday_yn: yn(body.sunday_yn ?? body.sundayYn),
  start_time: NormalizeTime(body.start_time ?? body.startTime),
  end_time: NormalizeTime(body.end_time ?? body.endTime),
});

const normalizeDtlInput = (body = {}) => ({
  schedule_date: body.schedule_date ?? body.scheduleDate ?? null,
  holiday_yn: yn(body.holiday_yn ?? body.holidayYn),
  start_time: NormalizeTime(body.start_time ?? body.startTime),
  end_time: NormalizeTime(body.end_time ?? body.endTime),
});

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
    ThrowFromCode(CODES.WASH_OPTION.MISSING_BUS_MST_IDX);
  }

  await AssertBusinessOwner(memIdx, Number(busMstIdx));

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
    ThrowFromCode(CODES.WASH_OPTION.MISSING_BUS_MST_IDX);
  }

  await AssertBusinessOwner(memIdx, Number(busMstIdx));

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
  const existing = await ScheduleRepository.FindOwnedMaster(memIdx, schMstIdx);
  const fields = normalizeMstInput(body);
  return await existing.update({
    ...fields,
    update_id: String(memIdx),
  });
};

/** DeleteLogic1: 스케줄 MST 삭제 */
const DeleteLogic1 = async (memIdx, schMstIdx) => {
  const existing = await ScheduleRepository.FindOwnedMaster(memIdx, schMstIdx);
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
      ThrowFromCode(
        CODES.COMMON.BAD_REQUEST,
        "schMstIdx 또는 busMstIdx는 필수입니다.",
      );
    }
    await AssertBusinessOwner(memIdx, Number(busMstIdx));
    const master = await ScheduleMaster.findOne({
      where: { bus_mst_idx: Number(busMstIdx) },
      order: [["sch_mst_idx", "DESC"]],
    });
    if (!master) {
      return { count: 0, rows: [] };
    }
    schMstIdx = master.sch_mst_idx;
  } else {
    await ScheduleRepository.FindOwnedMaster(memIdx, Number(schMstIdx));
  }

  if (year == null || month == null) {
    ThrowFromCode(CODES.COMMON.BAD_REQUEST, "year, month는 필수입니다.");
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
    ThrowFromCode(CODES.COMMON.BAD_REQUEST, "schMstIdx는 필수입니다.");
  }

  await ScheduleRepository.FindOwnedMaster(memIdx, Number(schMstIdx));

  const fields = normalizeDtlInput(body);
  if (!fields.schedule_date) {
    ThrowFromCode(CODES.COMMON.BAD_REQUEST, "scheduleDate는 필수입니다.");
  }

  if (fields.holiday_yn === "Y") {
    fields.start_time = null;
    fields.end_time = null;
  } else if (!fields.start_time || !fields.end_time) {
    ThrowFromCode(
      CODES.COMMON.BAD_REQUEST,
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
  const existing = await ScheduleRepository.FindOwnedDetail(memIdx, schDtlIdx);
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
    ThrowFromCode(
      CODES.COMMON.BAD_REQUEST,
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
  const existing = await ScheduleRepository.FindOwnedDetail(memIdx, schDtlIdx);
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
  formatTimeForApi: FormatTimeForApi,
};
