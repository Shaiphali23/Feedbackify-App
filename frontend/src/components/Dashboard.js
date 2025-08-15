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
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAuth } from "../ContextAPI/authContext";
import FeedbackChart from "./FeedbackChart";
import FeedbackList from "./FeedbackList";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const RefreshButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  fontWeight: "bold",
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
  transition: "all 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

export default function MenuAppBar() {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const token = localStorage.getItem("token");
  const [formLinks, setFormLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Menu handlers
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleMobileMenuOpen = (event) =>
    setMobileMoreAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
  };

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
        // toast.success("Feedback data updated successfully", {
        //   position: "top-center",
        //   autoClose: 3000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   theme: "colored",
        // });
      }
    } catch (err) {
      // toast.error(err.message || "Failed to fetch feedback data", {
      //   position: "top-center",
      //   theme: "colored",
      // });
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
      toast.success("New feedback form created successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (err) {
      toast.error(err.message || "Failed to create form", {
        position: "top-center",
        theme: "colored",
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
    toast.info("Refreshing data...", {
      position: "top-center",
      autoClose: 1000,
      theme: "colored",
    });
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

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleClose}
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          minWidth: 200,
        },
      }}
    >
      <MenuItem>
        <Chip
          label={user.name || user.email || "User"}
          sx={{ mr: 2, fontWeight: 600, width: "100%" }}
          avatar={
            <Avatar
              sx={{ bgcolor: theme.palette.primary.main }}
              alt={user.name || user.email || "User"}
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                user.name || user.email || "User"
              )}`}
            />
          }
        />
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
        <ExitToAppIcon sx={{ mr: 1 }} /> Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <AppBar
        position="sticky"
        elevation={1}
        sx={{ backgroundColor: theme.palette.background.paper }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="large"
              edge="start"
              sx={{ mr: 2 }}
              onClick={isMobile ? handleMobileMenuOpen : null}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="div"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: isMobile ? "1.1rem" : "1.5rem",
              }}
              noWrap
            >
              Feedback Dashboard
            </Typography>
          </Box>

          {user && (
            <Box
              sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}
            >
              {!isMobile && (
                <Chip
                  label={user.name || user.email || "User"}
                  sx={{ mr: 2, fontWeight: 600 }}
                  avatar={
                    <Avatar
                      sx={{ bgcolor: theme.palette.primary.main }}
                      alt={user.name || user.email || "User"}
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        user.name || user.email || "User"
                      )}`}
                    />
                  }
                />
              )}
              <IconButton onClick={handleMenu} color="inherit">
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 40,
                    height: 40,
                  }}
                  alt={user.name || user.email || "User"}
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    borderRadius: 2,
                    minWidth: 200,
                  },
                }}
              >
                <MenuItem
                  onClick={handleLogout}
                  sx={{ color: theme.palette.error.main }}
                >
                  <ExitToAppIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          )}

          {isMobile && (
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls="mobile-menu"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 40,
                  height: 40,
                }}
                alt={user.name || user.email || "User"}
              />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {isMobile && renderMobileMenu}

      <Box
        sx={{
          maxWidth: "md",
          mx: "auto",
          mt: 4,
          p: isMobile ? 1 : 3,
          width: "100%",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            mb: 4,
            px: isMobile ? 1 : 0,
            fontSize: isMobile ? "1.5rem" : "2.125rem",
          }}
        >
          Welcome to {user.name || user.email || "User"} Dashboard
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              width: "100%",
              maxWidth: 600,
              mx: "auto",
              fontSize: isMobile ? "0.875rem" : "1rem",
            }}
          >
            <Typography variant="body1">{error}</Typography>
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            width: "100%",
          }}
        >
          <SubmitButton
            onClick={createNewForm}
            variant="contained"
            color="primary"
            disabled={loading}
            size="large"
            startIcon={loading ? <CircularProgress size={24} /> : <AddIcon />}
            sx={{
              minWidth: isMobile ? "100%" : 300,
              py: 1.5,
              fontWeight: "medium",
              "&:hover": {
                boxShadow: 2,
              },
            }}
          >
            {loading ? "Creating..." : "Generate New Feedback Form Link"}
          </SubmitButton>

          <RefreshButton
            onClick={handleRefresh}
            variant="contained"
            color="primary"
            size="large"
            startIcon={<RefreshIcon />}
            sx={{
              py: 1.5,
              fontWeight: "medium",
              "&:hover": {
                boxShadow: 2,
              },
              minWidth: isMobile ? "100%" : "auto",
            }}
          >
            Refresh
          </RefreshButton>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: isMobile ? 2 : 3,
            mb: 4,
            borderRadius: 2,
            background: (theme) => theme.palette.background.paper,
            borderLeft: "4px solid",
            borderLeftColor: "primary.main",
            "&:hover": {
              boxShadow: (theme) => theme.shadows[6],
            },
            transition: "all 0.3s ease",
          }}
        >
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
                          wordBreak: "break-all",
                          fontSize: isMobile ? "0.875rem" : "1rem",
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

        <FeedbackChart feedbackData={feedbackData} isMobile={isMobile} />
        <FeedbackList
          feedbackData={feedbackData}
          onRefresh={handleRefresh}
          isMobile={isMobile}
        />
      </Box>
    </Box>
  );
}
