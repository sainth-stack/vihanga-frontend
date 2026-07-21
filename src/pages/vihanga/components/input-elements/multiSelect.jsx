import React from "react";
import { Autocomplete, TextField, Typography, Chip } from "@mui/material";

export const MultiSelectComponent = ({
  id = "",
  label = "",
  value = [],
  onChange = () => {},
  required = false,
  disabled = false,
  options = [],
  fullWidth = true,
  placeholder = "",
  sx = {},
  labelSx = {},
}) => {
  const handleChange = (event, newValue) => {
    // Create a fake event object that matches the expected structure
    const fakeEvent = {
      target: {
        id: id,
        name: id,
        value: newValue || [],
      },
    };
    onChange(fakeEvent);
  };

  return (
    <div style={{ marginBottom: "1rem", width: fullWidth ? "100%" : "auto" }}>
      {label && (
        <Typography
          variant="body1"
          sx={{
            marginBottom: "0.2rem",
            fontWeight: 400,
            fontFamily: "Work Sans !important",
            color: "#707070",
            fontSize: "14px",
            ...labelSx,
          }}
        >
          {label}
        </Typography>
      )}
      <Autocomplete
        multiple
        id={id}
        options={options}
        value={value || []}
        onChange={handleChange}
        getOptionLabel={(option) => option.label || option.key || ""}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                minHeight: "48px",
                "& fieldset": {
                  borderColor: "#E9EAEC",
                },
                "&:hover fieldset": {
                  borderColor: "#E9EAEC",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#E9EAEC",
                },
              },
              ...sx,
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option.label || option.key}
              {...getTagProps({ index })}
              sx={{
                backgroundColor: "#837F39",
                color: "white",
                fontSize: "12px",
                height: "24px",
                "& .MuiChip-deleteIcon": {
                  color: "white",
                },
              }}
            />
          ))
        }
        sx={{
          "& .MuiAutocomplete-input": {
            fontSize: "14px",
            color: "#707070",
            fontWeight: 500,
            fontFamily: "Work Sans",
          },
        }}
      />
    </div>
  );
}; 