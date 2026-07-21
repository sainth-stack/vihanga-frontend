import React from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

const SlideTransition = (props) => {
  return <Slide {...props} direction="down" />;
};

const CustomSnackbar = ({
  open,
  message,
  severity = "success",
  onClose,
  duration = 3000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          fontWeight: "bold",
          boxShadow: 1,
          borderRadius: 2,
          bgcolor:
            severity === "success"
              ? "success.main"
              : severity === "error"
              ? "error.main"
              : severity === "warning"
              ? "warning.main"
              : "info.main",
          color: "white",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
