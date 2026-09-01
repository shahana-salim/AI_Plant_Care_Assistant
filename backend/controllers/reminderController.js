const Reminder = require("../models/Reminder");
const Plant = require("../models/Plant");

const createReminder = async (req, res) => {
    try {
        const { plantId, type, description, date } = req.body;

        if (!plantId || !type || !date) {
            return res.status(400).json({
                message: "Plant ID, type and date are required"
            });
        }
        if (type === "other" && !description?.trim()) {
            return res.status(400).json({
                message: "Please describe the task"
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

        const reminder = await Reminder.create({
            plantId,
            type,
            description: type === "other" ? description : "",
            date
        });

        res.status(201).json({
            message: "Reminder created successfully",
            reminder
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getReminders = async (req, res) => {
    try {
        const plants = await Plant.find({
            userId: req.user.id
        }).select("_id");

        const plantIds = plants.map((plant) => plant._id);

        const reminders = await Reminder.find({
            plantId: { $in: plantIds }
        })
            .populate("plantId", "name species")
            .sort({ date: 1 });

        res.status(200).json({
            reminders
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getReminderById = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id)
            .populate("plantId", "name species");

        if (!reminder) {
            return res.status(404).json({
                message: "Reminder not found"
            });
        }

        const plant = await Plant.findOne({
            _id: reminder.plantId._id,
            userId: req.user.id
        });

        if (!plant) {
            return res.status(404).json({
                message: "Reminder not found"
            });
        }

        res.status(200).json({
            reminder
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const updateReminder = async (req, res) => {
    try {
        const { type, description, date, status } = req.body;

        const reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return res.status(404).json({
                message: "Reminder not found"
            });
        }

        const plant = await Plant.findOne({
            _id: reminder.plantId,
            userId: req.user.id
        });

        if (!plant) {
            return res.status(404).json({
                message: "Reminder not found"
            });
        }

        reminder.type = type || reminder.type;
        reminder.description =
            type === "other"
                ? description?.trim() || ""
                : "";
        reminder.date = date || reminder.date;
        reminder.status = status || reminder.status;

        await reminder.save();

        res.status(200).json({
            message: "Reminder updated successfully",
            reminder
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findById(req.params.id);

        if (!reminder) {
            return res.status(404).json({
                message: "Reminder not found"
            });
        }

        const plant = await Plant.findOne({
            _id: reminder.plantId,
            userId: req.user.id
        });

        if (!plant) {
            return res.status(404).json({
                message: "Reminder not found"
            });
        }

        await Reminder.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Reminder deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {
    createReminder,
    getReminders,
    getReminderById,
    updateReminder,
    deleteReminder
};