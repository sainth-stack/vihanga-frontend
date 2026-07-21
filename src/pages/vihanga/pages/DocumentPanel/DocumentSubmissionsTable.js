import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import CustomTable from "pages/vihanga/components/CustomTable";
import {
  Box,
  Stack,
  IconButton,
  ListItemIcon,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { appURL } from "./../../../../utilities/baseurl";
import { Toast } from "service/toast";
import ArrowDownwardOutlinedIcon from "../../../../assets/svg/ExportSvg.svg";
import { exportToCSV, exportToExcel, exportToPDF } from "utilities/ExportFunctions";
import { getUserData, canEdit } from "../../../../utilities/privilegeHelper";

const DocumentSubmissionsTable = ({ isAdmin = false, employeeId = null }) => {
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submissionToReject, setSubmissionToReject] = useState(null);

  const companyId =
    localStorage.getItem("companyId") !== null
      ? JSON.parse(localStorage.getItem("companyId"))
      : null;

  const userId =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user"))?._id
      : null;

  // Check if current user is HR Admin
  const userData = useMemo(() => getUserData(), []);
  const isHRAdmin = useMemo(
    () => userData?.role === "HR Admin" || userData?.role === "Super Admin",
    [userData]
  );

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {

      const params = {
        companyId,
        page: page + 1,
        limit: rowsPerPage,
        search,
        ...filters,
      };

      // If user is NOT HR Admin, filter by employeeId (for employees)
      // HR Admin can see all company-level submissions (no employeeId filter)
      if (!isHRAdmin && (employeeId || userId)) {
        params.employeeId = employeeId || userId;
      }

      const response = await axios.get(
        `${appURL}/recruitment/document-submissions`,
        { params }
      );
      const responseData = response?.data?.data || {};
      setData(responseData.data || []);
      setTotalPages(responseData.totalPages || 1);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(
        err.response?.data?.message || "Failed to fetch document submissions"
      );
      Toast({
        message:
          err.response?.data?.message || "Failed to fetch document submissions",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, filters, isHRAdmin, employeeId, userId, companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  // Handle row click to view document details
  const handleRowClick = (row) => {
    history.push(`/admin/previlages/document-submission?submissionId=${row._id}`);
  };

  const handleEdit = (row) => {
    history.push(`/admin/previlages/document-submission?submissionId=${row._id}`);
  };

  const handleDelete = (row) => {
    setSelectedSubmission(row);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSubmission) return;

    try {
      await axios.delete(
        `${appURL}/recruitment/document-submissions/${selectedSubmission._id}`
      );

      Toast({
        message: "Document submission deleted successfully",
        type: "success",
      });
      setDeleteDialogOpen(false);
      setSelectedSubmission(null);
      fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
      Toast({
        message: err.response?.data?.message || "Failed to delete document submission",
        type: "error",
      });
    }
  };


  const handleApprove = async (row) => {
    if (!isHRAdmin) {
      Toast({
        message: "Only HR Admin can approve documents",
        type: "error",
      });
      return;
    }

    try {
      await axios.put(
        `${appURL}/recruitment/document-submissions/${row._id}/approve`
      );

      Toast({
        message: "Document approved successfully",
        type: "success",
      });
      fetchData();
    } catch (err) {
      console.error("Approve Error:", err);
      Toast({
        message:
          err.response?.data?.message || "Failed to approve document",
        type: "error",
      });
    }
  };

  const handleRejectClick = (row) => {
    setSubmissionToReject(row);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!submissionToReject) return;

    if (!isHRAdmin) {
      Toast({
        message: "Only HR Admin can reject documents",
        type: "error",
      });
      return;
    }

    try {
      await axios.put(
        `${appURL}/recruitment/document-submissions/${submissionToReject._id}/reject`,
        {
          rejectionReason: rejectionReason || "",
        }
      );

      Toast({
        message: "Document rejected successfully",
        type: "success",
      });
      setRejectDialogOpen(false);
      setSubmissionToReject(null);
      setRejectionReason("");
      fetchData();
    } catch (err) {
      console.error("Reject Error:", err);
      Toast({
        message:
          err.response?.data?.message || "Failed to reject document",
        type: "error",
      });
    }
  };

  const handleExport = async (format) => {
    try {
      const params = { companyId, limit: 10000 };
      // If user is NOT HR Admin, filter by employeeId (for employees)
      // HR Admin can export all company-level submissions (no employeeId filter)
      if (!isHRAdmin && (employeeId || userId)) {
        params.employeeId = employeeId || userId;
      }

      const response = await axios.get(
        `${appURL}/recruitment/document-submissions`,
        { params }
      );
      const allData = response?.data?.data?.data || [];

      const exportData = allData.map((item) => ({
        Date: new Date(item.submissionDate).toLocaleDateString(),
        "Employee Name": item.employeeName || "N/A",
        "Document Type": item.documentTypeName || "N/A",
        Status: item.status || "N/A",
        "Submitted At": item.submittedAt
          ? new Date(item.submittedAt).toLocaleDateString()
          : "N/A",
      }));

      if (format === "csv") {
        exportToCSV(exportData, "document_submissions");
      } else if (format === "excel") {
        exportToExcel(exportData, "document_submissions");
      } else if (format === "pdf") {
        exportToPDF(exportData, "document_submissions");
      }
    } catch (err) {
      console.error("Export Error:", err);
      Toast({
        message: "Failed to export data",
        type: "error",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "#837F39"; // Theme color for approved
      case "rejected":
        return "#707070"; // Gray for rejected
      case "pending":
        return "#B8A960"; // Lighter shade of theme for pending
      default:
        return "#999";
    }
  };

  const columns = [
    {
      id: "submissionDate",
      label: "Date",
      sortable: true,
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row?.submissionDate
            ? new Date(row.submissionDate).toLocaleDateString()
            : "N/A"}
        </span>
      ),
    },
    {
      id: "employeeName",
      label: "Employee Name",
      sortable: true,
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row?.employeeName || "N/A"}
        </span>
      ),
    },
    {
      id: "documentTypeName",
      label: "Document Type",
      sortable: true,
      render: (row) => (
        <span 
          style={{ 
            color: "#837F39", 
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "underline"
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(row);
          }}
        >
          {row?.documentTypeName || "N/A"}
        </span>
      ),
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <Chip
          label={row?.status?.toUpperCase() || "N/A"}
          sx={{
            backgroundColor: getStatusColor(row?.status),
            color: "#fff",
            fontWeight: 500,
            fontSize: "12px",
            height: "24px",
          }}
        />
      ),
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <Stack direction="row" spacing={1} alignItems="center">
          {isHRAdmin && canEdit() && row?.status?.toLowerCase() === "pending" && (
            <>
              <IconButton
                onClick={() => handleApprove(row)}
                size="small"
                sx={{
                  color: "#4caf50",
                  "&:hover": {
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                  },
                }}
                title="Approve"
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => handleRejectClick(row)}
                size="small"
                sx={{
                  color: "#f44336",
                  "&:hover": {
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                  },
                }}
                title="Reject"
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </>
          )}
          {!isHRAdmin && row?.status?.toLowerCase() !== "pending" && (
            <Typography
              variant="body2"
              sx={{
                color: "#707070",
                fontStyle: "italic",
              }}
            >
              No actions available
            </Typography>
          )}
          {!isHRAdmin && row?.status?.toLowerCase() === "pending" && (
            <Typography
              variant="body2"
              sx={{
                color: "#B8A960",
                fontStyle: "italic",
              }}
            >
              Pending review
            </Typography>
          )}
        </Stack>
      ),
    },
  ];

  const menuItemsStage = [
    { value: "newapplied", text: "New Applied", progress: 10 },
    { value: "psychometrictest", text: "Psychometric Test", progress: 20 },
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

  return (
    <Box
      sx={{
        paddingBottom: "70px",
        margin: "1rem",
        bgcolor: "#fff",
        padding: "2rem",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      <Typography
        sx={{
          fontSize: "32px",
          fontWeight: "600",
          fontFamily: `"Montserrat"`,
          color: "#0E0E0E",
        }}
      >
        {isHRAdmin ? "All Document Submissions" : "My Document Submissions"}
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <CustomTable
        onExport={handleExport}
        columns={columns}
        data={data}
        menuItemsStage={menuItemsStage}
        menuItemsExportOptions={menuItemsExportOptions}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this document submission? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => {
          setRejectDialogOpen(false);
          setRejectionReason("");
          setSubmissionToReject(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Document Submission</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to reject this document submission?
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter the reason for rejection..."
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setRejectDialogOpen(false);
              setRejectionReason("");
              setSubmissionToReject(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmReject}
            color="error"
            variant="contained"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default DocumentSubmissionsTable;

