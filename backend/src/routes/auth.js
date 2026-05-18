import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

const isValidPassword = (value) => typeof value === "string" && value.length >= 8;

router.post("/setup", async (req, res) => {
  try {
    const existingCount = await Admin.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({ error: "admin already exists" });
    }

    const { email, password } = req.body;
    if (!email || !isValidPassword(password)) {
      return res.status(400).json({ error: "valid email and 8+ char password required" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await Admin.create({ email, passwordHash });

    return res.status(201).json({ id: admin.id, email: admin.email });
  } catch (err) {
    console.error("Admin setup error", err);
    return res.status(500).json({ error: "failed to create admin" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const token = jwt.sign(
      { sub: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ error: "failed to login" });
  }
});

export default router;
