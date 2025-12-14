const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  type: {
    type: String,
    enum: ['mobile', 'partner'],
    required: true
  },
  serviceType: {
    type: String,
    required: [true, '서비스 종류는 필수입니다.']
  },
  date: {
    type: String,
    required: [true, '날짜는 필수입니다.']
  },
  time: {
    type: String,
    required: [true, '시간은 필수입니다.']
  },
  address: {
    type: String,
    default: null
  },
  washLocation: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: [true, '가격은 필수입니다.']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);

