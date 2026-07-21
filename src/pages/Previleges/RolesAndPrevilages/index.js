/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import TitleHeader from "components/TitleHeader";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { LoadingIndicator, Validator, removeDuplicates } from "utilities";
import {
  createPrivilege,
  deletePrivilege,
  deletePrivilegeMultiple,
  getAllPrivileges,
  updatePrivilege,
  updatePrivilegePermissionGroup,
  updatePrivilegesActive,
  updatePrivilegesInActive,
} from "action/PrivilegesAct";
import { getAllPrivilegesGroup } from "action/PrivilegesGroupAct";
import { getPrivileges } from "reducer/userSlice";
import CustomTable from "pages/vihanga/components/CustomTable";
import TabsReact from './tabs';
import PrivilegeModal from './PrivilegeModal';
import SearchIcon from '@mui/icons-material/Search';
import CustomButton from "pages/vihanga/components/Button/CustomButton";
import { SelectComponent } from '../../../pages/vihanga/components/input-elements/select'
import {
  Card,
  Grid,
  Typography,
  TextField,
  Box,
  MenuItem,
  InputAdornment,
  Button,
  Checkbox
} from "@mui/material";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      role: data[i].role,
      description: data[i].description,
      privilegeGroup: data[i].privilegeGroup,
      active: data[i].active,
      privileges: data[i].privileges,
      updatedAt: data[i].updatedAt,
    });
  }
  return items;
};
function RolesAndPrivileges() {
  const { t } = useTranslation();
  const [roleData, setRoleData] = useState({
    role: "",
    description: "",
  });
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false);
  const [showPrivilegeModal, setPrivilegeModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [forceUpdate] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [privilegeGroups, setPrivilegeGroups] = useState([]);
  const [searchDropdown, setSearchDropdown] = useState("");
  const [searchText, setSearchText] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const validator = Validator();
  const mappedOptions = privilegeGroups.map((option) => ({
    value: option.key,
    label: option.key,
  }));


  const privilegesData = {
    employees: [
      {
        page: "Dashboards",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Key Results",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Tasks",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Rewards",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "RewardsNomination",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "IHaveIdea",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Org Chart",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Reviews",
        view: false,
        edit: false,
        delete: false,
        category: "Employees",
      },
      {
        page: "Advanced Reviews",
        view: false,
        edit: false,
        delete: false,
        category: "Employees",
      },
      {
        page: "Company Level Access",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Team Level Access",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Functional Level Access",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Team Leave",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Time Login",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Absence/Time-Off",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Resignation Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Document Submission",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Document Type Management",
        view: false,
        edit: false,
        delete: false,
      },
    ],
    goals: [
      {
        page: "Tasks",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Cascade Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Lock Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Approve Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Reject Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Unlock Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Tasks Drag and Drop",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Key Results - Target update once locked",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Key Results - Actual, comments update once locked",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Update progress on Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Goals",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Sessions",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Update Manager Progress For Cascaded",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Advanced Launch Forms",
        view: false,
        edit: false,
        delete: false,
      },
    ],
    previliges: [
      {
        page: "Roles & Privileges",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Departments",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "company",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Employees",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Privilege Groups",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "OKR Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Rewards Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Catalog Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Notification Settings",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Advanced Performance Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Integration Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Questionaire Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Competency Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Performance Management Templates",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Launch Forms Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Calibration Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Advanced Launch Forms Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Recruitment Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Attendance Upload",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Upload Leaves",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Approval WorkFlow",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Asset Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Leave Type",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Eligibility Criteria",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Lookups",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Active Sessions",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Document Submission",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Document Approval Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Holidays Calendar",
        view: false,
        edit: false,
        delete: false,
      },

    ],
  };

  const [privileges, setPrivileges] = useState(privilegesData);
  const handleChangeSearch = ({ target: { name, value, label } }) => {
    let updatedData = { ...roleData };
    updatedData[name] = value;
    setRoleData(updatedData);
  };
  const handleSubmit = () => {
    if (validator.current.allValid()) {
      if (editId) {
        let finalPrivilegesCategory1 = [...privileges.employees].map(
          (item) => ({
            ...item,
            category: "Employees",
          })
        );
        let finalPrivilegesCategory2 = [...privileges.goals].map((item) => ({
          ...item,
          category: "Goals",
        }));
        let finalPrivilegesCategory3 = [...privileges.previliges].map(
          (item) => ({
            ...item,
            category: "Previleges",
          })
        );
        const finalData = {
          ...roleData,
          active: true,
          privileges: [
            ...finalPrivilegesCategory1,
            ...finalPrivilegesCategory2,
            ...finalPrivilegesCategory3,
          ],
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        if (JSON.parse(localStorage.getItem("user")).role === finalData.role) {
          dispatch(getPrivileges(finalData.privileges));
        }
        setLoading(true);
        let response = dispatch(updatePrivilege(editId, finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            getPrivilegesDataRefresh();
            emptyData();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      } else {
        let finalPrivilegesCategory1 = [...privileges.employees].map(
          (item) => ({
            ...item,
            category: "Employees",
          })
        );
        let finalPrivilegesCategory2 = [...privileges.goals].map((item) => ({
          ...item,
          category: "Goals",
        }));
        let finalPrivilegesCategory3 = [...privileges.previliges].map(
          (item) => ({
            ...item,
            category: "Previleges",
          })
        );
        const finalData = {
          ...roleData,
          active: true,
          privileges: [
            ...finalPrivilegesCategory1,
            ...finalPrivilegesCategory2,
            ...finalPrivilegesCategory3,
          ],
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(createPrivilege(finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            getPrivilegesDataRefresh();
            emptyData();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      }
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };

  const handleCallback2 = (editObject) => {
    let response = dispatch(
      updatePrivilegePermissionGroup(editObject.roleId, editObject)
    );
    response.then(({ success, message }) => {
      if (success) {
        setError("");
        getPrivilegesDataRefresh();
        setPrivilegeModal(false);
      } else {
        setError(message);
      }
    });
  };

  const changeActiveStatus = (id, status) => {
    let dataActive = data.filter((item) => item._id === id);
    if (dataActive.length > 0) {
      let response = dispatch(updatePrivilege(id, { active: status }));
      response.then(({ success, message }) => {
        if (success) {
          setError("");
          getPrivilegesDataRefresh();
        } else {
          setError(message);
        }
      });
    } else {
      alert("Please select role...");
    }
  };

  const getPrivilegeGroupsData = () => {
    try {
      let response = dispatch(getAllPrivilegesGroup());
      response.then(({ data, message }) => {
        if (data.privilegeGroups !== undefined) {
          let nonduplicate = removeDuplicates(
            data.privilegeGroups,
            "groupName"
          );
          let finalData = nonduplicate.map((item) => ({
            key: item.groupName,
            value: item._id,
          }));
          setPrivilegeGroups(finalData);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getPrivilegesData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllPrivileges());
      response.then(({ data: apiData, message }) => {
        if (apiData !== undefined && apiData.length > 0) {
          let nonduplicate = removeDuplicates(apiData, "role");
          nonduplicate = tableGenerator(nonduplicate, nonduplicate.length);
          setData(nonduplicate);
          setLoading(false);
          setError("");
        } else if (apiData.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const getPrivilegesDataRefresh = () => {
    try {
      let response = dispatch(getAllPrivileges());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = removeDuplicates(data, "role");
          nonduplicate = tableGenerator(nonduplicate, nonduplicate.length);
          setData(nonduplicate);
          setError("");
        } else if (data.length === 0) {
          setError("No Data Found!");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
    }
  };

  const mergePrivileges = (staticList, userList) => {
    return staticList.map(staticItem => {
      const match = userList.find(u => u.page === staticItem.page);
      return match ? { ...staticItem, ...match } : { ...staticItem, enabled: false };
    });
  };

  const handleEdit = (row) => {
    setRoleData({
      role: row.role,
      description: row.description,
    });
    let EmployeesPrivileges = mergePrivileges(
      privilegesData.employees,
      row.privileges.filter(item => item.category === "Employees")
    );
    let GoalsPrivileges = mergePrivileges(
      privilegesData.goals,
      row.privileges.filter(item => item.category === "Goals")
    );
    let HrPreviliges = mergePrivileges(
      privilegesData.previliges,
      row.privileges.filter(item => item.category === "Previleges")
    );
    setPrivileges({
      employees: EmployeesPrivileges,
      goals: GoalsPrivileges,
      previliges:
        HrPreviliges.length === 0 ? privilegesData.previliges : HrPreviliges,
    });
    setEditId(row._id);
  };

  const emptyData = () => {
    setRoleData({
      role: "",
      description: "",
    });
    setPrivileges(privilegesData);
    setEditId(null);
    validator.current.hideMessages();
  };

  const handleAdd = () => {
    setPrivilegeModal(true);
  };
  const handleDelete = (id) => {
    let response = dispatch(deletePrivilege(id));
    response.then(({ success, message }) => {
      if (success) {
        setError("");
        getPrivilegesDataRefresh();
      } else {
        setError(message);
      }
    });
  };

  const handleDeleteMultiple = () => {
    if (selectedUsers.length > 0) {
      let selectedIds = selectedUsers.map((item) => item._id);
      let response = dispatch(deletePrivilegeMultiple({ data: selectedIds }));
      response.then(({ success, message }) => {
        if (success) {
          setError("");
          getPrivilegesDataRefresh();
          window.location.reload();
        } else {
          setError(message);
        }
      });
    } else {
      alert("Please select role...");
    }
  };

  const handleActiveMultiple = () => {
    if (selectedUsers.length > 0) {
      let selectedIds = selectedUsers.map((item) => item._id);
      let response = dispatch(updatePrivilegesActive({ data: selectedIds }));
      response.then(({ success, message }) => {
        if (success) {
          setError("");
          getPrivilegesDataRefresh();
        } else {
          setError(message);
        }
      });
    } else {
      alert("Please select role...");
    }
  };

  const handleInActiveMultiple = () => {
    if (selectedUsers.length > 0) {
      let selectedIds = selectedUsers.map((item) => item._id);
      let response = dispatch(updatePrivilegesInActive({ data: selectedIds }));
      response.then(({ success, message }) => {
        if (success) {
          setError("");
          getPrivilegesDataRefresh();
        } else {
          setError(message);
        }
      });
    } else {
      alert("Please select role...");
    }
  };


  const columns = [
    {
      id: "id",
      label: t("RolesAndPrivileges.TableHeaders.SerialNumber"),
      width: "5%",
      render: (row) => row.id
    },
    {
      id: "role",
      label: t("RolesAndPrivileges.TableHeaders.RoleName"),
      width: "20%",
      sortable: true,
      render: (row) => row.role
    },
    {
      id: "privilegeGroup",
      label: t("RolesAndPrivileges.TableHeaders.PermissionGroup"),
      width: "25%",
      sortable: true,
      render: (row) => row.privilegeGroup
    },
    {
      id: "active",
      label: t("RolesAndPrivileges.TableHeaders.Active"),
      width: "10%",
      render: (row) => (
        <Checkbox
          checked={row.active || false}
          onChange={(e) => changeActiveStatus(row._id, e.target.checked)}
        />
      )
    },
    {
      id: "actions",
      label: t("RolesAndPrivileges.TableHeaders.Actions"),
      width: "20%",
      render: (row) => (
        <div>
          <Button
            variant="text"
            onClick={() => handleEdit(row)}
            sx={{ mr: 1 }}
          >
            {t("Tasks.Edit")}
          </Button>
          <Button
            variant="text"
            color="error"
            onClick={() => handleDelete(row._id)}
          >
            {t("Tasks.Delete")}
          </Button>
        </div>
      )
    }
  ];

  // Calculate filtered data
  const filteredData = React.useMemo(() => {
    return data.filter(item => {
      const matchesDropdown = searchDropdown === "" ||
        (item.privilegeGroup && item.privilegeGroup.toLowerCase().includes(searchDropdown.toLowerCase()));

      const matchesSearch = searchText === "" ||
        Object.entries(item).some(([key, value]) => {
          if (value && typeof value === "string") {
            return value.toLowerCase().includes(searchText.toLowerCase());
          }
          return false;
        });

      return matchesDropdown && matchesSearch;
    });
  }, [data, searchDropdown, searchText]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  // Calculate paginated data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );


  React.useEffect(() => {
    if (page >= totalPages && totalPages > 0) {
      setPage(totalPages - 1);
    }
  }, [totalPages, page]);

  // Debug logging
  React.useEffect(() => {
    console.log('Current data:', {
      rawData: data,
      filteredData,
      pagination: {
        page,
        rowsPerPage,
        totalPages
      }
    });
  }, [data, filteredData, page, rowsPerPage]);
  useEffect(() => {
    getPrivilegesData();
    getPrivilegeGroupsData();
  }, []);

  return (
    <>
      <TitleHeader name={t("RolesAndPrivileges.PageTitle")} />

      {/* Role Information Card */}
      <Box sx={{ m: 3 }}>
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)' }}>
          <Typography variant="h5" sx={{ marginTop: "30px", fontWeight: 600, color: '#0E0E0E', fontFamily: "Montserrat", fontSize: "32px" }}>
            {t("RolesAndPrivileges.MainHeading")}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ marginTop: "30px", marginBottom: "6px", color: '#707070', fontFamily: "Work Sans", fontSize: "16px", fontWeight: "400" }}>
                {t("RolesAndPrivileges.RoleName")}
              </Typography>
              <TextField
                name="role"
                value={roleData.role}
                onChange={handleChangeSearch}
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  maxWidth: '465px',
                  '& .MuiOutlinedInput-root': {
                    height: '44px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    '& fieldset': {
                      borderColor: '1px solid #F4F4F4', // default border color
                    },
                    '&:hover fieldset': {
                      borderColor: '1px solid #F4F4F4', // b#order on hover
                    },
                    '&.Mui-focused': {
                      borderColor: ' #F4F4F4', // white on focus
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: ' #F4F4F4', // On Focus
                    },
                  },
                }}
              />

            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ marginTop: "30px", marginBottom: "6px", color: '#707070', fontFamily: "Work Sans", fontSize: "16px", fontWeight: "400" }}>
                {t("RolesAndPrivileges.Description")}
              </Typography>
              <TextField
                fullWidth
                name="description"
                multiline
                rows={4}
                value={roleData.description}
                onChange={handleChangeSearch}
                variant="outlined"
                size="small"
                sx={{
                  maxWidth: '465px', // Optional: remove if you want it 100% width
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: ' #FFFFFF',
                    '& fieldset': {
                      borderColor: '1px solid #F4F4F4', // Default
                    },
                    '&:hover fieldset': {
                      borderColor: '1px solid #F4F4F4', // On Hover
                    },
                    '&.Mui-focused': {
                      borderColor: ' #F4F4F4', // white on focus
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: ' #F4F4F4', // On Focus
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </Card>
      </Box>

      {/* Privileges Tabs Section */}
      <Box sx={{ m: 3 }}>
        <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)' }}>
          <TabsReact
            privileges={privileges}
            setPrivileges={setPrivileges}
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>

            <CustomButton
              text={editId ? t("RolesAndPrivileges.UpdateButton") : t("RolesAndPrivileges.SaveButton")}
              onClick={handleSubmit}


              IconProp={() => null}
              iconExists={true}
              sx={{ fontWeight: "500", backgroundColor: "#827e39 !important", border: "1px solid #827e39 !important", color: "#FFFFFF !important ", padding: "4px 30px !important", borderRadius: "10px !important" }}
            />
          </Box>
        </Card>
      </Box>

      {/* Grant Role Section */}
      <Box sx={{ m: 3 }}>
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)' }}>
          <Typography variant="h6" sx={{ mb: "20px", fontWeight: "400", fontFamily: "Work Sans", color: '#707070' }}>
            {t("RolesAndPrivileges.GrantRoleTo")}
          </Typography>

          <Card

            sx={{
              borderRadius: "10px",
              padding: "16px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #F4F4F4",
              maxWidth: "100%",
              boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Typography

              sx={{
                color: "#707070",
                fontSize: "12px",
                fontWeight: "400",
                fontFamily: "Work Sans",
                lineHeight: "1.6",
              }}
            >
              {t("RolesAndPrivileges.GrantRoleDescription")}
            </Typography>
          </Card>
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: "30px", mb: "40px", mt: "40px", flexWrap: 'wrap' }}>
            <CustomButton
              text={t("RolesAndPrivileges.AddButton")}
              onClick={handleAdd}
              IconProp={() => null}
              iconExists={true}
              sx={{ fontWeight: "500", backgroundColor: "#827e39 !important", border: "1px solid #827e39 !important", color: "#FFFFFF !important ", padding: "4px 30px !important", borderRadius: "20px !important" }}
            />

            <CustomButton
              text={t("RolesAndPrivileges.CancelButton")}
              onClick={handleDeleteMultiple}
              IconProp={() => null}
              iconExists={true}
              sx={{ fontWeight: "500", backgroundColor: "#FFFFFF !important", border: "1px solid #707070 !important", color: "#837F39 !important ", padding: "4px 30px !important", borderRadius: "20px !important" }}
            />

            <CustomButton
              text={t("RolesAndPrivileges.MakeActiveButton")}
              onClick={handleActiveMultiple}
              IconProp={() => null}
              iconExists={true}
              sx={{ fontWeight: "500", backgroundColor: "#FFFFFF !important", border: "1px solid #707070 !important", color: "#837F39 !important ", padding: "4px 30px !important", borderRadius: "20px !important" }}
            />

            <CustomButton
              text={t("RolesAndPrivileges.MakeInactiveButton")}
              onClick={handleInActiveMultiple}
              IconProp={() => null}
              iconExists={true}
              sx={{ fontWeight: "500", backgroundColor: "#FFFFFF !important", border: "1px solid #707070 !important", color: "#837F39 !important ", padding: "4px 30px !important", borderRadius: "20px !important" }}
            />

          </Box>

          {/* Filter Section */}


          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: "space-evenly" }}>
            <Typography sx={{ mb: 2, mt: 1, fontWeight: 500, color: '#0E0E0E', fontFamily: "Work Sans", fontSize: "16px" }}>
              {t("RolesAndPrivileges.PermissionGroupsOrUsers")}
            </Typography>
            <Box sx={{ marginLeft: "50px" }}>
              <SelectComponent
                id="searchDropdown"
                value={searchDropdown}
                onChange={(e) => setSearchDropdown(e.target.value)}
                options={mappedOptions}
                placeholder={t("RolesAndPrivileges.SelectPlaceholder")}
                fullWidth={false}
                sx={{
                  minWidth: 300,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    backgroundColor: "#f9f9f9",
                  },
                }}
              />
            </Box>
            {/* <Box sx={{ marginTop: "10px", marginLeft: "50px" }}>
              <TextField
                placeholder={t("RolesAndPrivileges.SearchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: 240,
                  border: "1px solid #837F39",
                  borderRadius: "5rem",
                  "& fieldset": { border: "none" },
                  height: "34px",
                  "& .MuiInputBase-root": {
                    height: "34px",
                    px: 1.5,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#85803c" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    "& input": {
                      p: 0,
                    },
                  },
                }}
              />
            </Box> */}
          </Box>



          {/* Table */}
          <CustomTable
            data={filteredData}
            columns={columns}
            loading={loading}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            totalPages={totalPages}
            selectedItems={selectedUsers}
            setSelectedItems={setSelectedUsers}
            search={search}
            setSearch={setSearch}
            sx={{
              '& .MuiTableCell-root': {
                padding: '8px 16px'
              }
            }}
          />
        </Card>
      </Box>

      {/* Privilege Modal */}
      {showPrivilegeModal && (
        <PrivilegeModal
          show={showPrivilegeModal}
          onHide={() => setPrivilegeModal(false)}
          handlecallback={(data) => handleCallback2(data)}
          roles={data.map((item) => ({ key: item.role, value: item._id }))}
        />
      )}
    </>
  );
}

export default RolesAndPrivileges;
