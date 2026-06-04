import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";
import leadsRouter from "./routes/leads.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const frontendDist = path.join(__dirname, "../frontend-dist");

app.use(cors());
app.use(express.json());
app.use(express.static(frontendDist));

app.use("/api/auth", authRouter);
app.use("/api/leads", leadsRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(frontendDist, "index.html"));
});

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not set");
}

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not set");
}

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });
