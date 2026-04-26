const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;

// SQLite alter 실패 시 남은 *_backup 테이블 정리
const CleanupSqliteBackupTables = async () => {
  if (sequelize.getDialect() !== "sqlite") return;

  const [rows] = await sequelize.query(
    "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%\\_backup' ESCAPE '\\'",
  );

  const tableNames = Array.isArray(rows)
    ? rows.map((r) => r.name).filter((n) => typeof n === "string")
    : [];

  for (const tableName of tableNames) {
    if (!tableName.endsWith("_backup")) continue;
    await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\`;`);
  }

  if (tableNames.length > 0) {
    console.log(`Cleaned up backup tables: ${tableNames.join(", ")}`);
  }
};

// DB 연결 후 서버를 기동(개발 SQLite면 필요 시 alter sync 수행)
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // 운영(MySQL)은 마이그레이션 전제: 앱 기동 시 sync/alter를 자동으로 돌리지 않음
    // 개발(SQLite)에서만 필요 시 sync/alter 수행
    const isDev = process.env.NODE_ENV === "development";
    const isSqlite = sequelize.getDialect() === "sqlite";
    const enableSyncAlter = (process.env.DB_SYNC_ALTER || "true") !== "false";

    if (isDev && isSqlite && enableSyncAlter) {
      // SQLite + alter(sync) 시 FK 제약 때문에 drop/rename 단계에서 실패할 수 있어
      // 개발 환경에서만 sync 전후로 foreign_keys를 잠시 끕니다.
      await sequelize.query("PRAGMA foreign_keys = OFF;");

      try {
        await sequelize.sync({ alter: true });
        console.log("Database tables synchronized");
      } catch (syncError) {
        console.error("Database sync failed:", syncError?.message || syncError);
        await CleanupSqliteBackupTables();
        await sequelize.sync({ alter: true });
        console.log("Database tables synchronized (after backup cleanup)");
      } finally {
        await sequelize.query("PRAGMA foreign_keys = ON;");
      }
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    console.log("Starting server without database connection...");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (without database)`);
    });
  }
};

startServer();
