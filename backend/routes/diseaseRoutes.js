const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
    createDiseaseAnalysis,
    getDiseaseAnalyses,
    getDiseaseAnalysisById,
    analyzePlantDisease,
    linkDiseaseAnalysisToPlant
} = require("../controllers/diseaseController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", protect, createDiseaseAnalysis);

router.post(
    "/analyze",
    protect,
    upload.single("image"),
    analyzePlantDisease
);
router.patch(
    "/:id/link",
    protect,
    linkDiseaseAnalysisToPlant
);

router.get("/", protect, getDiseaseAnalyses);

router.get("/:id", protect, getDiseaseAnalysisById);

module.exports = router;