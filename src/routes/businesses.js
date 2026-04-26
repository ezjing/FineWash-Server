const express = require("express");
const authMiddleware = require("../middlewares/auth");
const BusinessController = require("../controllers/business_controller");

const router = express.Router();

// 가까운 제휴 세차장 조회 (공개 API) — auth 없이 사용
router.get("/nearby", BusinessController.SearchLogic4);

// 사업장(MST) 등록
router.post("/", authMiddleware, BusinessController.SaveLogic1);

// 사업장(MST) 수정
router.put("/:busMstIdx", authMiddleware, BusinessController.SaveLogic2);

// 사업장(MST) 삭제 — GET /:id 와 구분 (메서드별)
router.delete("/:busMstIdx", authMiddleware, BusinessController.SaveLogic6);

// 룸(DTL) 상세 조회 - 해당 룸 정보 + 예약 목록 (경로가 /:id 보다 먼저 와야 함)
router.get("/rooms/:busDtlIdx", authMiddleware, BusinessController.SearchLogic1);

// 룸(DTL) 추가 - 특정 사업장에 룸만 추가 (경로가 / 보다 먼저 와야 함)
router.post("/rooms", authMiddleware, BusinessController.SaveLogic3);

// 룸(DTL) 수정
router.put("/rooms/:busDtlIdx", authMiddleware, BusinessController.SaveLogic4);

// 룸(DTL) 삭제
router.delete("/rooms/:busDtlIdx", authMiddleware, BusinessController.SaveLogic5);

// 사업장 목록 조회 (SearchLogic1) - 로그인한 유저의 mem_idx와 일치하는 경우만
router.get("/", authMiddleware, BusinessController.SearchLogic2);

// 사업장 상세 조회 - 로그인한 유저의 mem_idx와 일치하는 경우만
router.get("/:id", authMiddleware, BusinessController.SearchLogic3);

module.exports = router;
