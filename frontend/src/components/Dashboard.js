import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAuth } from "../ContextAPI/authContext";
import FeedbackChart from "./FeedbackChart";
import FeedbackList from "./FeedbackList";

export default function MenuAppBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const token = localStorage.getItem("token");
  const [formLinks, setFormLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Menu handlers
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleClose();
    logout?.() || navigate("/login");
  };

  // Fetch feedback data
  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/feedback/my-feedback`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to fetch feedback data");

      const data = await response.json();
      if (data.success) {
        setFeedbackData(data.data);
        const links = data.data.map(
          (form) => `${window.location.origin}/form/${form.formId}`
        );
        setFormLinks(links);
        setSnackbarMessage("Feedback data updated");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Create new feedback form
  const createNewForm = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/feedback/create-form`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!data.success)
        throw new Error(data.message || "Failed to create form");

      setFormLinks((prev) => [...prev, data.formLink]);
      await fetchFeedback();
      setSnackbarMessage("New form created successfully");
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  // Set up event listener for feedback submissions
  useEffect(() => {
    const handleFeedbackSubmitted = () => {
      fetchFeedback();
    };

    window.addEventListener("feedbackSubmitted", handleFeedbackSubmitted);
    return () => {
      window.removeEventListener("feedbackSubmitted", handleFeedbackSubmitted);
    };
  }, [fetchFeedback]);

  // Initial fetch and periodic refresh
  useEffect(() => {
    if (user) {
      fetchFeedback();
      const interval = setInterval(fetchFeedback, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user, fetchFeedback, refreshCount]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          {user && (
            <div>
              <IconButton onClick={handleMenu} color="inherit" sx={{ p: 0.5 }}>
                <Avatar
                  sx={{ bgcolor: "#1976d2", width: 40, height: 40 }}
                  alt={user.name || user.email || "User"}
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    user.name || user.email || "User"
                  )}`}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: "md", mx: "auto", mt: 4, p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Admin Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Button
            onClick={createNewForm}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Creating..." : "Generate New Feedback Form Link"}
          </Button>

          <Button
            onClick={handleRefresh}
            variant="outlined"
            color="primary"
            sx={{ ml: 2 }}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Feedback Form Links
          </Typography>

          {formLinks.length === 0 ? (
            <Typography>No forms created yet.</Typography>
          ) : (
            <List>
              {formLinks.map((link, idx) => (
                <ListItem key={idx} divider>
                  <ListItemText
                    primary={
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#1976d2",
                          textDecoration: "underline",
                        }}
                      >
                        {link}
                      </a>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <FeedbackChart feedbackData={feedbackData} />
        <FeedbackList feedbackData={feedbackData} onRefresh={handleRefresh} />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}
