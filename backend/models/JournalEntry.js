const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema(
    {
        plantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plant",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("JournalEntry", journalEntrySchema);