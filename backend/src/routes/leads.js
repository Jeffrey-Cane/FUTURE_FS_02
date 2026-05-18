import express from "express";
import Lead from "../models/Lead.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

const ALLOWED_STATUSES = ["new", "contacted", "converted"];

router.post("/", async (req, res) => {
  try {
    const { name, email, message, source } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "name, email, and message are required" });
    }

    const lead = await Lead.create({
      name,
      email,
      message,
      source: source || "website_form"
    });

    return res.status(201).json(lead);
  } catch (err) {
    console.error("Lead creation error", err);
    return res.status(500).json({ error: "failed to create lead" });
  }
});

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    return res.json(leads);
  } catch (err) {
    console.error("Lead fetch error", err);
    return res.status(500).json({ error: "failed to fetch leads" });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: "invalid status" });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ error: "lead not found" });
    }

    return res.json(lead);
  } catch (err) {
    console.error("Lead status update error", err);
    return res.status(500).json({ error: "failed to update status" });
  }
});

router.post("/:id/notes", async (req, res) => {
  try {
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({ error: "note body is required" });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: "lead not found" });
    }

    lead.notes.unshift({ body });
    await lead.save();

    return res.status(201).json(lead);
  } catch (err) {
    console.error("Lead notes error", err);
    return res.status(500).json({ error: "failed to add note" });
  }
});

export default router;
