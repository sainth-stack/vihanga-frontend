import React from "react";
import { Box, Typography, Button, Card } from "@mui/material";
import { useTranslation } from "react-i18next";

const SelectedApproversCard = ({ approvers = [], onSave, onCancel }) => {
  const { t } = useTranslation();
  const hasApprovers = approvers.length > 0;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        padding: "24px",
        backgroundColor: "#fff",
        border: "1px solid #eee",
        mt: "30px",
      }}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography
          sx={{
            fontFamily: "Montserrat",
            fontWeight: 600,
            fontSize: "20px",
            color: "#0E0E0E",
          }}
        >
          {t("selectedApprovers.title")}
        </Typography>

        <Typography
          sx={{
            fontFamily: "Work Sans",
            fontWeight: 500,
            fontSize: "16px",
            color: "#707070",
          }}
        >
          {hasApprovers
            ? approvers.map((approver) => approver.title).join(", ")
            : t("selectedApprovers.noApprovers")}
        </Typography>

        <Box display="flex" gap={2} mt={2}>
          <Button
            variant="contained"
            onClick={onSave}
            sx={{
              backgroundColor: "#827b37",
              borderRadius: "100px",
              px: 3,
              fontFamily: "Work Sans",
              fontWeight: 500,
              fontSize: "16px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#827b37",
                opacity: 0.9,
              },
            }}
          >
            {t("selectedApprovers.saveStep")}
          </Button>

          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              borderRadius: "100px",
              px: 3,
              fontFamily: "Work Sans",
              fontWeight: 500,
              fontSize: "16px",
              color: "#827b37",
              borderColor: "#827b37",
              textTransform: "none",
              "&:hover": {
                borderColor: "#827b37",
                backgroundColor: "rgba(130, 123, 55, 0.04)",
              },
            }}
          >
            {t("selectedApprovers.cancel")}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default SelectedApproversCard;
