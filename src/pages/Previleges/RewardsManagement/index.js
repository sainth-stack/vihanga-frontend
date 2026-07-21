/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import search from "../../../assets/svg/search.svg";
import { useState } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import Table from "components/Table";
import { LoadingIndicator, Validator, removeDuplicates } from "utilities";
import { useDispatch } from "react-redux";
// import "./style.scss";
import more from "assets/svg/More.svg";
import OKRLibraryTab from "./OKRLibraryTab";
import useWindowSize from "components/UseWindowSize";
import Button from "components/Company/Button";
import CustomTable from "pages/vihanga/components/CustomTable";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import CheckboxInput from "components/Company/CheckboxInput";
import CustomButton from "pages/vihanga/components/Button/CustomButton";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import { getAllOkrTab } from "action/OKRTabAct";
import { getAllPrivilegesGroup } from "action/PrivilegesGroupAct";
import { Toast } from "service/toast";
import { downloadExcel, downloadTemplate } from "./utils";
import {
  createReward,
  deleteReward,
  deleteRewards,
  getAllRewards,
  updateReward,
} from "action/RewardManagementAct";
import { t } from "i18next";
import CommonTableHeader from "./CommonTableHeader";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
} from "utilities/ExportFunctions";
import { useTranslation } from "react-i18next";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      rewardSchemeName: data[i].rewardSchemeName,
      rewardCategory: data[i].rewardCategory,
      rewardType: data[i].rewardType,
      rewardPoints: data[i].rewardPoints,
      rewardPoints2: data[i].rewardPoints2,
      rewardPoints3: data[i].rewardPoints3,
      rewardPointsType: data[i].rewardPointsType
        ? data[i].rewardPointsType
        : t("RewardsManagement.Bronze"),
      rewardPointsType2: data[i].rewardPointsType2
        ? data[i].rewardPointsType2
        : t("RewardsManagement.Silver"),
      rewardPointsType3: data[i].rewardPointsType3
        ? data[i].rewardPointsType3
        : t("RewardsManagement.Gold"),
      kudosEnabled: data[i].kudosEnabled,
      birthdayWishesEnabled: data[i].birthdayWishesEnabled,
      approvalRequired: data[i].approvalRequired,
      anniversaryWishesEnabled: data[i].anniversaryWishesEnabled,
      objectivesAchievementPercent: data[i].objectivesAchievementPercent,
      objectivesAchievementPoints: data[i].objectivesAchievementPoints,
      okrTemplate: data[i].okrTemplate,
      krAchievementPercent: data[i].krAchievementPercent,
      krAchievementPoints: data[i].krAchievementPoints,
      taskAchievementPercent: data[i].taskAchievementPercent,
      taskAchievementPoints: data[i].taskAchievementPoints,
      subTaskAchievementPercent: data[i].subTaskAchievementPercent,
      subTaskAchievementPoints: data[i].subTaskAchievementPoints,
      eligibilityGroup: data[i].eligibilityGroup,
      updatedAt: window.moment(data[i].updatedAt).format("MM-DD-YYYY"),
    });
  }
  return items;
};
export const tableGenerator2 = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      groupName: data[i].groupName,
      activeGroupMembers: data[i].activeGroupMembers
        ? data[i].activeGroupMembers
        : 0,
      actualActiveGroupMembers: data[i].actualActiveGroupMembers
        ? data[i].actualActiveGroupMembers
        : 0,
      inActiveGroupMembers: data[i].inActiveGroupMembers
        ? data[i].inActiveGroupMembers
        : 0,
      activeGroupMembersCount: data[i].activeGroupMembers
        ? data[i].activeGroupMembers.length
        : 0,
      groupMembers: data[i].groupMembers ? data[i].groupMembers : [],
      excludeGroupMembers: data[i].excludeGroupMembers
        ? data[i].excludeGroupMembers
        : [],
      updatedAt: window.moment(data[i].updatedAt).format("DD-MM-YYYY"),
    });
  }
  return items;
};
export const tableGenerator3 = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      okrTemplateName: data[i].okrTemplateName,
      startDate: window.moment(data[i].startDate).format("YYYY-MM-DD"),
      endDate: window.moment(data[i].endDate).format("YYYY-MM-DD"),
      eligibilityGroup: data[i].eligibilityGroup,
      includingKeyResults: data[i].includingKeyResults,
      highValueRange: data[i].highValueRange,
      instructionsToUsers: data[i].instructionsToUsers,
      lowValueRange: data[i].lowValueRange,
      midValueRange: data[i].midValueRange,
      isExportOKRs: data[i].isExportOKRs,
      updatedAt: window.moment(data[i].updatedAt).format("MM-DD-YYYY hh:mm:ss"),
    });
  }
  return items;
};

