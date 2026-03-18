const WashOptionService = require("../services/wash_option_service");
const { Ok, Fail } = require("../utils/response");

const SearchLogic1 = async (req, res) => {
  try {
    const result = await WashOptionService.SearchMasters(req.user.memIdx, req.query);
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
    if (error.statusCode === 403) {
      return Fail(res, 403, "해당 사업장에 대한 권한이 없습니다.");
    }
    console.error("WashOptionMaster SearchLogic1 error:", error);
    return Fail(res, 500, "세차 옵션 조회 중 오류가 발생했습니다.");
  }
};

const SaveLogic1 = async (req, res) => {
  try {
    const saved = await WashOptionService.CreateMaster(req.user.memIdx, req.body || {});
    return Ok(res, { row: saved }, 201);
  } catch (error) {
    if (error.statusCode === 400) {
      return Fail(res, 400, "busMstIdx는 필수입니다.");
    }
    if (error.statusCode === 403) {
      return Fail(res, 403, "해당 사업장에 대한 권한이 없습니다.");
    }
    console.error("WashOptionMaster SaveLogic1 error:", error);
    return Fail(res, 500, "세차 옵션 저장 중 오류가 발생했습니다.");
  }
};

const SaveLogic2 = async (req, res) => {
  try {
    const saved = await WashOptionService.UpdateMaster(
      req.user.memIdx,
      req.params.woptMstIdx,
      req.body || {},
    );
    return Ok(res, { row: saved });
  } catch (error) {
    if (error.statusCode === 404) {
      return Fail(res, 404, "세차 옵션(MST)을 찾을 수 없습니다.");
    }
    console.error("WashOptionMaster SaveLogic1(update) error:", error);
    return Fail(res, 500, "세차 옵션 수정 중 오류가 발생했습니다.");
  }
};

const SearchLogic2 = async (req, res) => {
  try {
    const result = await WashOptionService.SearchDetails(req.user.memIdx, req.query);
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
    if (error.statusCode === 403) {
      return Fail(res, 403, "해당 세차 옵션에 대한 권한이 없습니다.");
    }
    console.error("WashOptionDetail SearchLogic1 error:", error);
    return Fail(res, 500, "세차 옵션 상세 조회 중 오류가 발생했습니다.");
  }
};

const SaveLogic3 = async (req, res) => {
  try {
    const saved = await WashOptionService.CreateDetail(req.user.memIdx, req.body || {});
    return Ok(res, { row: saved }, 201);
  } catch (error) {
    if (error.statusCode === 400) {
      return Fail(res, 400, "woptMstIdx는 필수입니다.");
    }
    if (error.statusCode === 403) {
      return Fail(res, 403, "해당 세차 옵션에 대한 권한이 없습니다.");
    }
    console.error("WashOptionDetail SaveLogic1 error:", error);
    return Fail(res, 500, "세차 옵션 상세 저장 중 오류가 발생했습니다.");
  }
};

const SaveLogic4 = async (req, res) => {
  try {
    const saved = await WashOptionService.UpdateDetail(
      req.user.memIdx,
      req.params.woptDtlIdx,
      req.body || {},
    );
    return Ok(res, { row: saved });
  } catch (error) {
    if (error.statusCode === 404) {
      return Fail(res, 404, "세차 옵션(DTL)을 찾을 수 없습니다.");
    }
    console.error("WashOptionDetail SaveLogic1(update) error:", error);
    return Fail(res, 500, "세차 옵션 상세 수정 중 오류가 발생했습니다.");
  }
};

module.exports = {
  SearchLogic1,
  SaveLogic1,
  SaveLogic2,
  SearchLogic2,
  SaveLogic3,
  SaveLogic4,
};

