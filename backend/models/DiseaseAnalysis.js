const mongoose = require("mongoose");

const diseaseAnalysisSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        plantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plant",
            required: false
        },

        plantName: {
            type: String
        },

        image: {
            type: String,
            required: true
        },

        disease: {
            type: String,
            required: true
        },

        confidence: {
            type: Number
        },

        recommendation: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("DiseaseAnalysis", diseaseAnalysisSchema);