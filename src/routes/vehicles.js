const express = require("express");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/auth");
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }
    return await VehicleController.SaveLogic1(req, res);
  },
);

// 차량 수정
router.put("/:id", authMiddleware, VehicleController.SaveLogic2);

// 차량 삭제
router.delete("/:id", authMiddleware, VehicleController.SaveLogic3);

module.exports = router;
