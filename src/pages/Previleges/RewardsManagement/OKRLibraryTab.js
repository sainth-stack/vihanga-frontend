/* eslint-disable no-unused-vars */
import React from "react";
import {
  getProgressColor,
  RewardCategories,
  RewardTypes1,
  RewardTypes2,
} from "utilities";
import { useState, useEffect } from "react";
import { Box, Grid, Typography, Slider, Button } from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import CustomCheckBoxSwitch from "pages/vihanga/components/CustomCheckSwitch";
import CustomButton from "pages/vihanga/components/Button/CustomButton";
import { Toast } from "service/toast";
import ViewEmployeesPopup from "../ReviewPerformanceManagement/ViewEmployeesPopup";
import { useTranslation } from "react-i18next";

export default function OKRLibraryTab({
  roleData,
  handleChangeSearchBoolean,
  handleCancel,
  handleSubmit,
  isMobile,
  handleChangeSearch,
  eligibilityGroups,
  okrTemplates,
  handleChangeSearch2,
}) {
  const { t } = useTranslation();
  const [value, setValue] = useState(
    roleData.rewardPoints ? Number(roleData.rewardPoints / 10) : 0
  );
  const [value2, setValue2] = useState(
    roleData.rewardPoints2 ? Number(roleData.rewardPoints2 / 10) : 0
  );
  const [value3, setValue3] = useState(
    roleData.rewardPoints3 ? Number(roleData.rewardPoints3 / 10) : 0
  );

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Employees popup state
  const [showEmployees, setShowEmployees] = useState(false);
  const [employeesDetails, setEmployeesDetails] = useState([]);

  // Update slider values when roleData changes (for edit mode)
  useEffect(() => {
    setValue(roleData.rewardPoints ? Number(roleData.rewardPoints / 10) : 0);
    setValue2(roleData.rewardPoints2 ? Number(roleData.rewardPoints2 / 10) : 0);
    setValue3(roleData.rewardPoints3 ? Number(roleData.rewardPoints3 / 10) : 0);
  }, [roleData.rewardPoints, roleData.rewardPoints2, roleData.rewardPoints3]);

  // Populate employees when eligibilityGroup is set (for edit mode)
  useEffect(() => {
    if (roleData.eligibilityGroup && eligibilityGroups.length > 0) {
      const selectedGroup = eligibilityGroups.find(
        (item) => item.value === roleData.eligibilityGroup
      );
      const activeGroupMembers = selectedGroup?.activeGroupMembers || [];

      const processedMembers = activeGroupMembers.map((item) => ({
        key:
          `${item.personalInformation?.firstName || ""} ${
            item.personalInformation?.lastName || ""
          }`.trim() ||
          item.name ||
          t("OKRLibraryTab.NotAvailable"),
        value: item._id,
        profilePicture:
          item.personalInformation?.profilePicture || item.profilePicture,
        role: item.employmentInformation?.role || item.role,
      }));

      setEmployeesDetails(processedMembers);
    }
  }, [roleData.eligibilityGroup, eligibilityGroups, t]);

  // Reset errors and touched state when roleData changes (for new/edit mode)
  useEffect(() => {
    setErrors({});
    setTouched({});
  }, [roleData.rewardSchemeName]); // Use rewardSchemeName as a key indicator of form change

  // Field configs for mapping
  const textFields = [
    {
      id: "rewardSchemeName",
      label: t("OKRLibraryTab.Fields.RewardSchemeName"),
      type: "text",
      required: true,
    },
    {
      id: "objectivesAchievementPercent",
      label: t("OKRLibraryTab.Fields.ObjectivesAchievementPercent"),
      type: "text",
    },
    {
      id: "objectivesAchievementPoints",
      label: t("OKRLibraryTab.Fields.ObjectivesAchievementPoints"),
      type: "text",
    },
    {
      id: "krAchievementPercent",
      label: t("OKRLibraryTab.Fields.KrAchievementPercent"),
      type: "text",
    },
    {
      id: "krAchievementPoints",
      label: t("OKRLibraryTab.Fields.KrAchievementPoints"),
      type: "text",
    },
    {
      id: "taskAchievementPercent",
      label: t("OKRLibraryTab.Fields.TaskAchievementPercent"),
      type: "text",
    },
    {
      id: "taskAchievementPoints",
      label: t("OKRLibraryTab.Fields.TaskAchievementPoints"),
      type: "text",
    },
    {
      id: "subTaskAchievementPercent",
      label: t("OKRLibraryTab.Fields.SubTaskAchievementPercent"),
      type: "text",
    },
    {
      id: "subTaskAchievementPoints",
      label: t("OKRLibraryTab.Fields.SubTaskPoints"),
      type: "text",
    },
  ];

  // Map select options to {label, value}
  const mapOptions = (options) =>
    options.map((opt) => ({
      label: opt.label || opt.key || opt.value,
      value: opt.value,
    }));
  const rewardCategoryOptions = mapOptions(RewardCategories);
  const rewardTypeOptions = mapOptions(
    roleData.rewardCategory === "Monetory" ? RewardTypes1 : RewardTypes2
  );
  const okrTemplateOptions = okrTemplates.map((opt) => ({
    label: opt.key || opt.label || opt.value,
    value: opt.value,
  }));
  const eligibilityGroupOptions = eligibilityGroups.map((opt) => ({
    label: opt.key || opt.label || opt.value,
    value: opt.value,
  }));

  const selectFields = [
    {
      id: "rewardCategory",
      label: t("OKRLibraryTab.Fields.RewardCategory"),
      options: rewardCategoryOptions,
      required: true,
    },
    {
      id: "rewardType",
      label: t("OKRLibraryTab.Fields.RewardType"),
      options: rewardTypeOptions,
      required: true,
    },
    {
      id: "okrTemplate",
      label: t("OKRLibraryTab.Fields.OKRTemplate"),
      options: okrTemplateOptions,
      required: true,
    },
    {
      id: "eligibilityGroup",
      label: t("OKRLibraryTab.Fields.EligibilityGroup"),
      options: eligibilityGroupOptions,
      required: true,
    },
  ];
  const checkboxFields = [
    { name: "kudosEnabled", label: t("OKRLibraryTab.Fields.KudosEnabled") },
    {
      name: "birthdayWishesEnabled",
      label: t("OKRLibraryTab.Fields.BirthdayWishesEnabled"),
    },
    {
      name: "approvalRequired",
      label: t("OKRLibraryTab.Fields.ApprovalRequired"),
    },
    {
      name: "anniversaryWishesEnabled",
      label: t("OKRLibraryTab.Fields.AnniversaryWishesEnabled"),
    },
  ];

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Validate required text fields
    textFields
      .filter((field) => field.required)
      .forEach((field) => {
        if (
          !roleData[field.id] ||
          roleData[field.id].toString().trim() === ""
        ) {
          newErrors[field.id] = t("OKRLibraryTab.Validation.FieldRequired", {
            field: field.label.replace("*", ""),
          });
        }
      });

    // Validate required select fields
    selectFields
      .filter((field) => field.required)
      .forEach((field) => {
        if (
          !roleData[field.id] ||
          roleData[field.id] === "" ||
          roleData[field.id] === null ||
          roleData[field.id] === undefined
        ) {
          newErrors[field.id] = t("OKRLibraryTab.Validation.FieldRequired", {
            field: field.label.replace("*", ""),
          });
        }
      });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field change with validation
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    handleChangeSearch(e);

    // Clear error when user starts typing/selecting
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Handle form submission with validation
  const handleFormSubmit = async () => {
    // Mark all required fields as touched first
    const allRequiredFields = [
      ...textFields.filter((f) => f.required).map((f) => f.id),
      ...selectFields.filter((f) => f.required).map((f) => f.id),
    ];
    const newTouched = {};
    allRequiredFields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Force a re-render before validation
    setTimeout(() => {
      if (validateForm()) {
        handleSubmit();
      } else {
        Toast({
          message: t("OKRLibraryTab.Validation.FillRequiredFields"),
          time: 4000,
          type: "error",
        });
      }
    }, 0);
  };

  // Handle select field change with validation
  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    // Special handling for eligibility group - extract employees
    if (name === "eligibilityGroup") {
      const selectedGroup = eligibilityGroups.find(
        (item) => item.value === value
      );
      const activeGroupMembers = selectedGroup?.activeGroupMembers || [];

      const processedMembers = activeGroupMembers.map((item) => ({
        key:
          `${item.personalInformation?.firstName || ""} ${
            item.personalInformation?.lastName || ""
          }`.trim() ||
          item.name ||
          t("OKRLibraryTab.NotAvailable"),
        value: item._id,
        profilePicture:
          item.personalInformation?.profilePicture || item.profilePicture,
        role: item.employmentInformation?.role || item.role,
      }));

      setEmployeesDetails(processedMembers);
    }

    handleChangeSearch(e);

    // Clear error when user selects an option
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <Box sx={{ borderRadius: 4 }}>
      {/* Validation Error Summary */}

      {/* Section: Top Fields */}
      <Box
        sx={{ mb: 4, background: "#fff", p: isMobile ? 2 : 4, borderRadius: 4 }}
      >
        <Grid container spacing={3}>
          {textFields.slice(0, 1).map((field) => (
            <Grid item xs={12} md={6} key={field.id}>
              <InputTextComponent
                id={field.id}
                name={field.id}
                label={field.label}
                value={roleData[field.id]}
                onChange={handleFieldChange}
                type={field.type}
                required={field.required}
              />
              {touched[field.id] && errors[field.id] && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, display: "block", fontSize: "12px" }}
                >
                  {errors[field.id]}
                </Typography>
              )}
            </Grid>
          ))}
          {selectFields.slice(0, 3).map((field) => (
            <Grid item xs={12} md={6} key={field.id}>
              <SelectComponent
                id={field.id}
                name={field.id}
                label={field.label}
                value={roleData[field.id]}
                options={field.options}
                onChange={handleSelectChange}
                required={field.required}
              />
              {touched[field.id] && errors[field.id] && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, display: "block", fontSize: "12px" }}
                >
                  {errors[field.id]}
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Section: Reward Points */}
      <Box
        sx={{ mb: 4, background: "#fff", p: isMobile ? 2 : 4, borderRadius: 4 }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {t("OKRLibraryTab.Sections.RewardPoints")}
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              label: t("OKRLibraryTab.RewardPoints.Bronze"),
              value,
              setValue,
              name: "rewardPoints",
              color: "#e57373",
            },
            {
              label: t("OKRLibraryTab.RewardPoints.Silver"),
              value: value2,
              setValue: setValue2,
              name: "rewardPoints2",
              color: "#ffd600",
            },
            {
              label: t("OKRLibraryTab.RewardPoints.Gold"),
              value: value3,
              setValue: setValue3,
              name: "rewardPoints3",
              color: "#8bc34a",
            },
          ].map((slider, idx) => (
            <Grid item xs={12} md={4} key={slider.name}>
              <Typography variant="subtitle2">{slider.label}</Typography>
              <Typography
                color={getProgressColor(slider.value)}
                sx={{ fontWeight: 600 }}
              >
                {slider.value * 10}
              </Typography>
              <Slider
                value={slider.value}
                min={0}
                max={100}
                onChange={(_, v) => {
                  slider.setValue(v);
                  handleChangeSearch2({
                    target: { name: slider.name, value: v * 10 },
                  });
                }}
                sx={{ color: slider.color, mt: 1 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Section: Achievement */}
      <Box
        sx={{ mb: 4, background: "#fff", p: isMobile ? 2 : 4, borderRadius: 4 }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {t("OKRLibraryTab.Sections.Achievement")}
        </Typography>
        <Grid container spacing={3}>
          {textFields.slice(1).map((field, idx) => (
            <Grid item xs={12} md={6} key={field.id}>
              <InputTextComponent
                id={field.id}
                name={field.id}
                label={field.label}
                value={roleData[field.id]}
                onChange={handleFieldChange}
                type={field.type}
                required={field.required}
              />
              {touched[field.id] && errors[field.id] && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, display: "block", fontSize: "12px" }}
                >
                  {errors[field.id]}
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Section: Eligibility */}
      <Box
        sx={{ mb: 4, background: "#fff", p: isMobile ? 2 : 4, borderRadius: 4 }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {t("OKRLibraryTab.Sections.Eligibility")}
        </Typography>
        <Grid container spacing={3}>
          {selectFields.slice(3).map((field) => (
            <Grid item xs={12} md={6} key={field.id}>
              <SelectComponent
                id={field.id}
                name={field.id}
                label={field.label}
                value={roleData[field.id]}
                options={field.options}
                onChange={handleSelectChange}
                required={field.required}
              />
              {touched[field.id] && errors[field.id] && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, display: "block", fontSize: "12px" }}
                >
                  {errors[field.id]}
                </Typography>
              )}
              {field.id === "eligibilityGroup" && roleData.eligibilityGroup && (
                <Typography
                  component="span"
                  sx={{
                    cursor: "pointer",
                    color: "#827e39",
                    textDecoration: "underline",
                    ml: 1,
                    fontSize: "14px",
                    fontWeight: 500,
                    "&:hover": {
                      color: "#6a6530",
                    },
                  }}
                  onClick={() => setShowEmployees(!showEmployees)}
                >
                  {employeesDetails.length}{" "}
                  {t("OKRLibraryTab.EmployeesSelected")}
                </Typography>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Section: Toggles */}
      <Box
        sx={{ mb: 4, background: "#fff", p: isMobile ? 2 : 4, borderRadius: 4 }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {t("OKRLibraryTab.Sections.Toggles")}
        </Typography>
        <Grid container spacing={2}>
          {checkboxFields.map((field) => (
            <Grid item xs={12} sm={6} md={3} key={field.name}>
              <CustomCheckBoxSwitch
                label={field.label}
                checked={!!roleData[field.name]}
                onChange={() =>
                  handleChangeSearchBoolean({ target: { name: field.name } })
                }
                type="checkbox"
                color="#837F39"
                sx={{ mt: 0, ml: 0 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Section: Actions */}
      <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <CustomButton
          text={t("OKRLibraryTab.Buttons.Cancel")}
          onClick={handleCancel}
          color="#000"
          backgroundColor="#fff"
          border="1px solid #ccc"
          iconExists={true}
          IconProp={() => null}
          sx={{ fontWeight: 500 }}
        />
        <CustomButton
          text={t("OKRLibraryTab.Buttons.Save")}
          onClick={handleFormSubmit}
          color="#fff"
          backgroundColor="#827e39"
          border="1px solid #827e39"
          IconProp={() => null}
          iconExists={true}
          sx={{ fontWeight: 500 }}
        />
      </Box>

      {/* View Employees Popup */}
      {showEmployees && (
        <ViewEmployeesPopup
          employees={employeesDetails}
          show={showEmployees}
          onHide={() => setShowEmployees(!showEmployees)}
        />
      )}
    </Box>
  );
}
