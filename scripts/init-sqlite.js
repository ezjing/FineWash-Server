/**
 * 로컬에서 SQLite 파일이 없을 때 빈 DB 파일을 만듭니다.
 * 스키마는 서버 기동 시 sequelize.sync 로 생성됩니다.
 * .env는 직접 파싱합니다.
 */
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");

function ParseEnvFile(filePath) {
  const out = {};
  if (!fs.existsSync(filePath)) return out;
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function ResolveDbPath() {
  const envFile = ParseEnvFile(path.join(projectRoot, ".env"));
  const raw = String(process.env.DB_PATH || envFile.DB_PATH || "").trim();
  if (!raw) return path.join(projectRoot, "fineWash.db");
  return path.isAbsolute(raw) ? raw : path.join(projectRoot, raw);
}

const dbPath = ResolveDbPath();
const dir = path.dirname(dbPath);

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, Buffer.alloc(0));
  console.log("Created SQLite database file:", dbPath);
} else {
  console.log("SQLite database file already exists:", dbPath);
}
