import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
  Chip
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useDispatch, useSelector } from "react-redux";
import { getUploadsByCategory } from "action/UploadAct";
import {
  createTask,
  updateTask,
  getTasks,
  getTasksByRole,
  updateMultipleTasks,
  deleteTasks,
  exportSheet,
  getAllTasksSheet,
} from "action/TasksAct";
import {
  AuthRole,
  AuthTab,
  LoadingIndicator,
  removeDuplicates,
  statuses,
} from "utilities";
import { useLocation } from "react-router-dom";
import { Toast } from "service/toast";
import CustomTable from "../../vihanga/components/CustomTable"
import ActionDropdown from "../../../pages/vihanga/components/ActionDropdown/ActionDropdown";
import { keyresults } from "reducer";

import { useHistory } from 'react-router-dom';
import { DragDropContext } from "react-beautiful-dnd";
import { getEmployees } from "action/EmployeeAct";

import { updateNotificationTask } from "action/NotificationAct";
import useWindowSize from "components/UseWindowSize";
import { setSelectedTaskUser } from "reducer/userSlice";
import { setHandleClick } from "rdx/store";
import { useTranslation } from "react-i18next";
import UserOnboarding from "react-user-onboarding";
import DatePicker, { getAllDatesInRange } from "react-multi-date-picker";
import { multiStatus } from "reducer";
import SelectInputIconStatus from "components/Company/SelectInputIconStatus";

