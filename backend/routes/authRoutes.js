const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.Signup);
router.post("/login", authController.Login);
// router.get("/verify", auth, authController.verifyUser);
// router.post('/forgot-password', forgotPassword);
// router.patch('/reset-password/:token', resetPassword);

module.exports = router;