function RewardsManagement() {
  const { t } = useTranslation();
  const [roleData, setRoleData] = useState({
    rewardSchemeName: "",
    rewardCategory: "",
    rewardType: "",
    rewardPointsType: t("RewardsManagement.Bronze"),
    rewardPoints: "",
    rewardPointsType2: t("RewardsManagement.Silver"),
    rewardPoints2: "",
    rewardPointsType3: t("RewardsManagement.Gold"),
    rewardPoints3: "",
    kudosEnabled: false,
    birthdayWishesEnabled: false,
    approvalRequired: false,
    anniversaryWishesEnabled: false,
    objectivesAchievementPercent: "",
    objectivesAchievementPoints: "",
    okrTemplate: "",
    krAchievementPercent: "",
    krAchievementPoints: "",
    eligibilityGroup: "",
    taskAchievementPercent: "",
    taskAchievementPoints: "",
    subTaskAchievementPercent: "",
    subTaskAchievementPoints: "",
    companyId:
      localStorage.getItem("companyId") !== null
        ? JSON.parse(localStorage.getItem("companyId"))
        : null,
  });
  const companyNameUser =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user")).company
      : null;
  const initialData = [
    {
      objectiveID: 1,
      name: "",
      type: "obj",
      okrFunction: "",
      okrCategory: "",
      keyResults: [{ objectiveID: 1, name: "", type: "kr" }],
    },
  ];
  const [objectives, setObjectives] = useState(initialData);
  const isMobile = useWindowSize();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState("");
  const [, setError] = useState(false);
  const [data, setData] = useState([]);
  const [eligibilityGroups, setEligibilityGroups] = useState([]);
  const [okrTemplates, setOKRTemplates] = useState([]);
  const dispatch = useDispatch();
  const [, forceUpdate] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [uploads] = useState([]);
  const [fileName] = useState("");
  const [showProgress] = useState(false);
  const [progress] = useState(0);
  const [loaded] = useState(0);
  const [total] = useState(0);
  const [companyName] = useState(companyNameUser);
  const validator = Validator();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);

  const handleChangeSearch = ({ target: { name, value } }) => {
    setRoleData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeSearch2 = ({ target: { name, value } }) => {
    let updatedData = { ...roleData };
    updatedData[name] = value;
    setRoleData(updatedData);
  };
  const handleChangeSearchBoolean = ({ target: { name } }) => {
    setRoleData((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  const handleSubmit = () => {
    if (validator.current.allValid()) {
      if (editId) {
        setLoading(true);
        let response = dispatch(updateReward(editId, roleData));
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
        setLoading(true);
        let response = dispatch(createReward(roleData));
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
      Toast({
        message: t("RewardsManagement.Validation.OKRRequired"),
        time: 4000,
        type: "warning",
      });
    }
  };

  const getPrivilegesData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllRewards());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = tableGenerator(data, data.length);
          setData(nonduplicate);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError(t("RewardsManagement.Messages.NoDataFound"));
          setData([]);
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
  const getPrivilegesGroups = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllPrivilegesGroup());
      response.then(({ data, message }) => {
        if (data.privilegeGroups !== undefined && data.employees.length > 0) {
          let nonduplicate = removeDuplicates(
            data.privilegeGroups,
            "groupName"
          );
          nonduplicate = tableGenerator2(nonduplicate, nonduplicate.length);
          let groups = nonduplicate.map((item) => ({
            key: item.groupName,
            value: item._id,
            activeGroupMembers: item.activeGroupMembers, // Add full member data
          }));
          setEligibilityGroups(groups);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError(t("RewardsManagement.Messages.NoDataFound"));
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
  const getOKRTemplates = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllOkrTab());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = removeDuplicates(data, "okrTemplateName");
          nonduplicate = tableGenerator3(nonduplicate, nonduplicate.length);
          let groups = nonduplicate.map((item) => ({
            key: item.okrTemplateName,
            value: item._id,
          }));
          setOKRTemplates(groups);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError(t("RewardsManagement.Messages.NoDataFound"));
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

  const handleEdit = (row) => {
    setRoleData({
      rewardSchemeName: row.rewardSchemeName,
      rewardCategory: row.rewardCategory,
      rewardType: row.rewardType,
      rewardPoints: row.rewardPoints,
      rewardPointsType: row.rewardPointsType,
      rewardPoints2: row.rewardPoints2,
      rewardPointsType2: row.rewardPointsType2,
      rewardPoints3: row.rewardPoints3,
      rewardPointsType3: row.rewardPointsType3,
      kudosEnabled: row.kudosEnabled,
      birthdayWishesEnabled: row.birthdayWishesEnabled,
      approvalRequired: row.approvalRequired,
      anniversaryWishesEnabled: row.anniversaryWishesEnabled,
      objectivesAchievementPercent: row.objectivesAchievementPercent,
      objectivesAchievementPoints: row.objectivesAchievementPoints,
      okrTemplate: row.okrTemplate,
      krAchievementPercent: row.krAchievementPercent,
      krAchievementPoints: row.krAchievementPoints,
      taskAchievementPercent: row.taskAchievementPercent,
      taskAchievementPoints: row.taskAchievementPoints,
      subTaskAchievementPercent: row.subTaskAchievementPercent,
      subTaskAchievementPoints: row.subTaskAchievementPoints,
      eligibilityGroup: row.eligibilityGroup,
    });
    setEditId(row._id);
    handleShowAdd();
  };
  const handleShowAdd = () => {
    setShow(true);
  };
  const handleCancel = () => {
    setShow(false);
    emptyData();
  };

  const emptyData = () => {
    setRoleData({
      rewardSchemeName: "",
      rewardCategory: "",
      rewardType: "",
      rewardPoints: "",
      rewardPointsType: "",
      rewardPoints2: "",
      rewardPointsType2: "",
      rewardPoints3: "",
      rewardPointsType3: "",
      kudosEnabled: false,
      birthdayWishesEnabled: false,
      approvalRequired: false,
      anniversaryWishesEnabled: false,
      objectivesAchievementPercent: "",
      objectivesAchievementPoints: "",
      okrTemplate: "",
      krAchievementPercent: "",
      krAchievementPoints: "",
      taskAchievementPercent: "",
      taskAchievementPoints: "",
      subTaskAchievementPercent: "",
      subTaskAchievementPoints: "",
      eligibilityGroup: "",
    });
    setEditId(null);
    validator.current.hideMessages();
    setShow(false);
  };

  const handleDelete = (id) => {
    let response = dispatch(deleteReward(id));
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
      let response = dispatch(deleteRewards({ data: selectedIds }));
      response.then(({ success, message }) => {
        if (success) {
          setError("");
          getPrivilegesDataRefresh();
          // window.location.reload();
        } else {
          setError(message);
        }
      });
    } else {
      alert(t("RewardsManagement.Messages.SelectRole"));
    }
  };

  const getPrivilegesDataRefresh = (searchValue = "") => {
    try {
      let response = dispatch(getAllRewards());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = tableGenerator(data, data.length);
          setData(nonduplicate);
          setError("");
        } else if (data.length === 0) {
          setData([]);
          setError(t("RewardsManagement.Messages.NoDataFound"));
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
    }
  };

  // Keyboard handler for Scheme button
  const handleSchemeKeyDown = (e, row) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleEdit(row);
    }
  };

  const columns = [
    {
      dataField: "id",
      text: t("RewardsManagement.Table.SNo"),
      csvExport: false,
      hidden: true,
    },
    {
      dataField: "rewardSchemeName",
      text: t("RewardsManagement.Table.Scheme"),
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <Box
            component="button"
            onClick={() => {
              handleEdit(row);
            }}
            onKeyDown={(e) => handleSchemeKeyDown(e, row)}
            tabIndex={0}
            aria-label={`Reward Scheme ${row.rewardSchemeName}`}
            className="anchorlink"
            sx={{
              cursor: "pointer",
              color: "#0066cc",
              textDecoration: "underline",
              border: "none",
              background: "none",
              padding: 0,
              outline: "none",
              transition: "all 0.2s ease",
              borderRadius: "4px",
              fontSize: "inherit",
              fontFamily: "inherit",
              fontWeight: "inherit",
              "&:hover": {
                opacity: 0.8,
              },
              "&:focus": {
                outline: "2px solid #0066cc",
                outlineOffset: "2px",
              },
              "&:focus-visible": {
                outline: "2px solid #0066cc",
                outlineOffset: "2px",
              },
            }}
          >
            {row.rewardSchemeName}
          </Box>
        );
      },
    },
    {
      dataField: "rewardCategory",
      text: t("RewardsManagement.Table.Category"),
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "rewardType",
      text: t("RewardsManagement.Table.Type"),
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "rewardPoints",
      text: t("RewardsManagement.Table.Points"),
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "kudosEnabled",
      text: t("RewardsManagement.Table.Kudos"),
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <p>
            {row.kudosEnabled
              ? t("RewardsManagement.Yes")
              : t("RewardsManagement.No")}
          </p>
        );
      },
    },
    {
      dataField: "birthdayWishesEnabled",
      text: t("RewardsManagement.Table.Birthday"),
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <p>
            {row.birthdayWishesEnabled
              ? t("RewardsManagement.Yes")
              : t("RewardsManagement.No")}
          </p>
        );
      },
    },
    {
      dataField: "approvalRequired",
      text: t("RewardsManagement.Table.ApprovalRequired"),
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <p>
            {row.approvalRequired
              ? t("RewardsManagement.Yes")
              : t("RewardsManagement.No")}
          </p>
        );
      },
    },
    {
      dataField: "anniversaryWishesEnabled",
      text: t("RewardsManagement.Table.Anniversary"),
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <p>
            {row.anniversaryWishesEnabled
              ? t("RewardsManagement.Yes")
              : t("RewardsManagement.No")}
          </p>
        );
      },
    },
    {
      dataField: "updatedAt",
      text: t("RewardsManagement.Table.LastModified"),
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "_id",
      text: t("RewardsManagement.Table.Action"),
      formatter: (cellContent, row) => {
        return (
          <div className="d-flex flex-wrap">
            <div className="dropdown actionDropdown">
              <button
                className="dropdown-hide d-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img src={more} alt={"more"} style={{ height: 15 }} />
              </button>
              <div
                className="dropdown-menu text-left "
                aria-labelledby="dropdownMenuButton"
              >
                <button
                  className="btn  text-capitalize fs-14 text-left justify-content-start"
                  onClick={() => {
                    handleEdit(row);
                  }}
                >
                  {t("RewardsManagement.Table.Edit")}
                </button>
                <button
                  className="btn  text-capitalize fs-14 text-left justify-content-start"
                  onClick={() => handleDelete(row._id)}
                >
                  {t("RewardsManagement.Table.Delete")}
                </button>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setSelectedUsers(selectedUsers);
  }, [selectedUsers]);
  // Add checkbox column for multi-select at the start of columns
  const checkboxColumn = {
    id: "select",
    label: (
      <input
        type="checkbox"
        checked={
          data.length > 0 &&
          data
            .filter(
              (item) =>
                item.rewardSchemeName
                  .toLowerCase()
                  .indexOf(searchText.toLowerCase()) !== -1
            )
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .every((row) => selectedUsers.some((u) => u._id === row._id))
        }
        onChange={(e) => {
          const visibleRows = data
            .filter(
              (item) =>
                item.rewardSchemeName
                  .toLowerCase()
                  .indexOf(searchText.toLowerCase()) !== -1
            )
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
          if (e.target.checked) {
            // Add all visible rows that aren't already selected
            const newSelected = [
              ...selectedUsers,
              ...visibleRows.filter(
                (row) => !selectedUsers.some((u) => u._id === row._id)
              ),
            ];
            setSelectedUsers(newSelected);
          } else {
            // Remove all visible rows from selectedUsers
            const newSelected = selectedUsers.filter(
              (u) => !visibleRows.some((row) => row._id === u._id)
            );
            setSelectedUsers(newSelected);
          }
        }}
      />
    ),
    render: (row) => (
      <input
        type="checkbox"
        checked={!!selectedUsers.find((u) => u._id === row._id)}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedUsers([...selectedUsers, row]);
          } else {
            setSelectedUsers(selectedUsers.filter((u) => u._id !== row._id));
          }
        }}
      />
    ),
    width: 40,
  };

  useEffect(() => {
    getPrivilegesData();
    getPrivilegesGroups();
    getOKRTemplates();
  }, []);

  // Export logic
  const handleExport = (format) => {
    const exportData =
      data.length > 0
        ? data.filter(
          (item) =>
            item.rewardSchemeName
              .toLowerCase()
              .indexOf(searchText.toLowerCase()) !== -1
        )
        : [];
    if (!exportData || exportData.length === 0) {
      alert(t("RewardsManagement.Messages.NoDataToExport"));
      return;
    }
    const formattedData = exportData.map((item) => ({
      [t("RewardsManagement.Export.CandidateID")]: item?.candidateId,
      [t("RewardsManagement.Export.RewardSchemeName")]: item?.rewardSchemeName,
      [t("RewardsManagement.Export.RewardCategory")]: item?.rewardCategory,
      [t("RewardsManagement.Export.RewardType")]: item?.rewardType,
      [t("RewardsManagement.Export.RewardPoints")]:
        item?.rewardPoints + item?.rewardPoints2 + item?.rewardPoints3,
      [t("RewardsManagement.Export.KudosEnabled")]:
        item?.kudosEnabled == true
          ? t("RewardsManagement.Yes")
          : t("RewardsManagement.No"),
      [t("RewardsManagement.Export.BirthdayWishesEnabled")]:
        item?.birthdayWishesEnabled == true
          ? t("RewardsManagement.Yes")
          : t("RewardsManagement.No"),
      [t("RewardsManagement.Export.ApprovalRequired")]:
        item?.approvalRequired == true
          ? t("RewardsManagement.Yes")
          : t("RewardsManagement.No"),
      [t("RewardsManagement.Export.AnniversaryWishesEnabled")]:
        item?.anniversaryWishesEnabled == true
          ? t("RewardsManagement.Yes")
          : t("RewardsManagement.No"),
      [t("RewardsManagement.Export.UpdatedAt")]: new Date(
        item?.updatedAt
      ).toLocaleDateString(),
    }));

    switch (format) {
      case "csv":
        exportToCSV(formattedData);
        break;
      case "excel":
        exportToExcel(formattedData);
        break;
      case "pdf":
        exportToPDF(formattedData);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <TitleHeader name={t("RewardsManagement.TitleHeader")} />
      <Box
        sx={{
          background: "#f8f9fa",
          borderRadius: 2,
          p: isMobile ? 2 : 4,
          m: isMobile ? 0 : 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="text.primary"
          align={isMobile ? "center" : "left"}
          sx={{ mb: isMobile ? 2 : 3 }}
        >
          {t("RewardsManagement.Title")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: "flex-end",
            mb: 2,
            gap: 2,
          }}
        >
          <CustomButton
            disabled={selectedUsers.length > 1}
            key={"create"}
            text={t("RewardsManagement.Buttons.Create")}
            color={"#fff"}
            backgroundColor={"#85803c"}
            onClick={handleShowAdd}
            iconExists={true}
            IconProp={() => null}
            sx={{
              margin: "0 0 .3rem .5rem",
              maxHeight: "2rem",
              padding: " .5rem",
              fontWeight: 500,
              borderRadius: "5rem",
              fontFamily: "Work Sans",
            }}
          />
          {selectedUsers.length > 0 && (
            <CustomButton
              onClick={handleDeleteMultiple}
              key={"createRewards"}
              text={t("RewardsManagement.Buttons.CreateRewards")}
              color={"#fff"}
              backgroundColor={"#85803c"}
              iconExists={true}
              IconProp={() => null}
              sx={{
                margin: "0 0 .3rem .5rem",
                maxHeight: "2rem",
                padding: " .5rem",
                fontWeight: 500,
                borderRadius: "5rem",
                fontFamily: "Work Sans",
              }}
            />
          )}
        </Box>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <LoadingIndicator size={3} />
          </Box>
        ) : (
          <CustomTable
            header={
              <CommonTableHeader
                searchText={searchText}
                setSearchText={setSearchText}
                handleExport={handleExport}
              />
            }
            columns={[
              checkboxColumn,
              ...columns.map((col, idx) => ({
                ...col,
                id: col.dataField,
                label: col.text,
                render: col.formatter
                  ? (row) => col.formatter(row[col.dataField], row)
                  : undefined,
                key: col.dataField + "-col-" + idx,
              })),
            ]}
            data={
              data.length > 0
                ? data
                  .filter(
                    (item) =>
                      item.rewardSchemeName
                        .toLowerCase()
                        .indexOf(searchText.toLowerCase()) !== -1
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : []
            }
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            pagination={true}
            selectedItems={selectedUsers}
            setSelectedItems={setSelectedUsers}
            sx={{ tableSx: { minWidth: 650 } }}
            showHeader={false}
          />
        )}
        {show && (
          <OKRLibraryTab
            companyName={companyName}
            roleData={roleData}
            handleChangeSearch={handleChangeSearch}
            handleChangeSearch2={handleChangeSearch2}
            objectives={objectives}
            validator={validator}
            downloadExcel={() => downloadExcel(data, roleData)}
            downloadTemplate={downloadTemplate}
            handleCancel={handleCancel}
            setObjectives={setObjectives}
            handleSubmit={handleSubmit}
            handleChangeSearchBoolean={handleChangeSearchBoolean}
            isMobile={isMobile}
            showProgress={showProgress}
            fileName={fileName}
            progress={progress}
            loaded={loaded}
            total={total}
            uploads={uploads}
            eligibilityGroups={eligibilityGroups}
            okrTemplates={okrTemplates}
          />
        )}
      </Box>
    </>
  );
}

export default RewardsManagement;
