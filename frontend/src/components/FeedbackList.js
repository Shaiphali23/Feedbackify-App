import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Chip,
  Box,
  IconButton,
  Paper
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { format } from "date-fns";

const FeedbackList = ({ feedbackData = [], onRefresh }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, my: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" component="h2">
          Detailed Feedback
        </Typography>
        <IconButton onClick={onRefresh} aria-label="refresh">
          <RefreshIcon />
        </IconButton>
      </Box>

      {feedbackData.length === 0 ? (
        <Typography variant="body1">No feedback received yet.</Typography>
      ) : (
        feedbackData.map((form) => (
          <Box key={form._id} sx={{ mb: 4 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography variant="subtitle1">
                Form: {form.formId?.substring(0, 8)}...
              </Typography>
              <Chip
                label={`${form.responses.length} responses`}
                size="small"
                color="primary"
              />
            </Box>

            <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
              {form.responses.map((response, idx) => (
                <React.Fragment key={idx}>
                  <ListItem>
                    <ListItemText
                      primary={response.message}
                      secondary={
                        <>
                          <Box component="span" display="block">
                            From: {response.name} ({response.email})
                          </Box>
                          <Box component="span">
                            {format(
                              new Date(response.submittedAt),
                              "MMM dd, yyyy h:mm a"
                            )}
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  {idx < form.responses.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        ))
      )}
    </Paper>
  );
};

export default FeedbackList;