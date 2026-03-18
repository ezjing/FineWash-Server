const express = require("express");
const ProductController = require("../controllers/product_controller");

const router = express.Router();

// 상품 목록 조회 (SearchLogic1)
router.get("/", ProductController.SearchLogic1);

// 상품 상세 조회
router.get("/:id", ProductController.SearchLogic2);

// 카테고리별 상품 조회
router.get("/category/:category", ProductController.SearchLogic3);

module.exports = router;
