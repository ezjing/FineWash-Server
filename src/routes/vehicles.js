const express = require("express");
const { body, validationResult } = require("express-validator");
const { Vehicle } = require("../models");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// 차량 목록 조회 (SearchLogic1)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { mem_idx: req.user.memIdx },
      order: [["created_date", "DESC"]],
    });

    res.json({
      success: true,
      vehicles: vehicles.map((v) => ({
        id: v.veh_idx,
        vehicleType: v.vehicle_type,
        model: v.model,
        vehicleNumber: v.vehicle_number,
        color: v.color,
        year: v.year,
        remark: v.remark,
        memIdx: v.mem_idx,
      })),
    });
  } catch (error) {
    console.error("Get vehicles error:", error);
    res.status(500).json({
      success: false,
      message: "차량 목록 조회 중 오류가 발생했습니다.",
    });
  }
});

// 차량 등록 (SaveLogic1)
router.post(
  "/",
  authMiddleware,
  [
    body("vehicleNumber")
      .notEmpty()
      .withMessage("차량 번호는 필수입니다."),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const {
        vehicle_type,
        model,
        vehicle_number,
        color,
        year,
        remark,
      } = req.body;

      const vehicle = await Vehicle.create({
        mem_idx: req.user.memIdx,
        vehicle_type,
        model,
        vehicle_number,
        color,
        year,
        remark,
      });

      res.status(201).json({
        success: true,
        message: "차량이 등록되었습니다.",
        vehicle: {
          id: vehicle.veh_idx,
          vehicleType: vehicle.vehicle_type,
          model: vehicle.model,
          vehicleNumber: vehicle.vehicle_number,
          color: vehicle.color,
          year: vehicle.year,
          remark: vehicle.remark,
          memIdx: vehicle.mem_idx,
        },
      });
    } catch (error) {
      console.error("Create vehicle error:", error);
      res.status(500).json({
        success: false,
        message: "차량 등록 중 오류가 발생했습니다.",
      });
    }
  }
);

// 차량 수정
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      vehicle_type,
      model,
      vehicle_number,
      color,
      year,
      remark,
    } = req.body;
    const updateData = {};

    if (vehicle_type !== undefined) updateData.vehicle_type = vehicle_type;
    if (model !== undefined) updateData.model = model;
    if (vehicle_number !== undefined)
      updateData.vehicle_number = vehicle_number;
    if (color !== undefined) updateData.color = color;
    if (year !== undefined) updateData.year = year;
    if (remark !== undefined) updateData.remark = remark;

    const [updatedCount] = await Vehicle.update(updateData, {
      where: { veh_idx: req.params.id, mem_idx: req.user.memIdx },
    });

    if (updatedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "차량을 찾을 수 없습니다.",
      });
    }

    const vehicle = await Vehicle.findByPk(req.params.id);

    res.json({
      success: true,
      message: "차량 정보가 수정되었습니다.",
      vehicle: {
        id: vehicle.veh_idx,
        vehicleType: vehicle.vehicle_type,
        model: vehicle.model,
        vehicleNumber: vehicle.vehicle_number,
        color: vehicle.color,
        year: vehicle.year,
        remark: vehicle.remark,
        memIdx: vehicle.mem_idx,
      },
    });
  } catch (error) {
    console.error("Update vehicle error:", error);
    res.status(500).json({
      success: false,
      message: "차량 수정 중 오류가 발생했습니다.",
    });
  }
});

// 차량 삭제
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedCount = await Vehicle.destroy({
      where: { veh_idx: req.params.id, mem_idx: req.user.memIdx },
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "차량을 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      message: "차량이 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    res.status(500).json({
      success: false,
      message: "차량 삭제 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
