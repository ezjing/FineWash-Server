const path = require("path");
const { Sequelize } = require("sequelize");

const nodeEnv = process.env.NODE_ENV || "development";
const dialect =
  (process.env.DB_DIALECT || "").trim().toLowerCase() ||
  (nodeEnv === "production" ? "mysql" : "sqlite");

const commonDefine = {
  timestamps: true,
  underscored: false,
};

let sequelize;

if (dialect === "mysql") {
  // ----- MySQL (운영 권장) -----
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: nodeEnv === "development" ? console.log : false,
      timezone: "+09:00",
      define: {
        ...commonDefine,
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      },
      pool: {
        max: Number(process.env.DB_POOL_MAX) || 10,
        min: Number(process.env.DB_POOL_MIN) || 0,
        acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
        idle: Number(process.env.DB_POOL_IDLE) || 10000,
      },
    },
  );
} else {
  // ----- SQLite (개발/기본) -----
  const dbPath =
    process.env.DB_PATH || path.join(__dirname, "..", "..", "fineWash.db");

  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: nodeEnv === "development" ? console.log : false,
    define: commonDefine,
  });
}

module.exports = {
  sequelize,
  Sequelize,
};
