const mongoose = require("mongoose");

const BugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Open", "In Progress", "Resolved"], default: "Open" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
}, { timestamps: true });

module.exports = mongoose.model("Bug", BugSchema);
