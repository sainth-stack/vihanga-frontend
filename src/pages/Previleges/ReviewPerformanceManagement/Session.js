import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useDispatch } from "react-redux";
import { getAllTemplates } from "action/TemplatesAct";
import useGetEmployees from "pages/Goals/hooks/useGetEmployees";
import {
  deleteSession,
  getAllSessions,
  updateSession,
  createSession,
} from "action/SessionAct";

import { LoadingIndicator } from "utilities";
import GuideLinesTab from "./GuideLinesTab";
import { Link } from "react-router-dom";
import { getAllPrivilegesGroup } from "action/PrivilegesGroupAct";
import axios from "axios";
import { companyId, appURL } from "utilities";

// Import MUI components from vihanga/components
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { MultiSelectComponent } from "pages/vihanga/components/input-elements/multiSelect";
import CustomButton from "pages/vihanga/components/Button/CustomButton";
import ActionDropdown from "pages/vihanga/components/ActionDropdown/ActionDropdown";
import CustomTable from "pages/vihanga/components/CustomTable";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CalibrationManagement from "./calibrationManagement";
import "./style.scss";
import { useTranslation } from "react-i18next";
import { canEdit, canDelete } from "utilities/privilegeHelper";

const SessionTab = () => {
  // Use ref to track component mount status
  const isMountedRef = useRef(true);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [, setRatingScales] = useState([]);
  const [previlegeGroups, setPrivilegeGroups] = useState([]);
  const [previlegeGroupsData, setPrivilegeGroupsData] = useState([]);
  const [data, setData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [dateFilter, setDateFilter] = useState("Date X");
  const [statusFilter, setStatusFilter] = useState("Status All");

  // Pagination state variables
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useDispatch();
  const [templateInfo, setTemplateInfo] = useState({
    templateName: "",
    sessionName: "",
    sessionOwners: "",
    sessionStartDate: null,
    sessionEndDate: null,
    employees: [],
    employeesGroup: "",
    performance: [],
    selectedTemplateRatingScale: [],
    selectedTemplateOverallRating: [],
  });
  const [empData, setEmpData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const {
    data: employeeResponse,
    message,
    success,
    isLoading,
  } = useGetEmployees();

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Safe state update function
  const safeSetState = useCallback((setter, value) => {
    if (isMountedRef.current) {
      setter(value);
    }
  }, []);

  // Function to fetch rating scales from lookups API
  const fetchRatingScaleByName = useCallback(async (ratingScaleName) => {
    try {
      const response = await axios.get(`${appURL}/getLookupsByType`, {
        params: {
          companyId: companyId,
          lookType: ratingScaleName,
        },
      });

      if (response.data && response.data.success && response.data.data) {
        return response?.data?.data?.[0]?.ratingScale || [];
      }

      console.warn(`Rating scale not found for: ${ratingScaleName}`);
      return [];
    } catch (error) {
      console.error(
        `Error fetching rating scale for ${ratingScaleName}:`,
        error
      );
      return [];
    }
  }, []);

  // Memoized employee data processing
  useEffect(() => {
    if (
      !isLoading &&
      employeeResponse &&
      employeeResponse.data &&
      employeeResponse.data.length > 0
    ) {
      const employeeData = employeeResponse.data.map((item) => {
        const obj = {
          key:
            item.personalInformation.firstName +
            " " +
            item.personalInformation.lastName,
          value: item._id,
          role: item.employmentInformation.role,
        };
        obj.label = obj.key;
        return obj;
      });
      safeSetState(setEmpData, employeeData);
    }
  }, [isLoading, employeeResponse, safeSetState]);

  const getTemplates = useCallback(async () => {
    if (!isMountedRef.current) return;

    safeSetState(setLoading, true);
    try {
      const response = dispatch(getAllTemplates());
      const { success, message, data } = await response;

      if (success && isMountedRef.current) {
        console.log("Templates API response:", data);
        const updatedData = data.map((item) => ({
          key: item.templateName,
          value: item._id,
          ratingScale: item.ratingScale || { scores: [] },
          templateName: item.templateName,
          description: item.description,
          displayOptions: item.displayOptions || [],
          displaySteps: item.displaySteps || [],
          isPrimary: item.isPrimary || false,
        }));

        console.log("Updated templates data:", updatedData);

        safeSetState(setTemplates, updatedData);
        safeSetState(setRatingScales, data);
      } else if (isMountedRef.current) {
        console.error("Failed to fetch templates:", message);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      if (isMountedRef.current) {
        safeSetState(setLoading, false);
      }
    }
  }, [dispatch, safeSetState]);

  const getPrevilegeGroups = useCallback(async () => {
    if (!isMountedRef.current) return;

    safeSetState(setLoading, true);
    try {
      const response = dispatch(getAllPrivilegesGroup());
      const { success, message, data } = await response;

      if (success && isMountedRef.current) {
        const { privilegeGroups } = data;
        const updatedData = privilegeGroups.map((item) => ({
          key: item.groupName,
          value: item._id,
        }));
        safeSetState(setPrivilegeGroups, updatedData);
        safeSetState(setPrivilegeGroupsData, privilegeGroups);
      } else if (isMountedRef.current) {
        safeSetState(setPrivilegeGroups, []);
        safeSetState(setPrivilegeGroupsData, []);
      }
    } catch (error) {
      console.error("Error fetching privilege groups:", error);
      if (isMountedRef.current) {
        safeSetState(setPrivilegeGroups, []);
        safeSetState(setPrivilegeGroupsData, []);
      }
    } finally {
      if (isMountedRef.current) {
        safeSetState(setLoading, false);
      }
    }
  }, [dispatch, safeSetState]);

  const getSessions = useCallback(async () => {
    if (!isMountedRef.current) return;

    safeSetState(setLoading, true);
    try {
      const response = dispatch(getAllSessions());
      const { success, message, data } = await response;

      if (success && isMountedRef.current) {
        safeSetState(setData, data || []);
        // Calculate total pages based on data length and rows per page
        safeSetState(
          setTotalPages,
          Math.ceil((data || []).length / rowsPerPage)
        );
      } else if (isMountedRef.current) {
        safeSetState(setData, []);
        safeSetState(setTotalPages, 1);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      if (isMountedRef.current) {
        safeSetState(setData, []);
        safeSetState(setTotalPages, 1);
      }
    } finally {
      if (isMountedRef.current) {
        safeSetState(setLoading, false);
      }
    }
  }, [dispatch, rowsPerPage, safeSetState]);

  const columns = [
    {
      id: "sessionName",
      label: t("SessionTab.Table.Name"),
      sortable: true,
      render: (row) => (
        <Link
          to={"/admin/calibration/" + row._id}
          style={{ color: "#837F39", textDecoration: "none" }}
        >
          {row.sessionName}
        </Link>
      ),
    },
    {
      id: "actions",
      label: t("SessionTab.Table.Action"),
      render: (row) => {
        const actions = [];
        
        if (canEdit()) {
          actions.push({
            label: t("SessionTab.Table.Edit"),
            icon: <EditIcon />,
            onClick: (row) => handleEdit(row),
          });
        }
        
        if (canDelete()) {
          actions.push({
            label: t("SessionTab.Table.Delete"),
            icon: <DeleteIcon />,
            onClick: (row) => handleDelete(row._id),
          });
        }
        
        return actions.length > 0 ? (
          <ActionDropdown
            row={row}
            actions={actions}
          />
        ) : null;
      },
    },
  ];

  const handleEdit = useCallback(
    (row) => {
      console.log("Editing session:", row);
      const obj = {
        ...row,
        sessionStartDate: window
          .moment(row.sessionStartDate)
          .format("YYYY-MM-DD"),
        sessionEndDate: window.moment(row.sessionEndDate).format("YYYY-MM-DD"),
        sessionOwners: row.sessionOwners
          .map((item) => {
            const findEmp = empData.find((emp) => emp.value === item);
            return findEmp;
          })
          .filter(Boolean), // Filter out undefined values
        selectedTemplateRatingScale: [],
        selectedTemplateOverallRating: [],
      };

      // If there's existing performance data with rating scales, extract and store them
      if (
        row.performance &&
        Array.isArray(row.performance) &&
        row.performance.length > 0
      ) {
        const firstPerformance = row.performance[0];
        if (
          firstPerformance.ratingScale &&
          Array.isArray(firstPerformance.ratingScale)
        ) {
          obj.selectedTemplateRatingScale = firstPerformance.ratingScale;
        }
        if (
          firstPerformance.overallFormRating &&
          Array.isArray(firstPerformance.overallFormRating)
        ) {
          obj.selectedTemplateOverallRating =
            firstPerformance.overallFormRating;
        }
      }

      console.log("Mapped session data:", obj);
      setSelectedOwners(obj.sessionOwners);
      setTemplateInfo(obj);
      setShowForm(true);
    },
    [empData]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!isMountedRef.current) return;

      safeSetState(setLoading, true);
      try {
        const response = dispatch(deleteSession(id));
        const { success, message } = await response;

        if (success && isMountedRef.current) {
          await getSessions();
        } else if (isMountedRef.current) {
          alert(message || t("SessionTab.Messages.FailedDelete"));
        }
      } catch (error) {
        console.error("Error deleting session:", error);
        if (isMountedRef.current) {
          alert(t("SessionTab.Messages.ErrorDelete"));
        }
      } finally {
        if (isMountedRef.current) {
          safeSetState(setLoading, false);
        }
      }
    },
    [dispatch, getSessions, safeSetState, t]
  );

  // Initial data fetch
  useEffect(() => {
    if (isMountedRef.current) {
      getTemplates();
      getSessions();
    }
  }, [getTemplates, getSessions]);

  // Fetch privilege groups when form is shown
  useEffect(() => {
    if (showForm && isMountedRef.current) {
      getPrevilegeGroups();
    }
  }, [showForm, getPrevilegeGroups]);

  // Create a stable reference to templates for the handleInput callback
  const templatesRef = useRef(templates);
  useEffect(() => {
    templatesRef.current = templates;
  }, [templates]);

  const handleInput = useCallback(
    async ({ target: { name, value } }) => {
      if (!isMountedRef.current) return;

      // If templateName is changed, fetch the rating scale for the selected template
      if (name === "templateName" && value) {
        try {
          // Find the selected template using the ref to avoid dependency issues
          const selectedTemplate = templatesRef.current.find(
            (template) => template.value === value
          );
          if (
            selectedTemplate &&
            selectedTemplate.ratingScale &&
            typeof selectedTemplate.ratingScale === "string"
          ) {
            console.log(
              `Fetching rating scale for template: ${selectedTemplate.templateName}, rating scale: ${selectedTemplate.ratingScale}`
            );

            // Fetch rating scale data
            const ratingScaleData = await fetchRatingScaleByName(
              selectedTemplate.ratingScale
            );
            console.log(ratingScaleData, "dfsampl3333");
            // Convert to overallFormRating format
            const overallFormRating = ratingScaleData.map((scale) => ({
              rating: scale.code || scale.score,
              ratingLabel: scale.meaning || scale.label,
              distribution: "",
              key: scale.meaning || scale.label,
              label: scale.meaning || scale.label,
              value: scale.code || scale.score,
            }));

            console.log("Fetched rating scale data:", ratingScaleData);
            console.log("Formatted overall rating:", overallFormRating);

            // Update templateInfo with the fetched rating scale data
            if (isMountedRef.current) {
              setTemplateInfo((prev) => ({
                ...prev,
                [name]: value,
                selectedTemplateRatingScale: ratingScaleData,
                selectedTemplateOverallRating: overallFormRating,
              }));
            }
          } else if (isMountedRef.current) {
            setTemplateInfo((prev) => ({
              ...prev,
              [name]: value,
              selectedTemplateRatingScale: [],
              selectedTemplateOverallRating: [],
            }));
          }
        } catch (error) {
          console.error("Error fetching rating scale data:", error);
          // Still update the templateName even if rating scale fetch fails
          if (isMountedRef.current) {
            setTemplateInfo((prev) => ({
              ...prev,
              [name]: value,
              selectedTemplateRatingScale: [],
              selectedTemplateOverallRating: [],
            }));
          }
        }
      } else if (isMountedRef.current) {
        setTemplateInfo((prev) => ({ ...prev, [name]: value }));
      }
    },
    [fetchRatingScaleByName]
  );

  const resetForm = useCallback(() => {
    setTemplateInfo({
      templateName: "",
      sessionName: "",
      sessionOwners: [],
      sessionStartDate: null,
      sessionEndDate: null,
      employees: [],
      employeesGroup: "",
      performance: [],
      selectedTemplateRatingScale: [],
      selectedTemplateOverallRating: [],
    });
    setSelectedOwners([]);
    setShowForm(false);
  }, []);
  const handleSubmit = useCallback(async () => {
    if (!isMountedRef.current) return;

    safeSetState(setLoading, true);

    // Validate required fields
    if (
      !templateInfo.templateName ||
      !templateInfo.sessionName ||
      !templateInfo.sessionStartDate ||
      !templateInfo.sessionEndDate
    ) {
      alert(t("SessionTab.Validation.FillRequiredFields"));
      safeSetState(setLoading, false);
      return;
    }

    try {
      const sessionOwners = selectedOwners.map((item) => item.value);
      const templateData = { ...templateInfo };
      templateData.sessionOwners = sessionOwners;

      // Find the selected privilege group and get its members
      const selectedGroup = previlegeGroupsData.find(
        (item) => item._id === templateInfo.employeesGroup
      );
      if (selectedGroup && selectedGroup.activeGroupMembers) {
        templateData.employees = selectedGroup.activeGroupMembers.map(
          (item) => item._id
        );
      } else {
        templateData.employees = [];
      }

      // Ensure performance data is properly structured with rating scales
      if (templateData.performance && Array.isArray(templateData.performance)) {
        templateData.performance = templateData.performance.map((item) => {
          // Use the stored rating scale data from templateInfo
          const ratingScaleData =
            templateData.selectedTemplateRatingScale || [];
          const overallFormRating =
            templateData.selectedTemplateOverallRating || [];

          return {
            templateName: item.templateName || item.templateId,
            step: item.routingStep || item.step || "Calibration",
            ratingScale: ratingScaleData,
            overallFormRating: overallFormRating,
          };
        });
      }

      console.log("Submitting session data:", templateData);

      const response = dispatch(createSession(templateData));
      const { success, message } = await response;

      if (success && isMountedRef.current) {
        await getSessions();
        resetForm();
      } else if (isMountedRef.current) {
        alert(message || t("SessionTab.Messages.FailedCreate"));
      }
    } catch (error) {
      console.error("Create session error:", error);
      if (isMountedRef.current) {
        alert(t("SessionTab.Messages.ErrorCreate"));
      }
    } finally {
      if (isMountedRef.current) {
        safeSetState(setLoading, false);
      }
    }
  }, [
    templateInfo,
    selectedOwners,
    previlegeGroupsData,
    dispatch,
    getSessions,
    resetForm,
    safeSetState,
    t,
  ]);

  const handleUpdate = useCallback(async () => {
    if (!isMountedRef.current) return;

    safeSetState(setLoading, true);

    // Validate required fields
    if (
      !templateInfo.templateName ||
      !templateInfo.sessionName ||
      !templateInfo.sessionStartDate ||
      !templateInfo.sessionEndDate
    ) {
      alert(t("SessionTab.Validation.FillRequiredFields"));
      safeSetState(setLoading, false);
      return;
    }

    try {
      const id = templateInfo._id;
      const templateData = { ...templateInfo };
      delete templateData.__v;
      delete templateData.createdAt;
      delete templateData.updatedAt;
      delete templateData._id;

      const sessionOwners = selectedOwners.map((item) => item.value);
      templateData.sessionOwners = sessionOwners;

      // Find the selected privilege group and get its members
      const selectedGroup = previlegeGroupsData.find(
        (item) => item._id === templateInfo.employeesGroup
      );
      if (selectedGroup && selectedGroup.activeGroupMembers) {
        templateData.employees = selectedGroup.activeGroupMembers.map(
          (item) => item._id
        );
      } else {
        templateData.employees = [];
      }

      // Ensure performance data is properly structured with rating scales
      if (templateData.performance && Array.isArray(templateData.performance)) {
        templateData.performance = templateData.performance.map((item) => {
          // Use the stored rating scale data from templateInfo
          const ratingScaleData =
            templateData.selectedTemplateRatingScale || [];
          const overallFormRating =
            templateData.selectedTemplateOverallRating || [];

          return {
            templateName: item.templateName || item.templateId,
            step: item.routingStep || item.step || "Calibration",
            ratingScale: ratingScaleData,
            overallFormRating: overallFormRating,
          };
        });
      }

      console.log("Updating session data:", templateData);

      const response = dispatch(updateSession(id, templateData));
      const { success, message } = await response;

      if (success && isMountedRef.current) {
        await getSessions();
        resetForm();
      } else if (isMountedRef.current) {
        alert(message || t("SessionTab.Messages.FailedUpdate"));
      }
    } catch (error) {
      console.error("Update session error:", error);
      if (isMountedRef.current) {
        alert(t("SessionTab.Messages.ErrorUpdate"));
      }
    } finally {
      if (isMountedRef.current) {
        safeSetState(setLoading, false);
      }
    }
  }, [
    templateInfo,
    selectedOwners,
    previlegeGroupsData,
    dispatch,
    getSessions,
    resetForm,
    safeSetState,
    t,
  ]);

  const handleExport = useCallback(() => {
    const exportData = data.map((item) => ({
      Name: item.sessionName,
      "Created Date": item.createdAt,
      Status: item.status || "Active",
    }));

    const csvContent = [
      Object.keys(exportData[0] || {}).join(","),
      ...exportData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sessions_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [data]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleMultiSelectChange = useCallback((e) => {
    if (e.target.value) {
      setSelectedOwners(e.target.value);
    } else {
      setSelectedOwners([]);
    }
  }, []);

  const handlePerformanceChange = useCallback((performance) => {
    if (!isMountedRef.current) return;
    setTemplateInfo((prev) => {
      // Avoid unnecessary updates if performance is the same
      if (JSON.stringify(prev.performance) === JSON.stringify(performance)) {
        return prev;
      }
      return {
        ...prev,
        performance,
      };
    });
  }, []);

  // Memoize templates and performance to prevent unnecessary re-renders
  const memoizedTemplates = useMemo(() => templates, [templates]);
  const memoizedPerformance = useMemo(
    () => templateInfo.performance,
    [templateInfo.performance]
  );

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Section 1: Sessions Overview */}
      <Box
        sx={{
          mb: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
          p: 3,
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#333" }}>
            {t("SessionTab.Title")}
          </Typography>
          {canEdit() && (
            <CustomButton
              text={t("SessionTab.Buttons.Create")}
              backgroundColor="#837F39"
              color="white"
              onClick={() => setShowForm(!showForm)}
              sx={{ minWidth: "120px" }}
            />
          )}
        </Box>

        {/* Session Name Input */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{ color: "#707070", mb: 1, fontWeight: 500 }}
          >
            {t("SessionTab.FormFields.SessionName")}
          </Typography>
          <InputTextComponent
            id="searchKey"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder={t("SessionTab.Placeholders.SearchHere")}
            sx={{ maxWidth: "300px" }}
          />
        </Box>

        {/* Sessions Table */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <LoadingIndicator size={3} />
          </Box>
        ) : (
          <CustomTable
            data={data}
            columns={columns}
            loading={loading}
            search={searchKey}
            setSearch={setSearchKey}
            selectedItems={selectedUsers}
            setSelectedItems={setSelectedUsers}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            totalPages={totalPages}
            pagination={true}
            sx={{
              tableSx: {
                border: "1px solid #E9EAEC",
                borderRadius: "10px",
              },
              headerSx: {
                backgroundColor: "#F8F9FA",
              },
              rowSx: {
                "&:hover": {
                  backgroundColor: "#F8F9FA",
                },
              },
            }}
          />
        )}
      </Box>

      {/* Section 2: Define The Sessions Details */}
      {showForm && (
        <Box
          sx={{
            mb: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
            p: 3,
            boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 600, color: "#333" }}
          >
            {t("SessionTab.FormTitle")}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#707070", mb: 1, fontWeight: 500 }}
                >
                  {t("SessionTab.FormFields.Template")}
                </Typography>
                <SelectComponent
                  id="templateName"
                  placeholder={t("SessionTab.Placeholders.SelectTemplate")}
                  options={memoizedTemplates}
                  value={templateInfo.templateName}
                  onChange={handleInput}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#707070", mb: 1, fontWeight: 500 }}
                >
                  {t("SessionTab.FormFields.SessionName")}
                </Typography>
                <InputTextComponent
                  id="sessionName"
                  name="sessionName"
                  placeholder={t("SessionTab.Placeholders.EnterSessionName")}
                  value={templateInfo.sessionName}
                  onChange={handleInput}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#707070", mb: 1, fontWeight: 500 }}
                >
                  {t("SessionTab.FormFields.SessionStartDate")}
                </Typography>
                <InputTextComponent
                  id="sessionStartDate"
                  name="sessionStartDate"
                  type="date"
                  value={templateInfo.sessionStartDate}
                  onChange={handleInput}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#707070", mb: 1, fontWeight: 500 }}
                >
                  {t("SessionTab.FormFields.SessionEndDate")}
                </Typography>
                <InputTextComponent
                  id="sessionEndDate"
                  name="sessionEndDate"
                  type="date"
                  value={templateInfo.sessionEndDate}
                  onChange={handleInput}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#707070", mb: 1, fontWeight: 500 }}
                >
                  {t("SessionTab.FormFields.SessionOwners")}
                </Typography>
                <MultiSelectComponent
                  id="sessionOwners"
                  placeholder={t("SessionTab.Placeholders.SelectSessionOwners")}
                  options={empData}
                  value={selectedOwners}
                  onChange={handleMultiSelectChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#707070", mb: 1, fontWeight: 500 }}
                >
                  {t("SessionTab.FormFields.EmployeeGroup")}
                </Typography>
                <SelectComponent
                  id="employeesGroup"
                  placeholder={t("SessionTab.Placeholders.SelectEmployeeGroup")}
                  options={previlegeGroups}
                  value={templateInfo.employeesGroup}
                  onChange={handleInput}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Section 3: GuideLinesTab */}
      {showForm && (
        <Box
          sx={{
            borderRadius: 2,
            backgroundColor: "#fff",
            p: 3,
            boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
          }}
        >
          {console.log(
            "Session component - templates being passed:",
            memoizedTemplates
          )}
          {console.log(
            "Session component - templateInfo.performance:",
            memoizedPerformance
          )}
          <GuideLinesTab
            templates={memoizedTemplates}
            performance={memoizedPerformance}
            setTemplateInfo={handlePerformanceChange}
          />

          <Divider sx={{ my: 3 }} />

          <CalibrationManagement
            templates={memoizedTemplates}
            performance={memoizedPerformance}
            setTemplateInfo={handlePerformanceChange}
          />

          {canEdit() && (
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <CustomButton
                text={t("SessionTab.Buttons.Cancel")}
                backgroundColor="white"
                color="#707070"
                border="1px solid #E9EAEC"
                onClick={() => setShowForm(false)}
              />
              <CustomButton
                text={
                  !!templateInfo._id
                    ? t("SessionTab.Buttons.Update")
                    : t("SessionTab.Buttons.Save")
                }
                backgroundColor="#837F39"
                color="white"
                onClick={!!templateInfo._id ? handleUpdate : handleSubmit}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SessionTab;
