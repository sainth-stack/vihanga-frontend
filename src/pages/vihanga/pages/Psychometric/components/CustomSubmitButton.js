import React from "react";
import Button from "@mui/material/Button";

const CustomSubmitButton = ({
  variant = "contained",
  sx = {},
  onClick,
  disabled = false,
  children,
}) => {
  return (
    <Button
      variant={variant}
      sx={{
        margin: 2,
        width: "150px",
        fontFamily: "inherit",
        background: "#847F3B",
        "&:hover": {
          background: "#6c672e",
        },
        ...sx,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default CustomSubmitButton;
