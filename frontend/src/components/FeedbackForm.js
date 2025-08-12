import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  padding: theme.spacing(4),
  borderRadius: 12,
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  fontWeight: "bold",
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
  transition: "all 0.3s ease",
}));

const FeedbackForm = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/feedback/submit/${formId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formId,
            ...formData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
      window.dispatchEvent(new Event("feedbackSubmitted"));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <StyledPaper elevation={0}>
        <Box textAlign="center" py={4}>
          <Typography
            variant="h4"
            gutterBottom
            color="primary"
            sx={{ fontWeight: "bold" }}
          >
            Thank You!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your feedback has been submitted successfully.
          </Typography>
          <Box mt={3}>
            <svg
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                fill="#4CAF50"
              />
            </svg>
          </Box>
        </Box>
      </StyledPaper>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <StyledPaper elevation={0}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 3, color: "primary.main" }}
          >
            Submit Your Feedback
          </Typography>

          {error && (
            <Typography
              color="error"
              sx={{
                mb: 2,
                p: 1.5,
                backgroundColor: "error.light",
                borderRadius: 1,
              }}
            >
              {error}
            </Typography>
          )}

          <TextField
            size="small"
            fullWidth
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />

          <TextField
            size="small"
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />

          <TextField
            size="small"
            fullWidth
            label="Your Feedback"
            name="message"
            value={formData.message}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={5}
            variant="outlined"
            required
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />

          <SubmitButton
            type="submit"
            variant="contained"
            disabled={submitting}
            fullWidth
          >
            {submitting ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Submit Feedback"
            )}
          </SubmitButton>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default FeedbackForm;
