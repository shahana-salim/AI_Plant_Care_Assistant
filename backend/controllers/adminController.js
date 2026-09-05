const User = require("../models/User");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
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

module.exports = { getAllUsers };