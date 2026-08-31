const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { askPlantAI } = require("../controllers/aiController");

const router = express.Router();

router.post("/ask", protect, askPlantAI);

module.exports = router;