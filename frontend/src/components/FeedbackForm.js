import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';

const FeedbackForm = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/feedback/submit/${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setSubmitted(true);
      // Notify parent component or trigger data refresh
      window.dispatchEvent(new Event('feedbackSubmitted'));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Thank You!
        </Typography>
        <Typography>
          Your feedback has been submitted successfully.
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Submit Your Feedback
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        fullWidth
        label="Your Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Your Feedback"
        name="message"
        value={formData.message}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
        required
      />
      
      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        sx={{ mt: 2 }}
      >
        {submitting ? <CircularProgress size={24} /> : 'Submit Feedback'}
      </Button>
    </Box>
  );
};

export default FeedbackForm;