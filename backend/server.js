require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(" Connected to MongoDB Atlas!"))
  .catch((err) => {
    console.error(" MongoDB Connection Error:", err);
    process.exit(1);
  });

// Bug Schema
const BugSchema = new mongoose.Schema(
  {
    Summary: { type: String, required: true },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ["P1", "P2", "P3", "P4", "P5"],
      default: "P3",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    bugType: { type: String, default: "Unknown" },
    severity: { type: String, default: "Medium" },
    duplicateLinked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Bug = mongoose.model("Bug", BugSchema);

// Get all bugs
app.get("/api/bugs", async (req, res) => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.json(bugs);
  } catch (error) {
    console.error(" Error fetching bugs:", error);
    res.status(500).json({ message: "Error fetching bugs." });
  }
});

// Report a new bug
app.post("/api/bugs", async (req, res) => {
  try {
    const { Summary, description, priority } = req.body;

    if (!Summary || !description || !priority) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Call AI service
    const AI_API_URL = process.env.AI_API_URL || "http://127.0.0.1:8000/api/detect_duplicates";
    const aiResponse = await axios.post(AI_API_URL, { Summary, description });

    const { bug_type, severity, duplicates } = aiResponse.data;

    const newBug = new Bug({
      Summary,
      description,
      priority,
      bugType: bug_type || "Unknown",
      severity: severity || "Medium",
      duplicateLinked: Array.isArray(duplicates) && duplicates.length > 0,
    });

    await newBug.save();

    res.status(201).json({
      message: "Bug reported successfully!",
      bug: newBug,
      aiAnalysis: aiResponse.data,
    });
  } catch (error) {
    console.error(" Error reporting bug:", error.response?.data || error.message);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Update a bug
app.put("/api/bugs/:id", async (req, res) => {
  try {
    const { Summary, description, priority, status, bugType, severity } = req.body;

    const updatedBug = await Bug.findByIdAndUpdate(
      req.params.id,
      { Summary, description, priority, status, bugType, severity },
      { new: true, runValidators: true }
    );

    if (!updatedBug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    res.json({ message: "Bug updated successfully!", bug: updatedBug });
  } catch (error) {
    console.error(" Error updating bug:", error);
    res.status(500).json({ message: "Server error. Could not update bug." });
  }
});

// Delete a bug
app.delete("/api/bugs/:id", async (req, res) => {
  try {
    const deletedBug = await Bug.findByIdAndDelete(req.params.id);

    if (!deletedBug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    res.json({ message: "Bug deleted successfully!" });
  } catch (error) {
    console.error(" Error deleting bug:", error);
    res.status(500).json({ message: "Server error. Could not delete bug." });
  }
});

// Start server
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
