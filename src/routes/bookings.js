const express = require("express");
const { body, validationResult } = require("express-validator");
const { Booking, Vehicle } = require("../models");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// 예약 목록 조회 (SearchLogic1)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.userId },
      include: [{ model: Vehicle, as: "vehicle" }],
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      bookings: bookings.map((b) => ({
        id: b.id,
        type: b.type,
        vehicleId: b.vehicle_id,
        serviceType: b.service_type,
        date: b.date,
        time: b.time,
        address: b.address,
        washLocation: b.wash_location,
        price: b.price,
        status: b.status,
        createdAt: b.created_at,
        vehicle: b.vehicle
          ? {
              id: b.vehicle.id,
              name: b.vehicle.name,
              number: b.vehicle.number,
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
    const booking = await Booking.findOne({
      where: { id: req.params.id, user_id: req.user.userId },
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
        id: booking.id,
        type: booking.type,
        vehicleId: booking.vehicle_id,
        serviceType: booking.service_type,
        date: booking.date,
        time: booking.time,
        address: booking.address,
        washLocation: booking.wash_location,
        price: booking.price,
        status: booking.status,
        createdAt: booking.created_at,
        vehicle: booking.vehicle
          ? {
              id: booking.vehicle.id,
              name: booking.vehicle.name,
              number: booking.vehicle.number,
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
    body("type")
      .isIn(["mobile", "partner"])
      .withMessage("올바른 예약 유형을 선택해주세요."),
    body("vehicleId").notEmpty().withMessage("차량을 선택해주세요."),
    body("serviceType").notEmpty().withMessage("서비스 종류를 선택해주세요."),
    body("date").notEmpty().withMessage("날짜를 선택해주세요."),
    body("time").notEmpty().withMessage("시간을 선택해주세요."),
    body("price").isNumeric().withMessage("가격이 올바르지 않습니다."),
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
        type,
        vehicleId,
        serviceType,
        date,
        time,
        address,
        washLocation,
        price,
      } = req.body;

      // 출장세차는 주소 필수
      if (type === "mobile" && !address) {
        return res.status(400).json({
          success: false,
          message: "출장 세차 예약 시 주소는 필수입니다.",
        });
      }

      // 제휴세차장은 세차장 필수
      if (type === "partner" && !washLocation) {
        return res.status(400).json({
          success: false,
          message: "제휴 세차장 예약 시 세차장 선택은 필수입니다.",
        });
      }

      const booking = await Booking.create({
        user_id: req.user.userId,
        vehicle_id: vehicleId,
        type,
        service_type: serviceType,
        date,
        time,
        address: type === "mobile" ? address : null,
        wash_location: type === "partner" ? washLocation : null,
        price,
        status: "pending",
      });

      res.status(201).json({
        success: true,
        message: "예약이 완료되었습니다.",
        booking: {
          id: booking.id,
          type: booking.type,
          vehicleId: booking.vehicle_id,
          serviceType: booking.service_type,
          date: booking.date,
          time: booking.time,
          address: booking.address,
          washLocation: booking.wash_location,
          price: booking.price,
          status: booking.status,
          createdAt: booking.created_at,
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

// 예약 취소
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.id, user_id: req.user.userId },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "예약을 찾을 수 없습니다.",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "완료된 예약은 취소할 수 없습니다.",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "이미 취소된 예약입니다.",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      success: true,
      message: "예약이 취소되었습니다.",
      booking: {
        id: booking.id,
        status: booking.status,
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
