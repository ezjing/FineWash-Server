const express = require("express");
const { BusinessMaster, BusinessDetail, Reservation } = require("../models");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// 룸(DTL) 상세 조회 - 해당 룸 정보 + 예약 목록 (경로가 /:id 보다 먼저 와야 함)
router.get("/rooms/:busDtlIdx", authMiddleware, async (req, res) => {
  try {
    const room = await BusinessDetail.findOne({
      where: { bus_dtl_idx: req.params.busDtlIdx },
      include: [
        {
          model: BusinessMaster,
          as: "businessMaster",
          where: { mem_idx: req.user.memIdx },
          required: true,
        },
        {
          model: Reservation,
          as: "reservations",
          required: false,
        },
      ],
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "룸을 찾을 수 없습니다.",
      });
    }

    const reservations = (room.reservations || []).sort(
      (a, b) => new Date(b.create_date) - new Date(a.create_date)
    );
    const totalRevenue = reservations.reduce(
      (sum, r) => sum + (Number(r.payment_amount) || 0),
      0
    );

    res.json({
      success: true,
      room: {
        busDtlIdx: room.bus_dtl_idx,
        busMstIdx: room.bus_mst_idx,
        roomName: room.room_name,
        activeYn: room.active_yn,
        startDate: room.start_date,
        endDate: room.end_date,
      },
      reservations: reservations.map((r) => ({
        resvIdx: r.resv_idx,
        busDtlIdx: r.bus_dtl_idx,
        memIdx: r.mem_idx,
        vehIdx: r.veh_idx,
        mainOption: r.main_option,
        midOption: r.mid_option,
        subOption: r.sub_option,
        vehicleLocation: r.vehicle_location,
        contractYn: r.contract_yn,
        date: r.date,
        time: r.time,
        paymentAmount: r.payment_amount,
        createdDate: r.create_date,
        updateDate: r.update_date,
      })),
      totalRevenue,
    });
  } catch (error) {
    console.error("Get room detail error:", error);
    res.status(500).json({
      success: false,
      message: "룸 조회 중 오류가 발생했습니다.",
    });
  }
});

// 룸(DTL) 추가 - 특정 사업장에 룸만 추가 (경로가 / 보다 먼저 와야 함)
router.post("/rooms", authMiddleware, async (req, res) => {
  try {
    const { busMstIdx, roomName, startDate, endDate, activeYn } = req.body;

    if (!busMstIdx || !roomName || String(roomName).trim() === "") {
      return res.status(400).json({
        success: false,
        message: "사업장 ID와 룸 이름은 필수입니다.",
      });
    }

    const business = await BusinessMaster.findOne({
      where: {
        bus_mst_idx: busMstIdx,
        mem_idx: req.user.memIdx,
      },
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "사업장을 찾을 수 없습니다.",
      });
    }

    const room = await BusinessDetail.create({
      bus_mst_idx: busMstIdx,
      room_name: String(roomName).trim(),
      active_yn: activeYn === "N" ? "N" : "Y",
      start_date: startDate || null,
      end_date: endDate || null,
    });

    res.status(201).json({
      success: true,
      room: {
        busDtlIdx: room.bus_dtl_idx,
        busMstIdx: room.bus_mst_idx,
        roomName: room.room_name,
        activeYn: room.active_yn,
        startDate: room.start_date,
        endDate: room.end_date,
      },
    });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({
      success: false,
      message: "룸 추가 중 오류가 발생했습니다.",
    });
  }
});

// 사업장 목록 조회 (SearchLogic1) - 로그인한 유저의 mem_idx와 일치하는 경우만
router.get("/", authMiddleware, async (req, res) => {
  try {
    const businesses = await BusinessMaster.findAll({
      where: { mem_idx: req.user.memIdx },
      include: [
        {
          model: BusinessDetail,
          as: "businessDetails",
          where: { active_yn: "Y" },
          required: false,
        },
      ],
      order: [["create_date", "DESC"]],
    });

    res.json({
      success: true,
      businesses: businesses.map((b) => ({
        id: b.bus_mst_idx,
        busMstIdx: b.bus_mst_idx,
        memIdx: b.mem_idx,
        businessNumber: b.business_number,
        companyName: b.company_name,
        phone: b.phone,
        email: b.email,
        address: b.address,
        businessType: b.business_type,
        depositYn: b.deposit_yn,
        depositAmount: b.deposit_amount,
        remark: b.remark,
        businessDetails: b.businessDetails
          ? b.businessDetails.map((bd) => ({
              id: bd.bus_dtl_idx,
              busDtlIdx: bd.bus_dtl_idx,
              busMstIdx: bd.bus_mst_idx,
              roomName: bd.room_name,
              activeYn: bd.active_yn,
              startDate: bd.start_date,
              endDate: bd.end_date,
            }))
          : [],
        createdAt: b.create_date,
      })),
    });
  } catch (error) {
    console.error("Get businesses error:", error);
    res.status(500).json({
      success: false,
      message: "사업장 목록 조회 중 오류가 발생했습니다.",
    });
  }
});

// 사업장 상세 조회 - 로그인한 유저의 mem_idx와 일치하는 경우만
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const business = await BusinessMaster.findOne({
      where: {
        bus_mst_idx: req.params.id,
        mem_idx: req.user.memIdx,
      },
      include: [
        {
          model: BusinessDetail,
          as: "businessDetails",
          required: false,
        },
      ],
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "사업장을 찾을 수 없습니다.",
      });
    }

    res.json({
      success: true,
      business: {
        id: business.bus_mst_idx,
        busMstIdx: business.bus_mst_idx,
        memIdx: business.mem_idx,
        businessNumber: business.business_number,
        companyName: business.company_name,
        phone: business.phone,
        email: business.email,
        address: business.address,
        businessType: business.business_type,
        depositYn: business.deposit_yn,
        depositAmount: business.deposit_amount,
        remark: business.remark,
        businessDetails: business.businessDetails
          ? business.businessDetails.map((bd) => ({
              id: bd.bus_dtl_idx,
              busDtlIdx: bd.bus_dtl_idx,
              busMstIdx: bd.bus_mst_idx,
              roomName: bd.room_name,
              activeYn: bd.active_yn,
              startDate: bd.start_date,
              endDate: bd.end_date,
            }))
          : [],
        createdAt: business.create_date,
        updatedAt: business.update_date,
      },
    });
  } catch (error) {
    console.error("Get business error:", error);
    res.status(500).json({
      success: false,
      message: "사업장 조회 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
