import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Typography,
  Checkbox,
  FormGroup,
  FormLabel,
} from "@mui/material";

import CustomRadio from "pages/vihanga/components/CustomRadio";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import React, { useEffect, useState, useCallback } from "react";
import EligibilityTable from "./EligibilityTable";
import axios from "axios";
import { Toast } from "service/toast";
import { appURL, removeDuplicates } from "utilities";
import { getDesignations } from "action/DesignationAct";
import { getDepartmentsData } from "action/DepartmentAct";
import { useDispatch } from "react-redux";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { useTranslation } from "react-i18next";
import { canEdit } from "utilities/privilegeHelper";

const EligibilityCriteria = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [jobRolesOptions, setJobRolesOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [eligibilityOptions, setEligibilityOptions] = useState([]);
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);

  const [formData, setFormData] = useState({
    eligibilityName: "",
    lengthOfService: "",
    lengthOfServiceExclusions: {
      excludePublicHolidays: false,
      excludeLeaves: false,
      excludeWeekends: false,
    },
    jobName: "",
    gender: "",
    grade: "",
    maritalStatus: "",
    location: "",
    probationPeriod: "",
    noticePeriod: "",
    personType: "",
    religion: "",
    position: "",
    age: "",
    hireDate: "",
    department: "",
    workType: "",
  });

  // ----------- Fetch Candidate Options -----------
  useEffect(() => {
    const fetchCandidateOptions = async () => {
      setLoadingEligibility(true);
      setError(null);
      try {
        const response = await axios.get(`${appURL}/recruitment/candidates`, {
          headers: { "Content-Type": "application/json" },
        });

        const candidateData = response.data.data.data || [];

        const uniqueDesignations = [
          ...new Set(
            candidateData.map((item) => item.designation).filter(Boolean)
          ),
        ];
        const designationOptions = uniqueDesignations.map((designation) => ({
          label: designation,
          value: designation,
        }));

        const uniqueDepartments = [
          ...new Set(
            candidateData.map((item) => item.department).filter(Boolean)
          ),
        ];
        const departmentOptions = uniqueDepartments.map((department) => ({
          label: department,
          value: department,
        }));

        const eligibilityOptions = candidateData.map((item) => ({
          label: item.eligibilityName || item.candidateName,
          value: item.eligibilityName || item.candidateId,
        }));

        setEligibilityOptions(eligibilityOptions);
      } catch (err) {
        console.error("Fetch Candidate Options Error:", err);
        setError(
          err.response?.data?.message ||
            t("EligibilityCriteria.Messages.FailedFetchCandidates")
        );
        Toast({
          message:
            err.response?.data?.message ||
            t("EligibilityCriteria.Messages.FailedFetchCandidates"),
          type: "error",
        });
      } finally {
        setLoadingEligibility(false);
      }
    };

    fetchCandidateOptions();
  }, [t]);

  // ----------- Job Categories (Static) -----------
  const jobCategories = [
    { key: "all", label: t("EligibilityCriteria.Options.All"), value: "all" },
    {
      key: "Operations",
      label: t("EligibilityCriteria.Options.Operations"),
      value: "Operations",
    },
    {
      key: "Supervisor",
      label: t("EligibilityCriteria.Options.Supervisor"),
      value: "Supervisor",
    },
    {
      key: "Managerial",
      label: t("EligibilityCriteria.Options.Managerial"),
      value: "Managerial",
    },
    {
      key: "Executive Leadership",
      label: t("EligibilityCriteria.Options.ExecutiveLeadership"),
      value: "Executive Leadership",
    },
    {
      key: "Director",
      label: t("EligibilityCriteria.Options.Director"),
      value: "Director",
    },
  ];

  // ----------- Fetch Departments -----------
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
          const result = data[0].departments
            .filter((item) => item.status === "Active")
            .map((item) => ({
              value: item.departmentName,
              label: item.departmentName,
              key: item.departmentName,
            }));
          setDepartmentOptions([
            {
              key: "all",
              label: t("EligibilityCriteria.Options.All"),
              value: "all",
            },
            ...removeDuplicates(result, "value"),
          ]);

          const result2 = data[0].grades
            .filter((item) => item.status === "Active")
            .map((item) => ({
              value: item.gradeName,
              label: item.gradeName,
              key: item.gradeName,
            }));
          setGrades([
            {
              key: "all",
              label: t("EligibilityCriteria.Options.All"),
              value: "all",
            },
            ...removeDuplicates(result2, "value"),
          ]);

          setError("");
        } else if (data.length === 0) {
          setError(t("EligibilityCriteria.Messages.NoDataFound"));
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

  // ----------- Fetch Designations -----------
  const fetchDesignations = () => {
    try {
      setLoading(true);
      let response = dispatch(getDesignations());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          const result = data
            .filter((item) => item.status === "Active")
            .map((item) => ({
              value: item.designationName,
              label: item.designationName,
              key: item.designationName,
            }));
          setPositionOptions([
            {
              key: "all",
              label: t("EligibilityCriteria.Options.All"),
              value: "all",
            },
            ...removeDuplicates(result, "value"),
          ]);
          setError("");
        } else if (data.length === 0) {
          setError(t("EligibilityCriteria.Messages.NoDataFound"));
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

  useEffect(() => {
    setJobRolesOptions(jobCategories);
    fetchDepartments();
    fetchDesignations();
  }, [t]);

  // ----------- Options for Form Fields -----------
  const locationOptions = [
    { label: t("EligibilityCriteria.Options.All"), value: "all" },
    { label: t("EligibilityCriteria.Options.Location.USA"), value: "usa" },
    { label: t("EligibilityCriteria.Options.Location.India"), value: "india" },
    { label: t("EligibilityCriteria.Options.Location.UK"), value: "uk" },
  ];

  const noticePeriodOptions = [
    { label: t("EligibilityCriteria.Options.All"), value: "all" },
    { label: "15 days", value: "15" },
    { label: "30 days", value: "30" },
    { label: "45 days", value: "45" },
    { label: "60 days", value: "60" },
  ];

  const personTypeOptions = [
    { label: t("EligibilityCriteria.Options.All"), value: "all" },
    { label: t("EligibilityCriteria.Options.PersonType.EMP"), value: "emp" },
    {
      label: t("EligibilityCriteria.Options.PersonType.Contractor"),
      value: "contractor",
    },
    {
      label: t("EligibilityCriteria.Options.PersonType.Intern"),
      value: "intern",
    },
  ];

  const religionOptions = [
    { label: t("EligibilityCriteria.Options.All"), value: "all" },
    { label: t("EligibilityCriteria.Options.Religion.Hindu"), value: "hindu" },
    {
      label: t("EligibilityCriteria.Options.Religion.Muslim"),
      value: "muslim",
    },
    {
      label: t("EligibilityCriteria.Options.Religion.Christian"),
      value: "christian",
    },
    { label: t("EligibilityCriteria.Options.Religion.Sikh"), value: "sikh" },
    {
      label: t("EligibilityCriteria.Options.Religion.Buddhist"),
      value: "buddhist",
    },
    { label: t("EligibilityCriteria.Options.Religion.Jain"), value: "jain" },
    { label: t("EligibilityCriteria.Options.Religion.Other"), value: "other" },
  ];

  const workTypeOptions = [
    {
      label: t("EligibilityCriteria.Options.WorkType.FullTime"),
      value: "full_time",
    },
    {
      label: t("EligibilityCriteria.Options.WorkType.PartTime"),
      value: "part_time",
    },
  ];

  // ----------- Form Fields -----------
  const formFields = [
    {
      id: "eligibilityName",
      label: (
        <>
          {t("EligibilityCriteria.FormFields.EligibilityName")}{" "}
          <span style={{ color: "red" }}>*</span>
        </>
      ),
      type: "text",
      component: "input",
    },
    {
      id: "age",
      label: t("EligibilityCriteria.FormFields.Age"),
      type: "text",
      component: "input",
    },
    {
      id: "lengthOfService",
      label: t("EligibilityCriteria.FormFields.LengthOfService"),
      type: "text",
      component: "input",
    },
    {
      id: "jobName",
      label: t("EligibilityCriteria.FormFields.JobCategory"),
      component: "select",
      options: jobRolesOptions,
    },
    {
      id: "gender",
      label: t("EligibilityCriteria.FormFields.Gender"),
      component: "radio",
      options: [
        { label: t("EligibilityCriteria.Options.Gender.Male"), value: "male" },
        {
          label: t("EligibilityCriteria.Options.Gender.Female"),
          value: "female",
        },
      ],
    },
    {
      id: "grade",
      label: t("EligibilityCriteria.FormFields.Grade"),
      component: "select",
      options: grades,
    },

    {
      id: "maritalStatus",
      label: t("EligibilityCriteria.FormFields.MaritalStatus"),
      component: "radio",
      options: [
        {
          label: t("EligibilityCriteria.Options.MaritalStatus.Married"),
          value: "married",
        },
        {
          label: t("EligibilityCriteria.Options.MaritalStatus.Unmarried"),
          value: "unmarried",
        },
      ],
    },
    {
      id: "location",
      label: t("EligibilityCriteria.FormFields.Location"),
      component: "select",
      options: locationOptions,
    },
    {
      id: "probationPeriod",
      label: t("EligibilityCriteria.FormFields.ProbationPeriod"),
      component: "radio",
      options: [
        { label: t("EligibilityCriteria.Options.Yes"), value: "yes" },
        { label: t("EligibilityCriteria.Options.No"), value: "no" },
      ],
    },
    {
      id: "noticePeriod",
      label: t("EligibilityCriteria.FormFields.NoticePeriod"),
      component: "select",
      options: noticePeriodOptions,
    },
    {
      id: "personType",
      label: t("EligibilityCriteria.FormFields.PersonType"),
      component: "select",
      options: personTypeOptions,
    },
    {
      id: "religion",
      label: t("EligibilityCriteria.FormFields.Religion"),
      component: "select",
      options: religionOptions,
    },
    {
      id: "position",
      label: t("EligibilityCriteria.FormFields.Position"),
      component: "select",
      options: positionOptions,
    },
    {
      id: "hireDate",
      label: t("EligibilityCriteria.FormFields.HireDate"),
      type: "date",
      component: "input",
    },
    {
      id: "department",
      label: t("EligibilityCriteria.FormFields.Department"),
      component: "select",
      options: departmentOptions,
    },
    {
      id: "workType",
      label: t("EligibilityCriteria.FormFields.WorkType"),
      component: "radio",
      options: workTypeOptions,
      sx: { marginBottom: "-15px" },
    },
  ];

  // ----------- Buttons -----------
  const buttonConfigs = [
    {
      label: t("EligibilityCriteria.Buttons.Cancel"),
      type: "button",
      variant: "contained",
      sx: {
        backgroundColor: "#FFFFFF",
        color: "#847F3B",
        fontFamily: "Work Sans",
        fontWeight: "500",
        borderRadius: "20px",
        "&:hover": { backgroundColor: "#FFFFFF" },
        "&:active": { backgroundColor: "#FFFFFF" },
      },
      onClick: () => setFormData({}),
    },
    {
      label: formData._id
        ? t("EligibilityCriteria.Buttons.Update")
        : t("EligibilityCriteria.Buttons.Submit"),
      type: "submit",
      variant: "contained",
      sx: {
        backgroundColor: "#837F39",
        color: "#FFFFFF",
        fontFamily: "Work Sans",
        fontWeight: "500",
        borderRadius: "20px",
        "&:hover": { backgroundColor: "#837F39" },
        "&:active": { backgroundColor: "#837F39" },
      },
      disabled: isSubmitting,
    },
  ];

  // ----------- Input Validation -----------
  const validateInputFormat = (value, fieldName) => {
    if (fieldName === t("EligibilityCriteria.FormFields.EligibilityName")) {
      if (!value || value.trim() === "") {
        Toast({
          message: t("EligibilityCriteria.Validation.Required", {
            field: fieldName,
          }),
          type: "error",
        });
        return false;
      }
      return true;
    }
    if (!value) {
      Toast({
        message: t("EligibilityCriteria.Validation.CannotBeEmpty", {
          field: fieldName,
        }),
        type: "error",
      });
      return false;
    }
    const stringValue = String(value).trim();
    const operatorPattern = /[><=]/;
    if (!operatorPattern.test(stringValue)) {
      Toast({
        message: t("EligibilityCriteria.Validation.InvalidSymbols", {
          field: fieldName,
        }),
        type: "error",
      });
      return false;
    }
    return true;
  };

  // ----------- Input Change -----------
  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    if (fieldName === "lengthOfService" || fieldName === "age") {
      if (value === "" || validateInputFormat(value, fieldName)) {
        setFormData({ ...formData, [fieldName]: value });
      }
    } else {
      setFormData({ ...formData, [fieldName]: value });
    }
  };

  // ----------- Handle Edit -----------
  const handleEdit = useCallback((selectedRow) => {
    setFormData({
      _id: selectedRow._id || "",
      eligibilityName: selectedRow.eligibilityName || "",
      age: selectedRow.age || "",
      lengthOfService: selectedRow.lengthOfService || "",
      lengthOfServiceExclusions: {
        excludePublicHolidays: selectedRow.lengthOfServiceExclusions?.excludePublicHolidays || false,
        excludeLeaves: selectedRow.lengthOfServiceExclusions?.excludeLeaves || false,
        excludeWeekends: selectedRow.lengthOfServiceExclusions?.excludeWeekends || false,
      },
      jobName: selectedRow.jobName || "",
      gender: selectedRow.gender || "",
      grade: selectedRow.grade || "",
      maritalStatus: selectedRow.maritalStatus || "",
      location: selectedRow.location || "",
      probationPeriod: selectedRow.probationPeriod || "",
      noticePeriod: selectedRow.noticePeriod || "",
      personType: selectedRow.personType || "",
      religion: selectedRow.religion || "",
      position: selectedRow.position || "",
      hireDate: selectedRow.hireDate || "",
      department: selectedRow.department || "",
      workType: selectedRow.workType || "",
    });
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ----------- Handle Submit -----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validateInputFormat(
        formData.eligibilityName,
        t("EligibilityCriteria.FormFields.EligibilityName")
      )
    )
      return;
    if (!formData || Object.keys(formData).length === 0) {
      Toast({
        message: t("EligibilityCriteria.Validation.FillDetails"),
        type: "error",
      });
      return;
    }
    if (
      formData.lengthOfService &&
      !validateInputFormat(
        formData.lengthOfService,
        t("EligibilityCriteria.FormFields.LengthOfService")
      )
    )
      return;
    if (
      formData.age &&
      !validateInputFormat(
        formData.age,
        t("EligibilityCriteria.FormFields.Age")
      )
    )
      return;

    setIsSubmitting(true);
    setError(null);

    try {
      const isEditMode = Boolean(formData._id);
      const url = isEditMode
        ? `${appURL}/recruitment/eligibility-criteria?id=${formData._id}`
        : `${appURL}/recruitment/eligibility-criteria`;

      const method = isEditMode ? "put" : "post";
      const companyId = getItemFromLocalStorage("companyId");

      const payload = isEditMode ? formData : { ...formData, companyId };
      const response = await axios[method](url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      Toast({
        message:
          response?.data?.message ||
          (isEditMode
            ? t("EligibilityCriteria.Messages.SuccessUpdate")
            : t("EligibilityCriteria.Messages.SuccessCreate")),
        type: "success",
      });

      setFormData({});
      setRefreshTable((prev) => !prev);
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err.response?.data?.message ||
          t("EligibilityCriteria.Messages.ErrorSubmit")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------- Render Component -----------
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
                marginBottom: "1rem",
                marginLeft: "-17px",
              }}
            >
              {t("EligibilityCriteria.Title")}
            </Typography>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Grid container spacing={2}>
            {formFields.map((field) => (
              <React.Fragment key={field.id}>
                <Grid item xs={12} md={6}>
                  {field.component === "input" ? (
                    <InputTextComponent
                      id={field.id}
                      name={field.id}
                      label={field.label}
                      type={field.type}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(e, field.id)}
                      disabled={isSubmitting}
                      {...(field.id === "address" && {
                        multiline: true,
                        minRows: 5,
                      })}
                    />
                  ) : field.component === "select" ? (
                    <SelectComponent
                      id={field.id}
                      name={field.id}
                      label={field.label}
                      value={formData[field.id] || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.id]: e.target.value })
                      }
                      options={field.options || []}
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                  ) : null}
                </Grid>
                
                {/* Add exclusion checkboxes after lengthOfService field */}
                {field.id === "lengthOfService" && (
                  <Grid item xs={12} md={6}>
                    <FormLabel component="legend" sx={{ mb: 1, color: "#666", fontSize: "14px" }}>
      {t('EligibilityCriteria.FormFields.ExcludeByDefaultIncludesAll')}
                    </FormLabel>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.lengthOfServiceExclusions?.excludePublicHolidays || false}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lengthOfServiceExclusions: {
                                  ...formData.lengthOfServiceExclusions,
                                  excludePublicHolidays: e.target.checked,
                                },
                              })
                            }
                            disabled={isSubmitting}
                            sx={{ color: "#837F39", "&.Mui-checked": { color: "#837F39" } }}
                          />
                        }
  label={t('EligibilityCriteria.FormFields.PublicHolidays')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.lengthOfServiceExclusions?.excludeLeaves || false}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lengthOfServiceExclusions: {
                                  ...formData.lengthOfServiceExclusions,
                                  excludeLeaves: e.target.checked,
                                },
                              })
                            }
                            disabled={isSubmitting}
                            sx={{ color: "#837F39", "&.Mui-checked": { color: "#837F39" } }}
                          />
                        }
label={t('EligibilityCriteria.FormFields.Leaves')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.lengthOfServiceExclusions?.excludeWeekends || false}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lengthOfServiceExclusions: {
                                  ...formData.lengthOfServiceExclusions,
                                  excludeWeekends: e.target.checked,
                                },
                              })
                            }
                            disabled={isSubmitting}
                            sx={{ color: "#837F39", "&.Mui-checked": { color: "#837F39" } }}
                          />
                        }
label={t('EligibilityCriteria.FormFields.Weekends')}
                      />
                    </FormGroup>
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </Grid>

          {canEdit() && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              {buttonConfigs.map((btn) => (
                <Button
                  key={btn.label}
                  type={btn.type}
                  variant={btn.variant}
                  sx={btn.sx}
                  disabled={btn.disabled}
                  onClick={btn.onClick}
                >
                  {isSubmitting && btn.type === "submit" ? (
                    <CircularProgress size={24} sx={{ color: "#fff" }} />
                  ) : (
                    btn.label
                  )}
                </Button>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <EligibilityTable onEdit={handleEdit} refreshTable={refreshTable} />
    </>
  );
};

export default EligibilityCriteria;
