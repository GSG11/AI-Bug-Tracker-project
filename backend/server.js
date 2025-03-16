require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000; // Use .env PORT if available

// Middleware
app.use(cors());
app.use(express.json());

//  MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(" MONGO_URI is missing in .env");
  process.exit(1); // Stop the server if MONGO_URI is missing
}

mongoose.connect(MONGO_URI)
  .then(() => console.log(" Connected to MongoDB Atlas!"))
  .catch((err) => {
    console.error(" MongoDB Connection Error:", err);
    process.exit(1);
  });

//  Bug Schema
const bugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, required: true, enum: ["Low", "Medium", "High"] },
});

const Bug = mongoose.model("Bug", bugSchema);

//  GET all bugs
app.get("/api/bugs", async (req, res) => {
  try {
    const bugs = await Bug.find();
    res.json(bugs);
  } catch (error) {
    console.error("Error fetching bugs:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

//  POST - Report a new bug
app.post("/api/bugs", async (req, res) => {
  console.log("Incoming Request:", req.body);

  const { title, description, priority } = req.body;

  if (!title || !description || !priority) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    const newBug = new Bug({ title, description, priority });
    await newBug.save();
    res.status(201).json({ message: "Bug reported successfully!" });
  } catch (error) {
    console.error("Error saving bug:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

//  PUT - Update a bug
app.put("/api/bugs/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, priority } = req.body;

  if (!title || !description || !priority) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    const updatedBug = await Bug.findByIdAndUpdate(id, { title, description, priority }, { new: true });

    if (!updatedBug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    res.json({ message: "Bug updated successfully!", updatedBug });
  } catch (error) {
    console.error("Error updating bug:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

//  DELETE - Remove a bug
app.delete("/api/bugs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBug = await Bug.findByIdAndDelete(id);

    if (!deletedBug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    res.json({ message: "Bug deleted successfully!" });
  } catch (error) {
    console.error("Error deleting bug:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

//  Start Server
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
