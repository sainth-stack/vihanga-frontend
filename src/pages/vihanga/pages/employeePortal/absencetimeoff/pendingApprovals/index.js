import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Paper,
  LinearProgress
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Block as BlockIcon,
  Comment as CommentIcon,
  Flag as FlagIcon,
  Assignment as AssignmentIcon
} from "@mui/icons-material";
import axios from "axios";
import { Toast } from "service/toast";
import { appURL } from "utilities";
import moment from "moment";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getSelectedTabType } from "utilities/getLocalStorageItem";

// Professional status colors without emojis
const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "#2E7D32"; // Professional green
    case "pending":
      return "#F57C00"; // Professional orange
    case "rejected":
      return "#D32F2F"; // Professional red
    case "cancelled":
      return "#616161"; // Professional gray
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
    case "cancelled":
      return "#F5F5F5";
    default:
      return "#F5F5F5";
  }
};

// Professional status display without emojis
const getStatusDisplay = (status) => {
  switch (status) {
    case "approved":
      return "Approved";
    case "pending":
      return "Pending Approval";
    case "rejected":
      return "Rejected";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "approved":
      return <CheckCircleIcon sx={{ fontSize: 18 }} />;
    case "pending":
      return <AccessTimeIcon sx={{ fontSize: 18 }} />;
    case "rejected":
      return <CancelIcon sx={{ fontSize: 18 }} />;
    case "cancelled":
      return <BlockIcon sx={{ fontSize: 18 }} />;
    default:
      return <AccessTimeIcon sx={{ fontSize: 18 }} />;
  }
};

