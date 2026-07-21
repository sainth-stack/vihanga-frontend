import React, { useCallback, useState, useRef } from "react";
import TitleHeader from "components/TitleHeader";
import { Box, Container, Grid, Paper, Divider, IconButton, Tooltip, TextField, InputAdornment, Menu, MenuItem, ListItemIcon, ListItemText, Button } from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { MultiSelectComponent } from "pages/vihanga/components/input-elements/multiSelect";
import CustomButton from "pages/vihanga/components/Button/CustomButton";
import CustomTable from "pages/vihanga/components/CustomTable";
import CustomTypography from "pages/vihanga/components/TypoGraphy/CustomTypography";
import ActionDropdown from "pages/vihanga/components/ActionDropdown/ActionDropdown";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import ArrowDownwardOutlinedIcon from "../../../assets/svg/export.svg";

// import "./index.scss";
import { useDispatch } from "react-redux";
import { createCompetency, deleteCompetency, getAllCompetencies, updateCompetency } from "action/CompetencyAct";
import { getDesignations } from "action/DesignationAct";
import { useEffect } from "react";
import { LoadingIndicator } from "utilities";
import { Toast } from "service/toast";
// import { exportToExcel, exportToCSV, exportToPDF } from "../../utilities/ExportFunctions";
import { exportToExcel,exportToCSV, exportToPDF } from 'utilities/ExportFunctions';
import { useTranslation } from "react-i18next";
import { canEdit, canDelete } from "utilities/privilegeHelper";



