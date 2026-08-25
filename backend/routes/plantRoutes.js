const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createPlant, getPlants, getPlantById, updatePlant, deletePlant} = require("../controllers/plantController");

const router = express.Router();

router.post("/", protect, createPlant);
router.get("/", protect, getPlants);
router.get("/:id", protect, getPlantById);
router.put("/:id", protect, updatePlant);
router.delete("/:id", protect, deletePlant);

module.exports = router;