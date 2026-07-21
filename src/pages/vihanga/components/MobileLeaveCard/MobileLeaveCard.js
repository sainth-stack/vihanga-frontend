import React from "react";
import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  Button, 
  Stack, 
  Avatar, 
  Chip, 
  IconButton,
  useTheme 
} from "@mui/material";
import moment from "moment";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BlockIcon from "@mui/icons-material/Block";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"; // Add Move icon

const getStatusColor = (status) => {
  switch (status) {
    case "Waiting for approval":
    case "pending":
      return "#F57C00";
    case "Cancel":
    case "cancelled":
    case "rejected":
      return "#D32F2F";
    case "Approved":
    case "approved":
      return "#2E7D32";
    default:
      return "#000";
  }
};

const getStatusBackgroundColor = (status) => {
  switch (status) {
    case "approved":
      return "#E8F5E8";
    case "pending":
    case "Waiting for approval":
      return "#FFF3E0";
    case "rejected":
    case "cancelled":
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
    case "Waiting for approval":
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
      return <CheckCircleIcon sx={{ fontSize: 16 }} />;
    case "pending":
    case "Waiting for approval":
      return <AccessTimeIcon sx={{ fontSize: 16 }} />;
    case "rejected":
      return <CancelIcon sx={{ fontSize: 16 }} />;
    case "cancelled":
      return <BlockIcon sx={{ fontSize: 16 }} />;
    default:
      return <AccessTimeIcon sx={{ fontSize: 16 }} />;
  }
};

