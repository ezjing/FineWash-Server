const WashOptionService = require("../services/wash_option_service");
const { Ok, Fail } = require("../utils/response");
const { HandleControllerError } = require("../utils/controller_error");

const mapMstRow = (m) => ({
  woptMstIdx: m.wopt_mst_idx,
  busMstIdx: m.bus_mst_idx,
  optionName: m.option_name,
  vehicleType: m.vehicle_type,
  seq: m.seq,
  value1: m.value1,
  value2: m.value2,
  createId: m.create_id,
  createDate: m.create_date,
  updateId: m.update_id,
  updateDate: m.update_date,
});

const mapDtlRow = (d) => ({
  woptDtlIdx: d.wopt_dtl_idx,
  woptMstIdx: d.wopt_mst_idx,
  optionName: d.option_name,
  vehicleType: d.vehicle_type,
  seq: d.seq,
  value1: d.value1,
  value2: d.value2,
  createId: d.create_id,
  createDate: d.create_date,
  updateId: d.update_id,
  updateDate: d.update_date,
});

const SearchLogic1 = async (req, res) => {
  try {
    const result = await WashOptionService.SearchLogic1(req.user.memIdx, req.query);
    return Ok(res, {
      count: result.count,
      rows: (result.rows || []).map((m) => ({
        woptMstIdx: m.wopt_mst_idx,
        busMstIdx: m.bus_mst_idx,
        optionName: m.option_name,
        vehicleType: m.vehicle_type,
        seq: m.seq,
        value1: m.value1,
        value2: m.value2,
        createId: m.create_id,
        createDate: m.create_date,
        updateId: m.update_id,
        updateDate: m.update_date,
        details: (m.washOptionDetails || []).map((d) => ({
          woptDtlIdx: d.wopt_dtl_idx,
          woptMstIdx: d.wopt_mst_idx,
          optionName: d.option_name,
          vehicleType: d.vehicle_type,
          seq: d.seq,
          value1: d.value1,
          value2: d.value2,
          createId: d.create_id,
          createDate: d.create_date,
          updateId: d.update_id,
          updateDate: d.update_date,
        })),
      })),
    });
  } catch (error) {
    console.error("WashOptionMaster SearchLogic1 error:", error);
    return HandleControllerError(res, error, "세차 옵션 조회 중 오류가 발생했습니다.");
  }
};

const SaveLogic1 = async (req, res) => {
  try {
    const saved = await WashOptionService.SaveLogic1(req.user.memIdx, req.body || {});
    return Ok(res, { row: mapMstRow(saved) }, 201);
  } catch (error) {
    console.error("WashOptionMaster SaveLogic1 error:", error);
    return HandleControllerError(res, error, "세차 옵션 저장 중 오류가 발생했습니다.");
  }
};

const SaveLogic2 = async (req, res) => {
  try {
    const saved = await WashOptionService.SaveLogic2(
      req.user.memIdx,
      req.params.woptMstIdx,
      req.body || {},
    );
    return Ok(res, { row: mapMstRow(saved) });
  } catch (error) {
    console.error("WashOptionMaster SaveLogic1(update) error:", error);
    return HandleControllerError(res, error, "세차 옵션 수정 중 오류가 발생했습니다.");
  }
};

const SearchLogic2 = async (req, res) => {
  try {
    const result = await WashOptionService.SearchLogic2(req.user.memIdx, req.query);
    return Ok(res, {
      count: result.count,
      rows: (result.rows || []).map((d) => ({
        woptDtlIdx: d.wopt_dtl_idx,
        woptMstIdx: d.wopt_mst_idx,
        optionName: d.option_name,
        vehicleType: d.vehicle_type,
        seq: d.seq,
        value1: d.value1,
        value2: d.value2,
        createId: d.create_id,
        createDate: d.create_date,
        updateId: d.update_id,
        updateDate: d.update_date,
      })),
    });
  } catch (error) {
    console.error("WashOptionDetail SearchLogic1 error:", error);
    return HandleControllerError(res, error, "세차 옵션 상세 조회 중 오류가 발생했습니다.");
  }
};

const SaveLogic3 = async (req, res) => {
  try {
    const saved = await WashOptionService.SaveLogic3(req.user.memIdx, req.body || {});
    return Ok(res, { row: mapDtlRow(saved) }, 201);
  } catch (error) {
    console.error("WashOptionDetail SaveLogic1 error:", error);
    return HandleControllerError(res, error, "세차 옵션 상세 저장 중 오류가 발생했습니다.");
  }
};

const SaveLogic4 = async (req, res) => {
  try {
    const saved = await WashOptionService.SaveLogic4(
      req.user.memIdx,
      req.params.woptDtlIdx,
      req.body || {},
    );
    return Ok(res, { row: mapDtlRow(saved) });
  } catch (error) {
    console.error("WashOptionDetail SaveLogic1(update) error:", error);
    return HandleControllerError(res, error, "세차 옵션 상세 수정 중 오류가 발생했습니다.");
  }
};

const DeleteLogic1 = async (req, res) => {
  try {
    await WashOptionService.DeleteLogic1(req.user.memIdx, req.params.woptMstIdx);
    return Ok(res, { deleted: true });
  } catch (error) {
    console.error("WashOptionMaster DeleteLogic1 error:", error);
    return HandleControllerError(res, error, "세차 옵션(MST) 삭제 중 오류가 발생했습니다.");
  }
};

const DeleteLogic2 = async (req, res) => {
  try {
    await WashOptionService.DeleteLogic2(req.user.memIdx, req.params.woptDtlIdx);
    return Ok(res, { deleted: true });
  } catch (error) {
    console.error("WashOptionDetail DeleteLogic2 error:", error);
    return HandleControllerError(res, error, "세차 옵션(DTL) 삭제 중 오류가 발생했습니다.");
  }
};

module.exports = {
  SearchLogic1,
  SaveLogic1,
  SaveLogic2,
  SearchLogic2,
  SaveLogic3,
  SaveLogic4,
  DeleteLogic1,
  DeleteLogic2,
};

