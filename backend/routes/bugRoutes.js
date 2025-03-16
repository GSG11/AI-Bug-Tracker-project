const express = require("express");
const Bug = require("../models/Bug"); // Import the Bug model
const router = express.Router();

//  GET all bugs
router.get("/bugs", async (req, res) => {
  try {
    const bugs = await Bug.find();
    res.json(bugs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//  POST a new bug
router.post("/bugs", async (req, res) => {
  console.log("Incoming Request:", req.body); // Print request in terminal

  if (!req.body.title || !req.body.description || !req.body.status || !req.body.priority) {
      return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
      const newBug = new Bug({
          title: req.body.title,
          description: req.body.description,
          status: req.body.status,
          priority: req.body.priority
      });

      await newBug.save(); // Save to MongoDB
      console.log(" Bug Saved:", newBug); // Debugging log
      res.status(201).json(newBug);
  } catch (error) {
      console.error(" Error saving bug:", error);
      res.status(500).json({ message: "Server error" });
  }
});

//  GET a single bug by ID
router.get("/bugs/:id", async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ error: "Bug not found" });
    res.json(bug);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//  Update Bug by ID
router.put("/bugs/:id", async (req, res) => {
  try {
      const updatedBug = await Bug.findByIdAndUpdate(req.params.id, req.body, { new: true });
      
      if (!updatedBug) {
          return res.status(404).json({ message: "Bug not found" });
      }

      res.json(updatedBug);
  } catch (error) {
      res.status(500).json({ message: "Error updating bug", error });
  }
});

//  DELETE a bug
router.delete("/bugs/:id", async (req, res) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) return res.status(404).json({ error: "Bug not found" });
    res.json({ message: "Bug deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
