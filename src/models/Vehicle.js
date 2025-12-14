const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, '차량 이름은 필수입니다.'],
    trim: true
  },
  number: {
    type: String,
    required: [true, '차량 번호는 필수입니다.'],
    trim: true
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'suv'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);

