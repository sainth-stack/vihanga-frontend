import React, { useState, useEffect } from "react";
import { Popover, Grid, Typography, Button, Box } from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import axios from "axios";
import { appURL } from "utilities";
import { useDispatch } from "react-redux";
import { getDesignations } from "action/DesignationAct";
import { getDepartmentsData } from "action/DepartmentAct";
import { removeDuplicates } from "utilities";
import { useTranslation } from "react-i18next";

const FilterComponent = ({
  filterAnchorEl,
  handleCloseFilter,
  filters,
  handleFilterChange,
  resetFilters,
  applyFilters,
}) => {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const openFilter = Boolean(filterAnchorEl);
  const filterId = openFilter ? "filter-popover" : undefined;

  // Fetch departments and designations when the filter opens
  useEffect(() => {
    if (openFilter) {
      fetchDepartments();
      fetchDesignations();
    }
  }, [openFilter]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      let response = dispatch(getDepartmentsData());
      response.then(({ data, message }) => {
        if (
          data !== undefined &&
          data.length > 0 &&
          data[0].departments.length > 0
        ) {
          let result = data[0].departments
            .filter((item) => item.status === "Active")
            .map((item) => ({
              value: item.departmentName,
              label: item.departmentName,
              key: item.departmentName,
            }));
          let nonduplicates = removeDuplicates(result, "value");
          setDepartments(nonduplicates);
          setError("");
        } else if (data.length === 0) {
          setError(t("FilterComponent.Messages.NoDepartmentsFound"));
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignations = () => {
    try {
      setLoading(true);
      let response = dispatch(getDesignations());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = data
            .filter((item) => item.status === "Active")
            .map((item) => ({
              value: item.designationName,
              label: item.designationName,
              key: item.designationName,
            }));
          let nonduplicates = removeDuplicates(result, "value");
          setDesignations(nonduplicates);
          setError("");
        } else if (data.length === 0) {
          setError(t("FilterComponent.Messages.NoDesignationsFound"));
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
      console.error("Error fetching designations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover
      id={filterId}
      open={openFilter}
      anchorEl={filterAnchorEl}
      onClose={handleCloseFilter}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        mt: 1,
        "& .MuiPaper-root": {
          borderRadius: "8px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
          width: "600px",
          padding: "16px",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {t("FilterComponent.Title")}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InputTextComponent
              id="candidateId"
              label={t("FilterComponent.Fields.CandidateId")}
              value={filters?.candidateId || ""}
              onChange={(e) =>
                handleFilterChange("candidateId", e.target.value)
              }
              placeholder={t("FilterComponent.Placeholders.EnterCandidateId")}
            />
          </Grid>

          <Grid item xs={6}>
            <InputTextComponent
              id="candidateName"
              label={t("FilterComponent.Fields.CandidateName")}
              value={filters?.candidateName || ""}
              onChange={(e) =>
                handleFilterChange("candidateName", e.target.value)
              }
              placeholder={t("FilterComponent.Placeholders.EnterCandidateName")}
            />
          </Grid>

          <Grid item xs={6}>
            <SelectComponent
              id="department"
              label={t("FilterComponent.Fields.Department")}
              value={filters?.department || []}
              onChange={(e) => handleFilterChange("department", e.target.value)}
              options={departments}
              multiple={true}
              loading={loading}
            />
          </Grid>

          <Grid item xs={6}>
            <SelectComponent
              id="position"
              label={t("FilterComponent.Fields.Designation")}
              value={filters?.position || []}
              onChange={(e) => handleFilterChange("position", e.target.value)}
              options={designations}
              multiple={true}
              loading={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t("FilterComponent.Fields.ApplicationDate")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <InputTextComponent
                id="fromDate"
                type="date"
                value={filters?.fromDate || ""}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Typography variant="body2" sx={{ alignSelf: "center" }}>
                {t("FilterComponent.Fields.To")}
              </Typography>
              <InputTextComponent
                id="toDate"
                type="date"
                value={filters?.toDate || ""}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <SelectComponent
              id="stage"
              label={t("FilterComponent.Fields.Stage")}
              value={filters?.stage || []}
              onChange={(e) => handleFilterChange("stage", e.target.value)}
              options={[
                {
                  value: "New Applied",
                  label: t("FilterComponent.Options.NewApplied"),
                  progress: 10,
                },
                {
                  value: "Psychometric Test",
                  label: t("FilterComponent.Options.PsychometricTest"),
                  progress: 20,
                },
                {
                  value: "Interview 1",
                  label: t("FilterComponent.Options.Interview1"),
                  progress: 40,
                },
                {
                  value: "Interview 2",
                  label: t("FilterComponent.Options.Interview2"),
                  progress: 50,
                },
                {
                  value: "Document Upload",
                  label: t("FilterComponent.Options.DocumentUpload"),
                  progress: 60,
                },
                {
                  value: "Offer Letter",
                  label: t("FilterComponent.Options.OfferLetter"),
                  progress: 60,
                },
                {
                  value: "Onboarding",
                  label: t("FilterComponent.Options.Onboarding"),
                  progress: 70,
                },
                {
                  value: "Rejected",
                  label: t("FilterComponent.Options.Rejected"),
                  progress: 80,
                },
                {
                  value: "Convert to Employee",
                  label: t("FilterComponent.Options.ConvertToEmployee"),
                  progress: 100,
                },
              ]}
              multiple={true}
            />
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
        >
          <Button
            variant="outlined"
            onClick={resetFilters}
            sx={{
              textTransform: "none",
              color: "#85803c",
              borderColor: "#85803c",
              "&:hover": {
                borderColor: "#85803c",
              },
            }}
          >
            {t("FilterComponent.Buttons.Reset")}
          </Button>
          <Button
            variant="contained"
            onClick={applyFilters}
            disabled={loading}
            sx={{
              textTransform: "none",
              backgroundColor: "#85803c",
              "&:hover": {
                backgroundColor: "#6d6a30",
              },
            }}
          >
            {loading
              ? t("FilterComponent.Buttons.Loading")
              : t("FilterComponent.Buttons.Apply")}
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default FilterComponent;
