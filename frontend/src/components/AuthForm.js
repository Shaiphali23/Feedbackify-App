import { Card, Typography, Box } from "@mui/material";

const AuthForm = ({ title, children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Card sx={{ p: 4, width: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {title}
        </Typography>
        {children}
      </Card>
    </Box>
  );
};

export default AuthForm;