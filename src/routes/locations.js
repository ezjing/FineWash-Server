const express = require('express');
const WashLocation = require('../models/WashLocation');

const router = express.Router();

// 더미 세차장 데이터
const dummyLocations = [
  { 
    id: '1', 
    name: '클린세차장 강남점', 
    address: '서울 강남구 테헤란로 123', 
    distance: '1.2km', 
    rating: 4.8, 
    reviewCount: 245 
  },
  { 
    id: '2', 
    name: '프리미엄세차 역삼점', 
    address: '서울 강남구 역삼동 456', 
    distance: '2.5km', 
    rating: 4.6, 
    reviewCount: 189 
  },
  { 
    id: '3', 
    name: '스피드세차 선릉점', 
    address: '서울 강남구 선릉로 789', 
    distance: '3.1km', 
    rating: 4.7, 
    reviewCount: 312 
  }
];

// 세차장 목록 조회 (SearchLogic1)
router.get('/', async (req, res) => {
  try {
    let locations;
    try {
      locations = await WashLocation.find().sort({ distance: 1 });
    } catch (dbError) {
      locations = null;
    }

    // DB 데이터가 없으면 더미 데이터 사용
    if (!locations || locations.length === 0) {
      return res.json({
        success: true,
        locations: dummyLocations
      });
    }

    res.json({
      success: true,
      locations: locations.map(l => ({
        id: l._id,
        name: l.name,
        address: l.address,
        distance: l.distance,
        rating: l.rating,
        reviewCount: l.reviewCount,
        imageUrl: l.imageUrl
      }))
    });
  } catch (error) {
    console.error('Get locations error:', error);
    // 오류 발생 시에도 더미 데이터 반환
    res.json({
      success: true,
      locations: dummyLocations
    });
  }
});

// 세차장 상세 조회
router.get('/:id', async (req, res) => {
  try {
    let location;
    try {
      location = await WashLocation.findById(req.params.id);
    } catch (dbError) {
      location = null;
    }

    // DB에서 못 찾으면 더미 데이터에서 검색
    if (!location) {
      location = dummyLocations.find(l => l.id === req.params.id);
    }

    if (!location) {
      return res.status(404).json({
        success: false,
        message: '세차장을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      location: {
        id: location._id || location.id,
        name: location.name,
        address: location.address,
        distance: location.distance,
        rating: location.rating,
        reviewCount: location.reviewCount,
        imageUrl: location.imageUrl
      }
    });
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({
      success: false,
      message: '세차장 조회 중 오류가 발생했습니다.'
    });
  }
});

// 근처 세차장 검색 (위치 기반)
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    // 위치 정보가 없으면 기본 목록 반환
    if (!lat || !lng) {
      return res.json({
        success: true,
        locations: dummyLocations
      });
    }

    // TODO: 실제 위치 기반 검색 구현
    // 현재는 더미 데이터 반환
    res.json({
      success: true,
      locations: dummyLocations
    });
  } catch (error) {
    console.error('Get nearby locations error:', error);
    res.status(500).json({
      success: false,
      message: '세차장 검색 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;

