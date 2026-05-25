import express from "express";
import Lead from "../models/Lead.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

const ALLOWED_STATUSES = ["new", "contacted", "converted"];

const normalizeLead = (leadDoc) => {
  const data = leadDoc.toObject();

  if (!data.followUps?.length && data.notes?.length) {
    data.followUps = data.notes.map((note) => ({
      note: note.body,
      createdAt: note.createdAt,
      createdBy: note.createdBy,
      followUpDate: note.followUpDate
    }));
  }

  delete data.notes;
  return data;
};

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
    return res.json(leads.map(normalizeLead));
  } catch (err) {
    console.error("Lead fetch error", err);
    return res.status(500).json({ error: "failed to fetch leads" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: "lead not found" });
    }

    return res.json(normalizeLead(lead));
  } catch (err) {
    console.error("Lead detail error", err);
    return res.status(500).json({ error: "failed to fetch lead" });
  }
});

const updateStatusHandler = async (req, res) => {
  try {
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: "invalid status" });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status, statusUpdatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ error: "lead not found" });
    }

    return res.json(normalizeLead(lead));
  } catch (err) {
    console.error("Lead status update error", err);
    return res.status(500).json({ error: "failed to update status" });
  }
};

router.put("/:id/status", updateStatusHandler);
router.patch("/:id/status", updateStatusHandler);

router.post("/:id/followups", async (req, res) => {
  try {
    const { note, createdBy, followUpDate } = req.body;

    if (!note) {
      return res.status(400).json({ error: "note is required" });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: "lead not found" });
    }

    lead.followUps.unshift({ note, createdBy, followUpDate });
    await lead.save();

    return res.status(201).json(normalizeLead(lead));
  } catch (err) {
    console.error("Lead follow-up error", err);
    return res.status(500).json({ error: "failed to add follow-up" });
  }
});

export default router;
