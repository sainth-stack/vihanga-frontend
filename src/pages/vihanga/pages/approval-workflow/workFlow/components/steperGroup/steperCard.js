import React from "react";
import { Box, Typography, Avatar, Paper, IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";

const StepperCard = ({ stepGroup, stepIndex, onStepClick, removeStep = false, onRemoveStep }) => {
  // Generate initials from title
  const getInitials = (title) => {
    return title
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  // Create label from all titles in the group
  const groupLabel = stepGroup.map((step) => step.title).join(", ");

  return (
    <Box sx={{ width: "100%", px: 1 }}>
      <Paper
        elevation={3}
        // CHANGE 1: Add onClick to navigate to edit step
        onClick={() => onStepClick && onStepClick(stepIndex)}
        sx={{
          width: "100%",
          height: "167px",
          p: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: onStepClick ? "pointer" : "default", // CHANGE 2: Add cursor for interactivity
          position: "relative", // Add relative positioning for absolute positioning of remove button
          "&:hover": {
            backgroundColor: onStepClick
              ? "rgba(131, 127, 57, 0.1)"
              : "transparent", // Optional: Hover effect
          },
        }}
      >
        {/* Remove button */}
        {removeStep && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card onClick
              onRemoveStep && onRemoveStep(stepIndex);
            }}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "#ff4444",
              color: "white",
              width: 24,
              height: 24,
              "&:hover": {
                backgroundColor: "#cc0000",
              },
            }}
          >
            <RemoveIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}
        <Typography
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            fontWeight: "500",
            fontFamily: "Work Sans",
            color: "#0E0E0E",
            fontSize: "16px",
            mb: 2,
            textAlign: "center",
            width: "100%",
          }}
        >
          {groupLabel}
        </Typography>

        {/* Multiple Avatars */}
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {stepGroup.map((step, index) => (
            <Avatar
              key={step.id}
              sx={{
                bgcolor: "#837F39",
                width: 40,
                height: 40,
                color: "#FFFFFF",
                fontFamily: "Work Sans",
                fontWeight: "500",
                fontSize: "16px",
                marginLeft: "index > 0 ? '-8px' : '0'",
                zIndex: "stepGroup.length - index",
                border: "2px solid white",
              }}
            >
              {getInitials(step.title)}
            </Avatar>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default StepperCard;
