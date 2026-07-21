import CustomTable from "../../../../../components/CustomTable";
import CustomButton from "../../../../../components/Button/CustomButton";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AppShortcutIcon from "@mui/icons-material/AppShortcut";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import EditSvgIcon from "../../../../../../../assets/svg/EditSvg.svg"
import DeleteSvgIcon from "../../../../../../../assets/svg/DeleteSvg.svg";
import EmailSvgIcon from "../../../../../../../assets/svg/EmailSvg.svg";



import {
  Typography,
  Box,
  Container,
  Select,
  MenuItem,
  LinearProgress,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import CardWidget from "../../../../../components/Cards/CardWidget";
import axios from "axios";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowDownwardOutlinedIcon from "../../../../../../../assets/svg/ExportSvg.svg"
import moment from "moment";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Toast } from "service/toast";
import { appURL } from "utilities";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Grid } from "rsuite";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { useTranslation } from "react-i18next";
import { canEdit, canDelete } from "utilities/privilegeHelper";

const Icons = {
  briefCaseIcon: BusinessCenterOutlinedIcon,
  barChartIcon: BarChartOutlinedIcon,
  appShortcutIcon: AppShortcutIcon,
  assignmentIcon: AssignmentOutlinedIcon,
  AddOutlinedIcon: AddOutlinedIcon,
};


const ActionMenu = ({ row, handleEdit, handleView, handleDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ position: 'relative' }}>
      <IconButton
        onClick={handleMenuClick}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: "1rem",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid #eee",
            minWidth: '200px',
          }
        }}
      >
        {canEdit() && (
          <MenuItem onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleEdit(row);
          }}>
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <img src={EditSvgIcon} alt="Edit" width="18" height="18" />
            </ListItemIcon>
            <ListItemText
              primary={t('RecruitmentManagement.EditCandidate')}
              sx={{
                color: "#6D6D6D",
                fontWeight: "500",
                fontSize: "14px",
                letterSpacing: "1%",
              }}
            />
          </MenuItem>
        )}
        {/* <MenuItem onClick={(e) => {
          e.stopPropagation();
          handleClose();
          handleView(row);
        }}>
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <img src={EmailSvgIcon} alt="View" width="18" height="18" />
          </ListItemIcon>
          <ListItemText
            primary="Email Candidate"
            sx={{
              color: "#6D6D6D",
              fontWeight: "500",
              fontSize: "14px",
              letterSpacing: "1%",
            }}
          />
        </MenuItem> */}
        {canDelete() && (
          <MenuItem onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleDelete(row);
          }}>
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <img tabIndex={0} src={DeleteSvgIcon} alt="Delete" width="18" height="18" />
            </ListItemIcon>
            <ListItemText
              primary={t('RecruitmentManagement.Delete')}
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


