const User = require("../models/User");
const Plant = require("../models/Plant");

// Get all normal users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({ users });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};

// Get all plants
const getAllPlants = async (req, res) => {
    try {
        const plants = await Plant.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ plants });
    } catch (error) {
        console.error("Get all plants error:", error);
        res.status(500).json({
            message: "Failed to fetch plants"
        });
    }
};

module.exports = {
    getAllUsers,
    getAllPlants
};