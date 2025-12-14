const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '상품명은 필수입니다.'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, '가격은 필수입니다.']
  },
  image: {
    type: String,
    default: '📦'
  },
  category: {
    type: String,
    required: [true, '카테고리는 필수입니다.']
  },
  description: {
    type: String,
    default: null
  },
  stock: {
    type: Number,
    default: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);

