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
const FcmToken = require("./FcmToken")(sequelize);
const BusinessMaster = require("./BusinessMaster")(sequelize);
const BusinessDetail = require("./BusinessDetail")(sequelize);
const ReservationSchedule = require("./ReservationSchedule")(sequelize);
const ScheduleMaster = require("./ScheduleMaster")(sequelize);
const ScheduleDetail = require("./ScheduleDetail")(sequelize);
const SystemCode = require("./SystemCode")(sequelize);
const WashOptionMaster = require("./WashOptionMaster")(sequelize);
const WashOptionDetail = require("./WashOptionDetail")(sequelize);

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

// Member - FcmToken (1:N)
Member.hasMany(FcmToken, { foreignKey: "mem_idx", as: "fcmTokens" });
FcmToken.belongsTo(Member, { foreignKey: "mem_idx", as: "member" });

// Member - BusinessMaster (1:N)
Member.hasMany(BusinessMaster, { foreignKey: "mem_idx", as: "businessMasters" });
BusinessMaster.belongsTo(Member, { foreignKey: "mem_idx", as: "member" });

// BusinessMaster - BusinessDetail (1:N)
BusinessMaster.hasMany(BusinessDetail, { foreignKey: "bus_mst_idx", as: "businessDetails" });
BusinessDetail.belongsTo(BusinessMaster, { foreignKey: "bus_mst_idx", as: "businessMaster" });

// Reservation - ReservationSchedule (1:1)
Reservation.hasOne(ReservationSchedule, { foreignKey: "resv_idx", as: "reservationSchedule" });
ReservationSchedule.belongsTo(Reservation, { foreignKey: "resv_idx", as: "reservation" });

// BusinessDetail - Reservation (1:N)
BusinessDetail.hasMany(Reservation, { foreignKey: "bus_dtl_idx", as: "reservations" });
Reservation.belongsTo(BusinessDetail, { foreignKey: "bus_dtl_idx", as: "businessDetail" });

// BusinessDetail - ScheduleMaster (1:N)
BusinessDetail.hasMany(ScheduleMaster, { foreignKey: "bus_dtl_idx", as: "scheduleMasters" });
ScheduleMaster.belongsTo(BusinessDetail, { foreignKey: "bus_dtl_idx", as: "businessDetail" });

// ScheduleMaster - ScheduleDetail (1:N)
ScheduleMaster.hasMany(ScheduleDetail, { foreignKey: "sch_mst_idx", as: "scheduleDetails" });
ScheduleDetail.belongsTo(ScheduleMaster, { foreignKey: "sch_mst_idx", as: "scheduleMaster" });

// BusinessDetail - ScheduleDetail (1:N)
BusinessDetail.hasMany(ScheduleDetail, { foreignKey: "bus_dtl_idx", as: "scheduleDetails" });
ScheduleDetail.belongsTo(BusinessDetail, { foreignKey: "bus_dtl_idx", as: "businessDetail" });

// BusinessMaster - WashOptionMaster (1:N)
BusinessMaster.hasMany(WashOptionMaster, { foreignKey: "bus_mst_idx", as: "washOptionMasters" });
WashOptionMaster.belongsTo(BusinessMaster, { foreignKey: "bus_mst_idx", as: "businessMaster" });

// WashOptionMaster - WashOptionDetail (1:N)
WashOptionMaster.hasMany(WashOptionDetail, { foreignKey: "wopt_mst_idx", as: "washOptionDetails" });
WashOptionDetail.belongsTo(WashOptionMaster, { foreignKey: "wopt_mst_idx", as: "washOptionMaster" });

module.exports = {
  sequelize,
  Sequelize,
  Member,
  Vehicle,
  Reservation,
  Product,
  FcmToken,
  BusinessMaster,
  BusinessDetail,
  ReservationSchedule,
  ScheduleMaster,
  ScheduleDetail,
  SystemCode,
  WashOptionMaster,
  WashOptionDetail,
};
