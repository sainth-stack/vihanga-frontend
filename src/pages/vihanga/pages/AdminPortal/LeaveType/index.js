import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import CustomCheckBoxSwitch from "pages/vihanga/components/CustomCheckSwitch";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { canEdit } from "utilities/privilegeHelper";

import CarryoverRulesPopup from "../EligibilityCriteria/CarryoverRulesPopup";
import LeaveTypeTable from "./LeaveTypeTable";
import { appURL } from "./../../../../../utilities/baseurl";
import axios from "axios";
import { Toast } from "service/toast";
import CustomRadio from "pages/vihanga/components/CustomRadio";

const LeaveType = () => {
  const { t } = useTranslation();
  
  const generateCandidateId = () => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    const rand = Math.floor(Math.random() * 90 + 10); // random 2-digit

    return `${h}${m}${s}${rand}`; // e.g., "10452276"
  };
  const getFinancialYearStartISODate = () => {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const year = month >= 4 ? now.getFullYear() : now.getFullYear() - 1;
    return `${year}-04-01`;
  };
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [eligibilityOptions, setEligibilityOptions] = useState([]);
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    code: generateCandidateId(),
    balanceBasedOn: "",
    unit: "",
    status: "",
    eligibility: "",
    carryOver: {
      carryOverDate: getFinancialYearStartISODate(),
      carryOverExpiry: false,
      maxDays: 0,
    },
    attachmentsRequired: false, // Added this field
    customName: "",
    // Advanced Configuration
    maxLeavesAtOnce: "",
    autoAddLeaves: {
      enabled: false,
      type: "",
      days: "",
      maxElapsedDays: ""
    },
    attachmentRequiredDays: {
      operator: "greater_than_or_equal_to",
      value: ""
    },
    maxAdvanceDays: [],
    maxHalfDays: ""
  });
  const [obj, setSelectedObject] = useState({});
  const unitOptions = [
    { label: ` ${t("LeaveType.Options.Hours")}`, value: "hours" },
    { label: ` ${t("LeaveType.Options.Days")}`, value: "days" },
  ];

  const leaveNameOptions = [
    { label: t("LeaveType.LeaveNames.EarnedLeave"), value: "Earned Leave (EL)" },
    { label: t("LeaveType.LeaveNames.SickLeave"), value: "Sick Leave (SL)" },
    { label: t("LeaveType.LeaveNames.CasualLeave"), value: "Casual Leave (CL)" },
    { label: t("LeaveType.LeaveNames.MaternityLeave"), value: "Maternity Leave (ML)" },
    { label: t("LeaveType.LeaveNames.PaternityLeave"), value: "Paternity Leave (PL)" },
    { label: t("LeaveType.LeaveNames.CompensatoryOff"), value: "Compensatory Off" },
    { label: t("LeaveType.LeaveNames.BereavementLeave"), value: "Bereavement Leave" },
    { label: t("LeaveType.LeaveNames.MarriageLeave"), value: "Marriage Leave" },
    { label: t("LeaveType.LeaveNames.UnpaidLeave"), value: "Unpaid Leave (LWP)" },
    { label: t("LeaveType.LeaveNames.WorkFromHome"), value: "Work From Home (WFH)" },
    { label: t("LeaveType.LeaveNames.Others"), value: "Others" },
  ];

  const statusOptions = [
    { label: t("LeaveType.Options.Active"), value: "active" },
    { label: t("LeaveType.Options.InActive"), value: "inActive" },
  ];

  const autoAddLeaveTypeOptions = [
    { label: t("LeaveType.Options.Monthly"), value: "monthly" },
    { label: t("LeaveType.Options.Yearly"), value: "yearly" },
  ];

  const attachmentOperatorOptions = [
    { label: t("LeaveType.Options.Is"), value: "is" },
    { label: t("LeaveType.Options.LesserOrEqual"), value: "lesser_than_or_equal_to" },
    { label: t("LeaveType.Options.GreaterOrEqual"), value: "greater_than_or_equal_to" },
  ];
  const companyId =
  localStorage.getItem("companyId") !== null
    ? JSON.parse(localStorage.getItem("companyId"))
    : null;
  useEffect(() => {
    
    const fetchEligibilityOptions = async () => {
      setLoadingEligibility(true);
      setError(null);
      try {
        const response = await axios.get(
          `${appURL}/recruitment/eligibility-criteria`,
          {
            responseType: "json",
            
              params: {
                companyId, 
              },
          }
        );
        const eligibilityData = response?.data?.data?.data || [];
        const options = eligibilityData.map((item) => ({
          label: item.eligibilityName,
          value: item.eligibilityName,
          id: item._id,
        }));
        setEligibilityOptions([{ label: t("Select Eligibility"), value: "" },...options]);
      } catch (err) {
        console.error("Fetch Eligibility Error:", err);
        setError(
          err.response?.data?.message || "Failed to fetch eligibility options"
        );
        Toast({
          message:
            err.response?.data?.message ||
            "Failed to fetch eligibility options",
          type: "error",
        });
      } finally {
        setLoadingEligibility(false);
      }
    };

    fetchEligibilityOptions();
  }, []);

  const formFields = [
    {
      id: "name",
      label: t("LeaveType.FormFields.Name"),
      component: "select",
      options: leaveNameOptions,
    },
    {
      id: "icon",
      label: t("LeaveType.FormFields.ImageIcon"),
      type: "file",
      component: "input",
    },
    {
      id: "code",
      label: t("LeaveType.FormFields.Code"),
      type: "number",
      component: "input",
    },
    {
      id: "balanceBasedOn",
      label: t("LeaveType.FormFields.BalanceBasedOn"),
      type: "number",
      component: "input",
    },
    {
      id: "unit",
      label: t("LeaveType.FormFields.Units"),
      component: "radio",
      options: unitOptions,
    },
    {
      id: "status",
      label: t("LeaveType.FormFields.Status"),
      component: "select",
      options: statusOptions,
    },
    {
      id: "eligibility",
      label: t("LeaveType.FormFields.Eligibility"),
      component: "select",
      options: eligibilityOptions,
    },
  ];

  const buttonConfigs = [
    {
      label: t("LeaveType.Buttons.Cancel"),
      type: "button",
      variant: "contained",
      sx: {
        backgroundColor: "#FFFFFF",
        color: "#847F3B",
        fontFamily: "Work Sans",
        fontWeight: "500",
        borderRadius: "20px",
        "&:hover": {
          backgroundColor: "#FFFFFF",
        },
        "&:active": {
          backgroundColor: "#FFFFFF",
        },
      },
      onClick: () => {
        setFormData({
          name: "",
          icon: "",
          code: generateCandidateId(),
          balanceBasedOn: "",
          unit: "",
          status: "",
          eligibility: "",
          carryOver: {
            carryOverDate: getFinancialYearStartISODate(),
            carryOverExpiry: false,
            maxDays: 0,
          },
          attachmentsRequired: false,
          customName: "",
          // Advanced Configuration
          maxLeavesAtOnce: "",
          autoAddLeaves: {
            enabled: false,
            type: "",
            days: "",
            maxElapsedDays: ""
          },
          attachmentRequiredDays: {
            operator: "greater_than_or_equal_to",
            value: ""
          },
          maxAdvanceDays: [],
          maxHalfDays: ""
        });
        setAnchorEl(null);
        setError(null);
      },
    },
    {
      label: formData._id ? t("LeaveType.Buttons.Update") : t("LeaveType.Buttons.Submit"),
      type: "submit",
      variant: "contained",
      sx: {
        backgroundColor: "#837F39",
        color: "#FFFFFF",
        fontFamily: "Work Sans",
        fontWeight: "500",
        borderRadius: "20px",
        "&:hover": {
          backgroundColor: "#837F39",
        },
        "&:active": {
          backgroundColor: "#837F39",
        },
      },
      disabled: isSubmitting,
    },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const checkboxRef = useRef(null);

  const handleCarryoverChange = (event) => {
    const isChecked = event.target.checked;
    setFormData((prev) => ({
      ...prev,
      carryOver: {
        ...prev.carryOver,
        carryOverExpiry: isChecked,
      },
    }));
    setAnchorEl(isChecked ? checkboxRef.current : null);
  };

  const handleAttachmentsRequiredChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      attachmentsRequired: event.target.checked,
    }));
  };

  const handleClosePopup = () => {
    setAnchorEl(null);
    // Just close the popup without resetting carryover data
  };

  const handleCarryoverFormDataChange = (newFormData) => {
    setFormData(newFormData);
  };

  const handleEdit = useCallback((selectedRow) => {
    const isPredefined = leaveNameOptions.some((opt) => opt.value === selectedRow.name);
    const attachmentsRequiredNormalized =
      selectedRow.attachmentsRequired === true ||
      selectedRow.attachmentsRequired === "true" ||
      selectedRow.attachmentsRequired === 1 ||
      selectedRow.attachmentsRequired === "1";
    const normalizedCarryOverDate = (() => {
      const val = selectedRow.carryOver?.carryOverDate;
      if (!val) return getFinancialYearStartISODate();
      if (/^(0[1-9]|1[0-2])$/.test(val)) {
        const year = new Date().getFullYear();
        return `${year}-${val}-01`;
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
      return getFinancialYearStartISODate();
    })();
    setFormData({
      _id: selectedRow._id || "",
      name: isPredefined ? selectedRow.name || "" : "Others",
      icon: selectedRow.icon || "",
      code: selectedRow.code || generateCandidateId(),
      balanceBasedOn: selectedRow.balanceBasedOn || "",
      unit: selectedRow.unit || "",
      status: selectedRow.status || "",
      eligibility: selectedRow.eligibility || "",
      carryOver: {
        carryOverDate: normalizedCarryOverDate,
        carryOverExpiry: selectedRow.carryOver?.carryOverExpiry || false,
        maxDays: selectedRow.carryOver?.maxDays || 0,
      },
      attachmentsRequired: attachmentsRequiredNormalized,
      customName: isPredefined ? "" : (selectedRow.name || ""),
      // Advanced Configuration
      maxLeavesAtOnce: selectedRow.maxLeavesAtOnce || "",
      autoAddLeaves: {
        enabled: selectedRow.autoAddLeaves?.enabled || false,
        type: selectedRow.autoAddLeaves?.type || "",
        days: selectedRow.autoAddLeaves?.days || "",
        maxElapsedDays: selectedRow.autoAddLeaves?.maxElapsedDays || ""
      },
      attachmentRequiredDays: {
        operator: selectedRow.attachmentRequiredDays?.operator || "greater_than_or_equal_to",
        value: selectedRow.attachmentRequiredDays?.value || ""
      },
      maxAdvanceDays: selectedRow.maxAdvanceDays || [],
      maxHalfDays: selectedRow.maxHalfDays || ""
    });
    setError(null);
    // If carryOverExpiry is true, open the popup
    if (selectedRow.carryOver?.carryOverExpiry) {
      setTimeout(() => {
        setAnchorEl(checkboxRef.current);
      }, 100);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData || Object.keys(formData).length === 0) {
      Toast({
        message: "Please fill details before submitting",
        type: "error",
      });
      return;
    }

    if (formData.name === "Others" && !formData.customName?.trim()) {
      Toast({
        message: "Please enter a custom leave name",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append(
        "name",
        formData.name === "Others" ? formData.customName : formData.name
      );
      if (formData.icon instanceof File) {
        formDataToSend.append("icon", formData.icon);
      }
      formDataToSend.append("code", formData.code);
      formDataToSend.append("balanceBasedOn", formData.balanceBasedOn);
      formDataToSend.append("unit", formData.unit);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("eligibility", formData.eligibility);
      formDataToSend.append("carryOverDate", formData.carryOver.carryOverDate);
      formDataToSend.append(
        "carryOverExpiry",
        String(formData.carryOver.carryOverExpiry)
      );
      formDataToSend.append("maxDays", formData.carryOver.maxDays);
      formDataToSend.append("attachmentsRequired", String(formData.attachmentsRequired));
      // Advanced Configuration
      if (formData.maxLeavesAtOnce) {
        formDataToSend.append("maxLeavesAtOnce", formData.maxLeavesAtOnce);
      }
      formDataToSend.append("autoAddLeavesEnabled", String(formData.autoAddLeaves.enabled));
      if (formData.autoAddLeaves.type) {
        formDataToSend.append("autoAddLeavesType", formData.autoAddLeaves.type);
      }
      if (formData.autoAddLeaves.days) {
        formDataToSend.append("autoAddLeavesDays", formData.autoAddLeaves.days);
      }
      if (formData.autoAddLeaves.maxElapsedDays) {
        formDataToSend.append("autoAddLeavesMaxElapsedDays", formData.autoAddLeaves.maxElapsedDays);
      }
      if (formData.attachmentRequiredDays.value) {
        formDataToSend.append("attachmentRequiredOperator", formData.attachmentRequiredDays.operator);
        formDataToSend.append("attachmentRequiredDays", formData.attachmentRequiredDays.value);
      }
      formDataToSend.append("maxAdvanceDays", JSON.stringify(formData.maxAdvanceDays));
      if (formData.maxHalfDays) {
        formDataToSend.append("maxHalfDays", formData.maxHalfDays);
      }
      formDataToSend.append("eligibilityId", obj.id);
      const isEditMode = Boolean(formData._id);
      const url = isEditMode
        ? `${appURL}/recruitment/leave-type?id=${formData._id}`
        : `${appURL}/recruitment/leave-type`;


      if (!isEditMode) {
        formDataToSend.append("companyId", companyId);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios[isEditMode ? "put" : "post"](
        url,
        formDataToSend,
        config
      );

      Toast({
        message:
          response?.data?.message ||
          (isEditMode
            ? "LeaveType updated successfully"
            : "LeaveType created successfully"),
        type: "success",
      });

      setFormData({
        name: "",
        icon: "",
        code: generateCandidateId(),
        balanceBasedOn: "",
        unit: "",
        status: "",
        eligibility: "",
        carryOver: {
          carryOverDate: getFinancialYearStartISODate(),
          carryOverExpiry: false,
          maxDays: 0,
        },
        attachmentsRequired: false,
        customName: "",
        // Advanced Configuration
        maxLeavesAtOnce: "",
        autoAddLeaves: {
          enabled: false,
          type: "",
          days: ""
        },
        attachmentRequiredDays: {
          operator: "greater_than_or_equal_to",
          value: ""
        },
        maxAdvanceDays: [],
        maxHalfDays: ""
      });
      setAnchorEl(null); // Close the carryover popup after successful submission
      setRefreshTable((prev) => !prev);
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = err.response?.data?.message ||
        "An error occurred while submitting the form. Please try again.";
      setError(errorMessage);
      Toast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          margin: "20px",
          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
          height: "auto",
          overflowY: "auto",
        }}
      >
        <Box sx={{ padding: "30px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "8px 16px",
            }}
          >
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "600",
                fontFamily: `"Montserrat"`,
                color: "#0E0E0E",
                marginLeft: "-17px",
              }}
            >
              {t("LeaveType.PageTitle")}
            </Typography>

            {/* <Button
              variant="contained"
              sx={{
                backgroundColor: "#837E3B",
                borderRadius: "2rem",
                padding: "8px 16px",
                textTransform: "none",
                fontWeight: 500,
                fontFamily: `"Work Sans"`,
                fontSize: "20px",
                "&:hover": {
                  backgroundColor: "#6f6b2f",
                },
              }}
            >
              Add Category / Leave Type
            </Button> */}
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {loadingEligibility && (
            <Typography sx={{ mb: 2 }}>
              {t("LeaveType.FileStatus.LoadingEligibility")}
            </Typography>
          )}

          <Grid container spacing={2}>
            {formFields.map((field) => (
              <Grid item xs={12} md={6} key={field.id}>
                {field.component === "input" ? (
                  <>
                    <InputTextComponent
                      sx={{
                        ...(field.id === "code" && {
                          pointerEvents: "none",
                          color: "#555",
                        }),
                      }}
                      id={field.id}
                      name={field.id}
                      label={field.label}
                      type={field.type}
                      {...(field.type === "file" 
                        ? {} 
                        : { value: formData[field.id] || "" }
                      )}
                      onChange={(e) => {
                        if (e.target.name === "icon") {
                          if (e.target.files && e.target.files[0]) {
                            setFormData({ ...formData, icon: e.target.files[0] });
                          }
                        } else {
                          setFormData({
                            ...formData,
                            [field.id]: e.target.value,
                          });
                        }
                      }}
                      disabled={
                        isSubmitting || loadingEligibility || field.id == "code"
                      }
                      {...(field.id === "address" && {
                        multiline: true,
                        minRows: 5,
                      })}
                    />
                    {/* Show current file info for file inputs */}
                    {field.type === "file" && (
                      <Box sx={{ mt: 1, fontSize: "0.875rem", color: "#666" }}>
                        {formData[field.id] instanceof File ? (
                          <Typography variant="caption" sx={{ color: "#4caf50" }}>
                            {t("LeaveType.FileStatus.Selected")} {formData[field.id].name}
                          </Typography>
                        ) : formData[field.id] && typeof formData[field.id] === "string" ? (
                          <Typography variant="caption" sx={{ color: "#2196f3" }}>
                            {t("LeaveType.FileStatus.Current")} {formData[field.id].split('/').pop()}
                          </Typography>
                        ) : (
                          <Typography variant="caption" sx={{ color: "#999" }}>
                            {t("LeaveType.FileStatus.NoFileSelected")}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </>
                ) : field.component === "select" ? (
                  <SelectComponent
                    id={field.id}
                    name={field.id}
                    label={field.label}
                    value={formData[field.id] || ""}
                    onChange={(e) => {
                      const updated = {
                        ...formData,
                        [field.id]: e.target.value,
                      };
                      if (field.id === "eligibility") {
                        updated.eligibilityId = e.target.id;
                      }
                      setFormData(updated);
                    }}
                    setSelectedObject={field.id=="eligibility"?setSelectedObject:()=>{}}
                    options={field.options || []}
                    disabled={isSubmitting || loadingEligibility}
                  />
                ) : field.component === "radio" ? (
                  <CustomRadio
                    label={field.label}
                    name={field.id}
                    options={field.options || []}
                    color="#837F39"
                    direction="row"
                    value={formData[field.id] || ""}
                    onChange={(value) =>
                      setFormData({ ...formData, [field.id]: value })
                    }
                    disabled={isSubmitting || loadingEligibility}
                  />
                ) : null}
              </Grid>
            ))}
            {formData.name === "Others" && (
              <Grid item xs={12} md={6}>
                <InputTextComponent
                  id="customName"
                  name="customName"
                  label={t("LeaveType.FormFields.CustomName")}
                  type="text"
                  value={formData.customName || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customName: e.target.value,
                    })
                  }
                  disabled={isSubmitting || loadingEligibility}
                />
              </Grid>
            )}
          </Grid>

          {/* Advanced Configuration Section */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: "600",
                fontFamily: '"Montserrat"',
                color: "#0E0E0E",
                mb: 2,
                marginLeft: "-17px", // Align with main title
              }}
            >
              {t("LeaveType.AdvancedConfiguration")}
            </Typography>

            {/* Max Leaves At Once */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <InputTextComponent
                  id="maxLeavesAtOnce"
                  name="maxLeavesAtOnce"
                  label={t("LeaveType.AdvancedFields.MaxLeavesAtOnce")}
                  type="number"
                  value={formData.maxLeavesAtOnce || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxLeavesAtOnce: e.target.value,
                    })
                  }
                  disabled={isSubmitting || loadingEligibility}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InputTextComponent
                  id="maxHalfDays"
                  name="maxHalfDays"
                  label={t("LeaveType.AdvancedFields.MaxHalfDays")}
                  type="number"
                  value={formData.maxHalfDays || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxHalfDays: e.target.value,
                    })
                  }
                  disabled={isSubmitting || loadingEligibility}
                  helperText={t("LeaveType.AdvancedFields.MaxHalfDaysHelper")}
                />
              </Grid>
            </Grid>

            {/* Auto Add Leaves */}
            <Box my={2}>
              <CustomCheckBoxSwitch
                type="switch"
                label={t("LeaveType.AdvancedFields.AutoAddLeaves")}
                checked={formData.autoAddLeaves?.enabled || false}
                onChange={(event) => {
                    setFormData((prev) => ({
                      ...prev,
                      autoAddLeaves: {
                        ...prev.autoAddLeaves,
                        enabled: event.target.checked,
                        type: event.target.checked ? prev.autoAddLeaves.type : "",
                        days: event.target.checked ? prev.autoAddLeaves.days : "",
                        maxElapsedDays: event.target.checked ? prev.autoAddLeaves.maxElapsedDays : "",
                      },
                    }));
                }}
              />
            </Box>

            {/* Auto Add Leaves Configuration - Show only when enabled */}
            {formData.autoAddLeaves?.enabled && (
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                  <SelectComponent
                    id="autoAddLeavesType"
                    name="autoAddLeavesType"
                    label={t("LeaveType.AdvancedFields.AddType")}
                    value={formData.autoAddLeaves?.type || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        autoAddLeaves: {
                          ...prev.autoAddLeaves,
                          type: e.target.value,
                        },
                      }))
                    }
                    options={autoAddLeaveTypeOptions}
                    disabled={isSubmitting || loadingEligibility}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InputTextComponent
                    id="autoAddLeavesDays"
                    name="autoAddLeavesDays"
                    label={t("LeaveType.AdvancedFields.NumberOfDaysToAdd")}
                    type="number"
                    value={formData.autoAddLeaves?.days || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        autoAddLeaves: {
                          ...prev.autoAddLeaves,
                          days: e.target.value,
                        },
                      }))
                    }
                    disabled={isSubmitting || loadingEligibility}
                    inputProps={{ step: "0.01", min: "0", placeholder: "e.g. 1.25, 1.5" }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InputTextComponent
                    id="autoAddLeavesMaxElapsedDays"
                    name="autoAddLeavesMaxElapsedDays"
                    label="Max Elapsed Days"
                    type="number"
                    value={formData.autoAddLeaves?.maxElapsedDays || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        autoAddLeaves: {
                          ...prev.autoAddLeaves,
                          maxElapsedDays: e.target.value,
                        },
                      }))
                    }
                    disabled={isSubmitting || loadingEligibility}
                    helperText="Maximum accumulated balance (e.g., 3 for casual leaves)"
                  />
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Max Advance Days Configuration */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: "600",
                fontFamily: '"Montserrat"',
                color: "#0E0E0E",
                mb: 2,
                marginLeft: "-17px", // Align with main title
              }}
            >
              {t("LeaveType.MaxAdvanceDaysConfiguration")}
            </Typography>
            
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "400",
                fontFamily: '"Work Sans"',
                color: "#666",
                mb: 2,
                marginLeft: "-17px",
              }}
            >
              {t("LeaveType.MaxAdvanceDaysDescription")}
            </Typography>

            {formData.maxAdvanceDays.map((rule, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: "8px" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <InputTextComponent
                      id={`minDays_${index}`}
                      name={`minDays_${index}`}
                      label={t("LeaveType.MaxAdvanceFields.MinDays")}
                      type="number"
                      value={rule.minDays}
                      onChange={(e) => {
                        const newRules = [...formData.maxAdvanceDays];
                        newRules[index] = { ...newRules[index], minDays: parseFloat(e.target.value) || 0 };
                        setFormData({ ...formData, maxAdvanceDays: newRules });
                      }}
                      disabled={isSubmitting || loadingEligibility}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <InputTextComponent
                      id={`maxDays_${index}`}
                      name={`maxDays_${index}`}
                      label={t("LeaveType.MaxAdvanceFields.MaxDays")}
                      type="number"
                      value={rule.maxDays}
                      onChange={(e) => {
                        const newRules = [...formData.maxAdvanceDays];
                        newRules[index] = { ...newRules[index], maxDays: e.target.value ? parseFloat(e.target.value) : null };
                        setFormData({ ...formData, maxAdvanceDays: newRules });
                      }}
                      disabled={isSubmitting || loadingEligibility}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <InputTextComponent
                      id={`maxAdvanceDays_${index}`}
                      name={`maxAdvanceDays_${index}`}
                      label={t("LeaveType.MaxAdvanceFields.MaxAdvanceDays")}
                      type="number"
                      value={rule.maxAdvanceDays}
                      onChange={(e) => {
                        const newRules = [...formData.maxAdvanceDays];
                        newRules[index] = { ...newRules[index], maxAdvanceDays: parseFloat(e.target.value) || 0 };
                        setFormData({ ...formData, maxAdvanceDays: newRules });
                      }}
                      disabled={isSubmitting || loadingEligibility}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    {canEdit() && (
                      <Button
                        variant="contained"
                        onClick={() => {
                          const newRules = formData.maxAdvanceDays.filter((_, i) => i !== index);
                          setFormData({ ...formData, maxAdvanceDays: newRules });
                        }}
                        disabled={isSubmitting || loadingEligibility}
                        sx={{
                          backgroundColor: "#dc3545",
                          color: "#FFFFFF",
                          fontFamily: "Work Sans",
                          fontWeight: "500",
                          borderRadius: "20px",
                          textTransform: "none",
                          mt: 1,
                          "&:hover": {
                            backgroundColor: "#c82333",
                          },
                          "&:active": {
                            backgroundColor: "#c82333",
                          },
                        }}
                      >
                        {t("LeaveType.MaxAdvanceFields.RemoveRule")}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ))}

            {canEdit() && (
              <Button
                variant="contained"
                onClick={() => {
                  const newRules = [...formData.maxAdvanceDays, { minDays: 0, maxDays: null, maxAdvanceDays: 1 }];
                  setFormData({ ...formData, maxAdvanceDays: newRules });
                }}
                disabled={isSubmitting || loadingEligibility}
                sx={{
                  backgroundColor: "#837F39",
                  color: "#FFFFFF",
                  fontFamily: "Work Sans",
                  fontWeight: "500",
                  borderRadius: "20px",
                  textTransform: "none",
                  mt: 1,
                  "&:hover": {
                    backgroundColor: "#6f6b2f",
                  },
                  "&:active": {
                    backgroundColor: "#6f6b2f",
                  },
                }}
              >
                {t("LeaveType.MaxAdvanceFields.AddRule")}
              </Button>
            )}
          </Box>

          <Box display="flex" flexDirection="column" sx={{ overflow: "auto" }}>
            <Box my={0.5} ref={checkboxRef}>
              <CustomCheckBoxSwitch
                type="checkbox"
                label={t("LeaveType.Checkboxes.Carryover")}
                checked={formData.carryOver?.carryOverExpiry || false}
                onChange={handleCarryoverChange}
              />
            </Box>
            <CarryoverRulesPopup
              anchorEl={anchorEl}
              handleClose={handleClosePopup}
              formData={formData}
              onFormDataChange={handleCarryoverFormDataChange}
            />
            <Box my={0.5}>
              <CustomCheckBoxSwitch
                type="switch"
                label={t("LeaveType.Checkboxes.AttachmentsRequired")}
                checked={formData.attachmentsRequired || false}
                onChange={handleAttachmentsRequiredChange}
                sx={{ marginLeft: "0" }}
              />
            </Box>
            
            {/* Attachment Required Days - Show only when attachments are enabled */}
            {formData.attachmentsRequired && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "500",
                    fontFamily: '"Montserrat"',
                    color: "#666",
                    mb: 1,
                  }}
                >
                  {t("LeaveType.AttachmentsRequiredConfiguration")}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <SelectComponent
                      id="attachmentRequiredOperator"
                      name="attachmentRequiredOperator"
                      label={t("LeaveType.AttachmentFields.Operator")}
                      value={formData.attachmentRequiredDays?.operator || "greater_than_or_equal_to"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          attachmentRequiredDays: {
                            ...prev.attachmentRequiredDays,
                            operator: e.target.value,
                          },
                        }))
                      }
                      options={attachmentOperatorOptions}
                      disabled={isSubmitting || loadingEligibility}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InputTextComponent
                      id="attachmentRequiredDays"
                      name="attachmentRequiredDays"
                      label={t("LeaveType.AttachmentFields.ValueDays")}
                      type="number"
                      value={formData.attachmentRequiredDays?.value || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          attachmentRequiredDays: {
                            ...prev.attachmentRequiredDays,
                            value: e.target.value,
                          },
                        }))
                      }
                      disabled={isSubmitting || loadingEligibility}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>

          {canEdit() && (
            <Box display="flex" justifyContent="flex-end" gap={2} mt={4} mb={2}>
              {buttonConfigs.map((btn, index) => (
                <Button
                  key={index}
                  type={btn.type}
                  variant={btn.variant}
                  sx={btn.sx}
                  onClick={btn.onClick}
                  disabled={isSubmitting && btn.type === "submit"}
                >
                  {isSubmitting && btn.type === "submit" ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress
                        size={16}
                        thickness={5}
                        sx={{ color: "#ffffff" }}
                      />
                      {t("LeaveType.Buttons.Submitting")}
                    </Box>
                  ) : (
                    btn.label
                  )}
                </Button>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <LeaveTypeTable onEdit={handleEdit} refreshTable={refreshTable} />
    </>
  );
};

export default LeaveType;
