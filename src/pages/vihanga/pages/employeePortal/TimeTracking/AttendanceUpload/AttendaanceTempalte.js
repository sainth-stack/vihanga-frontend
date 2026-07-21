import React from "react";
import { Box, Button, Typography } from "@mui/material";

const AttendaanceTempalte = () => {
  // Replace with your actual template file path
  const templateUrl = "https://talent-spotify-templates.s3.ap-southeast-1.amazonaws.com/time-attendance-template+.csv";

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 4, textAlign: "center" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Download Attendance Template
      </Typography>
      <Button
        variant="contained"
        color="primary"
        href={templateUrl}
        download
        sx={{ borderRadius: 2, fontWeight: 500, fontSize: 16 }}
      >
        Download Template
      </Button>
    </Box>
  );
};

export default AttendaanceTempalte;
  