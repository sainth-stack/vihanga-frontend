import React from "react";
import { Box, Typography, Button, Grid, Stack, Paper, Divider } from "@mui/material";

export default function Toolcard({
  reward: {
    rewardName,
    rewardIcon,
    rewardDescription,
    rewardCode,
    rewardStatus,
    rewardPoints,
    rewardAmount,
  },
}) {
  const customButtonStyles = {
    backgroundColor: "#827e39",
    color: "#fff",
    textTransform: "capitalize",
    '&:hover': {
      backgroundColor: "#827e39",
    },
  };

  const outlinedButtonStyles = {
    borderColor: "#827e39",
    color: "#827e39",
    textTransform: "capitalize",
    '&:hover': {
      backgroundColor: "transparent",
      borderColor: "#827e39",
    },
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: 350,
        p: 3,
        borderRadius: 3,
        backgroundColor: "#fff",
        textAlign: "center",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Box
          component="img"
          src={rewardIcon}
          alt="reward logo"
          sx={{ width: 100, height: 100 }}
        />
        <Typography variant="h5" fontWeight="bold">
          {rewardName}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {rewardCode}
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
          {rewardDescription}
        </Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
            Reward Points
          </Typography>
          <Typography variant="body1">{rewardPoints}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
            Amount
          </Typography>
          <Typography variant="body1">USD {rewardAmount}</Typography>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Button
          variant={rewardStatus === "active" ? "contained" : "outlined"}
          sx={rewardStatus === "active" ? customButtonStyles : outlinedButtonStyles}
          size="small"
        >
          Active
        </Button>
        <Button
          variant={rewardStatus !== "active" ? "contained" : "outlined"}
          sx={rewardStatus !== "active" ? customButtonStyles : outlinedButtonStyles}
          size="small"
        >
          Inactive
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button variant="outlined" size="small" sx={outlinedButtonStyles}>
          Cancel
        </Button>
        <Button variant="contained" size="small" sx={customButtonStyles}>
          Add to Catalogue
        </Button>
      </Stack>
    </Paper>
  );
}
