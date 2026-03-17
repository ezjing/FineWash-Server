const express = require("express");
const { BusinessMaster, BusinessDetail, Reservation } = require("../models");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// 사업장(MST) 등록
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      businessNumber,
      companyName,
      phone,
      email,
      address,
      businessType,
      depositYn,
      depositAmount,
      remark,
    } = req.body || {};

    const bn = String(businessNumber ?? "").trim();
    const cn = String(companyName ?? "").trim();
    const ph = String(phone ?? "").trim();
    const addr = String(address ?? "").trim();

    if (!bn || !cn || !ph || !addr) {
      return res.status(400).json({
        success: false,
        message: "사업자번호, 사업장명, 전화번호, 주소는 필수입니다.",
      });
    }

    const created = await BusinessMaster.create({
      mem_idx: req.user.memIdx,
      business_number: bn,
      company_name: cn,
      phone: ph,
      email: email != null ? String(email).trim() : null,
      address: addr,
      business_type: businessType != null ? String(businessType).trim() : null,
      deposit_yn: depositYn === "Y" ? "Y" : "N",
      deposit_amount:
        depositAmount != null && !Number.isNaN(Number(depositAmount))
          ? Number(depositAmount)
          : 0,
      remark: remark != null ? String(remark) : null,
      create_id: String(req.user.memIdx),
      update_id: String(req.user.memIdx),
    });

    return res.status(201).json({
      success: true,
      business: {
        id: created.bus_mst_idx,
        busMstIdx: created.bus_mst_idx,
        memIdx: created.mem_idx,
        businessNumber: created.business_number,
        companyName: created.company_name,
        phone: created.phone,
        email: created.email,
        address: created.address,
        businessType: created.business_type,
        depositYn: created.deposit_yn,
        depositAmount: created.deposit_amount,
        remark: created.remark,
        businessDetails: [],
        createdAt: created.create_date,
        updatedAt: created.update_date,
      },
    });
  } catch (error) {
    console.error("Create business error:", error);
    return res.status(500).json({
      success: false,
      message: "사업장 저장 중 오류가 발생했습니다.",
    });
  }
});

// 사업장(MST) 수정
router.put("/:busMstIdx", authMiddleware, async (req, res) => {
  try {
    const business = await BusinessMaster.findOne({
      where: {
        bus_mst_idx: req.params.busMstIdx,
        mem_idx: req.user.memIdx,
      },
    });

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "사업장을 찾을 수 없습니다.",
      });
    }

    const {
      businessNumber,
      companyName,
      phone,
      email,
      address,
      businessType,
      depositYn,
      depositAmount,
      remark,
    } = req.body || {};

    const payload = {};
    if (businessNumber != null) payload.business_number = String(businessNumber).trim();
    if (companyName != null) payload.company_name = String(companyName).trim();
    if (phone != null) payload.phone = String(phone).trim();
    if (email != null) payload.email = String(email).trim();
    if (address != null) payload.address = String(address).trim();
    if (businessType != null) payload.business_type = String(businessType).trim();
    if (depositYn != null) payload.deposit_yn = depositYn === "Y" ? "Y" : "N";
    if (depositAmount != null && !Number.isNaN(Number(depositAmount))) {
      payload.deposit_amount = Number(depositAmount);
    }
    if (remark != null) payload.remark = String(remark);
    payload.update_id = String(req.user.memIdx);

    // 필수값 최소 검증 (넘어오는 경우만)
    if ("business_number" in payload && !payload.business_number) {
      return res.status(400).json({
        success: false,
        message: "사업자번호는 빈 값일 수 없습니다.",
      });
    }
    if ("company_name" in payload && !payload.company_name) {
      return res.status(400).json({
        success: false,
        message: "사업장명은 빈 값일 수 없습니다.",
      });
    }
    if ("phone" in payload && !payload.phone) {
      return res.status(400).json({
        success: false,
        message: "전화번호는 빈 값일 수 없습니다.",
      });
    }
    if ("address" in payload && !payload.address) {
      return res.status(400).json({
        success: false,
        message: "주소는 빈 값일 수 없습니다.",
      });
    }

    await business.update(payload);

    return res.json({
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
        businessDetails: [],
        createdAt: business.create_date,
        updatedAt: business.update_date,
      },
    });
  } catch (error) {
    console.error("Update business error:", error);
    return res.status(500).json({
      success: false,
      message: "사업장 수정 중 오류가 발생했습니다.",
    });
  }
});

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

// 룸(DTL) 수정
router.put("/rooms/:busDtlIdx", authMiddleware, async (req, res) => {
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
      ],
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "룸을 찾을 수 없습니다.",
      });
    }

    const { roomName, startDate, endDate, activeYn } = req.body || {};
    const payload = {};
    if (roomName != null) payload.room_name = String(roomName).trim();
    if (activeYn != null) payload.active_yn = activeYn === "N" ? "N" : "Y";
    if (startDate != null) payload.start_date = startDate || null;
    if (endDate != null) payload.end_date = endDate || null;

    if ("room_name" in payload && !payload.room_name) {
      return res.status(400).json({
        success: false,
        message: "룸 이름은 빈 값일 수 없습니다.",
      });
    }

    // 운영기간 최소 검증 (둘 다 들어온 경우만)
    if ("start_date" in payload && "end_date" in payload) {
      if (payload.start_date && payload.end_date) {
        const s = new Date(payload.start_date);
        const e = new Date(payload.end_date);
        if (!Number.isNaN(s.getTime()) && !Number.isNaN(e.getTime()) && e < s) {
          return res.status(400).json({
            success: false,
            message: "종료일자는 시작일자 이후여야 합니다.",
          });
        }
      }
    }

    await room.update(payload);

    return res.json({
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
    console.error("Update room error:", error);
    return res.status(500).json({
      success: false,
      message: "룸 수정 중 오류가 발생했습니다.",
    });
  }
});

// 룸(DTL) 삭제
router.delete("/rooms/:busDtlIdx", authMiddleware, async (req, res) => {
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
      ],
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "룸을 찾을 수 없습니다.",
      });
    }

    const reservationCount = await Reservation.count({
      where: { bus_dtl_idx: room.bus_dtl_idx },
    });

    // 예약이 있으면 물리 삭제 대신 비활성 처리 (데이터 무결성 보호)
    if (reservationCount > 0) {
      await room.update({ active_yn: "N" });
      return res.json({
        success: true,
        deleted: false,
        message: "예약 내역이 있어 삭제할 수 없어 비활성 처리했습니다.",
        room: {
          busDtlIdx: room.bus_dtl_idx,
          busMstIdx: room.bus_mst_idx,
          roomName: room.room_name,
          activeYn: room.active_yn,
          startDate: room.start_date,
          endDate: room.end_date,
        },
      });
    }

    await room.destroy();
    return res.json({
      success: true,
      deleted: true,
    });
  } catch (error) {
    console.error("Delete room error:", error);
    return res.status(500).json({
      success: false,
      message: "룸 삭제 중 오류가 발생했습니다.",
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
