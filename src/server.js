const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const { sequelize } = require("./models");
const { SyncDatabaseIfNeeded } = require("./config/database_bootstrap");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await SyncDatabaseIfNeeded();

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
