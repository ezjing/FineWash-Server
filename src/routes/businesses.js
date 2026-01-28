const express = require("express");
const { BusinessMaster, BusinessDetail } = require("../models");

const router = express.Router();

// 사업장 목록 조회 (SearchLogic1)
router.get("/", async (req, res) => {
  try {
    const businesses = await BusinessMaster.findAll({
      include: [
        {
          model: BusinessDetail,
          as: "businessDetails",
          where: { inactive_yn: "N" },
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
              inactiveYn: bd.inactive_yn,
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

// 사업장 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const business = await BusinessMaster.findOne({
      where: { bus_mst_idx: req.params.id },
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
              inactiveYn: bd.inactive_yn,
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
