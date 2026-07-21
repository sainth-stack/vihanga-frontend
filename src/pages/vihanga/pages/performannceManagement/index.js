import React, { useState } from "react";
import {
  Typography,
  Box,
  Card,
  Button,
  IconButton,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { canEdit } from "utilities/privilegeHelper";

const PerformanceManagement = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    typeOfEvaluation: "",
    frequencyOfEvaluation: "",
  });

  const empData = [
    {
      key: t("PerformanceManagement.Monthly"),
      value: t("PerformanceManagement.Monthly"),
    },
    {
      key: t("PerformanceManagement.Quarterly"),
      value: t("PerformanceManagement.Quarterly"),
    },
    {
      key: t("PerformanceManagement.SemiAnnually"),
      value: t("PerformanceManagement.SemiAnnually"),
    },
    {
      key: t("PerformanceManagement.Annually"),
      value: t("PerformanceManagement.Annually"),
    },
  ];

  const okrOptions = [
    {
      key: t("PerformanceManagement.Monthly"),
      value: t("PerformanceManagement.Monthly"),
    },
    {
      key: t("PerformanceManagement.Quarterly"),
      value: t("PerformanceManagement.Quarterly"),
    },
    {
      key: t("PerformanceManagement.SemiAnnually"),
      value: t("PerformanceManagement.SemiAnnually"),
    },
    {
      key: t("PerformanceManagement.Annually"),
      value: t("PerformanceManagement.Annually"),
    },
  ];

  const competencyOptions = [
    {
      key: t("PerformanceManagement.Monthly"),
      value: t("PerformanceManagement.Monthly"),
    },
    {
      key: t("PerformanceManagement.Quarterly"),
      value: t("PerformanceManagement.Quarterly"),
    },
    {
      key: t("PerformanceManagement.SemiAnnually"),
      value: t("PerformanceManagement.SemiAnnually"),
    },
    {
      key: t("PerformanceManagement.Annually"),
      value: t("PerformanceManagement.Annually"),
    },
  ];

  const weightageOptions = [
    {
      key: t("PerformanceManagement.Monthly"),
      value: t("PerformanceManagement.Monthly"),
    },
    {
      key: t("PerformanceManagement.Quarterly"),
      value: t("PerformanceManagement.Quarterly"),
    },
    {
      key: t("PerformanceManagement.SemiAnnually"),
      value: t("PerformanceManagement.SemiAnnually"),
    },
    {
      key: t("PerformanceManagement.Annually"),
      value: t("PerformanceManagement.Annually"),
    },
  ];

  const handleSelectChange = (name) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [date, setDate] = useState();

  const handleStartDate = (e) => {
    setDate(e.target.value);
  };

  const handleEndDate = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = () => {
    console.log("Form data:", formData);
  };

  return (
    <Box>
      <Box sx={{ m: 3 }}>
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: "10px",
            }}
          >
            <Typography
              sx={{
                color: "#0E0E0E",
                fontFamily: "Montserrat",
                fontWeight: "600",
                fontSize: "32px",
              }}
            >
              {t("PerformanceManagement.Title")}
            </Typography>
            {canEdit() && (
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: "#88823B",
                  color: "#fff",
                  borderRadius: "100px",
                  fontFamily: "Work Sans",
                  textTransform: "none",
                  fontWeight: 500,
                  height: "38px",
                  width: "100px",
                  "&:hover": {
                    backgroundColor: "#6f6a2f",
                  },
                }}
              >
                {t("PerformanceManagement.Create")}
              </Button>
            )}
          </Box>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <SelectComponent
                label={t("PerformanceManagement.TypeOfEvaluation")}
                key="TypeOfEvaluation"
                id="TypeOfEvaluation"
                placeholder={t("PerformanceManagement.Select")}
                name="typeOfEvaluation"
                value={formData.typeOfEvaluation}
                onChange={handleSelectChange("typeOfEvaluation")}
                options={empData}
                sx={{ flex: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <SelectComponent
                  label={t("PerformanceManagement.FrequencyOfEvaluation")}
                  key="FrequencyOfEvaluation"
                  id="FrequencyOfEvaluation"
                  placeholder={t("PerformanceManagement.Select")}
                  name="frequencyOfEvaluation"
                  value={formData.frequencyOfEvaluation}
                  onChange={handleSelectChange("frequencyOfEvaluation")}
                  options={empData}
                  sx={{ flex: 1 }}
                />
                {canEdit() && (
                  <IconButton
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#88823B",
                      color: "#fff",
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor: "#6f6a2f",
                      },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                )}

                {canEdit() && (
                  <IconButton
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#88823B",
                      color: "#fff",
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor: "#6f6a2f",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <InputTextComponent
                type="date"
                label={t("PerformanceManagement.StartDate")}
                placeholder={t("PerformanceManagement.EnterStartDate")}
                id="startDate"
                value={date}
                name="startDate"
                onChange={handleStartDate}
                sx={{ width: "100%" }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InputTextComponent
                type="date"
                label={t("PerformanceManagement.LaunchDate")}
                placeholder={t("PerformanceManagement.EnterLaunchDate")}
                id="launchDate"
                value={date}
                name="launchDate"
                onChange={handleEndDate}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>

          <Box sx={{ marginTop: "40px", marginLeft: "40px" }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "24px",
                mb: 3,
                fontFamily: "Montserrat",
                color: "#0E0E0E",
              }}
            >
              {t("PerformanceManagement.ListGroupName")}
            </Typography>

            <Box sx={{ display: "flex", gap: "40px", mb: 4 }}>
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <Typography
                    sx={{
                      color: "#0E0E0E",
                      fontSize: "16px",
                      fontFamily: "Work Sans",
                      fontWeight: "500",
                    }}
                  >
                    {t("PerformanceManagement.Employee")}
                  </Typography>
                }
              />
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <Typography
                    sx={{
                      color: "#0E0E0E",
                      fontSize: "16px",
                      fontFamily: "Work Sans",
                      fontWeight: "500",
                    }}
                  >
                    {t("PerformanceManagement.Manager")}
                  </Typography>
                }
              />
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <Typography
                    sx={{
                      color: "#0E0E0E",
                      fontSize: "16px",
                      fontFamily: "Work Sans",
                      fontWeight: "500",
                    }}
                  >
                    {t("PerformanceManagement.Leadership")}
                  </Typography>
                }
              />
            </Box>

            {canEdit() && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "#88823B",
                    color: "#88823B",
                    borderRadius: "100px",
                    fontFamily: "Work Sans",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#6f6a2f",
                      backgroundColor: "#f9f9f9",
                    },
                  }}
                >
                  {t("PerformanceManagement.Cancel")}
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#88823B",
                    color: "#fff",
                    borderRadius: "100px",
                    fontFamily: "Work Sans",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#6f6a2f",
                    },
                  }}
                >
                  {t("PerformanceManagement.Save")}
                </Button>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "50px",
              marginLeft: "40px",
            }}
          >
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Typography
                  sx={{
                    color: "#0E0E0E",
                    fontSize: "16px",
                    fontFamily: "Work Sans",
                    fontWeight: "500",
                  }}
                >
                  {t("PerformanceManagement.OverallRating")}
                </Typography>
              }
            />
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Typography
                  sx={{
                    color: "#0E0E0E",
                    fontSize: "16px",
                    fontFamily: "Work Sans",
                    fontWeight: "500",
                  }}
                >
                  {t("PerformanceManagement.AbsoluteRating")}
                </Typography>
              }
            />
            {canEdit() && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#88823B",
                  color: "#fff",
                  borderRadius: "100px",
                  fontFamily: "Work Sans",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#6f6a2f",
                  },
                }}
              >
                {t("PerformanceManagement.RatingScale")}
              </Button>
            )}
          </Box>

          <Box sx={{ marginLeft: "40px", marginTop: "40px" }}>
            <Box display="flex" alignItems="center" gap="40px" sx={{ mb: 2 }}>
              <Box sx={{ minWidth: "200px" }}>
                <Typography
                  sx={{
                    color: "#0E0E0E",
                    fontSize: "16px",
                    fontFamily: "Work Sans",
                    fontWeight: "500",
                  }}
                >
                  {t("PerformanceManagement.OKRWastage")}
                </Typography>
              </Box>
              <Box sx={{ width: "300px" }}>
                <SelectComponent
                  id="okrWastage"
                  name="okrWastage"
                  placeholder={t("PerformanceManagement.Select")}
                  value={formData.okrWastage}
                  onChange={handleSelectChange("okrWastage")}
                  options={okrOptions}
                />
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap="40px" sx={{ mb: 2 }}>
              <Box sx={{ minWidth: "200px" }}>
                <Typography
                  sx={{
                    color: "#0E0E0E",
                    fontSize: "16px",
                    fontFamily: "Work Sans",
                    fontWeight: "500",
                  }}
                >
                  {t("PerformanceManagement.CompetencyWeightage")}
                </Typography>
              </Box>
              <Box sx={{ width: "300px" }}>
                <SelectComponent
                  id="competencyWeightage"
                  name="competencyWeightage"
                  placeholder={t("PerformanceManagement.Select")}
                  value={formData.competencyWeightage}
                  onChange={handleSelectChange("competencyWeightage")}
                  options={competencyOptions}
                />
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap="40px" sx={{ mb: 2 }}>
              <Box sx={{ minWidth: "200px" }}>
                <Typography
                  sx={{
                    color: "#0E0E0E",
                    fontSize: "16px",
                    fontFamily: "Work Sans",
                    fontWeight: "500",
                  }}
                >
                  {t("PerformanceManagement.Weightage360")}
                </Typography>
              </Box>
              <Box sx={{ width: "300px" }}>
                <SelectComponent
                  id="weightage360"
                  name="weightage360"
                  placeholder={t("PerformanceManagement.Select")}
                  value={formData.weightage360}
                  onChange={handleSelectChange("weightage360")}
                  options={weightageOptions}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "40px",
              marginLeft: "40px",
            }}
          >
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Typography
                  sx={{
                    color: "#0E0E0E",
                    fontSize: "16px",
                    fontFamily: "Work Sans",
                    fontWeight: "500",
                  }}
                >
                  {t("PerformanceManagement.IncludeSelfEvaluation")}
                </Typography>
              }
            />
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Typography
                  sx={{
                    color: "#0E0E0E",
                    fontSize: "16px",
                    fontFamily: "Work Sans",
                    fontWeight: "500",
                  }}
                >
                  {t("PerformanceManagement.EmployeeAcknowledgement")}
                </Typography>
              }
            />
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Typography
                  sx={{
                    color: "#0E0E0E",
                    fontSize: "16px",
                    fontFamily: "Work Sans",
                    fontWeight: "500",
                  }}
                >
                  {t("PerformanceManagement.HRBPReview")}
                </Typography>
              }
            />
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Typography
                  sx={{
                    color: "#0E0E0E",
                    fontSize: "16px",
                    fontFamily: "Work Sans",
                    fontWeight: "500",
                  }}
                >
                  {t("PerformanceManagement.ApprovalRequired")}
                </Typography>
              }
            />
          </Box>

          <Box
            display="flex"
            alignItems="center"
            gap="40px"
            sx={{ marginTop: "40px", marginLeft: "40px", marginBottom: "40px" }}
          >
            <Box sx={{ minWidth: "200px" }}>
              <Typography
                sx={{
                  color: "#0E0E0E",
                  fontSize: "16px",
                  fontFamily: "Work Sans",
                  fontWeight: "500",
                }}
              >
                {t("PerformanceManagement.OKRWastage")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <SelectComponent
                key="FrequencyOfEvaluation"
                id="FrequencyOfEvaluation"
                placeholder={t("PerformanceManagement.Select")}
                name="frequencyOfEvaluation"
                value={formData.frequencyOfEvaluation}
                onChange={handleSelectChange("frequencyOfEvaluation")}
                options={empData}
                sx={{ width: "300px" }}
              />
              {canEdit() && (
                <IconButton
                  sx={{
                    width: 40,
                    height: 40,
                    marginTop: "-20px",
                    backgroundColor: "#88823B",
                    color: "#fff",
                    borderRadius: "50%",
                    "&:hover": {
                      backgroundColor: "#6f6a2f",
                    },
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              )}

              {canEdit() && (
                <IconButton
                  sx={{
                    width: 40,
                    height: 40,
                    marginTop: "-20px",
                    backgroundColor: "#88823B",
                    color: "#fff",
                    borderRadius: "50%",
                    "&:hover": {
                      backgroundColor: "#6f6a2f",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default PerformanceManagement;
