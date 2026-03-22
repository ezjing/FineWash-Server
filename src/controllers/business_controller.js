const BusinessService = require("../services/business_service");
const { Ok, Fail } = require("../utils/response");
const { HandleControllerError } = require("../utils/controller_error");

const SaveLogic1 = async (req, res) => {
  try {
    const created = await BusinessService.SaveLogic1(req.user.memIdx, req.body || {});
    return Ok(
      res,
      {
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
      },
      201,
    );
  } catch (error) {
    console.error("Create business error:", error);
    return HandleControllerError(res, error, "사업장 저장 중 오류가 발생했습니다.");
  }
};

const SaveLogic2 = async (req, res) => {
  try {
    const business = await BusinessService.SaveLogic2(
      req.user.memIdx,
      req.params.busMstIdx,
      req.body || {},
    );

    return Ok(res, {
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
    return HandleControllerError(res, error, "사업장 수정 중 오류가 발생했습니다.");
  }
};

const SearchLogic1 = async (req, res) => {
  try {
    const { room, reservations, totalRevenue } = await BusinessService.SearchLogic1(
      req.user.memIdx,
      req.params.busDtlIdx,
    );

    return Ok(res, {
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
    return HandleControllerError(res, error, "룸 조회 중 오류가 발생했습니다.");
  }
};

const SaveLogic3 = async (req, res) => {
  try {
    const room = await BusinessService.SaveLogic3(req.user.memIdx, req.body || {});
    return Ok(
      res,
      {
      room: {
        busDtlIdx: room.bus_dtl_idx,
        busMstIdx: room.bus_mst_idx,
        roomName: room.room_name,
        activeYn: room.active_yn,
        startDate: room.start_date,
        endDate: room.end_date,
      },
      },
      201,
    );
  } catch (error) {
    console.error("Create room error:", error);
    return HandleControllerError(res, error, "룸 추가 중 오류가 발생했습니다.");
  }
};

const SaveLogic4 = async (req, res) => {
  try {
    const room = await BusinessService.SaveLogic4(
      req.user.memIdx,
      req.params.busDtlIdx,
      req.body || {},
    );

    return Ok(res, {
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
    return HandleControllerError(res, error, "룸 수정 중 오류가 발생했습니다.");
  }
};

const SaveLogic5 = async (req, res) => {
  try {
    const result = await BusinessService.SaveLogic5(
      req.user.memIdx,
      req.params.busDtlIdx,
    );

    if (result.deleted === false) {
      const room = result.room;
      return Ok(res, {
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

    return Ok(res, { deleted: true });
  } catch (error) {
    console.error("Delete room error:", error);
    return HandleControllerError(res, error, "룸 삭제 중 오류가 발생했습니다.");
  }
};

const SearchLogic2 = async (req, res) => {
  try {
    const businesses = await BusinessService.SearchLogic2(req.user.memIdx);
    return Ok(res, {
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
    return HandleControllerError(res, error, "사업장 목록 조회 중 오류가 발생했습니다.");
  }
};

const SearchLogic3 = async (req, res) => {
  try {
    const business = await BusinessService.SearchLogic3(req.user.memIdx, req.params.id);
    return Ok(res, {
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
    return HandleControllerError(res, error, "사업장 조회 중 오류가 발생했습니다.");
  }
};

module.exports = {
  SaveLogic1,
  SaveLogic2,
  SearchLogic1,
  SaveLogic3,
  SaveLogic4,
  SaveLogic5,
  SearchLogic2,
  SearchLogic3,
};

