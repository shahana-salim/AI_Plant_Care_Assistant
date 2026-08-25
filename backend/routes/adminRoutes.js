const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/check-admin", protect, adminOnly, (req, res) => {
    res.status(200).json({
        message: "Admin access verified",
        user: req.user
    });
});

module.exports = router;