import React from "react";
import { Box, Typography } from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { useTranslation } from 'react-i18next';

const CarryoverRulesPopup = ({ anchorEl, handleClose, formData, onFormDataChange }) => {
  const { t } = useTranslation();
  const open = Boolean(anchorEl);

  const normalizeDateForInput = (value) => {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    if (/^(0[1-9]|1[0-2])$/.test(value)) {
      const year = new Date().getFullYear();
      return `${year}-${value}-01`;
    }
    return "";
  };

  const handleCarryOverDateChange = (e) => {
    onFormDataChange({
      ...formData,
      carryOver: {
        ...formData.carryOver,
        carryOverDate: e.target.value,
      },
    });
  };

  const handleMaxDaysChange = (e) => {
    onFormDataChange({
      ...formData,
      carryOver: {
        ...formData.carryOver,
        maxDays: parseInt(e.target.value) || 0,
      },
    });
  };

  if (!open) return null; 

  return (
    <Box
      sx={{
        position: "relative",
        top:  -10, 
        left: 30,
         zIndex: 1300, 
        borderRadius: "8px",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        width: "600px",
        padding: "8px",
        border: "1px solid #D3D3D3",
        backgroundColor: "#fff", 
      }}
    >
      <Box sx={{ p: 1 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.2rem" }}>
            {t("CarryoverRulesPopup.Title")}
          </Typography>
          <Typography
            onClick={handleClose}
            sx={{
              cursor: "pointer",
              fontSize: "18px",
              color: "#707070",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                color: "#ff4d4f",
                transform: "scale(1.1)",
              },
            }}
          >
            ✕
          </Typography>
        </Box>

        {/* Carryover Date */}
        <Typography sx={{ fontSize: "14px", color: "#707070", mb: 1, mt: 2 }}>
          {t("CarryoverRulesPopup.CarryoverDateQuestion")}
        </Typography>
        <Box sx={{ display: "flex", mb: 3 }}>
          <InputTextComponent
            id="carryOverDate"
            name="carryOverDate"
            type="date"
            label={t("CarryoverRulesPopup.CarryoverDateLabel")}
            value={normalizeDateForInput(formData?.carryOver?.carryOverDate || "")}
            onChange={handleCarryOverDateChange}
            sx={{ width: "100%" }}
          />
        </Box>

        {/* Max Days to Carry Forward */}
        <Typography sx={{ fontSize: "14px", color: "#707070", mb: 1 }}>
          {t("CarryoverRulesPopup.MaxDaysQuestion")}
        </Typography>
        <Box sx={{ display: "flex", mb: 2 }}>
          <InputTextComponent
            id="maxDays"
            name="maxDays"
            type="number"
            label={t("CarryoverRulesPopup.MaxDaysLabel")}
            value={formData?.carryOver?.maxDays}
            onChange={handleMaxDaysChange}
            sx={{ width: "100%" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CarryoverRulesPopup;
