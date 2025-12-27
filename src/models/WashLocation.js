const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const WashLocation = sequelize.define('WashLocation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: '세차장 이름은 필수입니다.' }
      }
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: '주소는 필수입니다.' }
      }
    },
    distance: {
      type: DataTypes.STRING(20),
      defaultValue: '0km'
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    review_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      defaultValue: null
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      defaultValue: null
    }
  }, {
    tableName: 'wash_locations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return WashLocation;
};
