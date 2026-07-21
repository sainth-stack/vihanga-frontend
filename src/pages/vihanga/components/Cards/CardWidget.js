import React from "react";
import { Box } from "@mui/material";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getThemeColors } from "utilities/getThemeColors";

const CardWidget = ({ children, sx = {}, onClick }) => {
  const { primaryColor, secondaryColors } = getThemeColors();
  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: secondaryColors.white,
        borderRadius: "20px",
        boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.05)",
        padding: "16px",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default CardWidget;
