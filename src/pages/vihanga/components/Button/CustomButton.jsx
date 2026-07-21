import React from "react";
import { Box, Button, Icon, IconButton } from "@mui/material";
  import TuneIcon from "@mui/icons-material/Tune";
  
const CustomButton = ({
  text = "Click Me", 
  backgroundColor = "",
  IconColor,
  color, 
  hoverColor="#827e39",
  onClick, // Click handler
  border = "1px solid #837F39",
  sx = {},
  IconProp,
  variant, // Icon component to render
  iconExists = false,
  iconPosition = "end",
  fontSize,
  disabled,
  fontWeight, // Spread other props
}) => {
  console.log("iconExists", iconExists);
  return (
    <Button
    disabled={disabled}
      disableRipple
      variant={variant || "contained"}
      onClick={onClick}
      sx={{
        color: color,
        border: border,
        marginTop: 0,
        backgroundColor: backgroundColor,
        outline: "none",
        padding: ".2rem 2rem",
        borderRadius: "1rem",
        textTransform: "none",
        ":hover": {
          backgroundColor: hoverColor ||backgroundColor,
          border: border,
        },
        ":focus": {
          backgroundColor: hoverColor || backgroundColor,
          border: border,
          
        },
        ":active": {
          backgroundColor: hoverColor || backgroundColor,
          border: border,
        
        },
        ...sx,
      }}
    >
      {iconExists && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {iconPosition === "start" && (
            <IconButton
              sx={{
                color: IconColor || "#85803c",
                transform: "rotate(0deg)",
              }}
            >
              <IconProp />
            </IconButton>
          )}
          <span
            className="p-1"
            style={{
              fontSize: fontSize || "12px", 
              fontWeight: fontWeight || 600, 
            }}
          >
            {text}
          </span>
          {/* Button text */}
          {iconPosition === "end" && (
            <IconButton
              sx={{
                color: IconColor || "#85803c",

                transform: "rotate(90deg)"
              }}
            >
              <IconProp />
            </IconButton>
          )}
          {iconPosition === "endNoRotate" && (
            <IconButton
              sx={{
                color: IconColor || "#85803c",

                transform: "rotate(0deg)"
              }}
            >
              <IconProp />
            </IconButton>
          )}
        </Box>
      )}

      {!iconExists && (
        <span
          style={{
            fontSize: fontSize || "12px", 
            fontWeight: fontWeight || 600, 
          }}
        >
          {text}
        </span>
      )}
    </Button>
  );
};

export default CustomButton;
