const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import database
const { sequelize } = require("./models");

// Import routes
const authRoutes = require("./routes/auth");
const memberRoutes = require("./routes/members");
const vehicleRoutes = require("./routes/vehicles");
const reservationRoutes = require("./routes/reservations");
const productRoutes = require("./routes/products");
const businessRoutes = require("./routes/businesses");
const paymentRoutes = require("./routes/payments");
const washOptionRoutes = require("./routes/washOption");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wash-options", washOptionRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "FineWash API Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "서버 오류가 발생했습니다.",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "요청한 리소스를 찾을 수 없습니다.",
  });
});

const PORT = process.env.PORT || 3000;

// Connect to database and start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // 개발 환경에서 테이블 동기화 (alter: true는 기존 데이터 유지)
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
