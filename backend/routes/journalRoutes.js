const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createJournalEntry,getJournalEntries,getJournalEntryById,updateJournalEntry,deleteJournalEntry } = require("../controllers/journalController");

const router = express.Router();

router.post("/", protect, createJournalEntry);
router.get("/", protect, getJournalEntries);
router.get("/:id", protect, getJournalEntryById);
router.put("/:id", protect, updateJournalEntry);
router.delete("/:id", protect, deleteJournalEntry);

module.exports = router;