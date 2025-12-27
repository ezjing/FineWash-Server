const { Sequelize } = require("sequelize");

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    timezone: "+09:00", // 한국 시간
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      timestamps: true,
      underscored: true, // snake_case 컬럼명 사용
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// 모델 import
const User = require("./User")(sequelize);
const Vehicle = require("./Vehicle")(sequelize);
const Booking = require("./Booking")(sequelize);
const Product = require("./Product")(sequelize);
const WashLocation = require("./WashLocation")(sequelize);

// 관계 설정
// User - Vehicle (1:N)
User.hasMany(Vehicle, { foreignKey: "user_id", as: "vehicles" });
Vehicle.belongsTo(User, { foreignKey: "user_id", as: "user" });

// User - Booking (1:N)
User.hasMany(Booking, { foreignKey: "user_id", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Vehicle - Booking (1:N)
Vehicle.hasMany(Booking, { foreignKey: "vehicle_id", as: "bookings" });
Booking.belongsTo(Vehicle, { foreignKey: "vehicle_id", as: "vehicle" });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Vehicle,
  Booking,
  Product,
  WashLocation,
};
