const DiseaseAnalysis = require("../models/DiseaseAnalysis");
const Plant = require("../models/Plant");

const ai = require("../config/gemini");


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
        const analyses = await DiseaseAnalysis.find({
            userId: req.user.id
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
const analyzePlantDisease = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Plant image is required"
            });
        }

        const { plantId } = req.body;

        let plant = null;

        // If a registered plant was selected,
        // verify that it belongs to the logged-in user.
        if (plantId) {
            plant = await Plant.findOne({
                _id: plantId,
                userId: req.user.id
            });

            if (!plant) {
                return res.status(404).json({
                    message: "Plant not found"
                });
            }
        }

        const base64Image = req.file.buffer.toString("base64");

        const plantInformation = plant
            ? `
Plant name: ${plant.name}
Plant species: ${plant.species || "Unknown"}
`
            : `
This is an unregistered plant.
Identify the plant from the image if possible.
`;

        const prompt = `
You are an expert plant health and disease detection assistant.

Analyze the uploaded plant image carefully.

${plantInformation}

Return ONLY valid JSON in exactly this format:

{
    "plantName": "plant name or Unknown",
    "disease": "disease name, Healthy, or Uncertain",
    "confidence": 0,
    "symptoms": "brief description of visible symptoms",
    "recommendation": "clear treatment and care recommendation"
}

Important:
- confidence must be a number from 0 to 100.
- Do not invent a disease when the image is unclear.
- If there is not enough visual evidence, use "Uncertain".
- Mention visible symptoms briefly.
- Give practical plant-care recommendations.
- If the plant cannot be identified, use "Unknown" as plantName.
`;

        const response = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: [
                {
                    type: "user_input",
                    content: [
                        {
                            type: "text",
                            text: prompt
                        },
                        {
                            type: "image",
                            data: base64Image,
                            mime_type: req.file.mimetype
                        }
                    ]
                }
            ]
        });

        const rawText = response.output_text;

        let result;

        try {
            const cleanedText = rawText
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim();

            result = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Invalid AI JSON:", rawText);

            return res.status(500).json({
                message: "AI returned an invalid response"
            });
        }

        const analysis = await DiseaseAnalysis.create({
            userId: req.user.id,
            plantId: plant ? plant._id : undefined,
            plantName: plant
                ? plant.name
                : result.plantName || "Unknown",
            image: req.file.originalname,
            disease: result.disease,
            confidence: result.confidence,
            recommendation: result.recommendation
        });

        res.status(201).json({
            message: "Plant disease analysis completed successfully",
            analysis,
            symptoms: result.symptoms,
            registeredPlant: !!plant
        });

    } catch (error) {
        console.error("Disease analysis error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};
const linkDiseaseAnalysisToPlant = async (req, res) => {
    try {
        const { plantId } = req.body;

        if (!plantId) {
            return res.status(400).json({
                message: "Plant ID is required"
            });
        }

        const analysis = await DiseaseAnalysis.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!analysis) {
            return res.status(404).json({
                message: "Disease analysis not found"
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

        analysis.plantId = plant._id;
        analysis.plantName = plant.name;

        await analysis.save();

        res.status(200).json({
            message: "Disease analysis linked to plant successfully",
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
    getDiseaseAnalysisById,
    analyzePlantDisease,
    linkDiseaseAnalysisToPlant
};