const PendingApprovals = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPending: 0,
    urgentPending: 0,
    todayRequests: 0
  });

  // Professional approval modal states
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [approvalAction, setApprovalAction] = useState("");
  const [approvalComments, setApprovalComments] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [submittingApproval, setSubmittingApproval] = useState(false);

  const companyId = getItemFromLocalStorage("companyId");
  const userRoleId = getItemFromLocalStorage("user");
  const currentUserId = userRoleId?._id;

  const fetchPendingApprovals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${appURL}/recruitment/leaves`, {
        params: {
          companyId,
          currentUserId,
          viewType: "pending-approvals",
          type: getSelectedTabType(),
        },
      });

      const requests = response.data?.data?.data || [];
      setPendingRequests(requests);

      // Calculate statistics
      const urgentCount = requests.filter(req => req.isUrgent).length;
      const todayCount = requests.filter(req => 
        moment(req.createdAt).isSame(moment(), 'day')
      ).length;

      setStats({
        totalPending: requests.length,
        urgentPending: urgentCount,
        todayRequests: todayCount
      });

    } catch (err) {
      console.error("Fetch Error:", err);
      Toast({
        message: err.response?.data?.message || "Failed to fetch pending approvals",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = (leave, action) => {
    setSelectedLeave(leave);
    setApprovalAction(action);
    setApprovalComments("");
    setRejectionReason("");
    setApprovalDialogOpen(true);
  };

  const submitApproval = async () => {
    if (!selectedLeave || !approvalAction) return;

    setSubmittingApproval(true);
    try {
      const response = await axios.post(`${appURL}/recruitment/approve-leave?id=${selectedLeave._id}`, {
        approverId: currentUserId,
        action: approvalAction,
        comments: approvalComments,
        rejectionReason: approvalAction === 'rejected' ? rejectionReason : undefined
      });

      Toast({
        message: response.data?.message || `Leave request ${approvalAction} successfully`,
        type: "success",
      });

      setApprovalDialogOpen(false);
      fetchPendingApprovals(); // Refresh the data
    } catch (err) {
      console.error("Approval Error:", err);
      Toast({
        message: err.response?.data?.message || `Failed to ${approvalAction} leave request`,
        type: "error",
      });
    } finally {
      setSubmittingApproval(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={50} />
          <Typography variant="h6" color="text.secondary">
            Loading pending approvals...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 3 }}>
      {/* Professional Header */}
      <Paper 
        sx={{ 
          p: 4, 
          mb: 3, 
          background: `linear-gradient(135deg, #837F39 0%, #6f6b2f 100%)`,
          color: 'white',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssignmentIcon sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" fontWeight={700}>
            Pending Approvals
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Review and approve leave requests assigned to you
        </Typography>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
            color: 'white',
            borderRadius: 2,
            boxShadow: theme.shadows[4]
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                {stats.totalPending}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Total Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
            color: 'white',
            borderRadius: 2,
            boxShadow: theme.shadows[4]
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                {stats.urgentPending}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Urgent Requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
            color: 'white',
            borderRadius: 2,
            boxShadow: theme.shadows[4]
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                {stats.todayRequests}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Today's Requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pending Requests */}
      {pendingRequests.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 64, color: '#837F39', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} color="text.primary" gutterBottom>
            All Caught Up!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No pending leave requests require your approval at this time.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {pendingRequests.map((request) => (
            <Grid item xs={12} md={6} lg={4} key={request._id}>
              <Card 
                sx={{ 
                  borderRadius: 2,
                  boxShadow: theme.shadows[2],
                  border: request.isUrgent ? `2px solid ${theme.palette.error.main}` : `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    boxShadow: theme.shadows[6],
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Request Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 48, 
                          height: 48, 
                          mr: 2, 
                          bgcolor: '#837F39',
                          fontSize: '1.1rem',
                          fontWeight: 600
                        }}
                      >
                        {request.employeeInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600} color="text.primary">
                          {request.employeeInfo?.name || "Unknown User"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          {request.employeeInfo?.department || "No Department"}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {request.isUrgent && (
                      <Chip
                        icon={<FlagIcon sx={{ fontSize: 14 }} />}
                        label="URGENT"
                        color="error"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Request Details */}
                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <BusinessIcon sx={{ fontSize: 16, mr: 1 }} />
                        Leave Type
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {request.absenceType || "Not specified"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <CalendarTodayIcon sx={{ fontSize: 16, mr: 1 }} />
                        Duration & Period
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {request.durationOfAbsence} day{request.durationOfAbsence > 1 ? 's' : ''}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {request.from && request.to
                          ? `${moment(request.from).format("MMM DD")} - ${moment(request.to).format("MMM DD, YYYY")}`
                          : "Date not specified"}
                      </Typography>
                    </Box>

                    {request.note && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <CommentIcon sx={{ fontSize: 16, mr: 1 }} />
                          Reason
                        </Typography>
                        <Paper sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2">
                            {request.note}
                          </Typography>
                        </Paper>
                      </Box>
                    )}

                    {/* Current Level Display */}
                    {request.currentLevelDisplay && (
                      <Paper sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
                        <Typography variant="body2" color="warning.dark" fontWeight={600}>
                          Current Status: {request.currentLevelDisplay}
                        </Typography>
                      </Paper>
                    )}
                  </Stack>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleApprovalAction(request, 'approved')}
                      fullWidth
                      sx={{
                        backgroundColor: "#2E7D32",
                        '&:hover': { backgroundColor: "#1B5E20" },
                        textTransform: "none",
                        fontWeight: 600,
                        py: 1.2
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => handleApprovalAction(request, 'rejected')}
                      fullWidth
                      sx={{
                        borderColor: "#D32F2F",
                        color: "#D32F2F",
                        '&:hover': { 
                          borderColor: "#B71C1C",
                          backgroundColor: "#FFEBEE" 
                        },
                        textTransform: "none",
                        fontWeight: 600,
                        py: 1.2
                      }}
                    >
                      Reject
                    </Button>
                  </Stack>

                  {/* Application Date */}
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                      Applied on {moment(request.createdAt).format("MMM DD, YYYY [at] HH:mm")}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Professional Approval Dialog */}
      <Dialog
        open={approvalDialogOpen}
        onClose={() => setApprovalDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[12]
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#837F39',
          color: 'white',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center'
        }}>
          {approvalAction === 'approved' ? (
            <CheckCircleIcon sx={{ mr: 1 }} />
          ) : (
            <CancelIcon sx={{ mr: 1 }} />
          )}
          {approvalAction === 'approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
        </DialogTitle>
        
        {submittingApproval && (
          <LinearProgress sx={{ backgroundColor: '#837F39', '& .MuiLinearProgress-bar': { backgroundColor: '#6f6b2f' } }} />
        )}
        
        <DialogContent sx={{ mt: 3 }}>
          {selectedLeave && (
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1, color: '#837F39' }} />
                Request Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Employee</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedLeave.employeeInfo?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Department</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedLeave.employeeInfo?.department || "Not specified"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Leave Type</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedLeave.absenceType}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Duration</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedLeave.durationOfAbsence} day{selectedLeave.durationOfAbsence > 1 ? 's' : ''}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Period</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {moment(selectedLeave.from).format("MMM DD")} - {moment(selectedLeave.to).format("MMM DD, YYYY")}
                  </Typography>
                </Grid>
                {selectedLeave.note && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Reason</Typography>
                    <Paper sx={{ p: 2, bgcolor: 'white', mt: 1, borderRadius: 1 }}>
                      <Typography variant="body1">
                        {selectedLeave.note}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
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
            variant="outlined"
          />
          
          {approvalAction === 'rejected' && (
            <TextField
              fullWidth
              label="Rejection Reason *"
              multiline
              rows={2}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
              error={!rejectionReason.trim()}
              helperText={!rejectionReason.trim() ? "Please provide a reason for rejection" : ""}
              placeholder="Please specify the reason for rejecting this leave request..."
              variant="outlined"
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Button 
            onClick={() => setApprovalDialogOpen(false)}
            disabled={submittingApproval}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          >
            Cancel
          </Button>
          <Button
            onClick={submitApproval}
            disabled={submittingApproval || (approvalAction === 'rejected' && !rejectionReason.trim())}
            variant="contained"
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 140,
              backgroundColor: '#837F39',
              '&:hover': { backgroundColor: '#6f6b2f' }
            }}
            startIcon={submittingApproval ? <CircularProgress size={20} color="inherit" /> : (approvalAction === 'approved' ? <CheckCircleIcon /> : <CancelIcon />)}
          >
            {submittingApproval ? 'Processing...' : (approvalAction === 'approved' ? 'Approve Request' : 'Reject Request')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingApprovals; 