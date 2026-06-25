const { FormatTimeForApi } = require("../utils/time");

const MapMstRow = (m) => ({
  schMstIdx: m.sch_mst_idx,
  busMstIdx: m.bus_mst_idx,
  mondayYn: m.monday_yn,
  tuesdayYn: m.tuesday_yn,
  wednesdayYn: m.wednesday_yn,
  thursdayYn: m.thursday_yn,
  fridayYn: m.friday_yn,
  saturdayYn: m.saturday_yn,
  sundayYn: m.sunday_yn,
  startTime: FormatTimeForApi(m.start_time),
  endTime: FormatTimeForApi(m.end_time),
  createId: m.create_id,
  createDate: m.create_date,
  updateId: m.update_id,
  updateDate: m.update_date,
});

const MapDtlRow = (d) => ({
  schDtlIdx: d.sch_dtl_idx,
  schMstIdx: d.sch_mst_idx,
  scheduleDate: d.schedule_date,
  holidayYn: d.holiday_yn,
  startTime: FormatTimeForApi(d.start_time),
  endTime: FormatTimeForApi(d.end_time),
  createId: d.create_id,
  createDate: d.create_date,
  updateId: d.update_id,
  updateDate: d.update_date,
});

module.exports = {
  MapMstRow,
  MapDtlRow,
};
