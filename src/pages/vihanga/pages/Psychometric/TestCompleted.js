import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const TestCompleted = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ padding: { xs: "0rem", md: "2rem" } }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "800px",
          padding: { xs: "2rem", md: "3rem" },
          textAlign: "center",
        }}
      >
        <CheckCircleOutlineIcon
          sx={{ fontSize: "5rem", color: "#4CAF50", mb: 3 }}
        />

        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.8rem", md: "2.5rem" },
            marginBottom: "1rem",
            color: "#333",
          }}
        >
          Assessment Already Completed
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "1rem", md: "1.2rem" },
            color: "#666",
            marginBottom: "3rem",
            lineHeight: 1.6,
          }}
        >
          You have already completed this assessment. Your results have been
          recorded.
        </Typography>
      </Box>
    </Box>
  );
};

export default TestCompleted;
