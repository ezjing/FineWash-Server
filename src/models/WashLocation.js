const mongoose = require('mongoose');

const washLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '세차장 이름은 필수입니다.'],
    trim: true
  },
  address: {
    type: String,
    required: [true, '주소는 필수입니다.']
  },
  distance: {
    type: String,
    default: '0km'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: null
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WashLocation', washLocationSchema);

