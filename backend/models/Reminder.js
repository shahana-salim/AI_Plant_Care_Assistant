const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
    {
        plantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plant",
            required: true
        },

        type: {
            type: String,
            enum: ["watering", "fertilizing"],
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Reminder", reminderSchema);