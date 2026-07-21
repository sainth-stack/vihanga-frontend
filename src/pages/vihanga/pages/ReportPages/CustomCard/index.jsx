import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Card container
const StyledCard = styled(Paper)({
  maxWidth: "100vw",
  margin: "3rem 0 0rem 0 !important",

  borderRadius: "2rem 0 2rem 0",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  position: "relative", // for absolute positioning of icon
});

// Styled Card header
// Styled Card header with dynamic color
const CardHeader = styled(Box)(({ headerColor }) => ({
  backgroundColor: headerColor, // fallback color
  borderRadius: "2rem 1rem 1rem 0",
  color: "white",
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
}));

// Styled content area
const CardContent = styled(Box)({
  padding: "16px",
  backgroundColor: "#f9f9f9",
  borderRadius: "0 0 1.5rem 0",
});

// Floating circle icon on top-right
const FloatingCircleIcon = ({ icon, circleBg = "#B373" }) => (
  <Box
    sx={{
      position: "absolute",
      top: -13,
      right: -16,
      width: 70,
      height: 70,
      borderRadius: "50%",
      backgroundColor: circleBg, // <- use prop here
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: 20,
    }}
  >
    <img src={icon} alt="icon" />
  </Box>
);

// Reusable InfoCard component
const InfoCard = ({ title, description, icon, headerColor, circleBg }) => (
  <StyledCard>
    <FloatingCircleIcon icon={icon} circleBg={circleBg} />
    <CardHeader headerColor={headerColor}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 500 }}>
        {title}
      </Typography>
    </CardHeader>
    <CardContent>
      <Typography
        sx={{
          fontFamily: "Work Sans",
          padding: ".5rem",
          fontWeight: "400",
          lineHeight: "19px",
          color: "#0E0E0E",
          letterSpacing: "0%",
          //   width: "500px",
        }}
      >
        {description}
      </Typography>
    </CardContent>
  </StyledCard>
);

export default InfoCard;
