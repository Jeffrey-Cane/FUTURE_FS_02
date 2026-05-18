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
    notes: [
      {
        body: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
