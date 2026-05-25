import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    source: { type: String, default: "website_form", trim: true },
    status: {
      type: String,
      enum: ["new", "contacted", "converted"],
      default: "new"
    },
    statusUpdatedAt: { type: Date, default: Date.now },
    followUps: [
      {
        note: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: String, trim: true },
        followUpDate: { type: Date }
      }
    ]
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
