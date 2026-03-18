const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("Database tables synchronized");
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
