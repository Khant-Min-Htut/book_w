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

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../mobile/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../mobile/dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  connectDB();
});
