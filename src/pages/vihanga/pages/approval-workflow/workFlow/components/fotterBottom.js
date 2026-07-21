import React from "react";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const FormNavigationButtons = ({
  onPrevious,
  onCancel,
  onSubmit,
  showPrevious = true,
  showCancel = true,
  submitText, // we’ll translate inside component if not passed
  disableSubmit = false,
}) => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={4}
      flexWrap="wrap"
      gap={2}
    >
      {/* Left Side Buttons */}
      <Box display="flex" gap={2}>
        {showPrevious && (
          <Button
            variant="outlined"
            onClick={onPrevious}
            sx={{
              borderRadius: "100px",
              borderColor: "#827B37",
              color: "#827B37",
              fontFamily: "Work Sans",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#F5F5F5",
              },
            }}
          >
            {t("formNavigation.previous")}
          </Button>
        )}
      </Box>

      {/* Right Side Buttons */}
      <Box display="flex" gap={2}>
        {showCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              borderRadius: "100px",
              borderColor: "#827B37",
              color: "#827B37",
              fontFamily: "Work Sans",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#F5F5F5",
              },
            }}
          >
            {t("formNavigation.cancel")}
          </Button>
        )}

        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={disableSubmit}
          sx={{
            borderRadius: "100px",
            backgroundColor: "#827B37",
            fontFamily: "Work Sans",
            fontWeight: 600,
            textTransform: "none",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#827B37",
              opacity: 0.9,
            },
          }}
        >
          {submitText || t("formNavigation.createWorkflow")}
        </Button>
      </Box>
    </Box>
  );
};

export default FormNavigationButtons;
