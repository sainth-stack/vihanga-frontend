import React from "react";
import { TextField, Typography, Autocomplete } from "@mui/material";

export const SelectComponent = ({
  id = "",
  name = "",
  label = "",
  value = "",
  onChange = () => {},
  required = false,
  disabled = false,
  options = [],
  fullWidth = true,
  placeholder = "",
  sx = {},
  setSelectedObject = () => {},
  labelSx = {},
}) => {
  const updatedOptions = options[0]?.label ? options : options?.map((opt) => ({ ...opt, label: opt?.key }));
  const selectedOption = updatedOptions.find((opt) => (opt.value === value) || (opt?.label === value)) || null;

  const fieldName = name || id;
  
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
        id={id}
        value={selectedOption}
        onChange={(event, newValue) => {
          onChange({
            target: { name: fieldName, value: newValue?.value || "" },
          });
          if (newValue) setSelectedObject(newValue, id);
        }}
        options={updatedOptions}
        disabled={disabled}
        getOptionLabel={(option) => option.label || ""}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            required={required}
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiSelect-select": {
                fontSize: "14px",
                color: value ? "#707070" : "#707070",
                fontWeight: 500,
                fontFamily: "Work Sans",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                height: "48px",
                "& fieldset": {
                  borderColor: "#E9EAEC",
                },
                "&:hover fieldset": {
                  borderColor: "#E9EAEC",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#E9EAEC",
                },
                "&.Mui-disabled": {
                  opacity: 0.5,
                  backgroundColor: "#f5f5f5",
                },
              },
              ...sx,
            }}
          />
        )}
      />
    </div>
  );
};
