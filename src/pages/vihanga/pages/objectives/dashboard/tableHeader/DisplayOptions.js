import React from "react";
import {
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const CheckboxDropdown = ({
  anchorEl,
  setAnchorEl,
  options,
  selectedOptions,
  onToggle,
  icon,
  label,
  useCustomIcons = false,
}) => {
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        variant="outlined"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        startIcon={icon}
        sx={{
          height: "34px",
          borderRadius: "100px",
          border: "1px solid #837F39",
          backgroundColor: "#FEFEFE",
          color: "#0E0E0E",
          fontFamily: "Work Sans",
          fontWeight: 600,
          fontSize: "12px",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
          px: "16px",
          gap: "8px",
        }}
      >
        {label}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            mt: 1,
            px: 1,
          },
        }}
      >
        {options?.map((option, idx) => (
          <MenuItem key={idx} onClick={() => onToggle(option)}>
            <Checkbox
            checked={(selectedOptions || []).includes(option)}
              icon={useCustomIcons ? <RadioButtonUncheckedIcon /> : undefined}
              checkedIcon={useCustomIcons ? <CheckCircleIcon /> : undefined}
              sx={{
                color: "#837F39",
                "&.Mui-checked": {
                  color: "#837F39",
                },
              }}
            />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default CheckboxDropdown;
