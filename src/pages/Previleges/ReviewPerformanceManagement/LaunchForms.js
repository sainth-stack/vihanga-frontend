import useGetEmployees from "pages/Objectives/hooks/useGetEmployees";
import React, { useMemo, useCallback } from "react";
import { useEffect, useState } from "react";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useDispatch } from "react-redux";
import { getAllTemplates } from "action/TemplatesAct";
import {
  createForm,
  deleteForm,
  getAllForms,
  updateForm,
} from "action/LaunchFormAct";
import {
  createMultipleReviewForm,
  createReviewForm,
} from "action/ReviewFormAct";
import { getAllPrivilegesGroup } from "action/PrivilegesGroupAct";
import ViewEmployeesPopup from "./ViewEmployeesPopup";
import {
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
  Checkbox,
  Grid,
} from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import CustomTable from "pages/vihanga/components/CustomTable";
import ActionDropdown from "pages/vihanga/components/ActionDropdown/ActionDropdown";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { companyId } from "utilities";
import { useTranslation } from "react-i18next";
import { canEdit, canDelete } from "utilities/privilegeHelper";

// Initial state constants
const INITIAL_TEMPLATE_INFO = {
  formType: "",
  formTemplate: "",
  launchDate: null,
  displaySteps: [],
  reviewPeriodStartDate: null,
  reviewPeriodEndDate: null,
  employees: [],
  employeesGroup: "",
  employeesDetails: [],
  templateName: "",
};

const FORM_TYPES = [
  {
    key: "Performance Management",
    value: "Performance Management",
  },
];

export default function LaunchForms() {
  const { t } = useTranslation();
  // State management
  const [templateInfo, setTemplateInfo] = useState(INITIAL_TEMPLATE_INFO);
  const [empData, setEmpData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false);
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [privilegeGroups, setPrivilegeGroups] = useState([]);
  const [privilegeGroupsData, setPrivilegeGroupsData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedRows, setSelectedRows] = useState([]);
  const [templateData, setTemplateData] = useState([]);
  const [formTemplates, setFormTemplates] = useState([]);

  // Flags to prevent unnecessary API calls
  const [isTemplatesLoaded, setIsTemplatesLoaded] = useState(false);
  const [isPrivilegeGroupsLoaded, setIsPrivilegeGroupsLoaded] = useState(false);

  const { data: employeeResponse, isLoading: employeeLoading } =
    useGetEmployees();
  const dispatch = useDispatch();

  // Memoized employee data processing
  const processedEmployeeData = useMemo(() => {
    if (!employeeLoading && employeeResponse?.data?.length > 0) {
      return employeeResponse.data.map((item) => ({
        key: `${item.personalInformation.firstName} ${item.personalInformation.lastName}`,
        value: item._id,
        role: item.employmentInformation.role,
      }));
    }
    return [];
  }, [employeeLoading, employeeResponse]);

  // Update empData when processed data changes
  useEffect(() => {
    if (processedEmployeeData.length > 0) {
      setEmpData(processedEmployeeData);
    }
  }, [processedEmployeeData]);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!searchKey) return data;
    return data.filter((item) =>
      item.templateName?.toLowerCase().includes(searchKey.toLowerCase())
    );
  }, [data, searchKey]);

  // Memoized sorted data
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortOrder]);

  // Update total pages when data changes
  useEffect(() => {
    if (sortedData && rowsPerPage) {
      setTotalPages(Math.ceil(sortedData.length / rowsPerPage));
    }
  }, [sortedData, rowsPerPage]);

  // Memoized paginated data
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, page, rowsPerPage]);

  // Optimized input handler with useCallback
  const handleInput = useCallback(
    ({ target: { name, value } }) => {
      if (name === "employeesGroup") {
        const selectedGroup = privilegeGroupsData.find(
          (item) => item._id === value
        );
        const activeGroupMembers = selectedGroup?.activeGroupMembers || [];

        const processedMembers = activeGroupMembers.map((item) => ({
          key: `${item.personalInformation.firstName} ${item.personalInformation.lastName}`,
          value: item._id,
          profilePicture: item.personalInformation.profilePicture,
          role: item.employmentInformation.role,
        }));

        setTemplateInfo((prev) => ({
          ...prev,
          [name]: value,
          employeesDetails: processedMembers,
        }));
      } else {
        setTemplateInfo((prev) => ({ ...prev, [name]: value }));
      }
    },
    [privilegeGroupsData]
  );

  // Optimized edit handler
  const handleEdit = useCallback((row) => {
    setTemplateInfo(row);
    setShowForm(true);
  }, []);

  // Optimized delete handler
  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm(t("LaunchForms.ConfirmDelete"))) return;

      setLoading(true);
      try {
        const response = await dispatch(deleteForm(id));
        if (response.success) {
          await getLaunchForms();
        }
      } catch (error) {
        console.error("Delete error:", error?.message || error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, t]
  );

  // API call functions
  const getLaunchForms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await dispatch(getAllForms());
      if (response.success) {
        setData(response.data || []);
      }
    } catch (error) {
      console.error("Get launch forms error:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const getTemplates = useCallback(async () => {
    if (isTemplatesLoaded) return; // Prevent unnecessary API calls

    setLoading(true);
    try {
      const response = await dispatch(getAllTemplates());
      if (response.success) {
        const updatedData = (response.data || []).map((item) => ({
          key: item.templateName,
          value: item._id,
        }));
        setTemplateData(response.data || []);
        setFormTemplates(updatedData);
        setIsTemplatesLoaded(true);
      }
    } catch (error) {
      console.error("Get templates error:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, isTemplatesLoaded]);

  const getPrivilegeGroups = useCallback(async () => {
    if (isPrivilegeGroupsLoaded) return; // Prevent unnecessary API calls

    setLoading(true);
    try {
      const response = await dispatch(getAllPrivilegesGroup());
      if (response.success) {
        const { privilegeGroups = [] } = response.data || {};
        const updatedData = privilegeGroups.map((item) => ({
          key: item.groupName,
          value: item._id,
        }));
        setPrivilegeGroups(updatedData);
        setPrivilegeGroupsData(privilegeGroups);
        setIsPrivilegeGroupsLoaded(true);
      }
    } catch (error) {
      console.error("Get privilege groups error:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, isPrivilegeGroupsLoaded]);

  // Form submission handlers
  const createReviewFormData = useCallback(
    (employees, finData) => {
      return employees.map((employee) => {
        const managerId = employeeResponse?.data?.find(
          (item) => item._id === employee
        );
        const employeeName = empData?.find((item) => item?.value === employee);

        return {
          employeeName:
            finData[0]?.label === t("LaunchForms.Submit") ? employee : "",
          employeeId: employee,
          employeeFullName: employeeName?.key || "",
          employeeRole: managerId?.employmentInformation?.role || "",
          reviewPeriod: templateInfo.reviewPeriodStartDate,
          totalAchievement: "0",
          overallRating: "0",
          goals: [],
          startDate: templateInfo.reviewPeriodStartDate,
          endDate: templateInfo.reviewPeriodEndDate,
          competencies: [],
          managerId:
            JSON.parse(localStorage.getItem("companyId")) ===
            "65901f8a16fcb600093e8f89"
              ? ""
              : managerId?.employmentInformation?.lineManager || "",
          managerName: "",
          attachment: "",
          status: finData[0]?.label || t("LaunchForms.Submit"),
          templateName: templateInfo.templateName,
          templateId: templateInfo.formTemplate,
          companyId: localStorage.getItem("companyId")
            ? JSON.parse(localStorage.getItem("companyId"))
            : null,
        };
      });
    },
    [employeeResponse, empData, templateInfo, t]
  );

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const selectedGroup = privilegeGroupsData?.find(
        (item) => item._id === templateInfo.employeesGroup
      );
      const activeGroupMembers = selectedGroup?.activeGroupMembers || [];

      const employees = activeGroupMembers.map((item) => item._id);
      const templateName =
        formTemplates?.find((item) => item.value === templateInfo.formTemplate)
          ?.key || "";

      const displaySteps =
        templateData.find((item) => item._id === templateInfo?.formTemplate)
          ?.displaySteps || [];

      const finData = displaySteps
        .filter((item) => item.isChecked)
        .map((item, index) => ({
          id: index,
          label: item.value,
        }));

      const formData = {
        ...templateInfo,
        employees,
        templateName,
        displaySteps,
        companyId,
      };

      const response = await dispatch(createForm(formData));
      if (response.success) {
        const reqBody = createReviewFormData(employees, finData);
        const reviewResponse = await dispatch(
          createMultipleReviewForm(reqBody)
        );

        if (reviewResponse.success) {
          await getLaunchForms();
          setTemplateInfo(INITIAL_TEMPLATE_INFO);
          setShowForm(false);
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  }, [
    templateInfo,
    privilegeGroupsData,
    formTemplates,
    templateData,
    createReviewFormData,
    dispatch,
    getLaunchForms,
  ]);

  const handleUpdate = useCallback(async () => {
    setLoading(true);
    try {
      const id = templateInfo._id;
      const selectedGroup = privilegeGroupsData.find(
        (item) => item._id === templateInfo.employeesGroup
      );
      const activeGroupMembers = selectedGroup?.activeGroupMembers || [];

      const employees = activeGroupMembers.map((item) => item._id);
      const templateName =
        formTemplates.find((item) => item.value === templateInfo.formTemplate)
          ?.key || "";

      const displaySteps = templateInfo?.displaySteps || [];
      const finData = displaySteps
        .filter((item) => item.isChecked)
        .map((item, index) => ({
          id: index,
          label: item.value,
        }));

      // Clean up the template info object
      const updateData = { ...templateInfo };
      delete updateData.__v;
      delete updateData.createdAt;
      delete updateData.updatedAt;
      delete updateData._id;

      updateData.employees = employees;
      updateData.templateName = templateName;
      updateData.companyId = companyId;

      const response = await dispatch(updateForm(id, updateData));
      if (response.success) {
        const reqBody = createReviewFormData(employees, finData);
        const reviewResponse = await dispatch(createReviewForm(reqBody));

        if (reviewResponse.success) {
          await getLaunchForms();
          setTemplateInfo(INITIAL_TEMPLATE_INFO);
          setShowForm(false);
        }
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  }, [
    templateInfo,
    privilegeGroupsData,
    formTemplates,
    createReviewFormData,
    dispatch,
    getLaunchForms,
  ]);

  // Row selection handlers
  const handleSelectRow = useCallback((id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  }, []);

  const handleSort = useCallback(
    (field) => {
      const isAsc = sortField === field && sortOrder === "asc";
      setSortOrder(isAsc ? "desc" : "asc");
      setSortField(field);
    },
    [sortField, sortOrder]
  );

  // Render functions
  const renderHeader = useCallback(
    (label, field) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: 500 }}>{label}</span>
        <SwapVertIcon
          fontSize="small"
          sx={{ cursor: "pointer", color: "#777" }}
          onClick={(e) => {
            e.stopPropagation();
            handleSort(field);
          }}
        />
      </Box>
    ),
    [handleSort]
  );

  // Initial data loading
  useEffect(() => {
    getLaunchForms();
    getTemplates();
  }, []);

  // Load privilege groups only when form is shown
  useEffect(() => {
    if (showForm) {
      getPrivilegeGroups();
    }
  }, [showForm]);

  // Table columns definition
  const columns = useMemo(
    () => [
      {
        id: "select",
        label: (
          <Checkbox
            checked={
              paginatedData.length > 0 &&
              paginatedData.every((row) => selectedRows.includes(row.id))
            }
            indeterminate={
              paginatedData.some((row) => selectedRows.includes(row.id)) &&
              !paginatedData.every((row) => selectedRows.includes(row.id))
            }
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRows([
                  ...selectedRows,
                  ...paginatedData
                    .map((row) => row.id)
                    .filter((id) => !selectedRows.includes(id)),
                ]);
              } else {
                setSelectedRows(
                  selectedRows.filter(
                    (id) => !paginatedData.map((row) => row.id).includes(id)
                  )
                );
              }
            }}
          />
        ),
        render: (row) => (
          <Checkbox
            checked={selectedRows.includes(row.id)}
            onChange={() => handleSelectRow(row.id)}
          />
        ),
      },
      {
        id: "templateName",
        label: renderHeader(t("LaunchForms.Table.Name"), "templateName"),
        render: (row) => row.templateName || "",
      },
      {
        id: "launchDate",
        label: renderHeader(t("LaunchForms.Table.LaunchDate"), "launchDate"),
        render: (row) => row.launchDate || "",
      },
      {
        id: "action",
        label: (
          <span style={{ fontWeight: 500 }}>
            {t("LaunchForms.Table.Action")}
          </span>
        ),
        render: (row) => {
          const actions = [];
          
          if (canEdit()) {
            actions.push({
              label: t("LaunchForms.Table.Edit"),
              icon: <BorderColorIcon fontSize="small" />,
              onClick: () => handleEdit(row),
            });
          }
          
          if (canDelete()) {
            actions.push({
              label: t("LaunchForms.Table.Delete"),
              icon: <DeleteIcon fontSize="small" />,
              onClick: () => handleDelete(row._id),
            });
          }
          
          return actions.length > 0 ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <ActionDropdown
                row={row}
                actions={actions}
              />
            </Stack>
          ) : null;
        },
      },
    ],
    [
      paginatedData,
      selectedRows,
      renderHeader,
      handleSelectRow,
      handleEdit,
      handleDelete,
      t,
    ]
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          sx={{
            fontFamily: "Montserrat",
            fontWeight: 600,
            fontSize: "32px",
          }}
        >
          {t("LaunchForms.Title")}
        </Typography>
        {canEdit() && (
          <Button
            variant="contained"
            onClick={() => setShowForm(!showForm)}
            sx={{
              backgroundColor: "#837F39",
              color: "white",
              borderRadius: "100px",
              "&:hover": {
                backgroundColor: "#837F39",
              },
            }}
          >
            {t("LaunchForms.Buttons.Create")}
          </Button>
        )}
      </Box>

      <Box sx={{ width: "465px" }}>
        <Stack spacing={1}>
          <InputTextComponent
            label={t("LaunchForms.FormFields.LaunchFormName")}
            id="searchKey"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </Stack>
      </Box>

      {loading ? (
        <Box
          sx={{
            m: 2,
            p: 2,
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ mt: 6 }}>
          <CustomTable
            columns={columns}
            data={paginatedData}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            search={searchKey}
            setSearch={setSearchKey}
            totalPages={totalPages}
            pagination
          />
        </Box>
      )}

      {showForm && (
        <Box mt={6} ml={4}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <SelectComponent
                label={t("LaunchForms.FormFields.FormType")}
                key="formType"
                id="formType"
                placeholder={t("LaunchForms.Placeholders.SelectFormType")}
                name="formType"
                value={templateInfo.formType}
                onChange={handleInput}
                options={FORM_TYPES}
                sx={{ width: "465px" }}
              />
            </Grid>

            <Grid item xs={6}>
              <SelectComponent
                label={t("LaunchForms.FormFields.FormTemplate")}
                key="formTemplate"
                id="formTemplate"
                placeholder={t("LaunchForms.Placeholders.SelectFormTemplate")}
                name="formTemplate"
                value={templateInfo.formTemplate}
                onChange={handleInput}
                options={formTemplates}
                sx={{ width: "465px" }}
              />
            </Grid>

            <Grid item xs={6}>
              <InputTextComponent
                type="date"
                label={t("LaunchForms.FormFields.LaunchDate")}
                placeholder={t("LaunchForms.Placeholders.EnterLaunchDate")}
                id="launchDate"
                value={templateInfo.launchDate || ""}
                name="launchDate"
                onChange={handleInput}
                sx={{ width: "465px" }}
              />
            </Grid>

            <Grid item xs={6}>
              <InputTextComponent
                type="date"
                id="reviewPeriodStartDate"
                label={t("LaunchForms.FormFields.ReviewPeriodStartDate")}
                placeholder={t("LaunchForms.Placeholders.EnterStartDate")}
                value={templateInfo.reviewPeriodStartDate || ""}
                name="reviewPeriodStartDate"
                onChange={handleInput}
                sx={{ width: "465px" }}
              />
            </Grid>

            <Grid item xs={6}>
              <InputTextComponent
                type="date"
                id="reviewPeriodEndDate"
                label={t("LaunchForms.FormFields.ReviewPeriodEndDate")}
                placeholder={t("LaunchForms.Placeholders.EnterEndDate")}
                name="reviewPeriodEndDate"
                value={templateInfo.reviewPeriodEndDate || ""}
                onChange={handleInput}
                sx={{ width: "465px" }}
              />
            </Grid>

            <Grid item xs={6}>
              <SelectComponent
                label={t("LaunchForms.FormFields.Employees")}
                key="employeesGroup"
                id="employeesGroup"
                placeholder={t("LaunchForms.Placeholders.SelectFormTemplate")}
                name="employeesGroup"
                value={templateInfo.employeesGroup}
                onChange={handleInput}
                options={privilegeGroups}
                sx={{ width: "465px" }}
              />
              {templateInfo.employeesGroup && (
                <Typography
                  component="span"
                  sx={{
                    cursor: "pointer",
                    color: "primary.main",
                    textDecoration: "underline",
                    ml: 1,
                  }}
                  onClick={() => setShowEmployees(!showEmployees)}
                >
                  {templateInfo.employeesDetails.length}{" "}
                  {t("LaunchForms.EmployeesSelected")}
                </Typography>
              )}
            </Grid>
          </Grid>

          {canEdit() && (
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowForm(false);
                  setTemplateInfo(INITIAL_TEMPLATE_INFO);
                }}
                sx={{
                  backgroundColor: "white",
                  color: "#837F39",
                  border: "1px solid #837F39",
                  borderRadius: "100px",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              >
                {t("LaunchForms.Buttons.Cancel")}
              </Button>

              <Button
                variant="contained"
                onClick={templateInfo._id ? handleUpdate : handleSubmit}
                disabled={loading}
                sx={{
                  backgroundColor: "#837F39",
                  color: "white",
                  borderRadius: "100px",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#837F39",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : templateInfo._id ? (
                  t("LaunchForms.Buttons.Update")
                ) : (
                  t("LaunchForms.Buttons.Save")
                )}
              </Button>
            </Box>
          )}
        </Box>
      )}

      {showEmployees && (
        <ViewEmployeesPopup
          employees={templateInfo.employeesDetails}
          show={showEmployees}
          onHide={() => setShowEmployees(!showEmployees)}
        />
      )}
    </Box>
  );
}
