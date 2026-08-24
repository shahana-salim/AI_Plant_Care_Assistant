const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        species: {
            type: String,
            trim: true
        },

        image: {
            type: String
        },

        careInfo: {
            wateringFrequency: {
                type: String
            },

            sunlight: {
                type: String
            },

            fertilizer: {
                type: String
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Plant", plantSchema);