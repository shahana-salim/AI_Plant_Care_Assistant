// const express = require("express");
// const { signup, signin, logout } = require("../controllers/authController");

// const router = express.Router();

// router.post("/signup", signup);
// router.post("/signin", signin);
// router.post("/logout", logout);

// module.exports = router;


const express = require("express");

const {
    signup,
    signin,
    logout,
    updateProfile,
    changePassword
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

router.put("/profile",protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;