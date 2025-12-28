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
      underscored: false, // camelCase 필드명 사용 (DB는 snake_case)
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
const Member = require("./Member")(sequelize);
const Vehicle = require("./Vehicle")(sequelize);
const Reservation = require("./Reservation")(sequelize);
const Product = require("./Product")(sequelize);
const WashLocation = require("./WashLocation")(sequelize);

// 관계 설정
// Member - Vehicle (1:N)
Member.hasMany(Vehicle, { foreignKey: "mem_idx", as: "vehicles" });
Vehicle.belongsTo(Member, { foreignKey: "mem_idx", as: "member" });

// Member - Reservation (1:N)
Member.hasMany(Reservation, { foreignKey: "mem_idx", as: "reservations" });
Reservation.belongsTo(Member, { foreignKey: "mem_idx", as: "member" });

// Vehicle - Reservation (1:N)
Vehicle.hasMany(Reservation, { foreignKey: "veh_idx", as: "reservations" });
Reservation.belongsTo(Vehicle, { foreignKey: "veh_idx", as: "vehicle" });

module.exports = {
  sequelize,
  Sequelize,
  Member,
  Vehicle,
  Reservation,
  Product,
  WashLocation,
};
