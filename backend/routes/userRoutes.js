const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        message: "Profile accessed successfully",
        user: req.user
    });
});

router.get("/check-user", protect, (req, res) => {
    res.status(200).json({
        message: "User is authenticated",
        user: req.user
    });
});

module.exports = router;