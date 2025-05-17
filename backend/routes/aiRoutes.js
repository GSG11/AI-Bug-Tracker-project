const express = require("express");
const router = express.Router();

// Mock function to simulate AI duplicate detection
const checkDuplicateBug = (description) => {
  const sampleBugs = [
    "App crashes on startup",
    "UI button not working",
    "Login fails after 3 attempts",
  ];

  return sampleBugs.some((bug) =>
    description.toLowerCase().includes(bug.toLowerCase())
  );
};

// POST /api/check-duplicate - Simulate AI checking for duplicate bugs
router.post("/detect_duplicates", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Bug description is required" });
    }

    const isDuplicate = checkDuplicateBug(description);

    res.json({
      duplicate: isDuplicate,
      message: isDuplicate
        ? "Duplicate bug detected! Please check existing reports."
        : "No duplicates found. You can report this bug.",
    });
  } catch (error) {
    console.error("Error in /detect-duplicates:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
