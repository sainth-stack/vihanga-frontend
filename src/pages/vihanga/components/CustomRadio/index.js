import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
} from "@mui/material";

const CustomRadio = ({
  label = "Select Option",
  name = "custom-radio",
  options = [],
  color = "#837F39",
  direction = "row",
  onChange,
  value = "",
}) => {
  const handleChange = (event) => {
    if (onChange) onChange(event.target.value);
  };

  return (
    <Box display="flex" alignItems="start" gap={1} flexDirection={"column"}>
      <Typography
        sx={{
          minWidth: "70px",
          fontSize: "14px",
          color: "#999",
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>

      <RadioGroup
        row={direction === "row"}
        name={name}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                sx={{
                  color: color,
                  "&.Mui-checked": {
                    color: color,
                  },
                }}
              />
            }
            label={option.label}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default CustomRadio;
