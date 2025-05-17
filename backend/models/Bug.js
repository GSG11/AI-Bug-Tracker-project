const mongoose = require("mongoose");

const BugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Open", "In Progress", "Resolved"], default: "Open" },
  priority: { 
    type: String, 
    enum: ["P1", "P2", "P3", "P4", "P5"], 
    default: "P3" 
  },
}, { timestamps: true });

module.exports = mongoose.model("Bug", BugSchema);
