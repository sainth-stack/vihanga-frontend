import React, { useState, useEffect } from "react";
import "./styles.scss";
import Text from "components/Company/Text";
import HorizontalBar from "components/Company/HorizontalBar";
import paginationFactory from "react-bootstrap-table2-paginator";
import trashIcon from "assets/svg/trashIcon.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import CheckboxInput from "components/Company/CheckboxInput";
import DownloadLink from "components/Company/DownloadLink";
import BrowseFiles from "components/Company/BrowseFiles";
import { useDispatch } from "react-redux";
import { t } from "i18next";
import "./styles.scss";
import { getGrades, deleteGrade, updateGrade, createOrUpdateMultipleGrades } from "action/GradeAct";
import { gradeApi } from "service/apiVariables";
import { getServiceUrl } from "service/api";
import axios from "axios";
import {
  createUpload,
  deleteUpload,
  getUploadsByCategory,
} from "action/UploadAct";
import { bytesToSize, LoadingIndicator, Validator, statusesActive } from "utilities";
import UploadProgress from "components/Company/UploadProgress";
import TableNormal from "components/TableNormal";
import CustomTable from "pages/vihanga/components/CustomTable";
import { Box, Typography, Chip, IconButton,Button, ListItemIcon,
  ListItemText,MenuItem,Menu } from '@mui/material';
import { ArrowUpward, ArrowDownward, Edit, Delete } from '@mui/icons-material';
import FileUpload from "../../vihanga/components/filesUplode/draganddropFile";
import { Download } from "lucide-react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditSvgIcon from "assets/svg/EditSvg.svg";
import DeleteSvgIcon from "assets/svg/DeleteSvg.svg";
import { Row, Col } from "react-bootstrap";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import { canEdit, canDelete } from "utilities/privilegeHelper";
import save from "assets/svg/save.svg";
import add from "assets/svg/add.svg";
import closeIcon from "assets/svg/closefile.svg";
import { Toast } from "service/toast";
import { FaSave } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { exportToCSV, exportToExcel, exportToPDF } from "utilities/ExportFunctions";
import ArrowDownwardOutlinedIcon from "../../../assets/svg/ExportSvg.svg";


const CancelToken = axios.CancelToken;
const link =
  "https://res.cloudinary.com/dbqm9svvp/raw/upload/v1688019346/talentspotifypics/Grade-Template_lm2kfj.csv";
const source = CancelToken.source();

const getGradeKey = (grade) =>
  `${(grade.gradeName || "").toLowerCase()}|${(grade.departmentName || "No Function").toLowerCase()}`;

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      gradeName: data[i].gradeName,
      departmentName: data[i].departmentName || "No Function",
      status: data[i].status || "Active",
      designationName: data[i].designationName,
      departmentId: data[i].departmentId,
      designationId: data[i].designationId,
    });
  }
  return items;
};

