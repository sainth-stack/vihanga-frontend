import React, { useState } from "react";
import { Box, Button, Paper, Typography, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";

const AddApprovalHeader = ({ activeTab, setActiveTab, searchTerm, setSearchTerm }) => {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        borderRadius: "16px",
        p: 3,
        m: 2,
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        backgroundColor: "#ffffff",
      }}
    >
      {/* 🔹 Title */}
      <Typography
        sx={{
          fontFamily: "Montserrat",
          color: "#0E0E0E",
          fontWeight: "600",
          fontSize: "32px",
        }}
        gutterBottom
      >
        {t("addApprovalHeader.title")}
      </Typography>

      {/* 🔹 Tabs */}
      <Box sx={{ display: "flex", mb: 3 }}>
        <Button
          variant="contained"
          onClick={() => setActiveTab("roles")}
          sx={{
            textTransform: "none",
            borderRadius: "20px",
            fontFamily: "Work Sans",
            fontWeight: "500",
            fontSize: "16px",
            margin: "0 .1rem 0 .1rem",
            backgroundColor: activeTab === "roles" ? "#837F39" : "#F4F4F4",
            color: activeTab === "roles" ? "#FFFFFF" : "#837F39",
            "&:hover": {
              backgroundColor: activeTab === "roles" ? "#746a2e" : "#e0e0e0",
            },
          }}
        >
          {t("addApprovalHeader.rolesTab")}
        </Button>

        <Button
          variant="contained"
          onClick={() => setActiveTab("user")}
          sx={{
            fontFamily: "Work Sans",
            fontWeight: "500",
            fontSize: "16px",
            textTransform: "none",
            borderRadius: "20px",
            margin: "0 .1rem 0 .1rem",
            backgroundColor: activeTab === "user" ? "#837F39" : "#F4F4F4",
            color: activeTab === "user" ? "#FFFFFF" : "#837F39",
            "&:hover": {
              backgroundColor: activeTab === "user" ? "#746a2e" : "#e0e0e0",
            },
          }}
        >
          {t("addApprovalHeader.individualUserTab")}
        </Button>
      </Box>

      {/* 🔹 Search Field */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #837F39",
          borderRadius: "20px",
          px: 2,
          py: 0.5,
          width: "100%",
          maxWidth: "444px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <SearchIcon
          sx={{ color: "#837F39", mr: 1, width: "24px", height: "24px" }}
        />
        <InputBase
          placeholder={t("addApprovalHeader.searchPlaceholder")}
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            color: "#837F39",
            fontWeight: 500,
            fontSize: "16px",
            fontFamily: "Work Sans",
          }}
        />
      </Box>
    </Paper>
  );
};

export default AddApprovalHeader;
