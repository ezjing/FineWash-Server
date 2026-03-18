const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

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
app.use(errorHandler);

// 404 handler
app.use(notFound);

module.exports = app;
