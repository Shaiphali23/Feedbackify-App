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
  Paper,
  useTheme,
  Avatar,
  Stack
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';
import { format } from "date-fns";

const FeedbackList = ({ feedbackData = [], onRefresh }) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={0} 
      sx={{
        p: 3,
        my: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        "&:hover": {
          boxShadow: theme.shadows[3],
        },
        transition: "all 0.3s ease",
      }}
    >
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Detailed Feedback
        </Typography>
        <IconButton 
          onClick={onRefresh} 
          aria-label="refresh"
          sx={{
            backgroundColor: theme.palette.action.hover,
            '&:hover': {
              backgroundColor: theme.palette.action.selected,
              transform: 'rotate(180deg)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      {feedbackData.length === 0 ? (
        <Box 
          sx={{ 
            height: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: theme.palette.action.hover,
            borderRadius: 2
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No feedback received yet
          </Typography>
        </Box>
      ) : (
        feedbackData.map((form) => (
          <Box key={form._id} sx={{ mb: 4 }}>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1} 
              mb={2}
              sx={{ 
                p: 1.5,
                backgroundColor: theme.palette.background.default,
                borderRadius: 2,
                borderLeft: `4px solid ${theme.palette.primary.main}`
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Form: {form.formId?.substring(0, 8)}...
              </Typography>
              <Chip
                label={`${form.responses.length} responses`}
                size="small"
                color="primary"
                sx={{ fontWeight: 500 }}
              />
            </Stack>

            <List 
              sx={{ 
                bgcolor: 'background.paper', 
                borderRadius: 2,
                boxShadow: theme.shadows[1],
                overflow: 'hidden'
              }}
            >
              {form.responses.map((response, idx) => (
                <React.Fragment key={idx}>
                  <ListItem
                    sx={{
                      py: 2,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <Avatar sx={{ 
                      mr: 2, 
                      bgcolor: theme.palette.primary.main,
                      width: 40, 
                      height: 40 
                    }}>
                      {response.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <MessageIcon color="primary" fontSize="small" />
                          <Typography 
                            variant="body1" 
                            sx={{ fontWeight: 500 }}
                          >
                            {response.message}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Stack direction="row" spacing={2} mt={1}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <EmailIcon color="action" fontSize="small" />
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                            >
                              {response.email}
                            </Typography>
                          </Box>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {format(
                              new Date(response.submittedAt),
                              "MMM dd, yyyy h:mm a"
                            )}
                          </Typography>
                        </Stack>
                      }
                      sx={{ my: 0 }}
                    />
                  </ListItem>
                  {idx < form.responses.length - 1 && (
                    <Divider 
                      sx={{ 
                        backgroundColor: theme.palette.divider,
                        my: 0 
                      }} 
                    />
                  )}
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