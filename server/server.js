const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

// Load env vars early
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const projectRoutes = require("./routes/projects");
const skillRoutes = require("./routes/skills");
const messageRoutes = require("./routes/messages");
const experienceRoutes = require("./routes/experience");

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ── Security ─────────────────────────────────────────────
app.use(helmet());

// CORS: allow CLIENT_URL in both modes, plus localhost in dev
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});
app.use("/api/", limiter);

// ── Body parsing ─────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Static: serve uploaded files ─────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── MongoDB ──────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not set. Please configure your .env file.");
  process.exit(1);
}

mongoose.set("strictQuery", true);
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: NODE_ENV === "production" ? 10 : 5,
  })
  .then(() => {
    console.log(`✅ MongoDB connected (${NODE_ENV} mode)`);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ── API Routes ───────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/experience", experienceRoutes);

// ── Health check ─────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Error handling ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    ...(NODE_ENV !== "production" && { detail: err.message }),
  });
});

// ── 404 ──────────────────────────────────────────────────
app.use("*", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ── Graceful shutdown ────────────────────────────────────
let server;
const shutdown = async () => {
  console.log("\n🛑 Shutting down gracefully...");
  if (server) {
    server.close(async () => {
      console.log("✅ Server stopped");
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
    // Force shutdown after 10s
    setTimeout(() => {
      console.error("❌ Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// ── Start ─────────────────────────────────────────────────
server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT} (${NODE_ENV} mode)`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});

