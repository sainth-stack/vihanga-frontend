import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { InputTextComponent } from "../../../components/input-elements/text";
import { SelectComponent } from "../../../components/input-elements/select";
import axios from "axios";
import {Toast} from '../../../../../service/toast'
import LookupsTable from "./table";
import { appURL, companyId } from "utilities";
import { useTranslation } from "react-i18next";
import { canEdit } from "utilities/privilegeHelper";


const LookupsForm = ({ editData = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    lookType: "",
    meaning: "",
  });

  const [ratingScaleData, setRatingScaleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
    const { t } = useTranslation();
  
  const resetForm = () => {
    setFormData({ lookType: "", meaning: "" });
    const defaultRow = {
      id: `rating-${Date.now()}`,
      code: "",
      meaning: "",
      dateStart: "",
      dateEnd: "",
      enabled: true,
    };
    setRatingScaleData([defaultRow]);
    setSuccessMsg("");
    setErrorMsg("");
    if (onCancel) onCancel();
  };


  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        lookType: editData.lookType || "",
        meaning: editData.meaning || "",
      });
      
      // Convert existing rating scale data to the format expected by the table
      const convertedRatingScale = editData.ratingScale ? editData.ratingScale.map((item, index) => ({
        // Prefer stable ids to avoid input focus loss on re-renders
        id: item._id || item.id || `rating-${index}`,
        code: item.code || "",
        meaning: item.meaning || "",
        dateStart: item.dateStart ? new Date(item.dateStart).toISOString().split('T')[0] : "",
        dateEnd: item.dateEnd ? new Date(item.dateEnd).toISOString().split('T')[0] : "",
        enabled: item.enabled !== undefined ? item.enabled : true
      })) : [];
      
      setRatingScaleData(convertedRatingScale);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, id, value } = e.target || {};
    const key = name || id; // Some inputs (like MUI Select) pass 'name' instead of 'id'
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRatingScaleChange = (newRatingScaleData) => {
    setRatingScaleData(newRatingScaleData);
  };

  const handleSubmit = async () => {
    setLoading(true);
  
    try {
      // Prepare the data to be submitted - format according to MongoDB schema
      const submitData = {
        ...formData,
        companyId,
        ratingScale: ratingScaleData.map(item => ({
          code: parseInt(item.code) || 0,
          meaning: item.meaning || "",
          dateStart: item.dateStart ? new Date(item.dateStart) : null,
          dateEnd: item.dateEnd ? new Date(item.dateEnd) : null,
          enabled: item.enabled !== undefined ? item.enabled : true
        }))
      };

      console.log("Submitting data:", submitData); // For debugging

      if (editData && editData._id) {
        // Edit mode
        await axios.put(`${appURL}/updateLookups/${editData._id}`,
          submitData);
        Toast({ type: "success", message: "Lookup updated successfully!" });
      } else {
        // Create mode
        await axios.post(`${appURL}/createLookups`, submitData);
        Toast({ type: "success", message: "Lookup created successfully!" });
        resetForm();
      }

      if (onSuccess) onSuccess(); // Refresh table
      setSuccessMsg('')
    } catch (error) {
      console.error("API Error:", error);
      Toast({ type: "error", message: "Failed to submit lookup. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          fontFamily: "Work Sans, sans-serif",
          mb: 2,
        }}
      >
        {editData ? t("LookUpScreen.EditLookUp") : t("LookUpScreen.CreateLookUp")}
      </Typography>

      {successMsg && <Alert severity="success">{successMsg}</Alert>}
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SelectComponent
            id="lookType"
              label={t("LookUpScreen.LookupType")}         

            value={formData.lookType}
            onChange={handleChange}
            placeholder="Select lookup type"
            disabled={!canEdit()}
            options={[
               { value: "Performance Rating Scale", label: t("LookUpScreen.PerformanceRatingScale") }
            ]}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="meaning"
  label={t("LookUpScreen.Meaning")}              
            value={formData.meaning}
            onChange={handleChange}
            placeholder="Enter meaning"
            disabled={!canEdit()}
          />
        </Grid>

        <Grid item xs={12}>
          <LookupsTable 
            ratingScaleData={ratingScaleData}
            onRatingScaleChange={handleRatingScaleChange}
          />
        </Grid>

        {canEdit() && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#837F39",
                "&:hover": { backgroundColor: "#6f6b32" },
                 fontFamily:"Work Sans",
                fontWeight:"500",
                borderRadius:"20px",
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : editData ? (
                t("LookUpScreen.Update")
              ) : (
                t("LookUpScreen.Submit")
              )}
            </Button>

              <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#FFFFFF",
                "&:hover": { backgroundColor: "#FFFFFF" },
                color:"#847F3B",
                marginLeft:"30px",
                borderRadius:"20px",
                border:"1px solid #847F3B",
                fontFamily:"Work Sans",
                fontWeight:"500",


              }}
              onClick={resetForm}
              disabled={loading}
            >
              {/* {loading ? (
                <CircularProgress size={24} />
              ) : editData ? (
                "Update"
              ) : (
                "Submit"
              )} */} {t("LookUpScreen.Cancel")} 
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default LookupsForm;
