const Feedback = require("../models/Feedback");
const { nanoid } = require("nanoid");

// Create new feedback form for logged-in admin
exports.createForm = async (req, res) => {
  try {
    const formId = nanoid(10); // unique form link
    const newForm = new Feedback({
      admin: req.user.id,
      formId,
      responses: [],
    });
    await newForm.save();

    res.status(201).json({
      success: true,
      message: "Form created successfully",
      formLink: `${process.env.CLIENT_URL}/form/${formId}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Submit feedback using form link (no auth required)
exports.submitFeedback = async (req, res) => {
  try {
    const { formId } = req.params;
    const { name, email, message } = req.body;

    const feedbackForm = await Feedback.findOne({ formId });
    if (!feedbackForm) {
      return res.status(404).json({ success: false, message: "Invalid form link" });
    }

    feedbackForm.responses.push({ name, email, message });
    await feedbackForm.save();

    res.status(200).json({ success: true, message: "Feedback submitted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// In your feedbackController.js
exports.getAdminFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ admin: req.user.id })
      .select('formId responses') // Only get necessary fields
      .lean();
      
    res.status(200).json({ 
      success: true, 
      data: feedbacks 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
