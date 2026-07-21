import React from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip,
  Checkbox,
} from "@mui/material";
import {
  Edit,
  Delete,
  MoreVert,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from "@mui/icons-material";
import CheckIcon from '@mui/icons-material/Check';
import objective from "assets/svg/objective.svg";
import childIcon from "assets/svg/child.svg";
import taskPlusIcon from "assets/svg/tasks.svg";
import { defaultProfilePic } from "utilities";
import { RatingComponent } from "./Rating";
import { useHistory } from "react-router-dom";

export function ReviewsColumns(
  stepStatus,
  handleEdit,
  setEditModal,
  privileges,
  refreshData,
  props,
  totalWeight,
  handleDelete,
  setOrderModalShow4,
  setMultipleObjectives,
  setSelectedObjective,
  handleDeleteKeyResults,
  handleViewTask,
  setViewModalTask,
  handleEditTask,
  setEditModalTask,
  handleDeleteTasks,
  handleOpenPopup,
  handleAuditHistory,
  hideColumns,
  handleUpdateGoals,
  isEmployee,
  isManager,
  status,
  templateInfo,
  selectedItems,
  setSelectedItems,
  ratingScale
) {
  const history = useHistory();

  console.log(status, "status------");
  const handleCheckboxChange = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columns = [
    {
      id: "objective",
      label: templateInfo?.percentageType === 'goal' ? "GOAL" : 'OBJECTIVE',
      sortable: true,
      width: "18.8%",
      render: (row) => {
        const handleNavigateToObjective = () => {
       if(row?.objectiveId){
        history.push(`/admin/objectives/details?isEdit=true&objectiveId=${row.objectiveId}&keyResultId=${row._id}&fromReviews=true`);
       } else if(row?.krReferenceId){
        history.push(`/admin/objectives/task?isEdit=true&objectiveId=${row.objectiveId}&keyResultId=${row.keyResultId}&taskId=${row._id}&fromReviews=true`);
       } else{
        history.push(`/admin/objectives/objective?isEdit=true&objectiveId=${row._id}&fromReviews=true`);
       }
        };

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              checked={selectedItems[row.id] || false}
              onChange={() => handleCheckboxChange(row.id)}
              icon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #535353',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              }
              checkedIcon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: '#837F39',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
                </Box>
              }
              sx={{ padding: 0 }}
            />
            <img 
              src={objective} 
              alt="Objective" 
              style={{ height: 15, cursor: 'pointer' }} 
              onClick={handleNavigateToObjective} 
            />
            <Typography
              sx={{
                fontSize: "14px",
                color: "#535353",
                cursor: "pointer",
                textDecoration: "underline",
                "&:hover": { color: "#837F39" }
              }}
              onClick={handleNavigateToObjective}
            >
              {row.objective}
            </Typography>
            {!hideColumns && (
              <IconButton
                size="small"
                onClick={() => handleDelete(row._id, row)}
                sx={{ color: "#f44336" }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        );
      }
    },
    {
      id: "dueDate",
      label: "DUE DATE",
      sortable: true,
      width: "9.8%",
      render: (row) => (
        <Typography sx={{ fontSize: "14px", color: "#535353" }}>
          {row.dueDate}
        </Typography>
      )
    },
    {
      id: "weight",
      label: "WEIGHT",
      sortable: true,
      width: "12%",
      render: (row) => (
        <Typography sx={{ fontSize: "14px", color: "#535353" }}>
          {row.weight}
        </Typography>
      )
    },
    {
      id: "progressStatus",
      label: "PROGRESS",
      sortable: true,
      hidden: templateInfo?.percentageType === 'goal',
      render: (row) => (
        <Box sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={row.progressStatus || 0}
            sx={{
              height: "10px",
              borderRadius: "20px",
              backgroundColor: "#ddd",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#388e3c",
                borderRadius: "20px",
              },
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: "12px", 
              color: "#535353",
              mt: 0.5,
              display: "block"
            }}
          >
            {row.progressStatus || 0}%
          </Typography>
        </Box>
      )
    },
    {
      id: "owner",
      label: "OWNER",
      sortable: true,
      hidden: hideColumns,
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={row.profilePicture ? row.profilePicture : defaultProfilePic}
            alt="user pic"
            sx={{ width: 24, height: 24 }}
          />
          <Typography sx={{ fontSize: "14px", color: "#535353" }}>
            {row.owner}
          </Typography>
        </Box>
      )
    },
    {
      id: "employeeRating",
      label: "Employee Rating",
      sortable: false,
      // Only show at 'Submit' step
      hidden: status !== "Submit",
      render: (row) => (
        <Box>
          <RatingComponent
            isGoals={true}
            // Editable only by the employee at 'Submit' step
            readonly={!(isEmployee && status === "Submit")}
            value={row.employeeRating}
            name="employeeRating"
            onChange={(event) => {
              let goalData = {
                ...row,
                employeeRating: event.target.value
              };
              handleUpdateGoals(row._id, goalData);
            }}
            ratingScale={ratingScale}
          />
        </Box>
      )
    },
    {
      id: "managerRating",
      label: "Manager Rating",
      sortable: false,
      // Hide for all self-submission statuses
      hidden: ["", "Submit", "Self Submission (Employee)"].includes(status),
      render: (row) => {
        console.log('managerRating column status:', status);
        return (
          <Box>
            <RatingComponent
              isGoals={true}
              // Editable only by the manager at 'Manager Review' step
              readonly={!(isManager && status === "Manager Review")}
              value={row.managerRating}
              name="managerRating"
              onChange={(event) => {
                let goalData = {
                  ...row,
                  managerRating: event.target.value
                };
                handleUpdateGoals(row._id, goalData);
              }}
              ratingScale={ratingScale}
            />
          </Box>
        );
      }
    },
    {
      id: "actions",
      label: "ACTION",
      hidden: hideColumns,
      render: (row) => {
        const handleEditClick = () => {
          // Navigate to objective edit page with fromReviews flag
          history.push(`/admin/objectives/objective?isEdit=true&objectiveId=${row._id}&fromReviews=true`);
        };

        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={handleEditClick}
              sx={{ color: "#837F39" }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDelete(row._id, row)}
              sx={{ color: "#f44336" }}
            >
              <Delete fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        );
      }
    }
  ];

  const columnsChild = [
    {
      id: "objective",
      label: templateInfo?.percentageType === 'goal' ? "GOAL" : 'OBJECTIVE',
      sortable: true,
      width: "18.8%",
      render: (row) => {
        const handleNavigateToKeyResult = () => {
          // Navigate to key result edit page with fromReviews flag
          history.push(`/admin/objectives/details?isEdit=true&objectiveId=${row.objectiveId}&keyResultId=${row._id}&fromReviews=true`);
        };

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img 
              src={objective} 
              alt="Objective" 
              style={{ height: 15, cursor: 'pointer' }} 
              onClick={handleNavigateToKeyResult} 
            />
            <Typography
              sx={{
                fontSize: "14px",
                color: "#535353",
                cursor: "pointer",
                textDecoration: "underline",
                "&:hover": { color: "#837F39" }
              }}
              onClick={handleNavigateToKeyResult}
            >
              {row.objective}
            </Typography>
            {!hideColumns && (
              <IconButton
                size="small"
                onClick={() => handleDelete(row._id, row)}
                sx={{ color: "#f44336" }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        );
      }
    },
    {
      id: "dueDate",
      label: "DUE DATE",
      sortable: true,
      width: "9.8%",
      render: (row) => (
        <Typography sx={{ fontSize: "14px", color: "#535353" }}>
          {row.dueDate}
        </Typography>
      )
    },
    {
      id: "weight",
      label: "WEIGHT",
      sortable: true,
      width: "12%",
      render: (row) => (
        <Typography sx={{ fontSize: "14px", color: "#535353" }}>
          {row.weight}
        </Typography>
      )
    },
    {
      id: "progressStatus",
      label: "PROGRESS",
      sortable: true,
      hidden: templateInfo?.percentageType === 'goal',
      render: (row) => (
        <Box sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={row.percent || 0}
            sx={{
              height: "10px",
              borderRadius: "20px",
              backgroundColor: "#ddd",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#388e3c",
                borderRadius: "20px",
              },
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: "12px", 
              color: "#535353",
              mt: 0.5,
              display: "block"
            }}
          >
            {row.percent || 0}%
          </Typography>
        </Box>
      )
    },
    {
      id: "owner",
      label: "OWNER",
      sortable: true,
      hidden: hideColumns,
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={row.profilePicture ? row.profilePicture : defaultProfilePic}
            alt="user pic"
            sx={{ width: 24, height: 24 }}
          />
          <Typography sx={{ fontSize: "14px", color: "#535353" }}>
            {row.owner}
          </Typography>
        </Box>
      )
    }
  ];

  const columnsChildTasks = [
    {
      id: "title",
      label: "TITLE",
      sortable: true,
      width: "19.5%",
      render: (row) => {
        const handleNavigateToTask = () => {
          // Navigate to task edit page with fromReviews flag
          history.push(`/admin/objectives/task?isEdit=true&objectiveId=${row.objectiveId}&keyResultId=${row.keyResultId}&taskId=${row._id}&fromReviews=true`);
        };

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img 
              src={taskPlusIcon} 
              alt="Task" 
              style={{ height: 15, cursor: 'pointer' }} 
              onClick={handleNavigateToTask}
            />
            <Typography 
              sx={{ 
                fontSize: "14px", 
                color: "#535353",
                cursor: "pointer",
                textDecoration: "underline",
                "&:hover": { color: "#837F39" }
              }}
              onClick={handleNavigateToTask}
            >
              {row.title}
            </Typography>
          </Box>
        );
      }
    },
    {
      id: "targetDate",
      label: "TARGET DATE",
      sortable: true,
      width: "10.4%",
      render: (row) => (
        <Typography sx={{ fontSize: "14px", color: "#535353" }}>
          {window.moment(row.dueDate).format("D MMM YYYY")}
        </Typography>
      )
    },
    {
      id: "weight",
      label: "WEIGHT",
      sortable: true,
      width: "9%",
      render: (row) => (
        <Typography sx={{ fontSize: "14px", color: "#535353" }}>
          {row.weight || "-"}
        </Typography>
      )
    },
    {
      id: "owner",
      label: "OWNER",
      sortable: true,
      width: "15%",
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            src={row.profilePicture ? row.profilePicture : defaultProfilePic}
            alt="user pic"
            sx={{ width: 24, height: 24 }}
          />
          <Typography sx={{ fontSize: "14px", color: "#535353" }}>
            {row.owner}
          </Typography>
        </Box>
      )
    },
    {
      id: "status",
      label: "SUCCESS METRICS",
      sortable: true,
      width: "29.5%",
      render: (row) => {
        let status = "";
        if (row.status === "notstarted") {
          status = "Not Started";
        } else if (row.status === "inprogress") {
          status = "In Progress";
        } else if (row.status === "completed") {
          status = "Completed";
        }

        return (
          <Chip
            label={status}
            size="small"
            sx={{
              backgroundColor: row.status === "completed" ? "#4CAF50" : 
                             row.status === "inprogress" ? "#FFC107" : "#F44336",
              color: "white",
              fontSize: "12px"
            }}
          />
        );
      }
    },
    {
      id: "actions",
      label: "ACTION",
      width: "7.5%",
      render: (row) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleViewTask(row)}
            sx={{ color: "#837F39" }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteTasks(row._id, row)}
            sx={{ color: "#f44336" }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  return {
    columns,
    columnsChild,
    columnsChildTasks
  };
} 