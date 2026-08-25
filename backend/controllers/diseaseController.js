const DiseaseAnalysis = require("../models/DiseaseAnalysis");
const Plant = require("../models/Plant");

const createDiseaseAnalysis = async (req, res) => {
    try {
        const { plantId, image, disease, confidence, recommendation } = req.body;

        if (!plantId || !image || !disease) {
            return res.status(400).json({
                message: "Plant ID, image and disease are required"
            });
        }

        const plant = await Plant.findOne({
            _id: plantId,
            userId: req.user.id
        });

        if (!plant) {
            return res.status(404).json({
                message: "Plant not found"
            });
        }

        const analysis = await DiseaseAnalysis.create({
            plantId,
            image,
            disease,
            confidence,
            recommendation
        });

        res.status(201).json({
            message: "Disease analysis saved successfully",
            analysis
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getDiseaseAnalyses = async (req, res) => {
    try {
        const plants = await Plant.find({
            userId: req.user.id
        }).select("_id");

        const plantIds = plants.map((plant) => plant._id);

        const analyses = await DiseaseAnalysis.find({
            plantId: { $in: plantIds }
        })
            .populate("plantId", "name species")
            .sort({ createdAt: -1 });

        res.status(200).json({
            analyses
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getDiseaseAnalysisById = async (req, res) => {
    try {
        const analysis = await DiseaseAnalysis.findById(req.params.id)
            .populate("plantId", "name species");

        if (!analysis) {
            return res.status(404).json({
                message: "Disease analysis not found"
            });
        }

        const plant = await Plant.findOne({
            _id: analysis.plantId._id,
            userId: req.user.id
        });

        if (!plant) {
            return res.status(404).json({
                message: "Disease analysis not found"
            });
        }

        res.status(200).json({
            analysis
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createDiseaseAnalysis,
    getDiseaseAnalyses,
    getDiseaseAnalysisById
};