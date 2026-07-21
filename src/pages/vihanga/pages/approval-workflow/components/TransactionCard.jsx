import React from "react";
import {
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const TransactionCard = ({ title, description, selected, onClick, item }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  return (
    <Card
      onClick={() => onClick(item)} // Pass the entire item object
      sx={{
        width: "100%",
        height: isSmallScreen ? "auto" : "106px",
        padding: isSmallScreen ? "8px" : "10px",
        borderRadius: "12px",
        boxShadow: selected ? 6 : 2,
        cursor: "pointer",
        backgroundColor: selected ? "#f3f4f6" : "#fff",
        border: selected ? "1px solid #7a7a52" : "1px solid #e0e0e0",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
      }}
    >
      <CardContent sx={{ padding: "0 !important" }}>
        <Typography
          variant={isSmallScreen ? "body1" : "subtitle1"}
          fontWeight={600}
          mt={-1}
        >
          {t(title)}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          mt={0.5}
          sx={{ fontSize: isSmallScreen ? "0.8rem" : "0.875rem" }}
        >
          {t(description)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