const MobileLeaveCard = ({
  row,
  leave, // Support both 'row' and 'leave' props for backward compatibility
  fields, // Dynamic fields for custom rendering (e.g., time tracking)
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onViewDetails,
  onMove, // Add Move handler
  canApprove = false,
  canEdit = false,
  canDelete = false,
  canViewDetails = false,
  canMove = false, // Add Move permission
  currentUserId,
  cardStyle = {},
  textColor = "#707070",
  statusField = "status",
  dateFields = { from: "from", to: "to" },
  highlight,
}) => {
  const theme = useTheme();
  // Use either 'leave' or 'row' prop for data
  const data = leave || row;

  // Check permissions
  const isOwner = currentUserId && data.empId === currentUserId;
  const showApprovalActions = canApprove && data.status === 'pending';
  const showEditAction = canEdit || (isOwner && data.status === 'pending');
  const showDeleteAction = canDelete || isOwner;
  const showMoveAction = canMove; // Add Move action check

  const renderRow = (label, value, customColor = textColor) => (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      key={label}
      sx={{ mb: "7px", }}
    >
      <Typography variant="body1" fontWeight={500} color="#827d3b">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} color={customColor}>
        {value}
      </Typography>
    </Box>
  );

  const renderEmployeeRow = () => {
    if (!data.employeeInfo?.name) return null;
    
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: "7px",
         
         }}
      >
        <Typography variant="body1" fontWeight={500} color="#827d3b">
          Employee
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar 
            sx={{ 
              width: 24, 
              height: 24, 
              mr: 1, 
              bgcolor: theme.palette.primary.main,
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            {data.employeeInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box textAlign="right">
            <Typography variant="body2" fontWeight={500} color={textColor}>
              {data.employeeInfo?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {data.employeeInfo?.department || "No Dept"}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderStatusRow = () => (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: "7px" }}
    >
      <Typography variant="body1" fontWeight={500} color="#827d3b">
        Status
      </Typography>
      <Box textAlign="right">
        <Chip
          icon={getStatusIcon(data.status)}
          label={getStatusDisplay(data.status)}
          sx={{
            backgroundColor: getStatusBackgroundColor(data.status),
            color: getStatusColor(data.status),
            fontWeight: 600,
            fontSize: "0.75rem",
            border: `1px solid ${getStatusColor(data.status)}`,
            height: "24px",
            '& .MuiChip-icon': {
              color: getStatusColor(data.status)
            }
          }}
          size="small"
        />
        {data.status === 'pending' && data.currentLevelDisplay && (
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
            {data.currentLevelDisplay}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const renderTypeRow = () => {
    if (!data.absenceType) return null;
    
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: "7px" }}
      >
        <Typography variant="body1" fontWeight={500} color="#827d3b">
          Type
        </Typography>
        <Chip
          label={data.absenceType}
          variant="outlined"
          size="small"
          sx={{ 
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            fontWeight: 500,
            fontSize: "0.75rem",
            height: "24px"
          }}
        />
      </Box>
    );
  };

  // Get date range value
  const getDateValue = () => {
    if (data.from && data.to) {
      return `${moment(data.from).format("D MMM YYYY")} - ${moment(data.to).format("D MMM YYYY")}`;
    }
    return "Not specified";
  };

  // Get duration value
  const getDurationValue = () => {
    if (data.durationOfAbsence) {
      return `${data.durationOfAbsence} day${data.durationOfAbsence > 1 ? 's' : ''}`;
    }
    return 'N/A';
  };

  // If fields are provided (for custom rendering like time tracking), use them
  if (fields && fields.length > 0) {
    return (
      <Card
        sx={{
          mb: "1rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.5px 0px rgba(0,0,0,0.2)",
          
          border: "1px solid #e0e0e0",
          ...cardStyle,
          paddingBottom: "0px"
        }}
      >
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: "0px", p: "12px",
            backgroundColor: highlight === 'red' ? '#ffeaea' : highlight === 'orange' ? '#fff4e5' : undefined,
           }}
        >
          {/* Dynamic Field Rendering */}
          {fields.map((field, index) => {
            const value = data[field.key];
            const displayValue = field.render ? field.render(value, data) : value || 'N/A';
            
            return (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: "7px",
                 
                 }}
                
              >
                <Typography variant="body1" fontWeight={500} color="#827d3b">
                  {field.label}
                </Typography>
                <Typography variant="body2" fontWeight={500} color={textColor}>
                  {displayValue}
                </Typography>
              </Box>
            );
          })}
          
          {/* Actions Section - All Inline at Bottom */}
          {(showApprovalActions || canViewDetails || showEditAction || showDeleteAction || showMoveAction) && (
            <Box sx={{ mt: 2, pt: 1, borderTop: "1px solid #e0e0e0" }}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                {/* View Details (Eye Icon) */}
                {canViewDetails && (
                  <IconButton
                    size="small"
                    onClick={() => onViewDetails && onViewDetails(data)}
                    sx={{
                      color: "#85803c", // Theme color for move
                      bgcolor: "#85803c20",
                      '&:hover': { 
                        bgcolor: "#85803c40"
                      },
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                )}

                {/* Edit Icon */}
                {showEditAction && (
                  <IconButton
                    size="small"
                    onClick={() => onEdit && onEdit(data)}
                    sx={{
                      color: "#85803c", // Theme color for move
                      bgcolor: "#85803c20",
                      '&:hover': { 
                        bgcolor: "#85803c40"
                      },
                    }}
                  >
                    <BorderColorIcon fontSize="small" />
                  </IconButton>
                )}

                {/* Delete Icon */}
                {showDeleteAction && (
                  <IconButton
                    size="small"
                    onClick={() => onDelete && onDelete(data)}
                    sx={{
                      color: theme.palette.error.main,
                      bgcolor: theme.palette.error.light + '20',
                      '&:hover': { 
                        bgcolor: theme.palette.error.light + '40'
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}

                {/* Move Icon */}
                {showMoveAction && (
                  <IconButton
                    size="small"
                    onClick={() => onMove && onMove(data)}
                    sx={{
                      color: "#85803c", // Theme color for move
                      bgcolor: "#85803c20",
                      '&:hover': { 
                        bgcolor: "#85803c40"
                      },
                    }}
                  >
                    <SwapHorizIcon fontSize="small" />
                  </IconButton>
                )}

                {/* Approval Actions */}
                {showApprovalActions && (
                  <>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => onApprove && onApprove(data)}
                      sx={{
                        backgroundColor: "#2E7D32",
                        '&:hover': { backgroundColor: "#1B5E20" },
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        minWidth: "80px"
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => onReject && onReject(data)}
                      sx={{
                        borderColor: "#D32F2F",
                        color: "#D32F2F",
                        '&:hover': { 
                          borderColor: "#B71C1C",
                          backgroundColor: "#ffebee" 
                        },
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        minWidth: "70px"
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default rendering for leave management (backward compatibility)
  return (
    <Card
      sx={{
        mb: "1rem",
        borderRadius: "1.5rem",
        backgroundColor: "#fff",
        border: "1px solid #e0e0e0",
        ...cardStyle,
        paddingBottom: "0px"
      }}
    >
      <CardContent
        sx={{ display: "flex", flexDirection: "column", gap: "0px", p: "12px",
          backgroundColor: highlight === 'red' ? '#ffeaea' : highlight === 'orange' ? '#fff4e5' : undefined,
        }}
      >
        {/* All Data Rows */}
        {renderRow("Date", getDateValue())}
        {renderEmployeeRow()}
        {renderTypeRow()}
        {renderRow("Duration", getDurationValue())}
        {renderStatusRow()}
        
        {/* Actions Section - All Inline at Bottom */}
        {(showApprovalActions || canViewDetails || showEditAction || showDeleteAction || showMoveAction) && (
          <Box sx={{ mt: 2, pt: 1, borderTop: "1px solid #e0e0e0" }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ paddingBottom: "0px" }}>
              {/* View Details (Eye Icon) */}
              {canViewDetails && (
                <IconButton
                  size="small"
                  onClick={() => onViewDetails && onViewDetails(data)}
                  sx={{
                    color: theme.palette.primary.main,
                    bgcolor: theme.palette.primary.light + '20',
                    '&:hover': { 
                      bgcolor: theme.palette.primary.light + '40'
                    },
                  }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              )}

              {/* Edit Icon */}
              {showEditAction && (
                <IconButton
                  size="small"
                  onClick={() => onEdit && onEdit(data)}
                  sx={{
                    color: theme.palette.info.main,
                    bgcolor: theme.palette.info.light + '20',
                    '&:hover': { 
                      bgcolor: theme.palette.info.light + '40'
                    },
                  }}
                >
                  <BorderColorIcon fontSize="small" />
                </IconButton>
              )}

              {/* Delete Icon */}
              {showDeleteAction && (
                <IconButton
                  size="small"
                  onClick={() => onDelete && onDelete(data)}
                  sx={{
                    color: theme.palette.error.main,
                    bgcolor: theme.palette.error.light + '20',
                    '&:hover': { 
                      bgcolor: theme.palette.error.light + '40'
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}

              {/* Move Icon */}
              {showMoveAction && (
                <IconButton
                  size="small"
                  onClick={() => onMove && onMove(data)}
                  sx={{
                    color: "#85803c", // Theme color for move
                    bgcolor: "#85803c20",
                    '&:hover': { 
                      bgcolor: "#85803c40"
                    },
                  }}
                >
                  <SwapHorizIcon fontSize="small" />
                </IconButton>
              )}

              {/* Approval Actions */}
              {showApprovalActions && (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => onApprove && onApprove(data)}
                    sx={{
                      backgroundColor: "#2E7D32",
                      '&:hover': { backgroundColor: "#1B5E20" },
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      minWidth: "80px"
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => onReject && onReject(data)}
                    sx={{
                      borderColor: "#D32F2F",
                      color: "#D32F2F",
                      '&:hover': { 
                        borderColor: "#B71C1C",
                        backgroundColor: "#ffebee" 
                      },
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      minWidth: "70px"
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileLeaveCard;
