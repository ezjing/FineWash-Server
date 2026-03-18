const express = require("express");
const { WashOptionMaster, WashOptionDetail, BusinessMaster } = require("../models");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ---- Logic Functions (routes layer) ----
const SearchLogic1 = async (model, params = {}) => {
  const { where, limit, offset, order, transaction, include } = params;
  return await model.findAndCountAll({
    where: where || {},
    include: include || undefined,
    limit: Number.isFinite(Number(limit)) ? Number(limit) : undefined,
    offset: Number.isFinite(Number(offset)) ? Number(offset) : undefined,
    order: Array.isArray(order) && order.length > 0 ? order : undefined,
    transaction,
  });
};

const SaveLogic1 = async (model, pkField, payload, options = {}) => {
  const { transaction } = options;
  if (!payload || typeof payload !== "object") throw new Error("payload is required");

  const pk = payload[pkField];
  if (pk !== undefined && pk !== null && pk !== "") {
    const row = await model.findByPk(pk, { transaction });
    if (!row) throw new Error(`${model?.name || "Row"} not found`);
    return await row.update(payload, { transaction });
  }
  return await model.create(payload, { transaction });
};

// ---- Masters ----
// 세차 옵션(MST) 목록 조회
router.get("/masters", authMiddleware, async (req, res) => {
  try {
    const {
      woptMstIdx,
      busMstIdx,
      optionName,
      vehicleType,
      limit,
      offset,
    } = req.query || {};

    const where = {};
    if (woptMstIdx != null && String(woptMstIdx).trim() !== "")
      where.wopt_mst_idx = Number(woptMstIdx);
    if (busMstIdx != null && String(busMstIdx).trim() !== "")
      where.bus_mst_idx = Number(busMstIdx);
    if (optionName != null && String(optionName).trim() !== "")
      where.option_name = String(optionName).trim();
    if (vehicleType != null && String(vehicleType).trim() !== "")
      where.vehicle_type = String(vehicleType).trim();

    // 본인 사업장 데이터만 허용 (busMstIdx가 있는 경우 검증)
    if (where.bus_mst_idx != null) {
      const business = await BusinessMaster.findOne({
        where: { bus_mst_idx: where.bus_mst_idx, mem_idx: req.user.memIdx },
      });
      if (!business) {
        return res.status(403).json({
          success: false,
          message: "해당 사업장에 대한 권한이 없습니다.",
        });
      }
    }

    const result = await SearchLogic1(WashOptionMaster, {
      where,
      limit,
      offset,
      order: [
        ["seq", "ASC"],
        ["wopt_mst_idx", "ASC"],
      ],
      include: [
        {
          model: WashOptionDetail,
          as: "washOptionDetails",
          required: false,
        },
      ],
    });

    return res.json({
      success: true,
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
    return res.status(500).json({
      success: false,
      message: "세차 옵션 조회 중 오류가 발생했습니다.",
    });
  }
});

// 세차 옵션(MST) 저장(신규)
router.post("/masters", authMiddleware, async (req, res) => {
  try {
    const payload = req.body || {};

    // 권한 검증 (busMstIdx 필수)
    if (payload.bus_mst_idx == null && payload.busMstIdx == null) {
      return res.status(400).json({
        success: false,
        message: "busMstIdx는 필수입니다.",
      });
    }
    const busMstIdx = payload.bus_mst_idx ?? payload.busMstIdx;
    const business = await BusinessMaster.findOne({
      where: { bus_mst_idx: busMstIdx, mem_idx: req.user.memIdx },
    });
    if (!business) {
      return res.status(403).json({
        success: false,
        message: "해당 사업장에 대한 권한이 없습니다.",
      });
    }

    const saved = await SaveLogic1(
      WashOptionMaster,
      "wopt_mst_idx",
      {
        ...payload,
        bus_mst_idx: Number(busMstIdx),
        create_id: String(req.user.memIdx),
        update_id: String(req.user.memIdx),
      },
      {},
    );

    return res.status(201).json({ success: true, row: saved });
  } catch (error) {
    console.error("WashOptionMaster SaveLogic1 error:", error);
    return res.status(500).json({
      success: false,
      message: "세차 옵션 저장 중 오류가 발생했습니다.",
    });
  }
});

// 세차 옵션(MST) 저장(수정)
router.put("/masters/:woptMstIdx", authMiddleware, async (req, res) => {
  try {
    const payload = req.body || {};
    const woptMstIdx = req.params.woptMstIdx;

    const existing = await WashOptionMaster.findByPk(woptMstIdx, {
      include: [
        {
          model: BusinessMaster,
          as: "businessMaster",
          where: { mem_idx: req.user.memIdx },
          required: true,
        },
      ],
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "세차 옵션(MST)을 찾을 수 없습니다.",
      });
    }

    const saved = await SaveLogic1(WashOptionMaster, "wopt_mst_idx", {
      ...payload,
      wopt_mst_idx: Number(woptMstIdx),
      update_id: String(req.user.memIdx),
    });

    return res.json({ success: true, row: saved });
  } catch (error) {
    console.error("WashOptionMaster SaveLogic1(update) error:", error);
    return res.status(500).json({
      success: false,
      message: "세차 옵션 수정 중 오류가 발생했습니다.",
    });
  }
});

// ---- Details ----
// 세차 옵션(DTL) 목록 조회
router.get("/details", authMiddleware, async (req, res) => {
  try {
    const {
      woptDtlIdx,
      woptMstIdx,
      optionName,
      vehicleType,
      limit,
      offset,
    } = req.query || {};

    const where = {};
    if (woptDtlIdx != null && String(woptDtlIdx).trim() !== "")
      where.wopt_dtl_idx = Number(woptDtlIdx);
    if (woptMstIdx != null && String(woptMstIdx).trim() !== "")
      where.wopt_mst_idx = Number(woptMstIdx);
    if (optionName != null && String(optionName).trim() !== "")
      where.option_name = String(optionName).trim();
    if (vehicleType != null && String(vehicleType).trim() !== "")
      where.vehicle_type = String(vehicleType).trim();

    // 마스터 기준으로 권한 검증 (woptMstIdx가 있으면 master의 businessMaster.mem_idx 확인)
    if (where.wopt_mst_idx != null) {
      const master = await WashOptionMaster.findOne({
        where: { wopt_mst_idx: where.wopt_mst_idx },
        include: [
          {
            model: BusinessMaster,
            as: "businessMaster",
            where: { mem_idx: req.user.memIdx },
            required: true,
          },
        ],
      });
      if (!master) {
        return res.status(403).json({
          success: false,
          message: "해당 세차 옵션에 대한 권한이 없습니다.",
        });
      }
    }

    const result = await SearchLogic1(WashOptionDetail, {
      where,
      limit,
      offset,
      order: [
        ["seq", "ASC"],
        ["wopt_dtl_idx", "ASC"],
      ],
    });

    return res.json({
      success: true,
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
    return res.status(500).json({
      success: false,
      message: "세차 옵션 상세 조회 중 오류가 발생했습니다.",
    });
  }
});

// 세차 옵션(DTL) 저장(신규)
router.post("/details", authMiddleware, async (req, res) => {
  try {
    const payload = req.body || {};
    const woptMstIdx = payload.wopt_mst_idx ?? payload.woptMstIdx;
    if (woptMstIdx == null || String(woptMstIdx).trim() === "") {
      return res.status(400).json({
        success: false,
        message: "woptMstIdx는 필수입니다.",
      });
    }

    const master = await WashOptionMaster.findOne({
      where: { wopt_mst_idx: woptMstIdx },
      include: [
        {
          model: BusinessMaster,
          as: "businessMaster",
          where: { mem_idx: req.user.memIdx },
          required: true,
        },
      ],
    });
    if (!master) {
      return res.status(403).json({
        success: false,
        message: "해당 세차 옵션에 대한 권한이 없습니다.",
      });
    }

    const saved = await SaveLogic1(
      WashOptionDetail,
      "wopt_dtl_idx",
      {
        ...payload,
        wopt_mst_idx: Number(woptMstIdx),
        create_id: String(req.user.memIdx),
        update_id: String(req.user.memIdx),
      },
      {},
    );

    return res.status(201).json({ success: true, row: saved });
  } catch (error) {
    console.error("WashOptionDetail SaveLogic1 error:", error);
    return res.status(500).json({
      success: false,
      message: "세차 옵션 상세 저장 중 오류가 발생했습니다.",
    });
  }
});

// 세차 옵션(DTL) 저장(수정)
router.put("/details/:woptDtlIdx", authMiddleware, async (req, res) => {
  try {
    const payload = req.body || {};
    const woptDtlIdx = req.params.woptDtlIdx;

    const existing = await WashOptionDetail.findByPk(woptDtlIdx, {
      include: [
        {
          model: WashOptionMaster,
          as: "washOptionMaster",
          required: true,
          include: [
            {
              model: BusinessMaster,
              as: "businessMaster",
              where: { mem_idx: req.user.memIdx },
              required: true,
            },
          ],
        },
      ],
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "세차 옵션(DTL)을 찾을 수 없습니다.",
      });
    }

    const saved = await SaveLogic1(WashOptionDetail, "wopt_dtl_idx", {
      ...payload,
      wopt_dtl_idx: Number(woptDtlIdx),
      update_id: String(req.user.memIdx),
    });

    return res.json({ success: true, row: saved });
  } catch (error) {
    console.error("WashOptionDetail SaveLogic1(update) error:", error);
    return res.status(500).json({
      success: false,
      message: "세차 옵션 상세 수정 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
