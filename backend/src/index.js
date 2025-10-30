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
app.use(cors());

// --- API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// --- Serve frontend in production ---
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../mobile/dist");
  app.use(express.static(clientPath));

  // ✅ Express 5 catch-all fallback
  app.use((req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB();
});
