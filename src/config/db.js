const path = require("path");
const { Sequelize } = require("sequelize");

// ----- SQLite (개발/기본) -----
const dbPath =
  process.env.DB_PATH || path.join(__dirname, "..", "..", "fineWash.db");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
  },
});

// ----- MySQL (운영 시 사용: 아래 주석 해제 후 위 SQLite 블록 주석 처리, package.json에 mysql2 필요) -----
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 3306,
//     dialect: "mysql",
//     logging: process.env.NODE_ENV === "development" ? console.log : false,
//     timezone: "+09:00",
//     define: {
//       charset: "utf8mb4",
//       collate: "utf8mb4_unicode_ci",
//       timestamps: true,
//       underscored: false,
//     },
//     pool: {
//       max: 10,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//   }
// );

module.exports = {
  sequelize,
  Sequelize,
};

