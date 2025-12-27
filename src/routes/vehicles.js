const express = require('express');
const { body, validationResult } = require('express-validator');
const { Vehicle } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 차량 목록 조회 (SearchLogic1)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { user_id: req.user.userId },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      vehicles: vehicles.map(v => ({
        id: v.id,
        name: v.name,
        number: v.number,
        size: v.size,
        userId: v.user_id
      }))
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: '차량 목록 조회 중 오류가 발생했습니다.'
    });
  }
});

// 차량 등록 (SaveLogic1)
router.post('/', authMiddleware, [
  body('name').notEmpty().withMessage('차량 이름은 필수입니다.'),
  body('number').notEmpty().withMessage('차량 번호는 필수입니다.'),
  body('size').isIn(['small', 'medium', 'large', 'suv']).withMessage('올바른 차량 크기를 선택해주세요.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { name, number, size } = req.body;

    const vehicle = await Vehicle.create({
      user_id: req.user.userId,
      name,
      number,
      size
    });

    res.status(201).json({
      success: true,
      message: '차량이 등록되었습니다.',
      vehicle: {
        id: vehicle.id,
        name: vehicle.name,
        number: vehicle.number,
        size: vehicle.size,
        userId: vehicle.user_id
      }
    });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({
      success: false,
      message: '차량 등록 중 오류가 발생했습니다.'
    });
  }
});

// 차량 수정
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, number, size } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (number) updateData.number = number;
    if (size) updateData.size = size;

    const [updatedCount] = await Vehicle.update(updateData, {
      where: { id: req.params.id, user_id: req.user.userId }
    });

    if (updatedCount === 0) {
      return res.status(404).json({
        success: false,
        message: '차량을 찾을 수 없습니다.'
      });
    }

    const vehicle = await Vehicle.findByPk(req.params.id);

    res.json({
      success: true,
      message: '차량 정보가 수정되었습니다.',
      vehicle: {
        id: vehicle.id,
        name: vehicle.name,
        number: vehicle.number,
        size: vehicle.size,
        userId: vehicle.user_id
      }
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({
      success: false,
      message: '차량 수정 중 오류가 발생했습니다.'
    });
  }
});

// 차량 삭제
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedCount = await Vehicle.destroy({
      where: { id: req.params.id, user_id: req.user.userId }
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: '차량을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      message: '차량이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      success: false,
      message: '차량 삭제 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
