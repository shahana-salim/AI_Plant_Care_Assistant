const express = require("express");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { getAllUsers } = require("../controllers/adminController");

const router = express.Router();

router.get("/check-admin", protect, adminOnly, (req, res) => {
    res.status(200).json({
        message: "Admin access verified",
        user: req.user
    });
});

router.get("/users", protect, adminOnly, getAllUsers);

module.exports = router;