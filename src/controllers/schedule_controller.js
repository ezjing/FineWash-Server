const ScheduleService = require("../services/schedule_service");
const { Ok } = require("../utils/response");
const AsyncHandler = require("../middlewares/asyncHandler");

const mapMstRow = (m) => ({
  schMstIdx: m.sch_mst_idx,
  busMstIdx: m.bus_mst_idx,
  mondayYn: m.monday_yn,
  tuesdayYn: m.tuesday_yn,
  wednesdayYn: m.wednesday_yn,
  thursdayYn: m.thursday_yn,
  fridayYn: m.friday_yn,
  saturdayYn: m.saturday_yn,
  sundayYn: m.sunday_yn,
  startTime: ScheduleService.formatTimeForApi(m.start_time),
  endTime: ScheduleService.formatTimeForApi(m.end_time),
  createId: m.create_id,
  createDate: m.create_date,
  updateId: m.update_id,
  updateDate: m.update_date,
});

const mapDtlRow = (d) => ({
  schDtlIdx: d.sch_dtl_idx,
  schMstIdx: d.sch_mst_idx,
  scheduleDate: d.schedule_date,
  holidayYn: d.holiday_yn,
  startTime: ScheduleService.formatTimeForApi(d.start_time),
  endTime: ScheduleService.formatTimeForApi(d.end_time),
  createId: d.create_id,
  createDate: d.create_date,
  updateId: d.update_id,
  updateDate: d.update_date,
});

const SearchLogic1 = AsyncHandler(async (req, res) => {
  const result = await ScheduleService.SearchLogic1(req.user.memIdx, req.query);
  return Ok(res, {
    count: result.count,
    rows: (result.rows || []).map(mapMstRow),
  });
});

const SaveLogic1 = AsyncHandler(async (req, res) => {
  const saved = await ScheduleService.SaveLogic1(
    req.user.memIdx,
    req.body || {},
  );
  return Ok(res, { row: mapMstRow(saved) }, 201);
});

const SaveLogic2 = AsyncHandler(async (req, res) => {
  const saved = await ScheduleService.SaveLogic2(
    req.user.memIdx,
    req.params.schMstIdx,
    req.body || {},
  );
  return Ok(res, { row: mapMstRow(saved) });
});

const DeleteLogic1 = AsyncHandler(async (req, res) => {
  await ScheduleService.DeleteLogic1(req.user.memIdx, req.params.schMstIdx);
  return Ok(res, { deleted: true });
});

const SearchLogic2 = AsyncHandler(async (req, res) => {
  const result = await ScheduleService.SearchLogic2(req.user.memIdx, req.query);
  return Ok(res, {
    count: result.count,
    schMstIdx: result.schMstIdx,
    rows: (result.rows || []).map(mapDtlRow),
  });
});

const SaveLogic3 = AsyncHandler(async (req, res) => {
  const saved = await ScheduleService.SaveLogic3(
    req.user.memIdx,
    req.body || {},
  );
  return Ok(res, { row: mapDtlRow(saved) }, 201);
});

const SaveLogic4 = AsyncHandler(async (req, res) => {
  const saved = await ScheduleService.SaveLogic4(
    req.user.memIdx,
    req.params.schDtlIdx,
    req.body || {},
  );
  return Ok(res, { row: mapDtlRow(saved) });
});

const DeleteLogic2 = AsyncHandler(async (req, res) => {
  await ScheduleService.DeleteLogic2(req.user.memIdx, req.params.schDtlIdx);
  return Ok(res, { deleted: true });
});

module.exports = {
  SearchLogic1,
  SaveLogic1,
  SaveLogic2,
  DeleteLogic1,
  SearchLogic2,
  SaveLogic3,
  SaveLogic4,
  DeleteLogic2,
};