const Tasks = () => {
  const [orderModalShow, setOrderModalShow] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [, setNotStarted] = useState([]);
  const [, setInprogress] = useState([]);
  const [, setCompleted] = useState([]);
  const [status, setStatus] = useState([]);
  const [sample, setSample] = useState([]);

  const [move, setMove] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const dispatch = useDispatch();
  const isMobile = useWindowSize();
  const [dates, setDates] = useState("");
  const [showView, setShowView] = useState("Table");
  const displayOpts = {
    startDate: "",
    endDate: "",
    CompletionDate: "",
  };
  const displayOpts2 = {
    notstarted: true,
    inprogress: true,
    completed: true,
  };
  const empID = JSON.parse(localStorage.getItem("userData"));
  const empID2 = JSON.parse(localStorage.getItem("user"));
  const selectedTab = JSON.parse(localStorage.getItem("selectedTab"));
  const [displayOptions, setDisplayOptions] = useState(displayOpts);
  const [displayOptions2, setDisplayOptions2] = useState(displayOpts2);
  const [employees, setEmployees] = useState([]);
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [operator, setOperator] = useState("");
  const [myTeam, setMyTeam] = useState([]);
  const [selectedUser3, setSelectedUser3] = useState("all");
  const [tableView, setTableView] = useState(true);
  
  // State for table pagination and sorting
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortField, setSortField] = useState("dueDate");
  const [sortDirection, setSortDirection] = useState("asc");

  // Initialize sortedData with tasks
  const sortedData = useMemo(() => {
    let filteredTasks = tasks;
    
    // Apply search filter
    if (search) {
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.owner && task.owner.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (selectedStatus !== "all") {
      filteredTasks = filteredTasks.filter(task => task.status === selectedStatus);
    }
    
    // Apply sorting
    filteredTasks.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
    
    return filteredTasks;
  }, [tasks, search, selectedStatus, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    let response = dispatch(deleteTasks({ data: [id] }));
    response.then(({ data, success, message }) => {
      if (success) {
        getTask();
        Toast({
          type: "success",
          message: "Task deleted successfully",
          time: 3000,
        });
      }
    });
  };

  const onEdit = (row) => {
    // Implement edit functionality
    setShowEditPopup(true);
    // You might want to set some state with the row data to edit
  };

  // ... [keep all your existing functions and useEffect hooks]

  const getProgressLabel = (progress) => {
    if (progress >= 80)
      return { label: "OnTrack", color: "white", backgroundColor: "#4CAF50" };
    if (progress >= 50)
      return { label: "AtRisk", color: "white", backgroundColor: "#FFC107" };
    return { label: "OffTrack", color: "white", backgroundColor: "#F44336" };
  };

  const getTask = () => {
      try {
        setLoading(true);
        let response = dispatch(getTasks());
        response.then(({ data, message }) => {
          if (data !== undefined && data.length > 0) {
            let updatedData = data.map((task) => {
              return {
                priority: task.priority,
                dueDate: task.dueDate,
                title: task.title,
                linkToKR: task.linkToKR,
                attachments: task.attachments,
                comments: task.comments,
                actualCompletionDate: task.actualCompletionDate,
                assignTo: task.assignTo,
                description: task.description,
                krReferenceId: task.krReferenceId,
                startDate: task.startDate,
                id: task._id,
                _id: task._id,
                status: task.status,
                estimationEffort: task.estimationEffort,
                actualEffort: task.actualEffort,
                recurrence: task.recurrence ? task.recurrence : false,
                recurrenceDetails: task.recurrenceDetails
                  ? task.recurrenceDetails
                  : null,
                targetDate: task.dueDate
                  ? window.moment(task.dueDate).format("D MMM YYYY")
                  : "No Date",
                profilePicture: task.profilePicture,
                mainTask: task.mainTask ? task.mainTask : "",
                progressStatus: task.progressStatus ? task.progressStatus : 0,
                owner: task.owner,
                userId: task.userId,
                companyId: task.companyId,
                employeeName: task.employeeName,
                dueMessage: task.dueMessage,
                rewardPoints: task.rewardPoints ? task.rewardPoints : 0,
                children: task.children,
              };
            });
            setTasks(updatedData);
            setLoading(false);
            setError("");
  
            let notStartedTasks = updatedData.filter((task, index) => {
              return task.status === "notstarted";
            });
            let inProgressTasks = updatedData.filter((task, index) => {
              return task.status === "inprogress";
            });
            let completedTasks = updatedData.filter((task, index) => {
              return task.status === "completed";
            });
            setNotStarted(notStartedTasks);
            setInprogress(inProgressTasks);
            setCompleted(completedTasks);
            setStatus(["Not Started", "InProgress", "Completed"]);
            setSample([
              { "Not Started": { tasks: notStartedTasks, lineColor: "#FA5453" } },
              { InProgress: { tasks: inProgressTasks, lineColor: "#FFBF00" } },
              { Completed: { tasks: completedTasks, lineColor: "#3FC429" } },
            ]);
            getEmployes();
          } else if (data.length === 0) {
            setLoading(false);
            setError("No Data Found!");
            setTasks([]);
            setSample([]);
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


     const getEmployes = () => {
        try {
          setLoading(true);
          let response = dispatch(getEmployees());
          response.then(({ data, message }) => {
            if (data !== undefined && data.length > 0) {
              let updatedData = data.map((item) => {
                return {
                  key:
                    item.personalInformation.firstName +
                    " " +
                    item.personalInformation.lastName,
                  value: item._id,
                  profilePicture: item.personalInformation.profilePicture,
                };
              });
              let nonduplicate = removeDuplicates(updatedData, "key");
              setEmployees(nonduplicate);
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

      
  const renderHeaderWithSort = (label, field) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <span style={{ fontWeight: 500 }}>{label}</span>
      <SwapVertIcon
        style={{ fontSize: 16, color: "#777", cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          handleSort(field);
        }}
      />
    </Box>
  );

  const columns = [
    { 
      id: "title", 
      label: renderHeaderWithSort("Title", "title"), 
      render: (row) => row.title 
    },
    {
      id: "dueDate",
      label: renderHeaderWithSort("Due Date", "dueDate"),
      render: (row) => row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "-",
    },
    { 
      id: "owner", 
      label: renderHeaderWithSort("Owner", "owner"), 
      render: (row) => row.owner || "-" 
    },
    { 
      id: "status", 
      label: renderHeaderWithSort("Status", "status"), 
      render: (row) => row.status || "-" 
    },
    { 
      id: "comments", 
      label: renderHeaderWithSort("Comments", "comments"), 
      render: (row) => row.comments || "-" 
    },
    {
      id: "progress",
      label: renderHeaderWithSort("Progress", "progress"),
      width: 160,
      render: (row) => {
        const progress = row.progressStatus || 0;
        const { label, color, backgroundColor } = getProgressLabel(progress);
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap={1.5}
          >
            <Box sx={{ display: "flex", gap: "5px" }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: backgroundColor,
                  fontFamily: "Work Sans",
                }}
              >
                {progress}%
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color,
                  padding: "5px",
                  backgroundColor,
                  borderRadius: "50px",
                  fontFamily: "Work Sans",
                }}
              >
                {label}
              </Typography>
            </Box>
            <Box sx={{ position: "relative", width: 110, height: 11 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: "100%",
                  borderRadius: 50,
                  backgroundColor: "#E0E0E0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor,
                    borderRadius: 95,
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  color: "#FFFFFF",
                  fontWeight: "400",
                  fontSize: "10px",
                  fontFamily: "Work Sans",
                }}
              >
                {progress}%
              </Typography>
            </Box>
            <Chip
              label={row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "--"}
              size="small"
              sx={{
                backgroundColor: color,
                color: "#FFFFFF",
                height: "17px",
                borderRadius: "100px",
              }}
            />
          </Box>
        );
      },
    },
    {
      id: "action",
      label: <span style={{ fontWeight: 500 }}>Action</span>,
      render: (row) => (
        <ActionDropdown
          row={row}
          actions={[
            ...(privileges?.some(p => p.page === "Key Results" && p.edit) 
              ? [{
                  label: "Edit",
                  icon: <BorderColorIcon fontSize="small" />,
                  onClick: () => onEdit(row),
                }]
              : []),
            {
              label: "Delete",
              icon: <DeleteIcon fontSize="small" />,
              onClick: () => handleDelete(row._id),
            },
          ]}
        />
      ),
    }
  ];

  return (
    <Box
      sx={{
        margin: "1rem",
        padding: "2rem",
        bgcolor: "#fff",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        paddingBottom: "70px",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            color: "#0E0E0E",
            fontWeight: "600",
            fontSize: "24px",
            fontFamily: "Montserrat",
            mb: "30px",
            pl: "22px",
          }}
        >
          Task Management
        </Typography>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : sortedData.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
            color: "#777",
            fontSize: "18px",
          }}
        >
          No tasks found
        </Box>
      ) : (
        <CustomTable
          columns={columns}
          data={sortedData}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          search={search}
          setSearch={setSearch}
          onEdit={onEdit}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          pagination
        />
      )}
    </Box>
  );
};

export default Tasks;