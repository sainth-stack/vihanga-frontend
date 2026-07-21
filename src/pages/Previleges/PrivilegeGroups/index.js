/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import {
  Validator,
  removeDuplicates,
} from "utilities";
import {
  createPrivilegeGroup,
  deletePrivilegeGroup,
  deletePrivilegeGroupMultiple,
  getAllPrivilegesGroup,
  updatePrivilegeGroup,
  updatePrivilegesGroupActive,
  updatePrivilegesGroupInActive,
} from "action/PrivilegesGroupAct";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "service/toast";
import "./index.css";
import GroupForm from "./GroupForm";
import ArrowDownwardOutlinedIcon from "../../../assets/svg/ExportSvg.svg";
import { exportToCSV, exportToExcel, exportToPDF } from "utilities/ExportFunctions";
import {
  filterFinalItems,
  filterFinalItemsDelete,
  inActivefilterFinalItems,
} from "./filterItemsData";
import { previleges } from "reducer/privilegesGroup";
import { t } from "i18next";
import CustomTable from "pages/vihanga/components/CustomTable";
import { Box, Typography,Button, Checkbox, Stack, CircularProgress } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import ActionDropdown from "pages/vihanga/components/ActionDropdown/ActionDropdown";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { canEdit, canDelete } from "utilities/privilegeHelper";

