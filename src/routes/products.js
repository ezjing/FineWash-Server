const express = require('express');
const { Product } = require('../models');

const router = express.Router();

// 더미 상품 데이터
const dummyProducts = [
  { id: '1', name: '프리미엄 세차 샴푸', price: 25000, image: '🧴', category: '세차용품' },
  { id: '2', name: '마이크로파이버 타월', price: 15000, image: '🧽', category: '세차용품' },
  { id: '3', name: '왁스 코팅제', price: 35000, image: '✨', category: '코팅제' },
  { id: '4', name: '타이어 광택제', price: 18000, image: '⚫', category: '타이어' },
  { id: '5', name: '실내 방향제', price: 12000, image: '🌸', category: '방향제' },
  { id: '6', name: '유리세정제', price: 16000, image: '💧', category: '세정제' }
];

// 상품 목록 조회 (SearchLogic1)
router.get('/', async (req, res) => {
  try {
    // MySQL에서 상품 조회 시도
    let products;
    try {
      products = await Product.findAll({ order: [['created_at', 'DESC']] });
    } catch (dbError) {
      // DB 연결이 없는 경우 더미 데이터 반환
      products = null;
    }

    // DB 상품이 없으면 더미 데이터 사용
    if (!products || products.length === 0) {
      return res.json({
        success: true,
        products: dummyProducts
      });
    }

    res.json({
      success: true,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        description: p.description,
        stock: p.stock
      }))
    });
  } catch (error) {
    console.error('Get products error:', error);
    // 오류 발생 시에도 더미 데이터 반환
    res.json({
      success: true,
      products: dummyProducts
    });
  }
});

// 상품 상세 조회
router.get('/:id', async (req, res) => {
  try {
    let product;
    try {
      product = await Product.findByPk(req.params.id);
    } catch (dbError) {
      product = null;
    }

    // DB에서 못 찾으면 더미 데이터에서 검색
    if (!product) {
      product = dummyProducts.find(p => p.id === req.params.id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
        stock: product.stock
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: '상품 조회 중 오류가 발생했습니다.'
    });
  }
});

// 카테고리별 상품 조회
router.get('/category/:category', async (req, res) => {
  try {
    let products;
    try {
      products = await Product.findAll({ where: { category: req.params.category } });
    } catch (dbError) {
      products = null;
    }

    if (!products || products.length === 0) {
      products = dummyProducts.filter(p => p.category === req.params.category);
    }

    res.json({
      success: true,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category
      }))
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: '상품 조회 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