const ActionMenu = ({ row, handleEdit, handleDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const {t} = useTranslation();

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

export default function Grades({ departments }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const [searchKey] = useState("");
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [isBulkUpload3, setBulkUpload3] = useState(true);
  const [uploads, setUploads] = useState([]);
  const [fileName, setFileName] = useState("");
  const [search, setSearch] = useState("");
    const [statusAnchorEl, setStatusAnchorEl] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([
        "id",
        "gradeName",
        "departmentName",
        "status",
        "actions",
      ]);
        const [page, setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(8);
      const statusOptions = ["Active", "Inactive"];

  const validator = Validator();
  const [, forceUpdate] = useState(false);
  const [gradeInfo, setGradeInfo] = useState([]);
  const gradeObj = {
    gradeName: "",
    departmentName: "No Function",
    status: "Active",
  };

  const {t} = useTranslation();

  const handleChangeArray = ({ target: { name, value } }, index) => {
    let updatedData = [...gradeInfo];
    updatedData[index][name] = value;
    setGradeInfo(updatedData);
    setError("");
  };

  const handleAddItem = () => {
    let updatedData = [...gradeInfo];
    updatedData.push(gradeObj);
    setGradeInfo(updatedData);
    setError("");
  };

  const handleRemoveItem = (index) => {
    let updatedData = [...gradeInfo];
    updatedData.splice(index, 1);
    setGradeInfo(updatedData);
    setError("");
  };

  const handleSave = () => {
    if (validator.current.allValid() && gradeInfo[0].gradeName.length > 0 &&  gradeInfo[0].status.length > 0) {
      const isEditMode = gradeInfo[0]._id !== undefined && gradeInfo[0]._id !== null;
      
      // Duplicate only when grade name and function both match
      const isDuplicate = data.some(
        (grade) =>
          grade._id !== gradeInfo[0]._id &&
          grade.gradeName?.toLowerCase() === gradeInfo[0].gradeName?.toLowerCase() &&
          (grade.departmentName || "No Function")?.toLowerCase() ===
            (gradeInfo[0].departmentName || "No Function")?.toLowerCase()
      );

      if (isDuplicate) {
        Toast({
          type: "error",
          message: "A grade with the same name and function already exists.",
        });
        return;
      }
      setLoading(true);
      
      if (isEditMode) {
        // Update existing grade
        const updateGradeData = {
          _id: gradeInfo[0]._id,
          gradeName: gradeInfo[0].gradeName,
          departmentName: gradeInfo[0].departmentName || "No Function",
          status: gradeInfo[0].status,
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        let result = dispatch(updateGrade(gradeInfo[0]._id, updateGradeData));
        result.then((response) => {
          setLoading(false);
          if (response.success) {
            refreshData();
            setError("");
            setGradeInfo([]);
            Toast({
              type: "success",
              message: "Grade updated successfully",
            });
          } else {
            setError(response.message);
          }
        }).catch((error) => {
          setLoading(false);
          setError(error.toString());
        });
      } else {
        // Create new grade
        const newGrade = {
          ...gradeInfo[0],
          departmentName: gradeInfo[0].departmentName || "No Function",
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };

        const body = { data: [newGrade] };
        
        dispatch(createOrUpdateMultipleGrades(body))
          .then(({ success, message }) => {
              setLoading(false);
              if (success) {
                  refreshData();
                  setError("");
                  setGradeInfo([]);
              } else {
                  setError(message);
              }
          })
          .catch((error) => {
              setLoading(false);
              setError(error.toString());
          });
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
 const menuItemsExportOptions = [
    { text: "Export as CSV", format: "csv", icon: ArrowDownwardOutlinedIcon },
    {
      text: "Export as Excel",
      format: "excel",
      icon: ArrowDownwardOutlinedIcon,
    },
    { text: "Export as PDF", format: "pdf", icon: ArrowDownwardOutlinedIcon },
  ]
const handleExport = async ({format}) => {
  try {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }

    const exportData = data.map((item) => ({
      "ID": item.id || "",
      "_id": item._id || "",
      "Grade Name": item.gradeName || "",
      "Function Name": item.departmentName || "",
      "Status": item.status || "",
      "Designation Name": item.designationName || "",
      "Department ID": item.departmentId || "",
      "Designation ID": item.designationId || "",
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
    id: "id",
    label: t("departments.s.no"),
    render: (row) => (
      <Typography
        sx={{
          fontSize: "14px",
          color: "#535353",
          fontFamily: "Work Sans",
          fontWeight: "400"
        }}
      >
        {row.id}
      </Typography>
    ),
  },
  {
    id: "gradeName",
    label: t("departments.gradeName"),
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
          {row.gradeName}
        </Typography>
        
      </Box>
    ),
  },
  {
    id: "departmentName",
    label: t("departments.departmentName"),
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
          {row.departmentName || "No Function"}
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
    id: "actions",
    label: t("departments.actions"),
    render: (row) => {
      const hasActions = canEdit() || canDelete();
      if (!hasActions) return null;
      
      return (
        <ActionMenu
          row={row}
          handleEdit={(data) => {
            // Use create form for editing instead of modal
            setGradeInfo([{
              gradeName: row.gradeName,
              departmentName: row.departmentName || "No Function",
              status: row.status,
              _id: row._id,
            }]);
          }}
          handleDelete={() => handleDelete(row)}
          sx={{ display: "flex", alignItems: "center" }}
        />
      );
    },
  },
];

    const handleStatusToggle = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };
     const searchLower = search.toLowerCase();

  const filteredData = data.filter((item) => {
    // Search matching
    const searchMatch = (text) =>
      text?.toString().toLowerCase().includes(searchLower);

    const matchesSearch = [
      item.departmentName,
      item.gradeName,
      item.designationName,
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
  
  const handleDelete = (data) => {
    try {
      let response = dispatch(deleteGrade(data._id));
      response.then(({ success, message }) => {
        if (success) {
          refreshData();
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

  const fetchGrades = () => {
    try {
      setLoading(true);
      let response = dispatch(getGrades());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(data, data.length);
          setData(result);
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
  useEffect(() => {
    fetchGrades();
    fetchUploads();
    //eslint-disable-next-line
  }, []);

  const refreshData = () => {
    try {
      let response = dispatch(getGrades());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(data, data.length);
          setData(result);
          setError("");
        } else if (data.length === 0) {
          setData([]);
          setError("No Data Found!");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
    }
  };

  const handleFileUpload = async ({ data: grades, file, url }) => {
    const existingKeys = new Set(data.map(getGradeKey));
    const seenInUpload = new Set();

    const hasDuplicate = grades.some((grade) => {
      const key = getGradeKey(grade);
      if (existingKeys.has(key) || seenInUpload.has(key)) {
        return true;
      }
      seenInUpload.add(key);
      return false;
    });

    if (hasDuplicate) {
      Toast({
        type: "error",
        message: "Duplicate grade and function combination exists. Modify the sheet and upload.",
      });
      return;
    }
    setShowProgress(true);
    setFileName(file.name);
    let reqBody = {
      category: "grade",
      filename: file.name,
      loadedData: loaded,
      totalData: total,
      fileSize: bytesToSize(file.size),
      fileUrl: url,
      companyId:
        localStorage.getItem("companyId") !== null
          ? JSON.parse(localStorage.getItem("companyId"))
          : null,
    };
    let totalDepartments = [...grades];
    let finalGrades = [];
    finalGrades = totalDepartments.map((grade) => {
      return {
        ...grade,
        departmentName: grade.departmentName || "No Function",
        companyId:
          localStorage.getItem("companyId") !== null
            ? JSON.parse(localStorage.getItem("companyId"))
            : null,
      };
    });
    let result = await axios
      .post(
        getServiceUrl("production") + gradeApi.createOrUpdateMultipleGrades.api,
        { data: finalGrades },
        {
          onUploadProgress: (data) => {
            setTotal(totalDepartments.length);
            setLoaded(
              Math.round(
                100 *
                  (data.loaded / data.total) *
                  (totalDepartments.length / 100)
              )
            );
            setProgress(Math.round((100 * data.loaded) / data.total));
          },
        }
      )
      .catch((err) => {
        reqBody.status = "failed";
        reqBody.loadedData = totalDepartments.length;
        reqBody.totalData = totalDepartments.length;
        const uploadResponse = dispatch(createUpload(reqBody));
        uploadResponse
          .then(({ success, message, id }) => {
            if (success) {
              setError("");
              setTimeout(() => {
                setShowProgress(false);
                fetchUploads();
                refreshData();
              }, 2000);
            } else {
              setTimeout(() => {
                setShowProgress(false);
                fetchUploads();
                refreshData();
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
      reqBody.loadedData = totalDepartments.length;
      reqBody.totalData = totalDepartments.length;
      const uploadResponse = dispatch(createUpload(reqBody));
      uploadResponse
        .then(({ success, message, id }) => {
          if (success) {
            setError("");
            setTimeout(() => {
              setShowProgress(false);
              fetchUploads();
              refreshData();
            }, 2000);
          } else {
            setTimeout(() => {
              setShowProgress(false);
              fetchUploads();
              refreshData();
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
        refreshData();
      }, 2000);
    }
  };
    const columnsToRender = columns.filter((col) =>
      visibleColumns.includes(col.id)
    );
  const fetchUploads = () => {
    try {
      setLoading(true);
      let response = dispatch(getUploadsByCategory("grade"));
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

  const cancelUpload = () => {
    source.cancel();
  };

 

  return (
    <>
      <div>
        <div>
          <div style={{ paddingInline: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <Text style={{ fontSize: "14px", fontWeight: "bold",  color: "#4E4A14", margin: 0 }} text="Grades" />
            {gradeInfo.length === 0 && canEdit() && (
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
                Add Grade
              </Button>
            )}
          </div>

              {gradeInfo.map((grade, index) => (
                  <div key={index} style={{ marginBottom: "30px", padding: "20px", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#fafafa" }}>
                    <Text
                      style={{ fontSize: "16px", fontWeight: "bold", color: "#837F39", marginBottom: "20px" }}
                      text={grade._id !== undefined && grade._id !== null ? "Edit Grade" : "Add Grade"}
                    />
<Row className="g-3 my-2 px-2 py-2 sm:my-0 sm:px-0 sm:py-0">
                <Col xs={12} lg={4}>
                      <TextInput
                          stackLabel={true}
                          label="Grade Name"
                          name="gradeName"
                          value={grade.gradeName}
                          onChangeText={(e) => handleChangeArray(e, index)}
                           inputStyle="custom-no-margin"
                          readonly={!canEdit()}
                      />
                      {validator.current.message(
                          "gradeName",
                          grade.gradeName,
                          "required"
                      )}
                      </Col>
                <Col xs={12} lg={4}>
                      <SelectInput
                          label="Function Name"
                          placeholder="--Select--"
                          name="departmentName"
                          options={[
                            { label: "No Function", value: "No Function",key: "No Function", departmentName: "No Function" },
                            ...departments
                          ]}
                          value={grade.departmentName}
                          onChangeText={(e) => handleChangeArray(e, index)}
                          stackLabel={true}
                          readonly={!canEdit()}
                      />
                      </Col>
                <Col xs={12} lg={4}>
                      <SelectInput
                          label="Status"
                          placeholder="--Select--"
                          name="status"
                          options={statusesActive}
                          value={grade.status}
                          onChangeText={(e) => handleChangeArray(e, index)}
                          stackLabel={true}
                          readonly={!canEdit()}
                      />
                      {validator.current.message(
                          "status",
                          grade.status,
                          "required"
                      )}
                      </Col>
              </Row>
              {canEdit() && (
                <Row className="g-3 my-2 px-2 py-2 sm:my-0 sm:px-0 sm:py-0">
                      <Col xs={12} className="d-flex justify-content-end align-items-center">
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
                            {grade._id !== undefined && grade._id !== null ? "Update" : "Save"}
                          </Button>
                        </Box>
                      </Col>
                  </Row>
              )}
                  </div>
              ))}

          {loading ? (
            <div className="text-center">
              <LoadingIndicator size={3} />
            </div>
          ) : (
            <>
            {/* <TableNormal
              data={data.filter((item) => {
                return (
                  item.gradeName
                    .toLowerCase()
                    .indexOf(searchKey.toLowerCase()) !== -1
                );
              })}
              columns={columns}
              paginationFactory={paginationFactory}
              searchKey={searchKey}
              keyField="_id"
            /> */}
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
                          </>
          )}
          <Box sx={{ mx: { xs: 2, sm: 0 } }}>
          <p className="m-0 fs14 text-center text-danger">
            {error.length > 0 ? error : ""}
          </p>
          <HorizontalBar className="pt-3 pb-3" />
           <Typography>{t("departments.BulkUploadofDepartment")} </Typography>
                          <div className="col-md-12 m-0 p-0 d-flex justify-content-between align-items-center">
                            {canEdit() && (
                              <CheckboxInput
                                label={t("departments.BulkUploadofDepartment")}
                                name="isBulkUpload"
                                value={isBulkUpload3}
                                onChangeText={(e) => setBulkUpload3(!isBulkUpload3)}
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
                                <a href={link} style={{color:'white'}} target="_blank" rel="noopener noreferrer" className="download-link p-0 m-0">{t("Company.download_template")}</a>
                    
                            </Button>
                    
                          </div>
                          </Box>
                          {isBulkUpload3 && canEdit() && (
                            <>
                        <Box
                          sx={{
                            mt: 2,
                            mx: { xs: 1, sm: 0 }, 
                          }}
                        >        <Typography fontWeight={500} fontSize={16}>
                                  {t("departments.UploadFile")}
                                </Typography>
                                <FileUpload
                                  
                                  // value={formData.file}
                                  onFileUpload={handleFileUpload}
                                  id="grades-file-upload"
                                />
                              </Box>
                            </>
                    
                        
                          )}
          {/* <Text text="Bulk Upload of Grade" />
          <div className="col-md-6 m-0 p-0 d-flex justify-content-between align-items-center">
            <CheckboxInput
              label="Bulk upload of Grade"
              name="isBulkUpload3"
              value={isBulkUpload3}
              onChangeText={(e) => setBulkUpload3(!isBulkUpload3)}
            />
            <DownloadLink text="Download Template" link={link} />
          </div>
          {isBulkUpload3 && (
            <div className="col-md-6 m-0 p-0">
              <BrowseFiles setData={handleFileUpload} />
              {showProgress && (
                <UploadProgress
                  filename={fileName}
                  message="10 records successfully uploading out 15"
                  status="inprogress"
                  progressWidth={progress}
                  cancelUpload={cancelUpload}
                  loaded={loaded}
                  total={total}
                />
              )}
              {uploads.length > 0 &&
                uploads.map((upload, index) => (
                  <>
                    <UploadProgress
                      deleteUpload={deleteUploadData}
                      index={index}
                      {...upload}
                    />
                    <HorizontalBar />
                  </>
                ))}
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}
