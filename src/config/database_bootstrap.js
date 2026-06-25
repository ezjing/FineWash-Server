const { sequelize } = require("./db");

/** SQLite alter 실패 시 남은 *_backup 테이블 정리 */
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

/** 개발(SQLite) 환경에서만 필요 시 sync/alter 수행 */
const SyncDatabaseIfNeeded = async () => {
  const isDev = process.env.NODE_ENV === "development";
  const isSqlite = sequelize.getDialect() === "sqlite";
  const enableSyncAlter = (process.env.DB_SYNC_ALTER || "true") !== "false";

  if (!isDev || !isSqlite || !enableSyncAlter) return;

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
};

module.exports = {
  CleanupSqliteBackupTables,
  SyncDatabaseIfNeeded,
};
