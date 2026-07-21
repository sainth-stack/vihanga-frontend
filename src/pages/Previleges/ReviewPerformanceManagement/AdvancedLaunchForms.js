import useGetEmployees from "pages/Objectives/hooks/useGetEmployees";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getAllTemplates } from "action/TemplatesAct";
import {
  createForm,
  deleteForm,
  getAllForms,
  updateForm,
} from "action/AdvancedLaunchFormAct";
import ViewEmployeesPopup from "./ViewEmployeesPopup";
import {
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Checkbox,
} from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import CustomTable from "pages/vihanga/components/CustomTable";
import ActionDropdown from "pages/vihanga/components/ActionDropdown/ActionDropdown";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useTranslation } from "react-i18next";
import { canEdit, canDelete } from "utilities/privilegeHelper";

export default function AdvancedLaunchForms() {
  const { t } = useTranslation();

  const [templateInfo, setTemplateInfo] = useState({
    formType: "",
    formTemplate: "",
    launchDate: null,
    reviewPeriodStartDate: null,
    reviewPeriodEndDate: null,
    toEmployee: "",
    employeesDetails: [],
    templateName: "",
    formName: "",
    selfAndManager: [],
    peers: [],
  });
  const {
    data: employeeResponse,
    message,
    success,
    isLoading,
  } = useGetEmployees();
  const [empData, setEmpData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false);
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [, setSelectedDefault] = useState("");
  const [selectedPeers, setSelectedPeers] = useState([]);
  const [defaultEmp, setDefaultEmp] = useState([]);
  const [peers, setPeers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedRows, setSelectedRows] = useState([]);

  const formTypes = [
    {
      key: t("AdvancedLaunchForms.AdvancedReviewManagement"),
      value: "Advanced Review Management",
    },
  ];
  const [formTemplates, setFormTemplates] = useState([]);
  const dispatch = useDispatch();

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
            label:
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

  const handleInput = ({ target: { name, value } }) => {
    setTemplateInfo({ ...templateInfo, [name]: value });
  };

  useEffect(() => {
    let peers = empData.filter(
      (item) => item.value !== templateInfo.toEmployee
    );
    let defaults = empData.filter(
      (item) => item.value === templateInfo.toEmployee
    );

    if (employeeResponse?.data) {
      empData.map((item) => {
        if (item.value === templateInfo.toEmployee) {
          let emp = employeeResponse.data.filter((itemchild) => {
            if (itemchild._id === item.value) {
              return true;
            }
          });
          let manager = employeeResponse?.data.filter(
            (item) => emp[0]?.employmentInformation?.lineManager === item._id
          );
          if (manager?.[0]) {
            defaults.push({
              key:
                manager[0].personalInformation.firstName +
                " " +
                manager[0].personalInformation.lastName,
              label:
                manager[0].personalInformation.firstName +
                " " +
                manager[0].personalInformation.lastName,
              role: manager[0].employmentInformation.role,
              value: manager[0]._id,
            });
          }
        }
      });
    }
    setPeers(peers);
    setDefaultEmp(defaults);
  }, [templateInfo.toEmployee, empData, employeeResponse]);

  const handleEdit = (row) => {
    setTemplateInfo(row);
    setShowForm(true);
    let updatedPeers = row.peers.map((item) => {
      let employee = employeeResponse?.data.filter(
        (itemChild) => itemChild._id === item
      );
      return {
        key:
          employee[0].personalInformation.firstName +
          " " +
          employee[0].personalInformation.lastName,
        label:
          employee[0].personalInformation.firstName +
          " " +
          employee[0].personalInformation.lastName,
        role: employee[0].employmentInformation.role,
        value: item,
      };
    });
    setSelectedPeers(updatedPeers);
  };

  const handleDelete = (id) => {
    setLoading(true);
    let response = dispatch(deleteForm(id));
    response.then(({ success, message, data }) => {
      if (success) {
        getLaunchForms();
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const getLaunchForms = () => {
    setLoading(true);
    let response = dispatch(getAllForms());
    response.then(({ success, message, data }) => {
      if (success) {
        setData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const getTemplates = () => {
    setLoading(true);
    let response = dispatch(getAllTemplates());
    response.then(({ success, message, data }) => {
      if (success) {
        let updatedData = data.map((item) => {
          return {
            key: item.templateName,
            value: item._id,
          };
        });
        setFormTemplates(updatedData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
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

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

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
    templateInfo.selfAndManager = defaultEmp.map((item) => item.value);
    templateInfo.peers = selectedPeers.map((item) => item.value);
    templateInfo.templateName = formTemplates.filter(
      (item) => item.value === templateInfo.formTemplate
    )[0].key;
    let response = dispatch(createForm(templateInfo));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        getLaunchForms();
        setTemplateInfo({
          formType: "",
          formTemplate: "",
          launchDate: null,
          reviewPeriodStartDate: null,
          reviewPeriodEndDate: null,
          employees: "",
          templateName: "",
          formName: "",
        });
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
  };

  const handleUpdate = () => {
    setLoading(true);
    let id = templateInfo._id;
    delete templateInfo.__v;
    delete templateInfo.createdAt;
    delete templateInfo.updatedAt;
    delete templateInfo._id;
    templateInfo.selfAndManager = defaultEmp.map((item) => item.value);
    templateInfo.peers = selectedPeers.map((item) => item.value);
    templateInfo.templateName = formTemplates.filter(
      (item) => item.value === templateInfo.formTemplate
    )[0].key;
    let response = dispatch(updateForm(id, templateInfo));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        getLaunchForms();
        setTemplateInfo({
          formType: "",
          formTemplate: "",
          launchDate: null,
          reviewPeriodStartDate: null,
          reviewPeriodEndDate: null,
          employees: "",
          templateName: "",
        });
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
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
      id: "formName",
      label: renderHeader(t("AdvancedLaunchForms.Table.FormName"), "formName"),
      render: (row) => row.formName,
    },
    {
      id: "templateName",
      label: renderHeader(
        t("AdvancedLaunchForms.Table.TemplateName"),
        "templateName"
      ),
      render: (row) => row.templateName,
    },
    {
      id: "toEmployeeName",
      label: renderHeader(
        t("AdvancedLaunchForms.Table.EmployeeName"),
        "toEmployeeName"
      ),
      render: (row) => row.toEmployeeName,
    },
    {
      id: "launchDate",
      label: renderHeader(
        t("AdvancedLaunchForms.Table.LaunchDate"),
        "launchDate"
      ),
      render: (row) => row.launchDate,
    },
    {
      id: "action",
      label: (
        <span style={{ fontWeight: 500 }}>
          {t("AdvancedLaunchForms.Table.Action")}
        </span>
      ),
      render: (row) => {
        const actions = [];
        
        if (canEdit()) {
          actions.push({
            label: t("AdvancedLaunchForms.Table.Edit"),
            icon: <BorderColorIcon fontSize="small" />,
            onClick: () => {
              handleEdit(row);
            },
          });
        }
        
        if (canDelete()) {
          actions.push({
            label: t("AdvancedLaunchForms.Table.Delete"),
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

  useEffect(() => {
    getTemplates();
    getLaunchForms();
  }, []);

  const filterData = (data) => {
    let filterData = data.filter((item) => {
      if (searchKey) {
        return (
          item.formName.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.templateName.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.toEmployeeName.toLowerCase().includes(searchKey.toLowerCase())
        );
      } else {
        return item;
      }
    });
    return filterData;
  };

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
          {t("AdvancedLaunchForms.Title")}
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
            {t("AdvancedLaunchForms.Buttons.Create")}
          </Button>
        )}
      </Box>

      <Box sx={{ width: "465px" }}>
        <Stack spacing={1}>
          <InputTextComponent
            label={t("AdvancedLaunchForms.FormFields.LaunchFormName")}
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
        !showForm && (
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
        )
      )}

      {showForm && (
        <Box mt={6} ml={4}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <InputTextComponent
                label={t("AdvancedLaunchForms.FormFields.FormName")}
                placeholder={t(
                  "AdvancedLaunchForms.Placeholders.EnterFormName"
                )}
                id="formName"
                value={templateInfo.formName}
                name="formName"
                onChange={handleInput}
                sx={{ width: "465px" }}
              />
            </Grid>

            <Grid item xs={6}>
              <SelectComponent
                label={t("AdvancedLaunchForms.FormFields.FormType")}
                key="formType"
                id="formType"
                placeholder={t(
                  "AdvancedLaunchForms.Placeholders.AdvanceReviewManagement"
                )}
                name="formType"
                value={empData.find(
                  (emp) => emp.value === templateInfo.formType
                )}
                onChange={(selectedOption) => {
                  handleInput({
                    target: {
                      name: "toEmployee",
                      value: selectedOption ? selectedOption.value : "",
                    },
                  });
                }}
                options={empData}
                sx={{ width: "465px" }}
              />
            </Grid>

            <Grid item xs={6}>
              <SelectComponent
                label={t("AdvancedLaunchForms.FormFields.FormTemplate")}
                key="formTemplate"
                id="formTemplate"
                placeholder={t(
                  "AdvancedLaunchForms.Placeholders.SelectFormTemplate"
                )}
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
                label={t("AdvancedLaunchForms.FormFields.LaunchDate")}
                placeholder={t(
                  "AdvancedLaunchForms.Placeholders.EnterLaunchDate"
                )}
                id="launchDate"
                value={templateInfo.launchDate}
                name="launchDate"
                onChange={handleInput}
                sx={{ width: "465px" }}
              />
            </Grid>

            <Grid item xs={6}>
              <InputTextComponent
                type="date"
                id="reviewPeriodStartDate"
                label={t(
                  "AdvancedLaunchForms.FormFields.ReviewPeriodStartDate"
                )}
                placeholder={t(
                  "AdvancedLaunchForms.Placeholders.EnterStartDate"
                )}
                value={templateInfo.reviewPeriodStartDate}
                name="reviewPeriodStartDate"
                onChange={handleInput}
                sx={{ width: "465px" }}
              />
            </Grid>

            <Grid item xs={6}>
              <InputTextComponent
                type="date"
                id="reviewPeriodEndDate"
                label={t("AdvancedLaunchForms.FormFields.ReviewPeriodEndDate")}
                placeholder={t("AdvancedLaunchForms.Placeholders.EnterEndDate")}
                name="reviewPeriodEndDate"
                value={templateInfo.reviewPeriodEndDate}
                onChange={handleInput}
                sx={{ width: "465px" }}
              />
            </Grid>

            <Grid item xs={6}>
              <SelectComponent
                label={t("AdvancedLaunchForms.FormFields.ToEmployee")}
                key="toEmployee"
                id="toEmployee"
                placeholder={t(
                  "AdvancedLaunchForms.Placeholders.SelectEmployee"
                )}
                name="toEmployee"
                value={templateInfo.toEmployee}
                onChange={handleInput}
                options={empData}
                sx={{ width: "465px" }}
              />
              <a
                href={null}
                className="link cursor-pointer usersList"
                onClick={() => setShowEmployees(!showEmployees)}
              >
                {templateInfo.employeesGroup
                  ? templateInfo.employeesDetails.length
                  : ""}
              </a>
            </Grid>

            <Grid item xs={6}>
              <SelectComponent
                label={t("AdvancedLaunchForms.FormFields.SelfAndManager")}
                key="selfAndManager"
                id="selfAndManager"
                placeholder={t(
                  "AdvancedLaunchForms.Placeholders.SelectSelfAndManager"
                )}
                name="selfAndManager"
                isMulti={true}
                value={defaultEmp}
                onChange={(selectedOptions) => {
                  setDefaultEmp(selectedOptions || []);
                }}
                options={defaultEmp}
                sx={{ width: "465px" }}
              />
            </Grid>

            <Grid item xs={6}>
              <SelectComponent
                label={t("AdvancedLaunchForms.FormFields.Peers")}
                key="peers"
                id="peers"
                placeholder={t("AdvancedLaunchForms.Placeholders.SelectPeers")}
                name="peers"
                isMulti={true}
                value={selectedPeers}
                onChange={(selectedOptions) => {
                  setSelectedPeers(selectedOptions || []);
                }}
                options={peers}
                sx={{ width: "465px" }}
              />
            </Grid>
          </Grid>

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
                {t("AdvancedLaunchForms.Buttons.Cancel")}
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
                  ? t("AdvancedLaunchForms.Buttons.Update")
                  : t("AdvancedLaunchForms.Buttons.Save")}
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
