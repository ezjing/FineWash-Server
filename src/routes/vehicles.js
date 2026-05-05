const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth");
const validateRequest = require("../middlewares/validateRequest");
const VehicleController = require("../controllers/vehicle_controller");

const router = express.Router();

// 차량 목록 조회 (SearchLogic1)
router.get("/", authMiddleware, VehicleController.SearchLogic1);

// 차량 등록 (SaveLogic1)
router.post(
  "/",
  authMiddleware,
  [
    body("vehicle_type").notEmpty().withMessage("차종은 필수입니다."),
    body("model").notEmpty().withMessage("모델명은 필수입니다."),
    body("vehicle_number").notEmpty().withMessage("차량 번호는 필수입니다."),
  ],
  validateRequest,
  VehicleController.SaveLogic1,
);

// 차량 수정
router.put("/:id", authMiddleware, VehicleController.SaveLogic2);

// 차량 삭제
router.delete("/:id", authMiddleware, VehicleController.SaveLogic3);

module.exports = router;
