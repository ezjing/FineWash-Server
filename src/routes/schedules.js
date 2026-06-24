const express = require("express");
const authMiddleware = require("../middlewares/auth");
const ScheduleController = require("../controllers/schedule_controller");

const router = express.Router();

router.get("/masters", authMiddleware, ScheduleController.SearchLogic1);
router.post("/masters", authMiddleware, ScheduleController.SaveLogic1);
router.put(
  "/masters/:schMstIdx",
  authMiddleware,
  ScheduleController.SaveLogic2,
);
router.delete(
  "/masters/:schMstIdx",
  authMiddleware,
  ScheduleController.DeleteLogic1,
);

router.get("/details", authMiddleware, ScheduleController.SearchLogic2);
router.post("/details", authMiddleware, ScheduleController.SaveLogic3);
router.put(
  "/details/:schDtlIdx",
  authMiddleware,
  ScheduleController.SaveLogic4,
);
router.delete(
  "/details/:schDtlIdx",
  authMiddleware,
  ScheduleController.DeleteLogic2,
);

module.exports = router;
