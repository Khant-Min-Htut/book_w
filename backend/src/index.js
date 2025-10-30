import express from "express";
import cors from "cors";
import "dotenv/config";
import job from "./lib/cron.js";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

job.start();
app.use(express.json());

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:3000", // local dev web
  "http://localhost:8081", // Expo web
  "https://book-w.vercel.app", // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile / server requests
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// ✅ Serve frontend build when in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../mobile/dist")));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../mobile/dist", "index.html"));
  });
}

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB();
});
