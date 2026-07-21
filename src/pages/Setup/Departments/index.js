import React, { useState, useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import "./styles.scss";
import Text from "components/Company/Text";
import HorizontalBar from "components/Company/HorizontalBar";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import paginationFactory from "react-bootstrap-table2-paginator";
import trashIcon from "assets/svg/trashIcon.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import CheckboxInput from "components/Company/CheckboxInput";
import DownloadLink from "components/Company/DownloadLink";
import BrowseFiles from "components/Company/BrowseFiles";
import UploadProgress from "components/Company/UploadProgress";
import { Col, Row } from "react-bootstrap";
import closeIcon from "assets/svg/closefile.svg";
import Grades from "../Grades";
import { useDispatch } from "react-redux";
import {
  deleteDepartment,
  createDepartment,
  updateDepartment,
  getDepartmentsData,
} from "action/DepartmentAct";
import {
  countriesNames,
  LoadingIndicator,
  statusesActive,
  Validator,
} from "utilities";
import Designation from "../Designations";
import { departmentApi } from "service/apiVariables";
import { getServiceUrl } from "service/api";
import axios from "axios";
import {
  createUpload,
  deleteUpload,
  getUploadsByCategory,
} from "action/UploadAct";
import { bytesToSize, removeDuplicates } from "utilities";
import { Toast } from "service/toast";
import TableNormal from "components/TableNormal";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import CustomTable from "pages/vihanga/components/CustomTable";
import { Box, Typography, Chip, IconButton,Button,Menu, ListItemIcon,
  ListItemText,MenuItem } from '@mui/material';
import { ArrowUpward, ArrowDownward, Edit, Delete } from '@mui/icons-material';
import { Download } from "lucide-react";
import FileUpload from "../../vihanga/components/filesUplode/draganddropFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditSvgIcon from "assets/svg/EditSvg.svg";
import DeleteSvgIcon from "assets/svg/DeleteSvg.svg";
import { FaSave } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { exportToCSV, exportToExcel, exportToPDF } from "utilities/ExportFunctions";
import ArrowDownwardOutlinedIcon from "../../../assets/svg/ExportSvg.svg";
import { canEdit, canDelete } from "utilities/privilegeHelper";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();
export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      createdAt: data[i].createdAt || "",
      departmentName: data[i].departmentName || "",
      legalEntityId: data[i].legalEntityId || null,
      legalEntityName: data[i].legalEntityName || "",
      location: data[i].location || "",
      parentDepartment: data[i].parentDepartment || "",
      parentDepartmentId: data[i].parentDepartmentId || null,
      status: data[i].status || "",
    });
  }
  return items;
};

