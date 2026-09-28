const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getDashboard } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/dashboard", getDashboard);

module.exports = router;