export const tableGenerator = (data, length) => {
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
function PrivilegeGroups() {
  const roleData = useSelector((store2) => store2.previlage.privilegeGroup);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [, setError] = useState(false);
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const dispatch = useDispatch();
  const [, forceUpdate] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const validator = Validator();
     const { t } = useTranslation();
  
const [filters, setFilters] = useState({
    groupName: "",
    groupMembers: "",
    excludeGroupMembers: "",
    activeGroupMembers: "",
  });
    const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchKey, setSearchKey] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
const companyId =
  localStorage.getItem("companyId") !== null
    ? JSON.parse(localStorage.getItem("companyId"))
   : null;

  const handleChangeSearch = ({ target: { name, value, label } }) => {
    let updatedData = { ...roleData };
    updatedData[name] = value;
    dispatch(previleges(updatedData));
  };
const wrapSelectOnChange = (index, fieldName, handler) => (val) => {
  const extractedValue = val?.target?.value || val?.value || val;
  handler(index)({
    target: {
      name: fieldName,      
      value: extractedValue,
    },
  });
};

  const handleChangeGroupMembers = (index) => {
    return (event) => {
    const { name, value } = event.target; 
      let updatedData = [...roleData.groupMembers];
      let updatedDatas = { ...roleData };
      let activeGroupMembers = [...roleData.activeGroupMembers];
      if (name === "categoryName" && value === "Designation") {
        let categories = employees
          .filter(
            (item) => item.employmentInformation.designation !== undefined
          )
          .map((item) => ({
            value: item.employmentInformation.designation,
            key: item.employmentInformation.designation,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Department") {
        let categories = employees
          .filter((item) => item.employmentInformation.department !== undefined)
          .map((item) => ({
            value: item.employmentInformation.department,
            key: item.employmentInformation.department,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Grade") {
        let categories = employees
          .filter((item) => item.employmentInformation.grade !== undefined)
          .map((item) => ({
            value: item.employmentInformation.grade,
            key: item.employmentInformation.grade,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Legal Entity") {
        let categories = employees
          .filter((item) => item.employmentInformation.legalEntity !== undefined)
          .map((item) => ({
            value: item.employmentInformation.legalEntity,
            key: item.employmentInformation.legalEntity,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Hire Date") {
        let hireDateOptions = [
          { key: "<", value: "<" },
          { key: ">", value: ">" },
          { key: "==", value: "==" },
        ];
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: hireDateOptions,
          categoryName: value,
        };
      }
      if (name === "categoryValue") {
        if (updatedData[index]["categoryName"] === "Designation") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.designation === value
          );
          updatedDatas.activeGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.activeGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
        } else if (updatedData[index]["categoryName"] === "Department") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.department === value
          );
          updatedDatas.activeGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.activeGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
        } else if (updatedData[index]["categoryName"] === "Grade") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.grade === value
          );
          updatedDatas.activeGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.activeGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
        } else if (updatedData[index]["categoryName"] === "Legal Entity") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.legalEntity === value
          );
          updatedDatas.activeGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.activeGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
        } else if (updatedData[index]["categoryName"] === "Hire Date") {
          updatedData[index] = { ...updatedData[index], categoryValue: value };
        }
      }
      if (
        name === "categoryValueText" &&
        updatedData[index]["categoryName"] === "Hire Date"
      ) {
        if (updatedData[index].categoryValue.length > 0) {
          let activeMembers = employees.filter((item) => {
            if (updatedData[index].categoryValue === "<") {
              return (
                window
                  .moment(item.employmentInformation.hireDate)
                  .format("DD-MM-YYYY") <
                window.moment(value).format("DD-MM-YYYY")
              );
            } else if (updatedData[index].categoryValue === ">") {
              return (
                window
                  .moment(item.employmentInformation.hireDate)
                  .format("DD-MM-YYYY") >
                window.moment(value).format("DD-MM-YYYY")
              );
            } else if (updatedData[index].categoryValue === "==") {
              return (
                window
                  .moment(item.employmentInformation.hireDate)
                  .format("DD-MM-YYYY") ==
                window.moment(value).format("DD-MM-YYYY")
              );
            }
          });
          updatedDatas.activeGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.activeGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
          };
        } else {
          alert("Please select category value!");
        }
      }
      updatedDatas.groupMembers = updatedData;
      filterFinalItems(
        activeGroupMembers,
        updatedDatas,
        updatedDatas.groupMembers,
        dispatch
      );
    };
  };
  const handleChangeExcludeGroupMembers = (index) => {
    return ({ target: { name, value } }) => {
      let updatedData = [...roleData.excludeGroupMembers];
      let updatedDatas = { ...roleData };
      let activeGroupMembers = [...roleData.inActiveGroupMembers];
      if (name === "categoryName" && value === "Designation") {
        let categories = employees
          .filter(
            (item) => item.employmentInformation.designation !== undefined
          )
          .map((item) => ({
            value: item.employmentInformation.designation,
            key: item.employmentInformation.designation,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Department") {
        let categories = employees
          .filter((item) => item.employmentInformation.department !== undefined)
          .map((item) => ({
            value: item.employmentInformation.department,
            key: item.employmentInformation.department,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Grade") {
        let categories = employees
          .filter((item) => item.employmentInformation.grade !== undefined)
          .map((item) => ({
            value: item.employmentInformation.grade,
            key: item.employmentInformation.grade,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Legal Entity") {
        let categories = employees
          .filter((item) => item.employmentInformation.legalEntity !== undefined)
          .map((item) => ({
            value: item.employmentInformation.legalEntity,
            key: item.employmentInformation.legalEntity,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Hire Date") {
        let hireDateOptions = [
          { key: "<", value: "<" },
          { key: ">", value: ">" },
          { key: "==", value: "==" },
        ];
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: hireDateOptions,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Email") {
        let emails = [...updatedDatas.activeGroupMembers].map((item) => ({
          value: item.contactInformation.email,
          key: item.contactInformation.email,
        }));
        let nonduplicate = removeDuplicates(emails, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      }
      if (name === "categoryValue") {
        if (updatedData[index]["categoryName"] === "Designation") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.designation === value
          );
          updatedDatas.inActiveGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.inActiveGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
          updatedData[index].categoryValueText = value;
          updatedData[index][name] = value;
        } else if (updatedData[index]["categoryName"] === "Department") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.department === value
          );
          updatedDatas.inActiveGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.inActiveGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
          updatedData[index].categoryValueText = value;
          updatedData[index][name] = value;
        } else if (updatedData[index]["categoryName"] === "Grade") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.grade === value
          );
          updatedDatas.inActiveGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.inActiveGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
          updatedData[index].categoryValueText = value;
          updatedData[index][name] = value;
        } else if (updatedData[index]["categoryName"] === "Legal Entity") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.legalEntity === value
          );
          updatedDatas.inActiveGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.inActiveGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
          updatedData[index].categoryValueText = value;
          updatedData[index][name] = value;
        } else if (updatedData[index]["categoryName"] === "Hire Date") {
          updatedData[index] = { ...updatedData[index], categoryValue: value };
          updatedData[index][name] = value;
        } else if (updatedData[index]["categoryName"] === "Email") {
          let activeMembers = employees.filter(
            (item) => item.contactInformation.email === value
          );
          updatedDatas.inActiveGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.inActiveGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
          updatedData[index].categoryValueText = value;
          updatedData[index][name] = value;
        }
      }
      if (
        name === "categoryValueText" &&
        updatedData[index]["categoryName"] === "Hire Date"
      ) {
        if (updatedData[index].categoryValue.length > 0) {
          let activeMembers = employees.filter((item) => {
            if (updatedData[index].categoryValue === "<") {
              return (
                window
                  .moment(item.employmentInformation.hireDate)
                  .format("DD-MM-YYYY") <
                window.moment(value).format("DD-MM-YYYY")
              );
            } else if (updatedData[index].categoryValue === ">") {
              return (
                window
                  .moment(item.employmentInformation.hireDate)
                  .format("DD-MM-YYYY") >
                window.moment(value).format("DD-MM-YYYY")
              );
            } else if (updatedData[index].categoryValue === "==") {
              return (
                window
                  .moment(item.employmentInformation.hireDate)
                  .format("DD-MM-YYYY hh:mm") ==
                window.moment(value).format("DD-MM-YYYY hh:mm")
              );
            }
          });
          updatedDatas.inActiveGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.inActiveGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
          };
        } else {
          alert("Please select category value!");
        }
      }
      updatedDatas.excludeGroupMembers = updatedData;
      inActivefilterFinalItems(
        activeGroupMembers,
        updatedDatas,
        updatedDatas.excludeGroupMembers,
        dispatch
      );
    };
  };
  const handleSubmit = () => {
    if (!roleData.groupName || roleData.groupName.trim() === "") {
    Toast({
  message: t("PrivilegeGroups.GroupNameIsRequired"),
      type: "error",
    });
    return; 
  }
    if (validator.current.allValid()) {
      if (editId) {
        let finalInActiveMembers =
          roleData.inActiveGroupMembers &&
          roleData.inActiveGroupMembers.length > 0
            ? [...roleData.inActiveGroupMembers].map((item) => item._id)
            : [];
        let finalActiveMembers =
          finalInActiveMembers.length > 0
            ? [...roleData.activeGroupMembers].filter(
                (item) => !finalInActiveMembers.includes(item._id)
              )
            : roleData.activeGroupMembers;
        const finalData = {
          ...roleData,
          actualActiveGroupMembers: roleData.activeGroupMembers,
          activeGroupMembers: finalActiveMembers,
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(updatePrivilegeGroup(editId, finalData));
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
        let finalInActiveMembers =
          roleData.inActiveGroupMembers &&
          roleData.inActiveGroupMembers.length > 0
            ? [...roleData.inActiveGroupMembers].map((item) => item._id)
            : [];
        let finalActiveMembers =
          finalInActiveMembers.length > 0
            ? [...roleData.activeGroupMembers].filter(
                (item) => !finalInActiveMembers.includes(item._id)
              )
            : roleData.activeGroupMembers;
        const finalData = {
          ...roleData,
          actualActiveGroupMembers: roleData.activeGroupMembers,
          activeGroupMembers: finalActiveMembers,
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(createPrivilegeGroup(finalData));
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

  const getPrivilegesData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllPrivilegesGroup());
      response.then(({ data, message }) => {
        if (data.privilegeGroups !== undefined && data.employees.length > 0) {
          let nonduplicate = removeDuplicates(
            data.privilegeGroups,
            "groupName"
          );
          nonduplicate = tableGenerator(nonduplicate, nonduplicate.length);
          setData(nonduplicate);
          setEmployees(data.employees);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
setError(t("PrivilegeGroups.NoDataFound"));
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
      let response = dispatch(getAllPrivilegesGroup());
      response.then(({ data, message }) => {
        if (data.privilegeGroups !== undefined && data.employees.length > 0) {
          let nonduplicate = removeDuplicates(
            data.privilegeGroups,
            "groupName"
          );
          nonduplicate = tableGenerator(nonduplicate, nonduplicate.length);
          setData(nonduplicate);
          setEmployees(data.employees);
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

  const handleEdit = (row) => {
    let privilegeGroup = {
      groupName: row.groupName,
      groupMembers: row.groupMembers,
      excludeGroupMembers: row.excludeGroupMembers,
      activeGroupMembers: row.activeGroupMembers,
    };
    dispatch(previleges(privilegeGroup));
    setEditId(row._id);
  };
  const handleEditCopy = (row) => {
    let privilegeGroup = {
      groupName: row.groupName,
      groupMembers: row.groupMembers,
      excludeGroupMembers: row.excludeGroupMembers,
      activeGroupMembers: row.activeGroupMembers,
    };
    dispatch(previleges(privilegeGroup));
  };

  const emptyData = () => {
    let privilegeGroup = {
      groupName: "",
      groupMembers: [
        {
          categoryName: "",
          categoryValues: [],
          categoryValue: "",
          categoryValueText: "",
        },
      ],
      excludeGroupMembers: [
        {
          categoryName: "",
          categoryValues: [],
          categoryValue: "",
          categoryValueText: "",
        },
      ],
      activeGroupMembers: [],
    };
    dispatch(previleges(privilegeGroup));
    setEditId(null);
    validator.current.hideMessages();
  };

  const handleAdd = () => {
    setEditId(null);
    emptyData();
    // this is dummy empty data
  };
  const handleDelete = (id) => {
    let response = dispatch(deletePrivilegeGroup(id));
    response.then(({ success, message }) => {
      if (success) {
        setError("");
        getPrivilegesDataRefresh();
      } else {
        setError(message);
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
  
  useEffect(() => {
    getPrivilegesData();
  }, []);


 const handleExport = async (item) => {
    try {
           let response = await dispatch(getAllPrivilegesGroup());
           console.log("response",response);
      if (response?.success) {
      const rawData = response.data.privilegeGroups;
        console.log("rawData",rawData);
        if (!rawData || rawData.length === 0) { 
          alert("No data available for export.");
          return; 
        }
       const formattedData = rawData.map((entry) => ({
          groupName: entry.groupName||"",
      groupMembers: entry.groupMembers||"",
      excludeGroupMembers: entry.excludeGroupMembers||"",
      activeGroupMembers: entry.activeGroupMembers||"",
      updatedAt: entry.updatedAt||"",
        }));

        // Export according to selected format
        switch (item.format) {
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
            alert(`Unknown export format: ${item.format}`);
            return;
        }

        Toast({
          message: `Exported as ${item.format.toUpperCase()}`,
          type: "success",
        });
      } else {
        alert("Failed to fetch export data.");
      }
    } catch (err) {
      console.error("Export Error:", err);
      Toast({
        message: err.response?.data?.message || "Failed to export data",
        type: "error",
      });
    }
  };

const menuItemsExportOptions = [
    { text: "Export as CSV", format: "csv", icon: ArrowDownwardOutlinedIcon },
    {
      text: "Export as Excel",
      format: "excel",
      icon: ArrowDownwardOutlinedIcon,
    },
    { text: "Export as PDF", format: "pdf", icon: ArrowDownwardOutlinedIcon },
  ];
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
          sx={{
        "& .MuiSvgIcon-root": {
          fontSize: 22,
            color: "#B0B0B0" // ✅ Light gray color for unchecked state

        },
        "&.Mui-checked": {
          color: "#837F39", 
        },
      }}
        />
      ),
    },
    {
      id: "groupName",
      label: renderHeader(t("PrivilegeGroups.GroupName"), "groupName"),
      render: (row) => row.groupName,
    },
    {
      id: "description",
      label: renderHeader(t("PrivilegeGroups.UserType"), "description"),
      render: (row) => row.description,
    },
    {
      id: "descriptions",
      label: renderHeader(t("PrivilegeGroups.SonicOfDynamic"), "descriptions"),
      render: (row) => row.descriptions,
    },
{
      id: "activeGroupMembersCount",
      label:renderHeader(t("PrivilegeGroups.ActiveMembership"), "activeGroupMembersCount"),
      render: (row) => row.activeGroupMembersCount,
    },
    {
      id: "updatedAt",
      label:renderHeader(t("PrivilegeGroups.LastModified"), "updatedAt"),
      render: (row) => row.updatedAt,
    },
    {
      id: "action",
      label: <span style={{ fontWeight: 500 }}>{t("PrivilegeGroups.Action")}</span>,
      render: (row) => {
        const actions = [];
        
        if (canEdit()) {
          actions.push({
            label: t("PrivilegeGroups.Edit"),
            icon: <BorderColorIcon fontSize="small" />,
            onClick: () => {
              handleEdit(row);
            },
          });
        }
        
        if (canDelete()) {
          actions.push({
            label: t("PrivilegeGroups.Delete"),
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
    <>
<Box
  sx={{
    borderRadius: "12px",
    minHeight: "100%",
    padding: 4,
    margin: 4,
  }}
>        
        <Box
          sx={{
            backgroundColor: "#fff",
            boxShadow: 2,
            borderRadius: "12px",
            p: 3,
            mb:3
          }}
          >
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}>
              <Typography
                sx={{
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: "28px",
                  pb: 1,
                }}
              >
  {t("PrivilegeGroups.PrivilegeGroups")}
              </Typography>

              {canEdit() && (
                <Button
                  variant="contained"
                  onClick={handleAdd}
                  sx={{
                    backgroundColor: "#837F39",
                    borderRadius: "40px",
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "bold",
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    "&:hover": {
                      backgroundColor: "#837F39",
                    },
                  }}
                >
                  {t("PrivilegeGroups.CreateNewGroup")}
                </Button>
              )}
            </Box>
          {loading ? (
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress size={30} />
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
                        menuItemsExportOptions={menuItemsExportOptions}
                        onExport={handleExport}
                        pagination
                        setFilters={setFilters}
                        filters={filters}
                      />
                    </Box>
          )}
          </Box>
          {employees.length > 0 && (
            <GroupForm
              roleData={roleData}
              handleChangeSearch={handleChangeSearch}
              handleAdd={handleAdd}
              handleChangeGroupMembers={handleChangeGroupMembers}
              wrapSelectOnChange={wrapSelectOnChange}
              handleChangeExcludeGroupMembers={handleChangeExcludeGroupMembers}
              dispatch={dispatch}
              handleSubmit={handleSubmit}
              filterFinalItems={filterFinalItems}
              filterFinalItemsDelete={filterFinalItemsDelete}
            />
          )}
      </Box>
    </>
  );
}

export default PrivilegeGroups;