const PerformanceManagement = () => {
  const opt1 = [{ key: "Supervisor", value: "Supervisor" }, { key: "Mid Management", value: "Mid Management" }, { key: "Executive Management", value: "Executive Management" }]
  const opt2 = [{ key: "Behavioural", value: "Behavioural" }, { key: "Functional", value: "Functional" }]
  const opt3 = [{ key: "Functional Head", value: "Functional Head" }, { key: "HR", value: "HR" }, { key: "Adhoc User", value: "Adhoc User" }];
    const { t } = useTranslation();
  
  // Get user from localStorage (keeping for potential future use)
  const user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
  
  // Get designation options from API data
  const getDesignationOptions = (designationsData) => {
    if (!designationsData || designationsData.length === 0) {
      return [];
    }

    // Filter active designations and map to options
    return designationsData
      .filter((item) => item.status === "Active")
      .map(designation => {
        const designationName = designation.designationName || "";
        const legalEntityName = designation.legalEntityName || "";
        const label = legalEntityName 
          ? `${designationName} - ${legalEntityName}`
          : designationName;
        
        return {
          key: designation.designationName,
          value: designation.designationName,
          label: label,
        };
      });
  };
  
  let companyId =
    localStorage.getItem("companyId") !== null
      ? JSON.parse(localStorage.getItem("companyId"))
      : null;
  const [designationsData, setDesignationsData] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [designationsLoading, setDesignationsLoading] = useState(false);
  const [competencyForm, setCompetencyForm] = useState({
    competencyName: "",
    description: "",
    startDate: null,
    endDate: null,
    competencyType: "",
    developmentActivities: [""],
    coachingActivities: [""],
    categoryActivities: "",
    designation: [],
    companyId:companyId
  })
  
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const exportButtonRef = useRef(null);

  // Fetch designations data from API
  const fetchDesignations = () => {
    try {
      setDesignationsLoading(true);
      let response = dispatch(getDesignations());
      response.then(({ data: apiData, message, success }) => {
        setDesignationsLoading(false);
        if (success && apiData && apiData.length > 0) {
          setDesignationsData(apiData);
          // Update designation options with fetched data
          const options = getDesignationOptions(apiData);
          const updatedOptions = [
            { key: "Select All", value: "Select All", label: "All" },
            ...options
          ];
          setDesignationOptions(updatedOptions);
        } else {
          setDesignationOptions([]);
        }
      }).catch((error) => {
        setDesignationsLoading(false);
        console.log("Error fetching designations:", error);
        setDesignationOptions([]);
      });
    } catch (error) {
      setDesignationsLoading(false);
      setDesignationOptions([]);
    }
  };

  // Filter data based on search
  const filteredData = data.filter((item) => {
    if (!searchKey) return true;
    return (
      item.competencyName?.toLowerCase().includes(searchKey.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchKey.toLowerCase()) ||
      item.competencyType?.toLowerCase().includes(searchKey.toLowerCase()) ||
      item.categoryActivities?.toLowerCase().includes(searchKey.toLowerCase()) ||
      (Array.isArray(item.designation) 
        ? item.designation.some(pos => 
            (pos.label || pos.value || pos).toLowerCase().includes(searchKey.toLowerCase())
          )
        : item.designation?.toLowerCase().includes(searchKey.toLowerCase())
      )
    );
  });

  // Export options
  const menuItemsExportOptions = [
    { text: "Export as CSV", format: "csv", icon: ArrowDownwardOutlinedIcon },
    {
      text: "Export as Excel",
      format: "excel",
      icon: ArrowDownwardOutlinedIcon,
    },
    { text: "Export as PDF", format: "pdf", icon: ArrowDownwardOutlinedIcon },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompetencyForm({ ...competencyForm, [name]: value });
  };
  
  const handleActivities = (e, index, name) => {
    const { value } = e.target;
    const list = [...competencyForm[name]];
    list[index] = value;
    setCompetencyForm({ ...competencyForm, [name]: list });
  }
  const handleSubmit = () => {
    setLoading(true);    
    if(!competencyForm.competencyName || !competencyForm.description || !competencyForm.startDate || !competencyForm.endDate || !competencyForm.competencyType || !competencyForm.categoryActivities || !competencyForm.designation.length){
      setLoading(false);
      Toast({ 
        message: "Please fill all the fields", 
        type: "error" 
      });
      return;
    }
    let response = dispatch(createCompetency(competencyForm));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        getCompetencies();
        setCompetencyForm({
          competencyName: "",
          description: "",
          startDate: null,
          endDate: null,
          competencyType: "",
          developmentActivities: [""],
          coachingActivities: [""],
          categoryActivities: "",
          designation: [],
          companyId:companyId
        })
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
  }
  
  const handleUpdate = () => {
    setLoading(true);
    
    let id = competencyForm._id;
    delete competencyForm.__v;
    delete competencyForm.createdAt;
    delete competencyForm.updatedAt;
    delete competencyForm._id;
    competencyForm.startDate = window.moment(competencyForm.startDate).format("YYYY-MM-DD");
    competencyForm.endDate = window.moment(competencyForm.endDate).format("YYYY-MM-DD");
    
    
    let response = dispatch(updateCompetency(id, competencyForm));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        getCompetencies();
        setCompetencyForm({
          competencyName: "",
          description: "",
          startDate: null,
          endDate: null,
          competencyType: "",
          developmentActivities: [""],
          coachingActivities: [""],
          categoryActivities: "",
          designation: [],
          companyId:companyId
        })
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
  }
  
  const getCompetencies = () => {
    setLoading(true);
    let response = dispatch(getAllCompetencies());
    response.then(({ success, message, data }) => {
      if (success) {
        let updatedData = data.map((item, index) => {
          // Normalize positionLevel data
          let normalizedPositionLevel = [];
          if (item.designation) {
            if (Array.isArray(item.designation)) {
              normalizedPositionLevel = item.designation.map(pos => {
                if (typeof pos === 'string') {
                  return { value: pos, label: pos, key: pos };
                } else if (typeof pos === 'object' && pos !== null) {
                  return {
                    value: pos.value || pos.label || pos.key || '',
                    label: pos.label || pos.value || pos.key || '',
                    key: pos.key || pos.value || pos.label || ''
                  };
                }
                return pos;
              }).filter(pos => pos.value || pos.label || pos.key); // Filter out empty entries
            } else if (typeof item.designation === 'string') {
              normalizedPositionLevel = [{ 
                value: item.designation, 
                label: item.designation, 
                key: item.designation 
              }];
            }
          }

          return {
            ...item,
            startDate: window.moment(item.startDate).format("YYYY-MM-DD"),
            endDate: window.moment(item.endDate).format("YYYY-MM-DD"),
            designation: normalizedPositionLevel
          }
        })
        setData(updatedData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  
  const handleDelete = (id) => {
    setLoading(true);
    let response = dispatch(deleteCompetency(id));
    response.then(({ success, message, data }) => {
      if (success) {
        getCompetencies();
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  
  useEffect(() => {
    getCompetencies();
    // Fetch designations data on component mount
    fetchDesignations();
  }, [])

  const handleEdit = (row) => {
    // Ensure positionLevel is properly formatted for the multi-select component
    const formattedRow = {
      ...row,
      designation: Array.isArray(row.designation) 
        ? row.designation.map(pos => {
            if (typeof pos === 'string') {
              return { value: pos, label: pos, key: pos };
            }
            return pos;
          })
        : row.designation 
          ? [{ value: row.designation, label: row.designation, key: row.designation }] 
          : []
    };    
    setCompetencyForm(formattedRow);
    setShowForm(true);
  }

  const handleExport =async (exportOption) => {
    const exportData = await data?.map(item => ({
      'Competency Name': item.competencyName,
      'Description': item.description,
      'Start Date': item.startDate,
      'End Date': item.endDate,
      'Competency Type': item.competencyType,
      'Category Activities': item.categoryActivities,
      'Position Level': Array.isArray(item.designation) ? item.designation.map(pos => pos.label || pos.value || pos).join(', ') : item.designation,
      'Development Activities': Array.isArray(item.developmentActivities) ? item.developmentActivities.join(', ') : item.developmentActivities,
      'Coaching Activities': Array.isArray(item.coachingActivities) ? item.coachingActivities.join(', ') : item.coachingActivities
    }));

    if (!exportData.length) {
      Toast({ message: 'No data to export!', type: 'error' });
      return;
    }

    

    switch (exportOption?.format) {
      case "csv":
       await exportToCSV(exportData);
        break;
      case "excel":
      await  exportToExcel(exportData);
        break;
      case "pdf":
       await exportToPDF(exportData);
        break;
      default:
        alert(`Unknown export format: ${exportOption?.text}`);
    }
  };

  const handleClickExport = (event) => {
    setExportAnchorEl(exportButtonRef.current);
  };

  const handleCloseExport = () => {
    setExportAnchorEl(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKey(value);
    setPage(0); // Reset to first page when searching
  };



  const columns = [
    {
      id: "competencyName",
      label: t("CompetencyManagement.Name"),
      sortable: true,
      render: (row) => (
        <CustomTypography variant="body2" sx={{ fontWeight: 500 }}>
          {row.competencyName}
        </CustomTypography>
      ),
    },
    {
      id: "designation",
       label: t("CompetencyManagement.PositionLevel"),
      sortable: true,
      render: (row) => {
        let displayText = 'N/A';
        if (row.designation) {
          if (Array.isArray(row.designation)) {
            displayText = row.designation.map(pos => {
              if (typeof pos === 'object' && pos !== null) {
                return pos.label || pos.value || pos.key || JSON.stringify(pos);
              }
              return pos;
            }).join(', ');
          } else if (typeof row.designation === 'string') {
            displayText = row.designation;
          }
        }
        return (
          <CustomTypography variant="body2" sx={{ fontWeight: 500 }}>
            {displayText}
          </CustomTypography>
        );
      },
    },
    {
      id: "action",
        label: t("CompetencyManagement.Action"),
      render: (row) => {
        const actions = [];
        
        if (canEdit()) {
          actions.push({
            label: "Edit",
            icon: <EditIcon sx={{ fontSize: 18 }} />,
            onClick: (row) => handleEdit(row),
          });
        }
        
        if (canDelete()) {
          actions.push({
            label: "Delete",
            icon: <DeleteIcon sx={{ fontSize: 18 }} />,
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
    }
  ];

  return (
    <>
      <TitleHeader name="Admin Portal - Designations " />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box  sx={{ mt: 3, p: 3, borderRadius: 5, backgroundColor: "white",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)"}}>
          <CustomTypography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: "#333", 
              mb: 3,
              fontFamily: "Work Sans"
            }}
          >
            {t("CompetencyManagement.CompetencyManagement")}
          </CustomTypography>
          
          {/* Create Section */}
          <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
            {canEdit() && (
              <CustomButton
                onClick={() => setShowForm(!showForm)}
                text={t("CompetencyManagement.Create")}
                backgroundColor="#837F39"
                color="#FFFFFF"
                IconColor="#FFFFFF"
                fontWeight="500"
                fontSize="13px"
                border="1px solid #837F39"
                variant="contained"
                IconProp={AddIcon}
                iconExists={true}
                iconPosition="start"
                sx={{
                  fontFamily: "Work Sans",
                  borderRadius: "2rem",
                  maxWidth: "8rem",
                }}
              />
            )}
          </Box>

          {/* Custom Table Header with Export */}
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "16px 24px 16px 24px",
              backgroundColor: "white",
              borderRadius: "1rem 1rem 0 0",
              border: "1px solid #827e39",
              borderBottom: "1px solid #827e39",
            }}
          >
            <TextField
              id="tableSearch"
              placeholder="Search competencies..."
              value={searchKey}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                width: 240,
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  height: "34px",
                  borderRadius: "5rem",
                  border: "1px solid #837F39",
                  "& fieldset": { border: "none" },
                }
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Button
                ref={exportButtonRef}
                onClick={handleClickExport}
                variant="outlined"
                startIcon={<SystemUpdateAltOutlinedIcon />}
                sx={{
                  px: 2,
                  py: 1,
                  fontWeight: 550,
                  border: "1px solid #85803c",
                  borderRadius: "5rem",
                  height: "34px",
                  fontFamily: "Work Sans",
                  fontSize: "12px",
                  color: "#000",
                  textTransform: "none",
                }}
              >
                Export
              </Button>
            </Box>
          </Box> */}

          {/* Table Section */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <LoadingIndicator size={3} />
            </Box>
          ) : (
            <CustomTable
            onExport={handleExport}
              
            menuItemsExportOptions={menuItemsExportOptions}
              columns={columns}
              data={filteredData}
              loading={loading}
              search={searchKey}
              setSearch={setSearchKey}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              pagination={true}
              showHeader={true}
              showFilterButton={false}
              showSearch={true}
              sx={{ 
                backgroundColor: "white", 
                borderRadius: "0 0 8px 8px",
                border: "1px solid #e0e0e0",
                borderTop: "none",
              }}
            />
          )}

          {/* Export Menu */}
          {/* <Menu
            anchorEl={exportAnchorEl}
            open={Boolean(exportAnchorEl)}
            onClose={handleCloseExport}
            PaperProps={{
              sx: {
                borderRadius: "1rem",
                border: "1px solid #fff",
                mt: 0.5,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                zIndex: 9999,
              },
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {menuItemsExportOptions?.map((item, index) => (
              <MenuItem key={index} onClick={() => {
                handleExport(item);
                handleCloseExport();
              }}>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: "#6D6D6D",
                    fontWeight: "500",
                    fontSize: "14px",
                    letterSpacing: "1%",
                  }}
                />
              </MenuItem>
            ))}
          </Menu> */}

          {/* Form Section */}
          {showForm && (
            <Box>
              <CustomTypography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: "#333", 
                  mb: 3,
                  fontFamily: "Work Sans"
                }}
              >
                {!!competencyForm._id ? t("CompetencyManagement.EditCompetency") :t("CompetencyManagement.CreateNewCompetency")}
              </CustomTypography>
              
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12} md={6}>
                  <InputTextComponent
                    id="competencyName"
                    label={t("CompetencyManagement.CompetencyName")}
                    value={competencyForm.competencyName}
                    onChange={(e) => setCompetencyForm({...competencyForm, competencyName: e.target.value})}
                    placeholder="Enter Template Name"
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <InputTextComponent
                    id="description"
label={t("CompetencyManagement.Description")}                    value={competencyForm.description}
                    onChange={(e) => setCompetencyForm({...competencyForm, description: e.target.value})}
                    placeholder="Enter a description..."
                    multiline
                    minRows={3}
                    sx={{ backgroundColor: "white" }}
                  />
                </Grid>

                {/* Date Range */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InputTextComponent
                      id="startDate"
                      label={t("CompetencyManagement.StartDate")}
                      type="date"
                      value={competencyForm.startDate}
                      onChange={(e) => setCompetencyForm({...competencyForm, startDate: e.target.value})}
                      sx={{ backgroundColor: "white" }}
                    />
                    <Tooltip title="Start date for the competency">
                      <HelpOutlineIcon sx={{ color: "#666", fontSize: 20 }} />
                    </Tooltip>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InputTextComponent
                      id="endDate"
                       label={t("CompetencyManagement.EndDate")}
                      type="date"
                      value={competencyForm.endDate}
                      onChange={(e) => setCompetencyForm({...competencyForm, endDate: e.target.value})}
                      sx={{ backgroundColor: "white" }}
                    />
                    <Tooltip title="End date for the competency">
                      <HelpOutlineIcon sx={{ color: "#666", fontSize: 20 }} />
                    </Tooltip>
                  </Box>
                </Grid>

                {/* Competency Type */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <CustomTypography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500, 
                        color: "#333", 
                        mb: 1,
                        fontFamily: "Work Sans"
                      }}
                    >
                       {t("CompetencyManagement.CompetencyType")}
                    </CustomTypography>
                    <InputTextComponent
                      id="competencyType"
                      value={competencyForm.competencyType}
                      onChange={(e) => setCompetencyForm({...competencyForm, competencyType: e.target.value})}
                      // options={opt2}
          placeholder="Enter Competency Type"
                      sx={{ backgroundColor: "white" }}
                    />
                  </Box>
                </Grid>

                  {/* Development Activities */}
                  <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <CustomTypography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500, 
                        color: "#333", 
                        mb: 1,
                        fontFamily: "Work Sans"
                      }}
                    >
                        {t("CompetencyManagement.DevelopmentActivities")}
                    </CustomTypography>
                    {competencyForm.developmentActivities.map((item, index) => (
                      <Box key={index} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
                        <Box sx={{ flex: 1 }}>
                          <InputTextComponent
                            id={`developmentActivities-${index}`}
                            value={item}
                            onChange={(e) => {
                              const list = [...competencyForm.developmentActivities];
                              list[index] = e.target.value;
                              setCompetencyForm({ ...competencyForm, developmentActivities: list });
                            }}
                            // options={opt3}
          placeholder="Enter development activity"
                            sx={{ backgroundColor: "white" }}
                          />
                        </Box>
                        {canEdit() && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                              onClick={() => {
                                const list = [...competencyForm.developmentActivities];
                                list.push("");
                                setCompetencyForm({ ...competencyForm, developmentActivities: list });
                              }}
                              sx={{ 
                                backgroundColor: "#837F39", 
                                color: "white",
                                "&:hover": { backgroundColor: "#6b6a2f" }
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                            {competencyForm.developmentActivities.length !== 1 && (
                              <IconButton
                                onClick={() => {
                                  const list = [...competencyForm.developmentActivities];
                                  list.splice(index, 1);
                                  setCompetencyForm({ ...competencyForm, developmentActivities: list });
                                }}
                                sx={{ 
                                  backgroundColor: "#f44336", 
                                  color: "white",
                                  "&:hover": { backgroundColor: "#d32f2f" }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Grid>

               

              

                {/* Coaching Activities */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <CustomTypography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500, 
                        color: "#333", 
                        mb: 1,
                        fontFamily: "Work Sans"
                      }}
                    >
  {t("CompetencyManagement.CoachingActivities")}
                    </CustomTypography>
                    {competencyForm.coachingActivities.map((item, index) => (
                      <Box key={index} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
                        <Box sx={{ flex: 1 }}>
                          <InputTextComponent
                            id={`coachingActivities-${index}`}
                            value={item}
                            onChange={(e) => {
                              const list = [...competencyForm.coachingActivities];
                              list[index] = e.target.value;
                              setCompetencyForm({ ...competencyForm, coachingActivities: list });
                            }}
                            // options={opt3}
                            placeholder="Enter coaching activity"
                            sx={{ backgroundColor: "white" }}
                          />
                        </Box>
                        {canEdit() && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                              onClick={() => {
                                const list = [...competencyForm.coachingActivities];
                                list.push("");
                                setCompetencyForm({ ...competencyForm, coachingActivities: list });
                              }}
                              sx={{ 
                                backgroundColor: "#837F39", 
                                color: "white",
                                "&:hover": { backgroundColor: "#6b6a2f" }
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                            {competencyForm.coachingActivities.length !== 1 && (
                              <IconButton
                                onClick={() => {
                                  const list = [...competencyForm.coachingActivities];
                                  list.splice(index, 1);
                                  setCompetencyForm({ ...competencyForm, coachingActivities: list });
                                }}
                                sx={{ 
                                  backgroundColor: "#f44336", 
                                  color: "white",
                                  "&:hover": { backgroundColor: "#d32f2f" }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Grid>

                 {/* Category Activities */}
                 <Grid item xs={12} md={6}>
                 <Box sx={{ mb: 2 }}>
                   <CustomTypography 
                     variant="body2" 
                     sx={{ 
                       fontWeight: 500, 
                       color: "#333", 
                       mb: 1,
                       fontFamily: "Work Sans"
                     }}
                   >
  {t("CompetencyManagement.CategoryActivities")}
                   </CustomTypography>
                   <InputTextComponent
                     id="categoryActivities"
                     value={competencyForm.categoryActivities}
                     onChange={(e) => setCompetencyForm({...competencyForm, categoryActivities: e.target.value})}
                    //  options={opt1}
                     placeholder="Enter Category Activities"
                     sx={{ backgroundColor: "white" }}
                   />
                 </Box>
               </Grid>

                 {/* Position Level */}
                 <Grid item xs={12} md={6}>
                 <Box sx={{ mb: 2 }}>
                   <CustomTypography 
                     variant="body2" 
                     sx={{ 
                       fontWeight: 500, 
                       color: "#333", 
                       mb: 1,
                       fontFamily: "Work Sans"
                     }}
                   >
  {t("CompetencyManagement.PositionLevel")}
                   </CustomTypography>
                   <MultiSelectComponent
                     id="designation"
                     value={competencyForm.designation}
                     onChange={(e) => {
                      const selectedOptions = e.target.value; // <-- array of objects

                      const hasSelectAll = selectedOptions.some(
                        (opt) => opt.value === "Select All"
                      );

                      if (hasSelectAll) {
                        const allOptions = designationOptions.filter(
                          (opt) => opt.value !== "Select All"
                        );
                        setCompetencyForm({
                          ...competencyForm,
                          designation: allOptions,  
                        });
                      } else {
                        setCompetencyForm({
                          ...competencyForm,
                          designation: selectedOptions,  
                        });
                      }
                    }}
                     options={designationOptions}
                     placeholder={designationsLoading ? "Loading designations..." : "Select Designation"}
                     disabled={designationsLoading}
                     sx={{ backgroundColor: "white" }}
                   />
                   {designationsLoading && (
                     <CustomTypography variant="caption" sx={{ color: "#666", mt: 1 }}>
                       Loading designations...
                     </CustomTypography>
                   )}
                 </Box>
               </Grid>

              </Grid>

              <Divider sx={{ my: 3 }} />
              
              {/* Action Buttons */}
              {canEdit() && (
                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                  <CustomButton
                    variant="outlined"
                    text={t("CompetencyManagement.Cancel")}
                    backgroundColor="transparent"
                    color="#837F39"
                    border="1px solid #837F39"
                    hoverColor="#f5f5f5"
                    onClick={() => setShowForm(false)}
                    sx={{
                      px: 2,
                      py: 1,
                      fontWeight: 550,
                      border: "1px solid #85803c",
                      borderRadius: "5rem",
                      height: "34px",
                      fontFamily: "Work Sans",
                      fontSize: "12px",
                    }}
                  />
                  <CustomButton
                    variant="outlined"
                    text={!!competencyForm._id ? t("CompetencyManagement.Update") : t("CompetencyManagement.Save")}
                    backgroundColor="#837F39"
                    color="white"
                    hoverColor="#6b6a2f"
                    onClick={!!competencyForm._id ? handleUpdate : handleSubmit}
                    sx={{
                      px: 2,
                      py: 1,
                      fontWeight: 550,
                      border: "1px solid #85803c",
                      borderRadius: "5rem",
                      height: "34px",
                      fontFamily: "Work Sans",
                      fontSize: "12px",
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default PerformanceManagement;