export const CandidateTable = ({ onEdit, onCandidateDelete }) => {
  const { t } = useTranslation();

  const userRole = getItemFromLocalStorage('userRole')
  const handleExport = async (item) => {
    try {
      const companyId =
        localStorage.getItem("companyId") !== null
          ? JSON.parse(localStorage.getItem("companyId"))
          : null;

      const response = await axios.get(`${appURL}/recruitment/all-candidates`, {
        params: {
          // Use the params option to send query parameters
          companyId: companyId,
        },
      });

      if (response?.data?.success) {
        console.log(response.data);
        const rawData = response.data.data;
        const formattedData = rawData.map((item) => ({
          CandidateID: item?.candidateId,
          Name: item?.candidateName,
          Email: item?.email,
          Phone: item?.phone,
          Gender: item?.gender,
          Location: item?.location,
          Source: item?.source,
          Department: item?.department,
          Designation: item?.designation,
          Status: item?.status,
          interviewer: item?.interviewer,
          AppliedOn: new Date(item?.appliedOn).toLocaleDateString(),
          companyId: companyId,
        }));
        const formatPdfData = rawData.map((item) => ({
          CandidateID: item?.candidateId,
          Name: item?.candidateName,
          Email: item?.email,
          Phone: item?.phone,
          Gender: item?.gender,
          Designation: item?.designation,
          Status: item?.status,
          AppliedOn: new Date(item?.appliedOn).toLocaleDateString(),
        }));

        switch (item?.format) {
          case "csv":
            exportToCSV(formattedData);
            break;
          case "excel":
            exportToExcel(formattedData);
            break;
          case "pdf":
            exportToPDF(formatPdfData);
            break;
          default:
            alert(`Unknown export format: ${item?.text}`);
        }
      } else {
        alert("Failed to fetch export data.");
      }
    } catch (error) {
      console.error("Error fetching export data:", error);
      alert("Something went wrong during export.");
    }
  };

  const exportToCSV = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "export.csv");
  };

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "export.xlsx");
  };

  const exportToPDF = (data) => {
    const doc = new jsPDF();

    // Set smaller font size for the title (default is 12, reducing by 4 makes it 8)
    doc.setFontSize(8);
    doc.text("Exported Candidates", 14, 20);

    const headers = Object.keys(data[0]);
    const body = data.map((row) => headers.map((header) => row[header]));

    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 30,
      // Set smaller font size for the table (default is 10, reducing by 2 makes it 8)
      styles: {
        fontSize: 8,
      },
      // Optional: set smaller font size specifically for header
      headStyles: {
        fontSize: 8,
      },
      // Optional: set smaller font size specifically for body
      bodyStyles: {
        fontSize: 8,
      },
    });

    doc.save("export.pdf");
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const history = useHistory();
  const [selectedItems, setSelectedItems] = useState("All");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    candidateId: "",
    candidateName: "",
    department: "",
    position: "",
    stage: "",
    fromDate: "",
    toDate: "",
  });
  // console.log(filters, "setingngng");
  const companyId =
    localStorage.getItem("companyId") !== null
      ? JSON.parse(localStorage.getItem("companyId"))
      : null;

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const apiPage = page + 1;

        // Prepare params object
        const params = {
          page: apiPage,
          limit: rowsPerPage,
          status: selectedItems,
          search,
          companyId,
        };

        // Add filters to params, but only if they have values
        if (filters.candidateId) params.candidateId = filters.candidateId;
        if (filters.candidateName) params.candidateName = filters.candidateName;
        if (filters.department) params.department = filters.department;
        if (filters.position) params.position = filters.position;
        if (filters.stage) params.stage = filters.stage;
        if (filters.fromDate) params.fromDate = filters.fromDate;
        if (filters.toDate) params.toDate = filters.toDate;

        const response = await axios.get(`${appURL}/recruitment/candidates`, {
          params,
        });

        // console.log("Full response:", response.data);
        const candidateList = response.data?.data?.data || [];
        setCandidates(candidateList);
        setTotalPages(response?.data?.data?.totalPages);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [page, rowsPerPage, selectedItems, search, filters, companyId]);

  const menuItemsStage = [
    { value: "newapplied", text: "New Applied", progress: 10 },
    { value: "psychometrictest", text: "Psychometric Test", progress: 20 },
    { value: "interview1", text: "Interview 1", progress: 40 },
    { value: "interview2", text: "Interview 2", progress: 50 },
    { value: "Document Upload", text: "Document Upload", progress: 60 },
    { value: "Offer Letter", text: "Offer Letter", progress: 70 },
    { value: "onboarding", text: "Onboarding", progress: 80 },
    { value: "rejected", text: "Rejected", progress: 100 },
    { value: "Convert to Employee", text: "Convert to Employee", progress: 100 },
    // { text: "Shortlisted", progress: 100, value: "shortlisted" },
  ];

  const menuItemsExportOptions = [
    { text: "Export as CSV", format: "csv", icon: ArrowDownwardOutlinedIcon },
    {
      text: "Export as Excel",
      format: "excel",
      icon: ArrowDownwardOutlinedIcon,
    },
    { text: "Export as PDF", format: "pdf", icon: ArrowDownwardOutlinedIcon },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleView = (selectedRow) => {
    console.log("View:", selectedRow);
    handleClose();
  };

  const handleEdit = (selectedRow) => {
    console.log("Edit :", selectedRow);

    handleClose();
    history.push(
      `/admin/previlages/candidate/create/${selectedRow?.candidateId}`
    );
  };

  const handleDelete = async (selectedRow) => {
    try {
      const response = await axios.delete(`${appURL}/recruitment/candidates`, {
        params: { _id: selectedRow?._id },
      });
      setCandidates((prevCandidates) =>
        prevCandidates.filter((candidate) => candidate._id !== selectedRow?._id)
      );

      Toast({ message: "Candidate deleted successfully", type: "success" });
      onCandidateDelete();
      console.log("Deleted successfully:", response.data);
    } catch (error) {
      Toast({ message: "Failed to delete candidate", type: "error" });
      console.error("Delete error:", error.response?.data || error.message);
    }
    console.log("Delete:", selectedRow._id);
  };

  const StatusCell = ({ row, onChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const selectedStage = menuItemsStage.find(
      (item) => {
        return item?.text?.toLocaleLowerCase() === row?.status?.toLocaleLowerCase()
      }

    );
    const progressValue = Math.min(
      100,
      Math.max(0, selectedStage?.progress ? Number(selectedStage.progress) : 0)
    );

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleSelect = (item) => {
      onChange(item.value);
      setAnchorEl(null);
    };

    return (
      <>
        <Grid style={{ display: "flex", flexDirection: "column" }}>
          <Box
            onClick={handleClick}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography
              fontSize="14px"
              sx={{
                fontFamily: "Work Sans",
              }}
            >
              {selectedStage?.text || "Select"}
            </Typography>
          </Box>

          <Box mt={1} sx={{ width: "100px" }}>
            {" "}
            {/* Added width */}
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: "10px",
                borderRadius: "20px",
                backgroundColor: "#ddd",
                "& .MuiLinearProgress-bar": {
                  backgroundColor:
                    selectedStage?.text == "Rejected" ? "#EF3838" : "#388e3c",
                  borderRadius: "20px",
                },
              }}
            />
          </Box>
        </Grid>
      </>
    );
  };

  const handleIdKeyDown = (e, row) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleEdit(row);
    }
  };

  const columns = [
    {
      id: "_id",
      label: t("RecruitmentManagement.ID"),
      sortable: true,
      render: (row) => {
        return (
          <Box
            component="button"
            onClick={() => {
              handleEdit(row);
            }}
            onKeyDown={(e) => handleIdKeyDown(e, row)}
            tabIndex={0}
            aria-label={`Candidate ID ${row.candidateId || row?._id}`}
            sx={{
              color: "#837F39",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
              border: "none",
              background: "none",
              padding: 0,
              outline: "none",
              transition: "all 0.2s ease",
              borderRadius: "4px",
              fontSize: "inherit",
              fontFamily: "inherit",
              "&:hover": {
                opacity: 0.8,
              },
              "&:focus": {
                outline: "2px solid #837F39",
                outlineOffset: "2px",
              },
              "&:focus-visible": {
                outline: "2px solid #837F39",
                outlineOffset: "2px",
              },
            }}
          >
            {row.candidateId || row?._id}
          </Box>
        );
      },
    },
    {
      id: "candidateName",
      label: t("RecruitmentManagement.Name"),
      sortable: true,
      render: (row) => {
        return (
          <span style={{ fontWeight: 500 }}>{row.candidateName || "N/A"}</span>
        );
      },
    },
    {
      id: "phone",
      label: t("RecruitmentManagement.PhoneNo"),
      sortable: true,
      render: (row) => {
        return <span style={{ color: "#555" }}>{row.phone || "N/A"}</span>;
      },
    },
    {
      id: "email",
      label: t("RecruitmentManagement.Email"),
      sortable: true,
      render: (row) => {
        return <span style={{}}>{row.email || "N/A"}</span>;
      },
    },
    {
      id: "appliedOn",
      label: t("RecruitmentManagement.AppliedOn"),
      sortable: true,
      render: (row) => {
        const date = row.appliedOn || row?._id;
        return <span>{moment(date).format("Do MMM YYYY")}</span>;
      },
    },
    {
      id: "status",
      label: t("RecruitmentManagement.Stages"),
      render: (row) => (
        <StatusCell
          row={row}
          onChange={(newStatus) => {
            row.status = newStatus;
            console.log("Updated status:", newStatus);
          }}
        />
      ),
    },
    {
      id: "department",
      label: t("RecruitmentManagement.Department"),
      sortable: true,
      render: (row) => {
        return (
          <span style={{ fontWeight: 500 }}>{row?.department || "N/A"}</span>
        );
      },
    },
    {
      id: "designation",
      label: t("RecruitmentManagement.Designation"),
      sortable: true,
      render: (row) => {
        return (
          <span style={{ fontWeight: 500 }}>{row.designation || "N/A"}</span>
        );
      },
    },
    {
      id: "actions",
      label: t("RecruitmentManagement.Actions"),
      render: (row) => (
        <ActionMenu
          row={row}
          handleEdit={handleEdit}
          handleView={handleView}
          handleDelete={handleDelete}
        />
      ),
    },
  ];
  // if (loading) {
  //   return <Typography>Loading candidates...</Typography>;
  // }

  // if (!loading && candidates.length === 0) {
  //   return <Typography>No candidates found.</Typography>;
  // }
  return (
    <>
      <CardWidget sx={{ mt: 2 }}>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              margin: ".5rem 0  1.5rem 0",
            }}
          >
            <Typography
              sx={{
                fontSize: "2rem",
                fontFamily: "Work Sans",
                fontWeight: "700",
              }}
            >
              {t("RecruitmentManagement.CandidatesList")}
            </Typography>
            {canEdit() && (
              <CustomButton
                iconExists={true}
                IconColor={"#fff"}
                IconProp={Icons.AddOutlinedIcon}
                iconPosition="start"
                key={"addNewCandidate"}
                text={t("RecruitmentManagement.AddNewCandidate")}
                color={"#fff"}
                backgroundColor={"#85803c"}
                onClick={() => {
                  history.push({
                    pathname: "candidate/create",
                  });
                }}
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
          <CustomTable
            onExport={handleExport}
            columns={columns}
            data={candidates}
            menuItemsStage={menuItemsStage}
            menuItemsExportOptions={menuItemsExportOptions}
            onEdit={(row) => console.log("Edit:", row)}
            onDelete={(row) => console.log("Delete:", row)}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            totalPages={totalPages}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            search={search}
            setSearch={setSearch}
            filters={filters}
            setFilters={setFilters}
            loading={loading}
          />


          {userRole === "Super Admin" && (

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            </Box>
          )}



        </Box>
      </CardWidget>
    </>
  );
};
