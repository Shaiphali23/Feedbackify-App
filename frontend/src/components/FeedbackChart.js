import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Box, Typography, Tabs, Tab, useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";
import EqualizerIcon from '@mui/icons-material/Equalizer';
import PieChartIcon from '@mui/icons-material/PieChart';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const FeedbackChart = ({ feedbackData = [] }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState(0);

  // Transform data for charts
  const barChartData = feedbackData.map((form) => ({
    name: form.formId?.substring(0, 6) + "...",
    responses: form.responses?.length || 0,
    formId: form.formId,
  }));

  const pieChartData = feedbackData.map((form) => ({
    name: form.formId?.substring(0, 6) + "...",
    value: form.responses?.length || 0,
    formId: form.formId,
  }));

  const handleTabChange = (event, newValue) => {  // Fixed: Added event parameter
    setTabValue(newValue);
  };

  return (
    <Paper
      elevation={3}
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Feedback Analytics
        </Typography>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}  // Now properly handles the event
        sx={{
          mb: 3,
          "& .MuiTabs-indicator": {
            height: 3,
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        <Tab
          icon={<EqualizerIcon />}
          iconPosition="start"
          label="Bar View"
          sx={{ 
            minHeight: 48, 
            textTransform: "none",
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            }
          }}
        />
        <Tab
          icon={<PieChartIcon />}
          iconPosition="start"
          label="Pie View"
          sx={{ 
            minHeight: 48, 
            textTransform: "none",
            '&.Mui-selected': {
              color: theme.palette.primary.main,
            }
          }}
        />
      </Tabs>

      {feedbackData.length === 0 ? (
        <Box sx={{ 
          height: 300, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: theme.palette.action.hover,
          borderRadius: 2
        }}>
          <Typography variant="body1" color="text.secondary">
            No feedback data available
          </Typography>
        </Box>
      ) : (
        <Box sx={{ height: 400 }}>
          {tabValue === 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: theme.palette.text.secondary }}
                />
                <YAxis tick={{ fill: theme.palette.text.secondary }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                  }}
                  formatter={(value, name, props) => [
                    value,
                    `Form: ${props.payload.formId}`,
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="responses"
                  name="Responses"
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                  }}
                  formatter={(value, name, props) => [
                    value,
                    `Form: ${props.payload.formId}`,
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default FeedbackChart;