import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Toast } from "service/toast";
import axios from "axios";
import CustomTable from "pages/vihanga/components/CustomTable/index";
import ActionDropdown from "pages/vihanga/components/ActionDropdown/ActionDropdown";
import { appURL } from "utilities";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getThemeColors } from "utilities/getThemeColors";
import { canEdit, canDelete } from "utilities/privilegeHelper";


const ResignationTable = ({ onEdit, refreshFlag }) => {
  // Local storage data
  const companyId = getItemFromLocalStorage("companyId");
  const userRoleId = getItemFromLocalStorage("user");
  const currentUserId = userRoleId?._id;

  // State management
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedResignation, setSelectedResignation] = useState(null);
  const [approvalAction, setApprovalAction] = useState("");
  const [approvalComments, setApprovalComments] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [submittingApproval, setSubmittingApproval] = useState(false);
  const [selectedTab, setSelectedTab] = useState(getItemFromLocalStorage("selectedTab").tab || "me");
  const previousTabRef = useRef(selectedTab);
  const isFetchingRef = useRef(false);

  // Responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { primaryColor, secondaryColors } = getThemeColors();
  // Listen for localStorage changes (tab changes from navbar)
  useEffect(() => {
    const handleStorageChange = () => {
      const newTab = getItemFromLocalStorage("selectedTab").tab || "me";
      // Only update if tab actually changed
      if (newTab !== previousTabRef.current) {
        previousTabRef.current = newTab;
        setSelectedTab(newTab);
      }
    };

    // Check for changes periodically (since storage event doesn't fire in same tab)
    const interval = setInterval(handleStorageChange, 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array - only set up once

  // Fetch resignation data with tab-based filtering
  useEffect(() => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) return;

    const fetchData = async () => {
      isFetchingRef.current = true;
      setLoading(true);
      try {
        const currentTab = getItemFromLocalStorage("selectedTab").tab || "me";
        const res = await axios.get(
          `${appURL}/recruitment/getAllResignations?companyId=${companyId}&userId=${currentUserId}&type=${currentTab}`
        );
        let resignations = res.data.data;
        if (!Array.isArray(resignations)) {
          resignations = resignations ? [resignations] : [];
        }
        setData(
          resignations.map((item) => ({
            id: item.employeeId || item._id || item.id,
            fullName: item.fullName,
            employeeId: item?.employeeId || "",
            employeeNumber: item?.employeeNumber || "",
            reason: item?.reasonForResignation || "",
            lastDay: item?.lastDayOfWorking || "",
            noticeDay: item?.notifiedDate || "",
            status: (item?.status || "pending").toLowerCase(),
            currentApprovers: item?.currentApprovers || [],
            currentLevel: item?.currentLevel || "0",
            approverLevels: item?.approverLevels || {},
            approvalHistory: item?.approvalHistory || [],
          }))
        );
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch resignations.");
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]); // Only when tab changes from navbar

  // Watch for refreshFlag changes separately
  useEffect(() => {
    if (refreshFlag !== undefined && refreshFlag !== false) {
      triggerRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag]);

  // Helper function to trigger refresh
  const triggerRefresh = () => {
    if (isFetchingRef.current) return;

    const fetchData = async () => {
      isFetchingRef.current = true;
      setLoading(true);
      try {
        const currentTab = getItemFromLocalStorage("selectedTab").tab || "me";
        const res = await axios.get(
          `${appURL}/recruitment/getAllResignations?companyId=${companyId}&userId=${currentUserId}&type=${currentTab}`
        );
        let resignations = res.data.data;
        if (!Array.isArray(resignations)) {
          resignations = resignations ? [resignations] : [];
        }
        setData(
          resignations.map((item) => ({
            id: item.employeeId || item._id || item.id,
            fullName: item.fullName,
            employeeId: item?.employeeId || "",
            employeeNumber: item?.employeeNumber || "",
            reason: item?.reasonForResignation || "",
            lastDay: item?.lastDayOfWorking || "",
            noticeDay: item?.notifiedDate || "",
            status: (item?.status || "pending").toLowerCase(),
            currentApprovers: item?.currentApprovers || [],
            currentLevel: item?.currentLevel || "0",
            approverLevels: item?.approverLevels || {},
            approvalHistory: item?.approvalHistory || [],
          }))
        );
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch resignations.");
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchData();
  };

  // Sort data
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

  // Delete operation
  const handleDelete = async (rowId) => {
    try {
      await axios.delete(
        `${appURL}/recruitment/deleteResignation?id=${rowId}&companyId=${companyId}`
      );
      Toast({ type: "success", message: "Resignation record deleted." });
      triggerRefresh();
    } catch (err) {
      console.error(err);
      Toast({ type: "error", message: "Delete failed." });
    }
  };

  // Edit operation
  const handleEdit = async (rowId) => {
    try {
      const res = await axios.get(
        `${appURL}/recruitment/getResignation?id=${rowId}&companyId=${companyId}`
      );
      const item = res.data.data[0];
      if (item) {
        onEdit({
          _id: item._id,
          fullName: item?.resignation?.fullName || "",
          employeeId: item?.resignation?.employeeNumber || "",
          reasonForResignation: item?.resignation?.reasonForResignation || "",
          lastDayOfWorking: item?.resignation?.lastDayOfWorking || "",
          notifiedDate: item?.resignation?.notifiedDate || "",
        });
      }
    } catch (err) {
      console.error(err);
      Toast({ type: "error", message: "Failed to load record for editing." });
    }
  };

  // Sorting logic
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
       tabIndex={0}
        fontSize="small"
        sx={{ cursor: "pointer", color: "#777" }}
        onClick={(e) => {
          e.stopPropagation();
          handleSort(field);
        }}
      />
    </Box>
  );

  // Status helpers
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#2E7D32";
      case "pending":
        return "#F57C00";
      case "rejected":
        return "#D32F2F";
      default:
        return "#757575";
    }
  };

  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case "approved":
        return "#E8F5E8";
      case "pending":
        return "#FFF3E0";
      case "rejected":
        return "#FFEBEE";
      default:
        return "#F5F5F5";
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending Approval";
      case "rejected":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case "pending":
        return <AccessTimeIcon sx={{ fontSize: 16 }} />;
      case "rejected":
        return <CancelIcon sx={{ fontSize: 16 }} />;
      default:
        return <AccessTimeIcon sx={{ fontSize: 16 }} />;
    }
  };

  // Check if current user is authorized approver
  const isCurrentUserApprover = (row) => {
    if (!row.currentApprovers || row.currentApprovers.length === 0) {
      return false;
    }
    // Convert to strings for comparison to handle ObjectId vs String
    const currentUserIdStr = currentUserId?.toString();
    return row.currentApprovers.some(
      approver => approver.approverId?.toString() === currentUserIdStr
    );
  };

  // Approval actions
  const handleApprovalAction = (resignation, action) => {
    setSelectedResignation(resignation);
    setApprovalAction(action);
    setApprovalComments("");
    setRejectionReason("");
    setApprovalDialogOpen(true);
  };

  const submitApproval = async () => {
    if (!selectedResignation || !approvalAction) return;
    setSubmittingApproval(true);
    try {
      await axios.post(
        `${appURL}/recruitment/approve-resignation?id=${selectedResignation.employeeId}&companyId=${companyId}`,
        {
          approverId: currentUserId,
          status: approvalAction.charAt(0).toUpperCase() + approvalAction.slice(1),
          comments: approvalComments,
          rejectionReason: approvalAction === "rejected" ? rejectionReason : undefined,
        }
      );
      Toast({
        type: "success",
        message: `Resignation ${approvalAction} successfully`,
      });
      setApprovalDialogOpen(false);
      triggerRefresh();
    } catch (err) {
      console.error("Approval Error:", err);
      Toast({
        type: "error",
        message: err.response?.data?.message || `Failed to ${approvalAction} resignation`,
      });
    } finally {
      setSubmittingApproval(false);
    }
  };

  // Mobile card fields for resignation
  const mobileFields = useMemo(() => {
    const fields = [
      {
        key: "fullName",
        label: "Employee",
        render: (value) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: "#837F39" }}>
              {value?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {value || "Unknown"}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        key: "employeeNumber",
        label: "Employee ID",
        render: (value) => value || "-",
      },
      {
        key: "noticeDay",
        label: "Notice Date",
        render: (value) => {
          if (!value) return "-";
          const date = new Date(value);
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        },
      },
      {
        key: "lastDay",
        label: "Last Working Day",
        render: (value) => {
          if (!value) return "-";
          const date = new Date(value);
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        },
      },
      {
        key: "reason",
        label: "Reason",
        render: (value) => value || "-",
      },
      {
        key: "status",
        label: "Status",
        render: (value) => (
          <Chip
            icon={getStatusIcon(value)}
            label={getStatusDisplay(value)}
            sx={{
              backgroundColor: getStatusBackgroundColor(value),
              color: getStatusColor(value),
              fontWeight: 600,
              fontSize: "0.75rem",
              border: `1px solid ${getStatusColor(value)}`,
              "& .MuiChip-icon": {
                color: getStatusColor(value),
              },
            }}
            size="small"
          />
        ),
      },
    ];

    // Only show current approver field in non-"me" views
    if (selectedTab !== "me") {
      fields.push({
        key: "currentApprovers",
        label: "Current Approver",
        render: (value, row) => {
          // For pending status, show current approvers
          if (row.status === "pending") {
            if (!value || value.length === 0) {
              return "-";
            }
            return value.map((approver, idx) => (
              <Typography key={idx} variant="caption" display="block">
                {approver?.approverName || 'Unknown'} ({approver?.approverType || 'N/A'})
              </Typography>
            ));
          }
          
          // For approved/rejected status, show approval history
          if (row.approvalHistory && row.approvalHistory.length > 0) {
            const lastApprover = row.approvalHistory[row.approvalHistory.length - 1];
            return (
              <Box>
                <Typography variant="caption" display="block" fontWeight={500}>
                  {lastApprover?.approverName || 'Unknown'} ({lastApprover?.approverType || 'N/A'})
                </Typography>
                {row.approvalHistory.length > 1 && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    +{row.approvalHistory.length - 1} previous
                  </Typography>
                )}
              </Box>
            );
          }
          
          return "-";
        },
      });
    }

    return fields;
  }, [selectedTab]);

  // Table column definitions
  const columns = useMemo(() => {
    const baseColumns = [
      {
        id: "fullName",
        label: renderHeader("FullName", "fullName"),
        render: (row) => row.fullName,
      },
      {
        id: "employeeId",
        label: renderHeader("EmployeeId", "employeeId"),
        render: (row) => row.employeeNumber,
      },
      {
        id: "noticeDay",
        label: renderHeader("Notice", "noticeDay"),
        render: (row) => {
          const date = new Date(row.noticeDay);
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        },
      },
      {
        id: "lastDay",
        label: renderHeader("Last Working Day", "lastDay"),
        render: (row) => {
          const date = new Date(row.lastDay);
          return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        },
      },
      {
        id: "reason",
        label: renderHeader("ReasonForResign", "reason"),
        render: (row) => row.reason,
      },
      {
        id: "status",
        label: renderHeader("Status", "status"),
        render: (row) => (
          <Chip
            icon={getStatusIcon(row.status)}
            label={getStatusDisplay(row.status)}
            sx={{
              backgroundColor: getStatusBackgroundColor(row.status),
              color: getStatusColor(row.status),
              fontWeight: 600,
              fontSize: "0.75rem",
              border: `1px solid ${getStatusColor(row.status)}`,
              "& .MuiChip-icon": {
                color: getStatusColor(row.status),
              },
            }}
            size="small"
          />
        ),
      },
    ];

    // Only show "Current Approver(s)" column in non-"me" views
    if (selectedTab !== "me") {
      baseColumns.push({
        id: "currentApprovers",
        label: <span style={{ fontWeight: 500 }}>Current Approver(s)</span>,
        render: (row) => {
          // For pending status, show current approvers
          if (row.status === "pending") {
            if (!row.currentApprovers || row.currentApprovers.length === 0) {
              return <Typography variant="body2" color="text.secondary">-</Typography>;
            }
            return (
              <Box>
                {row.currentApprovers.slice(0, 2).map((approver, idx) => (
                  <Typography key={idx} variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {approver?.approverName || 'Unknown'} ({approver?.approverType || 'N/A'})
                  </Typography>
                ))}
                {row.currentApprovers.length > 2 && (
                  <Typography variant="caption" color="text.secondary">
                    +{row.currentApprovers.length - 2} more
                  </Typography>
                )}
              </Box>
            );
          }
          
          // For approved/rejected status, show approval history
          if (row.approvalHistory && row.approvalHistory.length > 0) {
            const lastApprover = row.approvalHistory[row.approvalHistory.length - 1];
            return (
              <Box>
                <Typography variant="body2" sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  {lastApprover?.approverName || 'Unknown'} ({lastApprover?.approverType || 'N/A'})
                </Typography>
                {row.approvalHistory.length > 1 && (
                  <Typography variant="caption" color="text.secondary">
                    +{row.approvalHistory.length - 1} previous
                  </Typography>
                )}
              </Box>
            );
          }
          
          return <Typography variant="body2" color="text.secondary">-</Typography>;
        },
      });
    }

    // Action column - different behavior based on view
    baseColumns.push({
      id: "action",
      label: <span style={{ fontWeight: 500 }}>Action</span>,
      render: (row) => {
        const isOwnResignation = row.employeeId === currentUserId;
        const canApprove = row.status === "pending" && isCurrentUserApprover(row);
        
        // Debug logging to help identify issues
        if (selectedTab === "myteam" && row.status === "pending") {
          console.log("Debug - Resignation row:", {
            fullName: row.fullName,
            employeeId: row.employeeId,
            currentUserId,
            currentUserIdType: typeof currentUserId,
            status: row.status,
            currentApprovers: row.currentApprovers,
            approverIds: row.currentApprovers?.map(a => ({
              approverId: a.approverId,
              approverIdType: typeof a.approverId,
              match: a.approverId?.toString() === currentUserId?.toString()
            })),
            canApprove,
            isOwnResignation,
            isCurrentUserApprover: isCurrentUserApprover(row)
          });
        }
        
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            {canApprove && (
              <>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleApprovalAction(row, "approved")}
                  sx={{
                    minWidth: 90,
                    backgroundColor: "#2E7D32",
                    "&:hover": { backgroundColor: "#1B5E20" },
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => handleApprovalAction(row, "rejected")}
                  sx={{
                    minWidth: 80,
                    borderColor: "#D32F2F",
                    color: "#D32F2F",
                    "&:hover": {
                      borderColor: "#B71C1C",
                      backgroundColor: "#FFEBEE",
                    },
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  Reject
                </Button>
              </>
            )}
            {(() => {
              const actions = [];
              if (canEdit()) {
                actions.push({
                  label: "Edit",
                  icon: <BorderColorIcon fontSize="small" />,
                  onClick: () => handleEdit(row.employeeId),
                });
              }
              if (canDelete()) {
                actions.push({
                  label: "Delete",
                  icon: <DeleteIcon tabIndex={0} fontSize="small" />,
                  onClick: () => handleDelete(row.employeeId),
                });
              }
              return actions.length > 0 ? (
                <ActionDropdown
                  row={row}
                  actions={actions}
                />
              ) : null;
            })()}
          </Stack>
        );
      },
    });

    return baseColumns;
  }, [selectedTab, currentUserId]);

  // Render loading, error, or table
  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          m: 2,
          p: 4,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Typography color="error" sx={{ textAlign: "center" }}>
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        m: 2,
        p: 2,
        bgcolor: secondaryColors.white,
        borderRadius: 2,
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        pb: isMobile || isTablet ? "30px" : "70px",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: 24, fontWeight: 600, mb: 3 }}>
          Resignation Records
        </Typography>
      </Box>

      {sortedData.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 100,
            color: "#777",
            fontSize: 18,
          }}
        >
          No resignations found
        </Box>
      ) : (
        <>
          {/* Mobile/Tablet Card View */}
          {(isMobile || isTablet) && (
            <Stack spacing={2}>
              {sortedData.map((entry, idx) => (
                <Paper
                  key={entry.id || idx}
                  sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}
                >
                  <Stack spacing={1}>
                    {mobileFields.map((field) => (
                      <Box
                        key={field.key}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            minWidth: 100,
                            fontSize: "0.95rem",
                          }}
                        >
                          {field.label}:
                        </Typography>
                        <Box sx={{ ml: 1, flex: 1 }}>
                          {field.render
                            ? field.render(entry[field.key], entry)
                            : entry[field.key] || "-"}
                        </Box>
                      </Box>
                    ))}
                    {/* Actions */}
                    <Stack direction="row" spacing={1} mt={1}>
                      {(() => {
                        const isOwnResignation = entry.employeeId === currentUserId;
                        const canApprove = entry.status === "pending" && isCurrentUserApprover(entry);
                        
                        return (
                          <>
                            {canApprove && (
                              <>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() =>
                                    handleApprovalAction(entry, "approved")
                                  }
                                  sx={{
                                    backgroundColor: "#2E7D32",
                                    textTransform: "none",
                                    fontSize: "12px",
                                    flex: 1,
                                    "&:hover": { backgroundColor: "#1B5E20" },
                                  }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    handleApprovalAction(entry, "rejected")
                                  }
                                  sx={{
                                    borderColor: "#D32F2F",
                                    color: "#D32F2F",
                                    textTransform: "none",
                                    fontSize: "12px",
                                    flex: 1,
                                    "&:hover": {
                                      borderColor: "#B71C1C",
                                      backgroundColor: "#ffebee",
                                    },
                                  }}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {isOwnResignation && entry.status === "pending" && (
                              <>
                                {canEdit() && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleEdit(entry.employeeId)}
                                    sx={{
                                      color: "#837F39",
                                      borderColor: "#837F39",
                                      textTransform: "none",
                                      fontSize: "12px",
                                      flex: 1,
                                    }}
                                  >
                                    Edit
                                  </Button>
                                )}
                                {canDelete() && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleDelete(entry.employeeId)}
                                    sx={{
                                      borderColor: "#D32F2F",
                                      color: "#D32F2F",
                                      textTransform: "none",
                                      fontSize: "12px",
                                      flex: 1,
                                      "&:hover": {
                                        borderColor: "#B71C1C",
                                        backgroundColor: "#ffebee",
                                      },
                                    }}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </>
                            )}
                            {!canApprove && (!isOwnResignation || entry.status !== "pending" || (!canEdit() && !canDelete())) && (
                              <Typography variant="body2" color="text.secondary" sx={{ flex: 1, textAlign: "center" }}>
                                No actions available
                              </Typography>
                            )}
                          </>
                        );
                      })()}
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}

          {/* Desktop Table View */}
          {!isMobile && !isTablet && (
            <CustomTable
              columns={columns}
              data={paginatedData}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              search={search}
              setSearch={setSearch}
              totalPages={totalPages}
              pagination
            />
          )}
        </>
      )}

      {/* Approval Dialog */}
      <Dialog
        open={approvalDialogOpen}
        onClose={() => setApprovalDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[10],
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#837F39",
            color: "white",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
          }}
        >
          {approvalAction === "approved" ? (
            <CheckCircleIcon sx={{ mr: 1 }} />
          ) : (
            <CancelIcon sx={{ mr: 1 }} />
          )}
          {approvalAction === "approved"
            ? "Approve Resignation"
            : "Reject Resignation"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedResignation && (
            <Paper sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Request Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Employee
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedResignation?.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Employee ID
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedResignation?.employeeNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Last Working Day
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedResignation?.lastDay}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Notice Date
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedResignation?.noticeDay}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Reason
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedResignation?.reason}
                  </Typography>
                </Grid>
                {selectedResignation?.currentLevel && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Current Approval Level
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      Level {parseInt(selectedResignation?.currentLevel) + 1}
                    </Typography>
                  </Grid>
                )}
                {selectedResignation?.currentApprovers && selectedResignation?.currentApprovers.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Current Approvers in this Level
                    </Typography>
                    {selectedResignation?.currentApprovers.map((approver, idx) => (
                      <Chip
                        key={idx}
                        label={`${approver?.approverName || 'Unknown'} (${approver?.approverType || 'N/A'})`}
                        size="small"
                        sx={{ mr: 0.5, mt: 0.5 }}
                        color={approver?.approverId === currentUserId ? "primary" : "default"}
                      />
                    ))}
                  </Grid>
                )}
              </Grid>
            </Paper>
          )}
          {selectedResignation && selectedResignation?.approvalHistory && selectedResignation?.approvalHistory.length > 0 && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Approval History
              </Typography>
              <Stack spacing={1}>
                {selectedResignation?.approvalHistory.map((history, idx) => (
                  <Box key={idx} sx={{ p: 1.5, bgcolor: "white", borderRadius: 1, border: "1px solid #e0e0e0" }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Approver</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {history?.approverName || 'Unknown'} ({history?.approverType || 'N/A'})
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="caption" color="text.secondary">Level</Typography>
                        <Typography variant="body2">{history?.level ? parseInt(history.level) + 1 : 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="caption" color="text.secondary">Action</Typography>
                        <Chip 
                          label={history?.action || 'unknown'} 
                          size="small"
                          color={history?.action === 'approved' ? 'success' : 'error'}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Grid>
                      {history?.comments && (
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Comments</Typography>
                          <Typography variant="body2">{history.comments}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}
          <TextField
            fullWidth
            label="Comments (Optional)"
            multiline
            rows={3}
            value={approvalComments}
            onChange={(e) => setApprovalComments(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Add any comments regarding this decision..."
          />
          {approvalAction === "rejected" && (
            <TextField
              fullWidth
              label="Rejection Reason *"
              multiline
              rows={2}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
              error={!rejectionReason.trim()}
              helperText={
                !rejectionReason.trim()
                  ? "Please provide a reason for rejection"
                  : ""
              }
              placeholder="Please specify the reason for rejecting this resignation..."
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: "grey.50" }}>
          <Button
            onClick={() => setApprovalDialogOpen(false)}
            disabled={submittingApproval}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={submitApproval}
            disabled={
              submittingApproval ||
              (approvalAction === "rejected" && !rejectionReason.trim())
            }
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              minWidth: 120,
              backgroundColor: "#837F39",
              "&:hover": { backgroundColor: "#6f6b2f" },
            }}
            startIcon={submittingApproval && <CircularProgress size={20} />}
          >
            {submittingApproval
              ? "Processing..."
              : approvalAction === "approved"
              ? "Approve Request"
              : "Reject Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResignationTable;