import useGetEmployees from "pages/Objectives/hooks/useGetEmployees";
import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteTemplate,
  getAllTemplates,
  createTemplate,
  updateTemplate,
} from "action/TemplatesAct";
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  Collapse,
  FormControlLabel,
  Grid,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import CustomTable from "pages/vihanga/components/CustomTable/index";
import ActionDropdown from "pages/vihanga/components/ActionDropdown/ActionDropdown";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import CustomRadio from "pages/vihanga/components/CustomRadio";
import CustomCheckBoxSwitch from "pages/vihanga/components/CustomCheckSwitch";
import { getRatingScales } from "action/RatingScaleAct";
import { getAllCompetencies } from "action/CompetencyAct";
import { companyId } from "utilities";
import { useTranslation } from "react-i18next";
import { canEdit, canDelete } from "utilities/privilegeHelper";

export default function Templates() {
  const { t } = useTranslation();

  let companyObj = {
    fromEmployeeName: "",
    toEmployeeName: "",
    role: "",
    employeeName: "",
  };
  const [companyInfo, setCompanyInfo] = useState(companyObj);
  const [templateInfo, setTemplateInfo] = useState({
    templateName: "",
    description: "",
    displayOptions: [
      {
        key: t("Templates.DisplayOptions.FirstName"),
        value: "firstName",
        isChecked: true,
      },
      {
        key: t("Templates.DisplayOptions.LastName"),
        value: "lastName",
        isChecked: true,
      },
      {
        key: t("Templates.DisplayOptions.Department"),
        value: "department",
        isChecked: false,
      },
      {
        key: t("Templates.DisplayOptions.Grade"),
        value: "grade",
        isChecked: false,
      },
      {
        key: t("Templates.DisplayOptions.Manager"),
        value: "manager",
        isChecked: false,
      },
      {
        key: t("Templates.DisplayOptions.Designation"),
        value: "designation",
        isChecked: false,
      },
    ],

    displaySteps: [
      {
        key: t("Templates.DisplaySteps.SelfSubmission"),
        value: "Submit",
        isChecked: true,
        text: "",
      },
      {
        key: t("Templates.DisplaySteps.ManagerReview"),
        value: "Manager Review",
        isChecked: true,
        text: t("Templates.DisplayStepsText.SubmitToManager"),
      },
      {
        key: t("Templates.DisplaySteps.HRReview"),
        value: "HR Review",
        isChecked: true,
        text: t("Templates.DisplayStepsText.SubmitToHR"),
      },
      {
        key: t("Templates.DisplaySteps.ManagerSignOff"),
        value: "Manager SignOff",
        isChecked: true,
        text: t("Templates.DisplayStepsText.SubmitToManagerSignOff"),
      },
      {
        key: t("Templates.DisplaySteps.EmployeeSignOff"),
        value: "Employee SignOff",
        isChecked: true,
        text: t("Templates.DisplayStepsText.SubmitToEmployeeSignOff"),
      },
      {
        key: t("Templates.DisplaySteps.Completed"),
        value: "Completed",
        isChecked: true,
        text: t("Templates.DisplayStepsText.SignOffToComplete"),
      },
    ],
    percentageType: "goal",
    ratingScale: "",
    goalPercentage: "",
    competenciesPercentage: "",
    competencies: [],
  });
  const { data: employeeResponse, isLoading } = useGetEmployees();
  const [empData, setEmpData] = useState([]);
  const [showOKRs, setShowOkrs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [ratingScales, setRatingScales] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [competenciesData, setCompetenciesData] = useState([]);
  const [competenciesOpen, setCompetenciesOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && employeeResponse && employeeResponse.data.length > 0) {
      let employeeData =
        employeeResponse &&
        employeeResponse.data.length > 0 &&
        employeeResponse.data.map((item) => {
          return {
            key:
              item.personalInformation.firstName +
              " " +
              item.personalInformation.lastName,
            value: item._id,
            role: item.employmentInformation.role,
          };
        });
      setEmpData(employeeData);
    }
  }, [isLoading, employeeResponse]);

  useEffect(() => {
    const filterData = data.filter((item) =>
      item.templateName.includes(searchKey)
    );
    setFilterData(filterData);
  }, [searchKey]);

  const handleInput = ({ target: { name, value } }) => {
    setTemplateInfo({ ...templateInfo, [name]: value });
  };

  const selectedCompetencyValues = (templateInfo.competencies || []).map(
    (c) => (typeof c === "object" && c !== null ? c.value : c)
  );
  const allCompetenciesSelected =
    competenciesData.length > 0 &&
    selectedCompetencyValues.length === competenciesData.length;
  const someCompetenciesSelected =
    selectedCompetencyValues.length > 0 &&
    selectedCompetencyValues.length < competenciesData.length;

  const handleCompetenciesSelectAll = () => {
    setTemplateInfo({
      ...templateInfo,
      competencies: [...competenciesData],
    });
  };

  const handleCompetenciesUnselectAll = () => {
    setTemplateInfo({
      ...templateInfo,
      competencies: [],
    });
  };

  const handleCompetencyToggle = (option) => {
    const isSelected = selectedCompetencyValues.includes(option.value);
    let newCompetencies;
    if (isSelected) {
      newCompetencies = (templateInfo.competencies || []).filter(
        (c) => (typeof c === "object" && c !== null ? c.value : c) !== option.value
      );
    } else {
      newCompetencies = [...(templateInfo.competencies || []), option];
    }
    setTemplateInfo({ ...templateInfo, competencies: newCompetencies });
  };

  const handleAllCompetenciesToggle = (checked) => {
    setTemplateInfo({
      ...templateInfo,
      competencies: checked ? [...competenciesData] : [],
    });
  };

  const handleEdit = (row) => {
    setTemplateInfo({
      ...row,
      templateName:
        typeof row.templateName === "string" ? row.templateName : "",
      description: typeof row.description === "string" ? row.description : "",
      ratingScale: typeof row.ratingScale === "string" ? row.ratingScale : "",
      goalPercentage:
        typeof row.goalPercentage === "string" ? row.goalPercentage : "",
      competenciesPercentage:
        typeof row.competenciesPercentage === "string"
          ? row.competenciesPercentage
          : "",
      competencies: Array.isArray(row.competencies) ? row.competencies : [],
      displayOptions: Array.isArray(row.displayOptions)
        ? row.displayOptions
        : [],
      displaySteps: Array.isArray(row.displaySteps) ? row.displaySteps : [],
      percentageType:
        typeof row.percentageType === "string" ? row.percentageType : "goal",
    });
    setShowForm(true);
  };

  const getTemplates = () => {
    setLoading(true);
    let response = dispatch(getAllTemplates());
    response.then(({ success, message, data }) => {
      if (success) {
        setData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const handleDelete = (id) => {
    setLoading(true);
    let response = dispatch(deleteTemplate(id));
    response
      .then(({ success, message, data }) => {
        if (success) {
          getTemplates();
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(error?.message || t("Templates.Messages.UnknownError"));
      });
  };

  const getRatingScalesAll = () => {
    setLoading(true);
    let response = dispatch(getRatingScales());
    response.then(({ success, message, data }) => {
      if (success) {
        const updatedRatingScales = data.map((item) => ({
          key:
            item.ratingScale.name +
            " (" +
            item.ratingScale.ratingScaleTemplate +
            ")",
          value: item._id,
        }));
        setRatingScales(updatedRatingScales);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const getCompetencies = () => {
    let response = dispatch(getAllCompetencies());
    response.then(({ success, message, data }) => {
      if (success) {
        const updatedCompetencies = data.map((item) => ({
          key: item.competencyName,
          value: item._id,
          label: item.competencyName,
        }));
        setCompetenciesData(updatedCompetencies);
      }
    });
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortOrder]);

  useEffect(() => {
    if (sortedData && rowsPerPage) {
      setTotalPages(Math.ceil(sortedData.length / rowsPerPage));
    }
  }, [sortedData, rowsPerPage]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, page, rowsPerPage]);

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    onSelect: (row) => {
      let totalData = [...selectedUsers];
      let filterData = totalData.findIndex((item) => item._id === row._id);
      if (filterData < 0) {
        totalData.push(row);
        setSelectedUsers(totalData);
      } else {
        totalData.splice(filterData, 1);
        setSelectedUsers(totalData);
      }
    },
    onSelectAll: (isSelected) => {
      if (isSelected) {
        setSelectedUsers(data);
      } else {
        setSelectedUsers([]);
      }
    },
  };

  const handleSubmit = () => {
    setLoading(true);
    let response = dispatch(createTemplate({ ...templateInfo, companyId }));
    response
      .then(({ success, message }) => {
        if (success) {
          setLoading(false);
          getTemplates();
          setTemplateInfo({
            templateName: "",
            description: "",
            displayOptions: [
              {
                key: t("Templates.DisplayOptions.FirstName"),
                value: "firstName",
                isChecked: true,
              },
              {
                key: t("Templates.DisplayOptions.LastName"),
                value: "lastName",
                isChecked: true,
              },
              {
                key: t("Templates.DisplayOptions.Department"),
                value: "department",
                isChecked: false,
              },
              {
                key: t("Templates.DisplayOptions.Grade"),
                value: "grade",
                isChecked: false,
              },
              {
                key: t("Templates.DisplayOptions.Manager"),
                value: "manager",
                isChecked: false,
              },
              {
                key: t("Templates.DisplayOptions.Designation"),
                value: "designation",
                isChecked: false,
              },
            ],
            displaySteps: [
              {
                key: t("Templates.DisplaySteps.SelfSubmission"),
                value: "Submit",
                isChecked: true,
                text: "",
              },
              {
                key: t("Templates.DisplaySteps.ManagerReview"),
                value: "Manager Review",
                isChecked: true,
                text: t("Templates.DisplayStepsText.SubmitToManager"),
              },
              {
                key: t("Templates.DisplaySteps.HRReview"),
                value: "HR Review",
                isChecked: true,
                text: t("Templates.DisplayStepsText.SubmitToHR"),
              },
              {
                key: t("Templates.DisplaySteps.ManagerSignOff"),
                value: "Manager SignOff",
                isChecked: true,
                text: t("Templates.DisplayStepsText.SubmitToManagerSignOff"),
              },
              {
                key: t("Templates.DisplaySteps.EmployeeSignOff"),
                value: "Employee SignOff",
                isChecked: true,
                text: t("Templates.DisplayStepsText.SubmitToEmployeeSignOff"),
              },
              {
                key: t("Templates.DisplaySteps.Completed"),
                value: "Completed",
                isChecked: true,
                text: t("Templates.DisplayStepsText.SignOffToComplete"),
              },
            ],
            ratingScale: "",
            goalPercentage: "",
            competenciesPercentage: "",
            competencies: [],
          });
          setShowForm(false);
        } else {
          setLoading(false);
          setError(message || t("Templates.Messages.UnknownError"));
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(error?.message || t("Templates.Messages.UnknownError"));
      });
  };

  const handleUpdate = () => {
    setLoading(true);
    let id = templateInfo._id;
    delete templateInfo.__v;
    delete templateInfo.createdAt;
    delete templateInfo.updatedAt;
    delete templateInfo._id;
    let response = dispatch(updateTemplate(id, { ...templateInfo, companyId }));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        getTemplates();
        setTemplateInfo({
          templateName: "",
          description: "",
          displayOptions: [
            {
              key: t("Templates.DisplayOptions.FirstName"),
              value: "firstName",
              isChecked: true,
            },
            {
              key: t("Templates.DisplayOptions.LastName"),
              value: "lastName",
              isChecked: true,
            },
            {
              key: t("Templates.DisplayOptions.Department"),
              value: "department",
              isChecked: false,
            },
            {
              key: t("Templates.DisplayOptions.Grade"),
              value: "grade",
              isChecked: false,
            },
            {
              key: t("Templates.DisplayOptions.Manager"),
              value: "manager",
              isChecked: false,
            },
            {
              key: t("Templates.DisplayOptions.Designation"),
              value: "designation",
              isChecked: false,
            },
          ],
          displaySteps: [
            {
              key: t("Templates.DisplaySteps.SelfSubmission"),
              value: "Submit",
              isChecked: true,
              text: "",
            },
            {
              key: t("Templates.DisplaySteps.ManagerReview"),
              value: "Manager Review",
              isChecked: true,
              text: t("Templates.DisplayStepsText.SubmitToManager"),
            },
            {
              key: t("Templates.DisplaySteps.HRReview"),
              value: "HR Review",
              isChecked: true,
              text: t("Templates.DisplayStepsText.SubmitToHR"),
            },
            {
              key: t("Templates.DisplaySteps.ManagerSignOff"),
              value: "Manager SignOff",
              isChecked: true,
              text: t("Templates.DisplayStepsText.SubmitToManagerSignOff"),
            },
            {
              key: t("Templates.DisplaySteps.EmployeeSignOff"),
              value: "Employee SignOff",
              isChecked: true,
              text: t("Templates.DisplayStepsText.SubmitToEmployeeSignOff"),
            },
            {
              key: t("Templates.DisplaySteps.Completed"),
              value: "Completed",
              isChecked: true,
              text: t("Templates.DisplayStepsText.SignOffToComplete"),
            },
          ],
          ratingScale: "",
          goalPercentage: "",
          competenciesPercentage: "",
          competencies: [],
        });
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getTemplates();
    getRatingScalesAll();
    getCompetencies();
  }, []);
  const handleCheckbox = (e) => {
    let displayOptions = [...templateInfo.displayOptions];
    let index = displayOptions.findIndex(
      (item) => item.value === e.target.name
    );
    displayOptions[index].isChecked = !displayOptions[index].isChecked;
    setTemplateInfo({ ...templateInfo, displayOptions: displayOptions });
  };
  const handleCheckboxSteps = (e) => {
    let displayOptions = [...templateInfo.displaySteps];
    let index = displayOptions.findIndex(
      (item) => item.value === e.target.name
    );
    displayOptions[index].isChecked = !displayOptions[index].isChecked;
    setTemplateInfo({ ...templateInfo, displaySteps: displayOptions });
  };
  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const renderHeader = (label, field) => (
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
  );
  const columns = [
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
      label: renderHeader(t("Templates.Table.Name"), "templateName"),
      render: (row) => row.templateName,
    },

    {
      id: "action",
      label: (
        <span style={{ fontWeight: 500 }}>{t("Templates.Table.Action")}</span>
      ),
      render: (row) => {
        const actions = [];
        
        if (canEdit()) {
          actions.push({
            label: t("Templates.Table.Edit"),
            icon: <BorderColorIcon fontSize="small" />,
            onClick: () => {
              handleEdit(row);
            },
          });
        }
        
        if (canDelete()) {
          actions.push({
            label: t("Templates.Table.Delete"),
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
  ];
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
          {t("Templates.Title")}
        </Typography>
        {canEdit() && (
          <Button
            variant="contained"
            onClick={() => {
              if (!showForm) {
                // Reset form when opening for new template
                setTemplateInfo({
                  templateName: "",
                  description: "",
                  displayOptions: [
                    {
                      key: t("Templates.DisplayOptions.FirstName"),
                      value: "firstName",
                      isChecked: true,
                    },
                    {
                      key: t("Templates.DisplayOptions.LastName"),
                      value: "lastName",
                      isChecked: true,
                    },
                    {
                      key: t("Templates.DisplayOptions.Department"),
                      value: "department",
                      isChecked: false,
                    },
                    {
                      key: t("Templates.DisplayOptions.Grade"),
                      value: "grade",
                      isChecked: false,
                    },
                    {
                      key: t("Templates.DisplayOptions.Manager"),
                      value: "manager",
                      isChecked: false,
                    },
                    {
                      key: t("Templates.DisplayOptions.Designation"),
                      value: "designation",
                      isChecked: false,
                    },
                  ],
                  displaySteps: [
                    {
                      key: t("Templates.DisplaySteps.SelfSubmission"),
                      value: "Submit",
                      isChecked: true,
                      text: "",
                    },
                    {
                      key: t("Templates.DisplaySteps.ManagerReview"),
                      value: "Manager Review",
                      isChecked: true,
                      text: t("Templates.DisplayStepsText.SubmitToManager"),
                    },
                    {
                      key: t("Templates.DisplaySteps.HRReview"),
                      value: "HR Review",
                      isChecked: true,
                      text: t("Templates.DisplayStepsText.SubmitToHR"),
                    },
                    {
                      key: t("Templates.DisplaySteps.ManagerSignOff"),
                      value: "Manager SignOff",
                      isChecked: true,
                      text: t(
                        "Templates.DisplayStepsText.SubmitToManagerSignOff"
                      ),
                    },
                    {
                      key: t("Templates.DisplaySteps.EmployeeSignOff"),
                      value: "Employee SignOff",
                      isChecked: true,
                      text: t(
                        "Templates.DisplayStepsText.SubmitToEmployeeSignOff"
                      ),
                    },
                    {
                      key: t("Templates.DisplaySteps.Completed"),
                      value: "Completed",
                      isChecked: true,
                      text: t("Templates.DisplayStepsText.SignOffToComplete"),
                    },
                  ],
                  percentageType: "goal",
                  ratingScale: "",
                  goalPercentage: "",
                  competenciesPercentage: "",
                  competencies: [],
                });
              }
              setShowForm(!showForm);
            }}
            sx={{
              backgroundColor: "#837F39",
              color: "white",
              borderRadius: "100px",
              "&:hover": {
                backgroundColor: "#837F39",
              },
            }}
          >
            {t("Templates.Buttons.Create")}
          </Button>
        )}
      </Box>

      <Box sx={{ width: "465px" }}>
        <Stack spacing={1}>
          <InputTextComponent
            label={t("Templates.FormFields.TemplatesName")}
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
              <InputTextComponent
                label={t("Templates.FormFields.TemplateName")}
                name="templateName"
                placeholder={t("Templates.Placeholders.EnterTemplateName")}
                value={templateInfo.templateName}
                onChange={handleInput}
                sx={{ width: "465px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <InputTextComponent
                label={t("Templates.FormFields.Description")}
                placeholder={t("Templates.Placeholders.EnterDescription")}
                multiline
                name="description"
                minRows={4}
                value={templateInfo.description}
                onChange={handleInput}
                sx={{ width: "465px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2, // space between label and radios
                }}
              >
                <Typography sx={{ fontWeight: 400, whiteSpace: "nowrap" }}>
                  {t("Templates.FormFields.PercentageType")}
                </Typography>

                <CustomRadio
                  label=""
                  direction="row"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "465px",
                  }}
                  value={templateInfo.percentageType}
                  onChange={(e) =>
                    handleInput({
                      target: { name: "percentageType", value: e },
                    })
                  }
                  options={[
                    { label: t("Templates.Options.Goals"), value: "goal" },
                    {
                      label: t("Templates.Options.Objectives"),
                      value: "objective",
                    },
                  ]}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <SelectComponent
                label={t("Templates.FormFields.RatingScale")}
                key="Rating Scale"
                placeholder={t("Templates.Placeholders.EnterRatingScale")}
                name="ratingScale"
                id="ratingScale"
                value={templateInfo.ratingScale}
                onChange={handleInput}
                options={[
                  {
                    value: "Performance Rating Scale",
                    label: t("Templates.Options.PerformanceRatingScale"),
                  },
                ]}
                sx={{ width: "465px" }}
              />
            </Grid>

            <Grid item xs={6}>
              {templateInfo.percentageType === "goal" ? (
                <InputTextComponent
                  label={t("Templates.FormFields.GoalPercentage")}
                  placeholder={t("Templates.Placeholders.EnterGoalPercentage")}
                  name="goalPercentage"
                  type="number"
                  value={templateInfo.goalPercentage}
                  onChange={handleInput}
                  sx={{ width: "465px" }}
                />
              ) : (
                <InputTextComponent
                  label={t("Templates.FormFields.ObjectivePercentage")}
                  placeholder={t(
                    "Templates.Placeholders.EnterObjectivePercentage"
                  )}
                  name="goalPercentage"
                  type="number"
                  value={templateInfo.goalPercentage}
                  onChange={handleInput}
                  sx={{ width: "465px" }}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              <InputTextComponent
                label={t("Templates.FormFields.CompetenciesPercentage")}
                placeholder={t(
                  "Templates.Placeholders.EnterCompetenciesPercentage"
                )}
                name="competenciesPercentage"
                type="number"
                value={templateInfo.competenciesPercentage}
                onChange={handleInput}
                sx={{ width: "465px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <ClickAwayListener onClickAway={() => setCompetenciesOpen(false)}>
                <Box sx={{ width: "465px" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      marginBottom: "0.2rem",
                      fontWeight: 400,
                      fontFamily: "Work Sans !important",
                      color: "#707070",
                      fontSize: "14px",
                    }}
                  >
                    {t("Templates.FormFields.Competencies")}
                  </Typography>
                  <Box
                    onClick={() => setCompetenciesOpen(!competenciesOpen)}
                    sx={{
                      border: "1px solid #E9EAEC",
                      borderRadius: "10px",
                      minHeight: "48px",
                      display: "flex",
                      alignItems: "center",
                      px: 1.5,
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      "&:hover": { borderColor: "#ccc" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: selectedCompetencyValues.length
                          ? "#333"
                          : "#999",
                        fontFamily: "Work Sans",
                      }}
                    >
                      {selectedCompetencyValues.length
                        ? `${selectedCompetencyValues.length} selected`
                        : t("Templates.Placeholders.SelectCompetencies")}
                    </Typography>
                    <Box sx={{ ml: "auto", color: "#707070" }}>
                      {competenciesOpen ? "▲" : "▼"}
                    </Box>
                  </Box>
                  <Collapse in={competenciesOpen}>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5, mb: 0.5 }}>
                      <Typography
                        component="button"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompetenciesSelectAll();
                        }}
                        sx={{
                          fontSize: "12px",
                          color: "#837F39",
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          padding: 0,
                          textDecoration: "underline",
                          "&:hover": { color: "#6b6730" },
                        }}
                      >
                        {t("Templates.Buttons.SelectAll")}
                      </Typography>
                      <Typography sx={{ fontSize: "12px", color: "#707070" }}>
                        |
                      </Typography>
                      <Typography
                        component="button"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompetenciesUnselectAll();
                        }}
                        sx={{
                          fontSize: "12px",
                          color: "#837F39",
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          padding: 0,
                          textDecoration: "underline",
                          "&:hover": { color: "#6b6730" },
                        }}
                      >
                        {t("Templates.Buttons.UnselectAll")}
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        border: "1px solid #E9EAEC",
                        borderRadius: "10px",
                        maxHeight: 220,
                        overflow: "auto",
                        p: 0.5,
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={allCompetenciesSelected}
                            indeterminate={someCompetenciesSelected}
                            onChange={(e) =>
                              handleAllCompetenciesToggle(e.target.checked)
                            }
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              color: '#837F39',
                              '&.Mui-checked': { color: '#837F39' },
                              '&.MuiCheckbox-indeterminate': { color: '#837F39' },
                            }}
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 500,
                              fontFamily: "Work Sans",
                            }}
                          >
                            {t("Templates.Options.AllCompetencies")}
                          </Typography>
                        }
                        sx={{ display: "flex", ml: 0, mr: 0 }}
                      />
                      {competenciesData.map((option) => {
                        const isChecked = selectedCompetencyValues.includes(
                          option.value
                        );
                        return (
                          <FormControlLabel
                            key={option.value}
                            control={
                              <Checkbox
                                checked={!!isChecked}
                                onChange={() => handleCompetencyToggle(option)}
                                onClick={(e) => e.stopPropagation()}
                                sx={{
                                  color: '#837F39',
                                  '&.Mui-checked': { color: '#837F39' },
                                }}
                              />
                            }
                            label={
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontFamily: "Work Sans",
                                  color: "#333",
                                }}
                              >
                                {option.label || option.key}
                              </Typography>
                            }
                            sx={{ display: "flex", ml: 0, mr: 0 }}
                          />
                        );
                      })}
                    </Box>
                  </Collapse>
                </Box>
              </ClickAwayListener>
            </Grid>

            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  width: "465px",
                }}
              >
                <Typography
                  sx={{ fontWeight: 400, whiteSpace: "nowrap", mt: 0.5 }}
                >
                  {t("Templates.FormFields.ReviewSteps")}:
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {templateInfo.displaySteps.length > 0 &&
                    templateInfo.displaySteps.map((option) => (
                      <CustomCheckBoxSwitch
                        key={option.value}
                        type="checkbox"
                        value={option.isChecked}
                        label={option.key}
                        checked={option.isChecked}
                        onChange={() =>
                          handleCheckboxSteps({
                            target: {
                              name: option.value,
                              checked: !option.isChecked,
                            },
                          })
                        }
                      />
                    ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  width: "465px",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                    mt: 0.5,
                  }}
                >
                  {t("Templates.FormFields.EmployeeDisplayOptions")}:
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {templateInfo.displayOptions.length > 0 &&
                    templateInfo.displayOptions.map((option) => (
                      <CustomCheckBoxSwitch
                        key={option.value}
                        type="checkbox"
                        name={option.value}
                        value={option.isChecked}
                        label={option.key}
                        checked={option.isChecked}
                        onChange={() =>
                          handleCheckbox({
                            target: {
                              name: option.value,
                              checked: !option.isChecked,
                            },
                          })
                        }
                      />
                    ))}
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Button Section */}
          {canEdit() && (
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button
                variant="outlined"
                onClick={() => setShowForm(false)}
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
                {t("Templates.Buttons.Cancel")}
              </Button>

              <Button
                variant="contained"
                onClick={!!templateInfo._id ? handleUpdate : handleSubmit}
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
                {!!templateInfo._id
                  ? t("Templates.Buttons.Update")
                  : t("Templates.Buttons.Save")}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
