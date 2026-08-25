const JournalEntry = require("../models/JournalEntry");
const Plant = require("../models/Plant");

const createJournalEntry = async (req, res) => {
    try {
        const { plantId, title, content } = req.body;

        if (!plantId || !title || !content) {
            return res.status(400).json({
                message: "Plant ID, title and content are required"
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

        const entry = await JournalEntry.create({
            plantId,
            title,
            content
        });

        res.status(201).json({
            message: "Journal entry created successfully",
            entry
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getJournalEntries = async (req, res) => {
    try {
        const plants = await Plant.find({ userId: req.user.id }).select("_id");

        const plantIds = plants.map((plant) => plant._id);

        const entries = await JournalEntry.find({
            plantId: { $in: plantIds }
        })
            .populate("plantId", "name species")
            .sort({ createdAt: -1 });

        res.status(200).json({
            entries
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getJournalEntryById = async (req, res) => {
    try {
        const entry = await JournalEntry.findById(req.params.id)
            .populate("plantId", "name species");

        if (!entry) {
            return res.status(404).json({
                message: "Journal entry not found"
            });
        }

        const plant = await Plant.findOne({
            _id: entry.plantId._id,
            userId: req.user.id
        });

        if (!plant) {
            return res.status(404).json({
                message: "Journal entry not found"
            });
        }

        res.status(200).json({
            entry
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const updateJournalEntry = async (req, res) => {
    try {
        const { title, content } = req.body;

        const entry = await JournalEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({
                message: "Journal entry not found"
            });
        }

        const plant = await Plant.findOne({
            _id: entry.plantId,
            userId: req.user.id
        });

        if (!plant) {
            return res.status(404).json({
                message: "Journal entry not found"
            });
        }

        entry.title = title || entry.title;
        entry.content = content || entry.content;

        await entry.save();

        res.status(200).json({
            message: "Journal entry updated successfully",
            entry
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const deleteJournalEntry = async (req, res) => {
    try {
        const entry = await JournalEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({
                message: "Journal entry not found"
            });
        }

        const plant = await Plant.findOne({
            _id: entry.plantId,
            userId: req.user.id
        });

        if (!plant) {
            return res.status(404).json({
                message: "Journal entry not found"
            });
        }

        await JournalEntry.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Journal entry deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createJournalEntry,
    getJournalEntries,
    getJournalEntryById,
    updateJournalEntry,
    deleteJournalEntry
};