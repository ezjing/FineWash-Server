const express = require("express");
const authMiddleware = require("../middlewares/auth");
const WashOptionController = require("../controllers/wash_option_controller");

const router = express.Router();

router.get("/masters", authMiddleware, WashOptionController.SearchLogic1);
router.post("/masters", authMiddleware, WashOptionController.SaveLogic1);
router.put(
  "/masters/:woptMstIdx",
  authMiddleware,
  WashOptionController.SaveLogic2,
);
router.delete(
  "/masters/:woptMstIdx",
  authMiddleware,
  WashOptionController.DeleteLogic1,
);

router.get("/details", authMiddleware, WashOptionController.SearchLogic2);
router.post("/details", authMiddleware, WashOptionController.SaveLogic3);
router.put(
  "/details/:woptDtlIdx",
  authMiddleware,
  WashOptionController.SaveLogic4,
);
router.delete(
  "/details/:woptDtlIdx",
  authMiddleware,
  WashOptionController.DeleteLogic2,
);

module.exports = router;
