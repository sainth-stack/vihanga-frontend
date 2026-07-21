import React from "react";
import { Checkbox, FormControlLabel, Typography, Switch } from "@mui/material";

const CustomCheckBoxSwitch = ({
  label = "Terms and Conditions",
  type = "checkbox", // can be "checkbox" or "switch"
  color = "#837F39",
  sx = {},
  checked = false, // Use prop instead of internal state
  onChange = () => {}, // Use prop for onChange
}) => {
  const ToggleComponent = type === "switch" ? Switch : Checkbox;

  const toggleStyles =
    type === "switch"
      ? {
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: color,
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: color,
          },
        }
      : {
          color: color,
          "&.Mui-checked": {
            color: color,
          },
        };

  return (
    <FormControlLabel
    sx={
      {...sx}
    }
      label={
        <Typography
          sx={{
            color: checked ? "black" : "gray",
            fontWeight: checked ? "500" : "normal",
            fontFamily: "Work Sans",
            ...sx,
          }}
        >
          {label}
        </Typography>
      }
      control={
        <ToggleComponent
          checked={checked}
          onChange={onChange}
          sx={toggleStyles}
        />
      }
      labelPlacement={type === "switch" ? "start" : "end"}
    />
  );
};

export default CustomCheckBoxSwitch;
