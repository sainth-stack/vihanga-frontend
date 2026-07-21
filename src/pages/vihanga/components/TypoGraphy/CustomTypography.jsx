// src/components/CustomTypography.jsx
import React from "react";
import { Typography } from "@mui/material";

const CustomTypography = ({ variant, children, sx = {} }) => {
  return (
    <Typography variant={variant} sx={{ ...sx }}>
      {children}
    </Typography>
  );
};

export default CustomTypography;
