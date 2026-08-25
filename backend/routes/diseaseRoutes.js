const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createDiseaseAnalysis,getDiseaseAnalyses,getDiseaseAnalysisById} = require("../controllers/diseaseController");

const router = express.Router();

router.post("/", protect, createDiseaseAnalysis);
router.get("/", protect, getDiseaseAnalyses);
router.get("/:id", protect, getDiseaseAnalysisById);

module.exports = router;