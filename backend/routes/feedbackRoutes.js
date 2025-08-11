const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const auth = require("../middleware/auth");

router.post("/create-form", auth, feedbackController.createForm);
router.post("/submit/:formId", feedbackController.submitFeedback);
router.get("/my-feedback", auth, feedbackController.getAdminFeedback);

module.exports = router;