const ActionMenu = ({ row, handleEdit, handleDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const hasEditPermission = canEdit();
  const hasDeletePermission = canDelete();
  
  // Don't render if no permissions
  if (!hasEditPermission && !hasDeletePermission) {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      <IconButton onClick={handleMenuClick} size="small">
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "1rem",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid #eee",
            minWidth: "200px",
          },
        }}
      >
        {hasEditPermission && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              handleEdit(row);
            }}
          >
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <img src={EditSvgIcon} alt="Edit" width="18" height="18" />
            </ListItemIcon>
            <ListItemText
              primary={t("departments.edit")}
              sx={{
                color: "#6D6D6D",
                fontWeight: "500",
                fontSize: "14px",
                letterSpacing: "1%",
              }}
            />
          </MenuItem>
        )}

        {hasDeletePermission && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              handleDelete(row._id);
            }}
          >
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <img src={DeleteSvgIcon} alt="Delete" width="18" height="18" />
            </ListItemIcon>
            <ListItemText
              primary={t("departments.delete")}
              sx={{
                color: "#6D6D6D",
                fontWeight: "500",
                fontSize: "14px",
                letterSpacing: "1%",
              }}
            />
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default function Departments() {
  const companyId = useSelector((store) => store.user.companyId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [, forceUpdate] = useState(false);
  const dispatch = useDispatch();
  const validator = Validator();
  const departmentObjs = [
    {
      departmentName: "",
      legalEntityName: "",
      location: "",
      parentDepartment: "",
      status: "",
      companyId,
      _id: null,
    },
  ];
  const [departmentSearch, setDepartmentSearch] = useState(departmentObjs[0]);
  const [departmentInfo, setdepartmentInfo] = useState([]);
  const [grades, setGrades] = useState([]);
  const [searchKey] = useState("");
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [isBulkUpload, setBulkUpload] = useState(true);
  const [uploads, setUploads] = useState([]);
  const [fileName, setFileName] = useState("");
  const [legalEntities, setLegalEntities] = useState([]);
  const [parentDepartments, setParentDepartments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [uploadError, setUploadError] = useState("");
  const [visibleColumns, setVisibleColumns] = useState([
    "departmentName",
    "status",
    "legalEntityName",
    "location",
    "actions",
  ]);
  const statusOptions = ["Active", "Inactive"];

  const [search, setSearch] = useState("");
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const link =
    "https://res.cloudinary.com/dbqm9svvp/raw/upload/v1688019345/talentspotifypics/Department-Template_vekak5.csv";

    const { i } = useTranslation()

  const handleExport = async ({format}) => {
    try {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    const exportData = data.map((item) => ({
      "ID": item.id || "",
      "_id": item._id || "",
      "Created At": item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }) : "",
      [t("departments.DepartmentName")]: item.departmentName || "",
      "Legal Entity ID": item.legalEntityId || "",
      [t("departments.LegalEntity")]: item.legalEntityName || "",
      [t("departments.Location")]: item.location || "",
      [t("Tasks.Status")]: item.status || "",
    }));

    switch (format) {
      case "csv":
        exportToCSV(exportData);
        break;
      case "excel":
        exportToExcel(exportData);
        break;
      case "pdf":
        exportToPDF(exportData);
        break;
      default:
        alert(`Unknown export format: ${format}`);
    }
  } catch (error) {
    console.error("Export error:", error);
    alert("Failed to export data. Please try again.");
  }
};

const columns = [
  {
    id: "departmentName",
    label:t("departments.DepartmentName"),
    render: (row) => (
      <Box sx={{ display: "flex", alignItems: "center",flexDirection: { xs: "column", sm: "row" }, 
      textAlign: { xs: "center", sm: "left" },
      px: { xs: 1, sm: 0 },  }}>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#535353",
            fontFamily: "Work Sans",
            fontWeight: "400"
          }}
        >
          {row.departmentName}
        </Typography>
        
      </Box>
    ),
  },
  {
    id: "status",
    label: t("Tasks.Status"),
    render: (row) => (
      <Box display="flex" flexDirection="column" alignItems="center">
               <Typography color={"#837F39"}>{row?.status}</Typography>
             </Box>
    ),
  },
  {
    id: "legalEntityName",
    label: t("departments.LegalEntity"),
    render: (row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#535353",
            fontFamily: "Work Sans",
            fontWeight: "400"
          }}
        >
          {row.legalEntityName}
        </Typography>
        
      </Box>
    ),
  },
  {
    id: "location",
    label: t("departments.Location"),
    render: (row) => (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#535353",
            fontFamily: "Work Sans",
            fontWeight: "400"
          }}
        >
          {row.location}
        </Typography>
        
      </Box>
    ),
  },
    {
      id: "actions",
      label: t("departments.action"),
      render: (row) => {
        const hasActions = canEdit() || canDelete();
        if (!hasActions) return null;
        
        return (
          <ActionMenu
            row={row}
            handleEdit={(data) => {
              // Use create form for editing instead of modal
              setdepartmentInfo([{
                departmentName: row.departmentName,
                legalEntityName: row.legalEntityName,
                location: row.location,
                parentDepartment: row.parentDepartment || "",
                status: row.status,
                companyId: row.companyId || companyId,
                _id: row._id,
              }]);
            }}
            handleDelete={() => handleDelete(row._id)}
            sx={{ display: "flex", alignItems: "center" }}
          />
        );
      },
    },
];
 const menuItemsExportOptions = [
    { text: "Export as CSV", format: "csv", icon: ArrowDownwardOutlinedIcon },
    {
      text: "Export as Excel",
      format: "excel",
      icon: ArrowDownwardOutlinedIcon,
    },
    { text: "Export as PDF", format: "pdf", icon: ArrowDownwardOutlinedIcon },
  ]

  const handleStatusToggle = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleChangeArray = ({ target: { name, value } }, index) => {
    let updatedData = [...departmentInfo];
    updatedData[index][name] = value;
    setdepartmentInfo(updatedData);
    setError("");
  };



  const handleAddItem = () => {
    let updatedData = [...departmentInfo];
    updatedData.push(departmentObjs[0]);
    setdepartmentInfo(updatedData);
    setError("");
  };
  const handleRemoveItem = (index) => {
    let updatedData = [...departmentInfo];
    updatedData.splice(index, 1);
    setdepartmentInfo(updatedData);
    setError("");
  };
  const handleDelete = (id) => {
    try {
      let response = dispatch(deleteDepartment(id));
      response.then(({ success, message }) => {
        if (success) {
          fetchParentDepartments();
          setError("");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const fetchParentDepartments = () => {
    try {
      setLoading(true);
      let response = dispatch(getDepartmentsData());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(
            data[0].departments,
            data[0].departments.length
          );
          setData(result);
          let result2 = data[0].departments.map((item) => {
            return { key: item.departmentName, value: item.departmentName };
          });
          setParentDepartments(result2);
          let nonduplicates = removeDuplicates(
            data[0].entities,
            "legalEntityName"
          );
          let result3 = nonduplicates
            .filter((item) => item.companyId === companyId)
            .map((item) => {
              return { key: item.legalEntityName, value: item.legalEntityName };
            });
          setLegalEntities(result3);
          let nonduplicates2 = removeDuplicates(data[0].grades, "gradeName");
          let result4 = nonduplicates2.map((item) => {
            return { key: item.gradeName, value: item.gradeName };
          });
          setGrades(result4);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
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

  const cancelUpload = () => {
    source.cancel();
  };
  useEffect(() => {
    fetchParentDepartments();
    fetchUploads();
    //eslint-disable-next-line
  }, []);

  const handleSave = () => {
    if (
      validator.current.allValid() &&
      departmentInfo[0].departmentName.length > 0 &&
      departmentInfo[0].status.length > 0 &&
      departmentInfo[0].legalEntityName.length > 0 &&
      departmentInfo[0].location.length > 0
    ) {
      const isEditMode = departmentInfo[0]._id !== null;
      
      // Check for duplicates only when creating or if name/entity changed
      const hasConflict = data.some((d) =>
        d?._id !== departmentInfo[0]._id &&
        d?.departmentName?.toLowerCase?.() === departmentInfo[0]?.departmentName?.toLowerCase?.() &&
        d?.legalEntityName?.toLowerCase?.() === departmentInfo[0]?.legalEntityName?.toLowerCase?.()
      );
      if (hasConflict) {
        Toast({
          type: "error",
          message: "Duplicate department name exists for this Legal Entity.",
        });
        return;
      }
      try {
        let result = departmentInfo.map((entity) => {
          return { ...entity };
        });
        
        if (isEditMode) {
          // Update existing department
          const updatedData = {
            _id: result[0]._id,
            legalEntityName: result[0].legalEntityName,
            status: result[0].status,
            location: result[0].location,
            departmentName: result[0].departmentName,
            companyId: result[0].companyId,
          };
          let response = dispatch(updateDepartment(result[0]._id, updatedData));
          response.then(({ success, message }) => {
            setLoading(true);
            if (success) {
              setLoading(false);
              fetchParentDepartments();
              setError("");
              setdepartmentInfo([]);
              setDepartmentSearch(departmentObjs[0]);
              Toast({
                type: "success",
                message: "Department updated successfully",
              });
            } else {
              setLoading(false);
              setError(message);
            }
          });
        } else {
          // Create new department
          let response = dispatch(createDepartment(result[0]));
          response.then(({ success, message }) => {
            setLoading(true);
            if (success) {
              setLoading(false);
              fetchParentDepartments();
              setError("");
              setdepartmentInfo([]);
              setDepartmentSearch(departmentObjs[0]);
            } else {
              setLoading(false);
              setError(message);
            }
          });
        }
      } catch (error) {
        setLoading(false);
        setError(error.toString());
      }
    } else {
      validator.current.showMessages();
      forceUpdate(true);
      Toast({
        type: "warning",
        message: "Please fill all the fields",
        time: 4000,
      });
    }
  };
  const handleFileUpload = async ({ data: departments, file, url }) => {
    const existingDepartmentNames = data.map((d) =>
      d.departmentName.toLowerCase()
    );
    const uploadedDepartmentNames = departments.map((d) =>
      d.departmentName.toLowerCase()
    );
    const duplicates = uploadedDepartmentNames.filter((name) =>
      existingDepartmentNames.includes(name)
    );

    if (duplicates.length > 0) {
      Toast({
        type: "error",
        message: "Duplicate departments exist, modify the sheet and upload.",
      });
      return;
    }
    setFileName(file.name);
    let reqBody = {
      category: "department",
      filename: file.name,
      loadedData: loaded,
      totalData: total,
      fileSize: bytesToSize(file.size),
      fileUrl: url,
      companyId,
    };
    let totalDepartments = [...departments];
    let finalDepartments = [];
    finalDepartments = totalDepartments.map((department) => {
      return {
        ...department,
        companyId,
      };
    });
    const duplicateDepartments = [...finalDepartments].filter((department) => {
      return (
        departments.filter(
          (dept) =>
            dept.departmentName === department.departmentName &&
            dept.legalEntityName === department.legalEntityName &&
            dept.location === department.location
        ).length > 1
      );
    });

    let duplicateIndexes = duplicateDepartments.map((department) => {
      return (
        departments.findIndex(
          (dept) =>
            dept.departmentName === department.departmentName &&
            dept.legalEntityName === department.legalEntityName &&
            dept.location === department.location
        ) + 2
      );
    });
    duplicateIndexes = duplicateIndexes.filter(
      (v, i, a) => a.findIndex((v2) => v2 === v) === i
    );
    if (duplicateIndexes.length > 0) {
      setUploadError(
        "Duplicate Departments found in the file. Please check line numbers " +
          duplicateIndexes.toString()
      );
    } else {
      setShowProgress(true);
      let result = await axios
        .post(
          getServiceUrl("production") +
            departmentApi.createOrUpdateMultipleDepartments.api,
          { data: finalDepartments },
          {
            onUploadProgress: (data) => {
              setTotal(finalDepartments.length);
              setLoaded(
                Math.round(
                  100 *
                    (data.loaded / data.total) *
                    (finalDepartments.length / 100)
                )
              );
              setProgress(Math.round((100 * data.loaded) / data.total));
            },
          }
        )
        .catch((err) => {
          reqBody.status = "failed";
          reqBody.loadedData = 0;
          reqBody.totalData = finalDepartments.length;
          const uploadResponse = dispatch(createUpload(reqBody));
          uploadResponse
            .then(({ success, message, id }) => {
              if (success) {
                setError("");
                setTimeout(() => {
                  setShowProgress(false);
                  fetchUploads();
                  fetchParentDepartments();
                }, 2000);
              } else {
                setTimeout(() => {
                  setShowProgress(false);
                  fetchUploads();
                  fetchParentDepartments();
                }, 2000);
                setError(message);
              }
            })
            .catch((error) => {
              console.log("error detected", error);
            });
        });
      if (result?.data?.success) {
        reqBody.status = "success";
        reqBody.loadedData = finalDepartments.length;
        reqBody.totalData = finalDepartments.length;
        const uploadResponse = dispatch(createUpload(reqBody));
        uploadResponse
          .then(({ success, message, id }) => {
            if (success) {
              setError("");
              setTimeout(() => {
                setShowProgress(false);
                fetchUploads();
                fetchParentDepartments();
              }, 2000);
            } else {
              setTimeout(() => {
                setShowProgress(false);
                fetchUploads();
                fetchParentDepartments();
              }, 2000);
            }
          })
          .catch((error) => {
            console.log("error detected", error);
          });
      } else {
        setTimeout(() => {
          setShowProgress(false);
          fetchUploads();
          fetchParentDepartments();
        }, 2000);
      }
    }
  };
  const fetchUploads = () => {
    try {
      setLoading(true);
      let response = dispatch(getUploadsByCategory("department"));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setUploads(data);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setUploads([]);
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

  const deleteUploadData = (id) => {
    try {
      let response = dispatch(deleteUpload(id));
      response.then(({ success, message }) => {
        if (success) {
          fetchUploads();
          setError("");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const searchLower = search.toLowerCase();

  const filteredData = data.filter((item) => {
    // Search matching
    const searchMatch = (text) =>
      text?.toString().toLowerCase().includes(searchLower);

    const matchesSearch = [
      item.companyEntityName,
      item.industry,
      item.legalEntityName,
      item.departmentName,
    ].some(searchMatch);

    const matchesStatus = selectedStatus.length === 0 ||

    selectedStatus.includes(item.status);

    return matchesSearch &&matchesStatus;
  });
  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
    const columnsToRender = columns.filter((col) =>
    visibleColumns.includes(col.id)
  );
  return (
    <>
<Box
  sx={{
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    minHeight: '100vh',
    padding: { xs: 2, lg: 4 },
    margin: { xs: 2, lg: 4 },
  }}
>          
<div className="company-form">
          <div style={{  paddingInline: "10px",display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <p className=" text-dark font-weight-bold pb20" style={{ margin: 0 }}>
             {t("departments.DepartmentSetup")}
            </p>
            {departmentInfo.length === 0 && canEdit() && (
              <Button
                variant="contained"
                onClick={handleAddItem}
                sx={{
                  height: "34px",
                  borderRadius: "100px",
                  backgroundColor: "#837F39",
                  color: "#FFFFFF",
                  fontWeight: 500,
                  fontSize: "12px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#6e6b32", color: "#FFFFFF" },
                }}
              >
                Add Function
              </Button>
            )}
          </div>
          {departmentInfo.map((entity, index) => (
            <div key={index} style={{ marginBottom: "30px", padding: "20px", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#fafafa" }}>
              <Text
                style={{ fontSize: "16px", fontWeight: "bold", color: "#837F39", marginBottom: "20px" }}
                text={entity._id !== null ? "Edit Function" : "Add Function"}
              />
<Row className="g-3 my-2 px-2 py-2 sm:my-0 sm:px-0 sm:py-0">
                <Col xs={12} lg={4}>
                  <TextInput
                    stackLabel={true}
                    label={t("departments.DepartmentName")}
                    name="departmentName"
                    value={entity.departmentName}
                    onChangeText={(e) => handleChangeArray(e, index)}
                          inputStyle="custom-no-margin"
                    readonly={!canEdit()}
                  />
                  {validator.current.message(
                    "departmentName",
                    entity.departmentName,
                    "required"
                  )}
                </Col>
                <Col xs={12} lg={4}>
                  <SelectInput
                    label={t("departments.Status")}
                    placeholder={t("departments.Select")}
                    name="status"
                    options={statusesActive}
                    value={entity.status}
                    onChangeText={(e) => handleChangeArray(e, index)}
                    stackLabel={true}
                    readonly={!canEdit()}
                  />
                  {validator.current.message(
                    "status",
                    entity.status,
                    "required"
                  )}
                </Col>
                <Col xs={12} lg={4}>
                  <SelectInput
                    label={t("departments.LegalEntity")}
                    placeholder="--Select--"
                    name="legalEntityName"
                    options={legalEntities}
                    value={entity.legalEntityName}
                    onChangeText={(e) => handleChangeArray(e, index)}
                    stackLabel={true}
                    readonly={!canEdit()}
                  />
                  {validator.current.message(
                    "legalEntityName",
                    entity.legalEntityName,
                    "required"
                  )}
                </Col>
              </Row>
<Row className="g-3 my-2 px-2 py-2 sm:my-0 sm:px-0 sm:py-0">
                <Col xs={12} lg={4}>
                
                
                
                <TextInput
                    label={t("departments.Location")}
                    name="location"
                    value={entity.location}
                    onChangeText={(e) => handleChangeArray(e, index)}
                    stackLabel={true}
                    inputStyle="custom-no-margin"
                    readonly={!canEdit()}
                  />
                  {validator.current.message(
                    "location",
                    entity.location,
                    "required"
                  )}
                </Col>
                {canEdit() && (
                  <Col xs={12} lg={8} className="d-flex justify-content-end align-items-center">
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={() => handleRemoveItem(index)}
                        sx={{
                          height: "34px",
                          borderRadius: "100px",
                          borderColor: "#837F39",
                          color: "#837F39",
                          fontWeight: 500,
                          fontSize: "12px",
                          textTransform: "none",
                          "&:hover": { borderColor: "#6e6b32", color: "#6e6b32" },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                          height: "34px",
                          borderRadius: "100px",
                          backgroundColor: "#837F39",
                          color: "#FFFFFF",
                          fontWeight: 500,
                          fontSize: "12px",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#6e6b32", color: "#FFFFFF" },
                        }}
                      >
                        {entity._id !== null ? "Update" : "Save"}
                      </Button>
                    </Box>
                  </Col>
                )}
              </Row>
            </div>
          ))}
          {loading ? (
            <div className="text-center">
              <LoadingIndicator size={3} />
            </div>
          ) : (
            <div style={{marginTop:'20px'}}>
                     
              <CustomTable
                data={paginatedData}
                columns={columns}
                pagination={true}
                page={page}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                totalCount={data.length}
                setPage={setPage}
                onRowsPerPageChange={(newRowsPerPage) => {
                  setRowsPerPage(newRowsPerPage);
                  setPage(0);
                }}
                search={search}
                setSearch={setSearch}
                rowsPerPageOptions={[5, 8, 10, 20]}
                isCompany={true}
                statusAnchorEl={statusAnchorEl}
                setStatusAnchorEl={setStatusAnchorEl}
                statusOptions={statusOptions}
                handleStatusToggle={handleStatusToggle}
                selectedStatus={selectedStatus}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                columnsToRender={columnsToRender}
                 onExport={handleExport}
              menuItemsExportOptions={menuItemsExportOptions}
              />
            </div>
          )}
<Box sx={{ mx: { xs: 2, sm: 0 } }}>
          <p className="m-0 fs14 text-center text-danger">
            {error.length > 0 ? error : ""}
          </p>
          <HorizontalBar className="pt-3 pb-3" />
             <Typography>{t("departments.BulkUploadofDepartment")}</Typography>
                <div className="col-md-12 m-0 p-0 d-flex justify-content-between align-items-center">
                  {canEdit() && (
                    <CheckboxInput
                      label={t("departments.BulkUploadofDepartment")}
                      name="isBulkUpload"
                      value={isBulkUpload}
                      onChangeText={(e) => setBulkUpload(!isBulkUpload)}
                    />
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<Download sx={{ width: 20, height: 20 }} />}
                    sx={{
                      // width: "160px",
          
                      height: "34px",
                      borderRadius: "100px",
                      border: "1px solid #837F39",
          
                      gap: "8px",
                      backgroundColor: "#837F39",
                      color: "#FFFFFF",
                      fontWeight: 500,
                      fontSize: "11px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#837F39",
                        color: "#FFFFFF",
                      },
                    }}
                    >
                                          <a href={link} target="_blank" style={{color:'white'}} rel="noopener noreferrer" className="download-link p-0 m-0">{t("Company.download_template")}</a>
          
                  </Button>
          
                </div>
                </Box>
                {isBulkUpload && canEdit() && (
                  <>
                      <Box
                          sx={{
                            mt: 2,
                            mx: { xs: 1, sm: 0 }, 
                          }}
                        >
                              <Typography fontWeight={500} fontSize={16}>
                        {t("departments.UploadFile")}
                      </Typography>
                      <FileUpload
                        onFileUpload={handleFileUpload}
                        id="department-file-upload"
                      />
                    </Box>
                  </>
          
              
                )}
          <HorizontalBar className="pt-2 pb-2 mt-5" />
          <Grades departments={parentDepartments} />
          <HorizontalBar className="pt-2 pb-2 mt-5" />
          <Designation grades={grades} departments={parentDepartments} />
        </div>
      </Box>
    </>
  );
}
