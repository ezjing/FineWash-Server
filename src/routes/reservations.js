const express = require("express");
const { body, validationResult } = require("express-validator");
const { Reservation, Vehicle } = require("../models");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// 예약 목록 조회 (SearchLogic1)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Reservation.findAll({
      where: { mem_idx: req.user.memIdx },
      include: [{ model: Vehicle, as: "vehicle" }],
      order: [["created_date", "DESC"]],
    });

    res.json({
      success: true,
      bookings: bookings.map((b) => ({
        id: b.resv_idx,
        mainOption: b.main_option,
        midOption: b.mid_option,
        subOption: b.sub_option,
        vehicleId: b.veh_idx,
        vehicleLocation: b.vehicle_location,
        contractYn: b.contract_yn,
        date: b.date,
        time: b.time,
        createdAt: b.created_date,
        vehicle: b.vehicle
          ? {
              id: b.vehicle.veh_idx,
              vehicleType: b.vehicle.vehicle_type,
              model: b.vehicle.model,
              vehicleNumber: b.vehicle.vehicle_number,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      message: "예약 목록 조회 중 오류가 발생했습니다.",
    });
  }
});

// 예약 상세 조회
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Reservation.findOne({
      where: { resv_idx: req.params.id, mem_idx: req.user.memIdx },
      include: [{ model: Vehicle, as: "vehicle" }],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "예약을 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      booking: {
        id: booking.resv_idx,
        mainOption: booking.main_option,
        midOption: booking.mid_option,
        subOption: booking.sub_option,
        vehicleId: booking.veh_idx,
        vehicleLocation: booking.vehicle_location,
        contractYn: booking.contract_yn,
        date: booking.date,
        time: booking.time,
        createdAt: booking.created_date,
        vehicle: booking.vehicle
          ? {
              id: booking.vehicle.veh_idx,
              vehicleType: booking.vehicle.vehicle_type,
              model: booking.vehicle.model,
              vehicleNumber: booking.vehicle.vehicle_number,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      message: "예약 조회 중 오류가 발생했습니다.",
    });
  }
});

// 예약 생성 (SaveLogic1 - 출장세차, SaveLogic2 - 제휴세차장)
router.post(
  "/",
  authMiddleware,
  [
    body("vehicleId").notEmpty().withMessage("차량을 선택해주세요."),
    body("mainOption").notEmpty().withMessage("예약 대옵션을 선택해주세요."),
    body("date").notEmpty().withMessage("날짜를 선택해주세요."),
    body("time").notEmpty().withMessage("시간을 선택해주세요."),
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
        vehicleId,
        main_option,
        mid_option,
        sub_option,
        vehicle_location,
        date,
        time,
        bus_dtl_idx,
      } = req.body;

      const booking = await Reservation.create({
        mem_idx: req.user.memIdx,
        veh_idx: vehicleId,
        bus_dtl_idx: bus_dtl_idx || null,
        main_option: main_option,
        mid_option: mid_option || null,
        sub_option: sub_option || null,
        vehicle_location: vehicle_location || null,
        date,
        time,
        contract_yn: "Y", // 기본값 승낙
      });

      res.status(201).json({
        success: true,
        message: "예약이 완료되었습니다.",
        booking: {
          id: booking.resv_idx,
          mainOption: booking.main_option,
          midOption: booking.mid_option,
          subOption: booking.sub_option,
          vehicleId: booking.veh_idx,
          vehicleLocation: booking.vehicle_location,
          contractYn: booking.contract_yn,
          date: booking.date,
          time: booking.time,
          createdAt: booking.created_date,
        },
      });
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(500).json({
        success: false,
        message: "예약 생성 중 오류가 발생했습니다.",
      });
    }
  }
);

// 예약 취소 (contract_yn을 'N'으로 변경)
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const booking = await Reservation.findOne({
      where: { resv_idx: req.params.id, mem_idx: req.user.memIdx },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "예약을 찾을 수 없습니다.",
      });
    }

    if (booking.contract_yn === "N") {
      return res.status(400).json({
        success: false,
        message: "이미 취소된 예약입니다.",
      });
    }

    booking.contract_yn = "N";
    await booking.save();

    res.json({
      success: true,
      message: "예약이 취소되었습니다.",
      booking: {
        id: booking.resv_idx,
        contractYn: booking.contract_yn,
      },
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "예약 취소 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;

