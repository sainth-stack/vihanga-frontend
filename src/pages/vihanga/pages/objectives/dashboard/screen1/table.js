import React, { useState, useEffect } from "react";
import CustomTable from "../../../../components/CustomTable/index";
import EditSvgIcon from "../../../../../../../src/assets/svg/EditSvg.svg";
import DeleteSvgIcon from "../../../../../../../src/assets/svg/DeleteSvg.svg";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTranslation } from 'react-i18next';
import {
  Box,
  Checkbox,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";
import addButtonIcon from "../../../../../../assets/svg/addButtonIcon.svg";
import taskIcon from "../../../../../../assets/svg/obticon.svg";
import keyResultIcon from "../../../../../../assets/svg/keyresults.svg";
import task2Icon from "../../../../../../assets/svg/tasks.svg";
import AssignmentIcon from '@mui/icons-material/Assignment';
import notepadIcon from "../../../../../../assets/svg/reviewspaper.svg";
import { useDispatch } from "react-redux";
import { deleteObjectives, updateObjective, approveAllObjectives } from "action/GoalsAct";
import { updateTask } from "action/TasksAct";
import { updatekeyResult } from "action/keyResultAct";
import { useHistory } from "react-router-dom";
import CascadedPopup from "./cascade/CascadedPopup";
import { handleCascade } from "./cascade/handleFunctions";
import { canEdit, canDelete } from "utilities/privilegeHelper";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { getAllRewards } from "action/RewardManagementAct";
import { getAllPrivilegesGroup } from "action/PrivilegesGroupAct";
import { getObjectiveRewardPoints, getTaskRewardPoints, getSubTaskRewardPoints, getKRRewardPoints } from "utils/rewardCalculator";
import { Toast } from "service/toast";
import { renderTextWithLinks } from "utils/linkUtils";

const ActionMenu = ({ row, handleEdit, handleDelete, sx, t, hasEditPrivilege, hasDeletePrivilege, actionMenuRef, editButtonRef, isFirstRow }) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Don't show menu if no privileges
  if (!hasEditPrivilege && !hasDeletePrivilege) {
    return null;
  }

  const isDeleteDisabled = row.isApproved === "pending" || row.isApproved === "approved";

  return (
    <div style={{ position: "relative", ...sx }}>
      <IconButton
        tabIndex={0}
        ref={isFirstRow ? actionMenuRef : null}
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
        {hasEditPrivilege && (
          <MenuItem
            ref={isFirstRow ? editButtonRef : null}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              handleEdit(row);
            }}
          >
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <img tabIndex={0} src={EditSvgIcon} alt={t("ObjectivesTable.Actions.Edit")} width="18" height="18" />
            </ListItemIcon>
            <ListItemText
              primary={t("ObjectivesTable.Actions.Edit")}
              sx={{
                color: "#6D6D6D",
                fontWeight: "500",
                fontSize: "14px",
                letterSpacing: "1%",
              }}
            />
          </MenuItem>
        )}

        {hasDeletePrivilege && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              if (!isDeleteDisabled) handleDelete(row);
            }}
            disabled={isDeleteDisabled}
          >
            <ListItemIcon sx={{ minWidth: "30px", opacity: isDeleteDisabled ? 0.5 : 1 }}>
              <img tabIndex={0} src={DeleteSvgIcon} alt={t("ObjectivesTable.Actions.Delete")} width="18" height="18" />
            </ListItemIcon>
            <ListItemText
              primary={t("ObjectivesTable.Actions.Delete")}
              sx={{
                color: isDeleteDisabled ? "#A0A0A0" : "#6D6D6D",
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

/** Normalize API values ("Approved", booleans) for strict comparisons. */
const normalizeApprovalString = (value) => {
  if (value === true || value === "true") return "approved";
  if (value === false || value === "false") return "";
  if (value == null) return "";
  const s = String(value).trim().toLowerCase().replace(/\s+/g, "_");
  if (s === "approved") return "approved";
  if (s === "rejected") return "rejected";
  if (s === "pending") return "pending";
  if (s === "not_submitted") return "not_submitted";
  return "";
};

/**
 * Chips for KR/task should reflect parent approval when the child has no own status
 * (common after objective-only approval).
 */
const getEffectiveApprovalForDisplay = (row) => {
  const own = normalizeApprovalString(row.isApproved);
  if (own === "approved" || own === "rejected" || own === "pending") return own;
  if (own === "not_submitted") return "not_submitted";

  if (row.type === "task") {
    const kr = normalizeApprovalString(row.keyResultIsApproved);
    if (kr === "approved" || kr === "rejected" || kr === "pending") return kr;
  }
  if (row.type === "keyresult" || row.type === "task") {
    const obj = normalizeApprovalString(row.objectiveIsApproved);
    if (obj === "approved" || obj === "rejected" || obj === "pending") return obj;
  }
  return own;
};

//objectives table-dashboard
const TaskTable3 = ({ data, isLoading, refetchObjectives, selectedTab, createOKRRef, actionMenuRef, editButtonRef, addKRRef }) => {
  const { t } = useTranslation();

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 960px)");

  // Privilege checks - automatically detects current page from route
  const hasEditPrivilege = canEdit();
  const hasDeletePrivilege = canDelete();


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [multipleObjectives, setMultipleObjectives] = useState(false);
  const [objectiveId, setObjectiveId] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState();

  const [selectedStatus, setSelectedStatus] = useState([
    "OnTrack",
    "AtRisk",
    "OffTrack",
  ]);
  const [visibleColumns, setVisibleColumns] = useState([
    "Objective",
    "progress",
    "owner",
    "dueDate",
    "weight",
    "status",
    "actions",
    "Add KR",
  ]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [isCompanyOKRsFilterActive, setIsCompanyOKRsFilterActive] =
    useState(false);
  const [orderModalShow4, setOrderModalShow4] = useState(false);
  const [rewardSchemes, setRewardSchemes] = useState([]);
  const [privilegeGroups, setPrivilegeGroups] = useState([]);
  const [approvingId, setApprovingId] = useState(null);
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [isApprovingAll, setIsApprovingAll] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const companyId = JSON.parse(localStorage.getItem("companyId")) || null;

  // Fetch reward schemes and privilege groups on component mount
  useEffect(() => {
    const fetchRewardData = async () => {
      try {
        // Fetch reward schemes
        const rewardsResponse = await dispatch(getAllRewards());
        if (rewardsResponse.data) {
          setRewardSchemes(rewardsResponse.data);
        }

        // Fetch privilege groups
        const groupsResponse = await dispatch(getAllPrivilegesGroup());
        if (groupsResponse.data && groupsResponse.data.privilegeGroups) {
          setPrivilegeGroups(groupsResponse.data.privilegeGroups);
        }
      } catch (error) {
        console.error("Error fetching reward data:", error);
      }
    };

    fetchRewardData();
  }, [dispatch]);

  const handlecallback = () => {
    refetchObjectives();
  };

  const getProgressLabel = (progress) => {
    if (progress >= 80)
      return { label: "OnTrack", displayLabel: t("ObjectivesTable.Status.OnTrack"), color: "white", backgroundColor: "#4CAF50" };
    if (progress >= 50)
      return { label: "AtRisk", displayLabel: t("ObjectivesTable.Status.AtRisk"), color: "white", backgroundColor: "#FFC107" };
    return { label: "OffTrack", displayLabel: t("ObjectivesTable.Status.OffTrack"), color: "white", backgroundColor: "#F44336" };
  };


  // Calculate total weight per employee from backend data
  const calculateTotalWeightPerEmployee = () => {
    if (!data?.data) return {};

    const weightsByEmployee = {};

    data.data.forEach(item => {
      // Use employeeTotalWeight from backend if available, otherwise calculate
      const empId = item.employeeReferenceId;
      if (empId && item.employeeTotalWeight !== undefined) {
        weightsByEmployee[empId] = item.employeeTotalWeight;
      } else if (empId) {
        // Fallback: calculate on frontend
        if (!weightsByEmployee[empId]) {
          weightsByEmployee[empId] = 0;
        }
        weightsByEmployee[empId] += parseFloat(item.weight) || 0;
      }
    });

    return weightsByEmployee;
  };

  const employeeWeights = calculateTotalWeightPerEmployee();

  console.log("Employee weights:", employeeWeights);

  const mappedData =
    data?.data?.map((item) => {
      const employeeId = item.employeeReferenceId;
      const employeeTotalWeight = employeeWeights[employeeId] || 0;
      const canSubmitForApproval = employeeTotalWeight >= 100;

      return {
        id: item._id,
        task: item.objective || "N/A",
        description: item.dimension || "",
        progress: parseFloat(item.progressStatus) || 0,
        dueDate: item.dueDate && new Date(item.dueDate).getTime() ? new Date(item.dueDate).getTime() : 0, // Use timestamp for sorting
        dueDateRaw: item.dueDate && new Date(item.dueDate).getTime() ? item.dueDate : null, // Original date for API payloads (never send sort timestamp)
        dueDateDisplay: item.dueDate && new Date(item.dueDate).getTime()
          ? new Date(item.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
          : "N/A",
        owner: item.owner || "N/A",
        ownerName: item?.ownerName || item?.owner || "N/A", // Display name for objectives
        ownerRole: item.employeeName || "N/A",
        weight: item.children?.length > 0
          ? item.children.reduce((sum, kr) => sum + (parseFloat(kr.weight) || 0), 0)
          : (parseFloat(item.weight) || 0),
        rewardPoints: parseFloat(item.dynamicRewardPoints) || parseFloat(item.rewardPoints) || 0, // Reward points for the objective
        status: item.isApproved || item.approvalRequired || false,
        isApproved: item.isApproved || "",
        pending: item.pending || null,
        type: "objective",
        statusDisplay: item.statusLabel || item.statusName || item.status || null,
        isAlignedToCompany: !!(item.isAlignedToCompany === true || item.isAlignedToCompany === "Yes"),
        cascadeAssigneeType: item.cascadeAssigneeType || null,
        // Store complete objective data for approval
        objective: item.objective,
        dimension: item.dimension,
        comments: item.comments,
        feedAttachment: item.feedAttachment,
        employeeName: item.employeeName,
        employeeReferenceId: item.employeeReferenceId,
        okrPeriod: item.okrPeriod,
        okrYear: item.okrYear,
        // Add totalWeight flag to know if user can submit
        employeeTotalWeight: employeeTotalWeight,
        canSubmitForApproval: canSubmitForApproval,
        functionName: item.functionName || "",
        designation: item.designation || "",

        children:
          item.children?.map((kr) => ({
            id: kr._id,
            objectiveId: item._id,
            task: kr.keyResultName || "N/A",
            description: kr.dimension || "",
            progress: parseFloat(kr.percent) || 0, // Ensure it's a number
            dueDate: kr.targetDate && new Date(kr.targetDate).getTime() ? new Date(kr.targetDate).getTime() : 0, // Use timestamp for sorting
            dueDateDisplay: kr.targetDate && new Date(kr.targetDate).getTime()
              ? new Date(kr.targetDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
              : "N/A",
            owner: kr.owner || "N/A",
            ownerName: kr?.ownerName || kr?.owner || "N/A", // Display name for key results
            ownerRole: "Key Result",
            weight: parseFloat(kr.weight) || 0, // Ensure it's a number
            rewardPoints: parseFloat(kr.dynamicRewardPoints) || parseFloat(kr.rewardPoints) || 0, // Reward points for key results
            status: kr.isApproved || kr.approvalRequired || false,
            isApproved: kr.isApproved || "",
            pending: kr.pending || null,
            isAlignedToCompany: !!(kr.isAlignedToCompany === true || kr.isAlignedToCompany === "Yes"),
            cascadeAssigneeType: kr.cascadeAssigneeType || null,
            objectiveIsApproved: item.isApproved,
            type: "keyresult",
            statusDisplay:
              kr.status ||
              kr.statusLabel ||
              kr.progressStatusLabel ||
              kr.progressStatusName ||
              null,
            // Store complete key result data for approval
            keyResultName: kr.keyResultName,
            okrName: kr.okrName || kr.keyResultName,
            // Inherit parent's weight calculation
            employeeTotalWeight: employeeTotalWeight,
            canSubmitForApproval: canSubmitForApproval,
            source: kr.source,
            polarity: kr.polarity,
            target: kr.target,
            actual: kr.actual,
            targetDate: kr.targetDate,
            actualDate: kr.actualDate,
            feedAttachment: kr.feedAttachment,
            userId: kr.userId,
            kpiName: kr.kpiName,
            unit: kr.unit,
            comments: kr.comments,
            functionName: kr.functionName || item.functionName || "",
            designation: kr.designation || item.designation || "",
            children:
              kr.children?.map((task) => ({
                id: task._id,
                objectiveId: item._id,
                keyResultId: kr._id,
                task: task.title || "N/A",
                description: task.description || "",
                progress: parseFloat(task.progressStatus) || 0, // Ensure it's a number
                dueDate: task.dueDate && new Date(task.dueDate).getTime() ? new Date(task.dueDate).getTime() : 0, // Use timestamp for sorting
                dueDateRaw: task.dueDate && new Date(task.dueDate).getTime() ? task.dueDate : null, // Original date for API payloads
                dueDateDisplay: task.dueDate && new Date(task.dueDate).getTime()
                  ? new Date(task.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                  : "N/A",
                owner: task.assignTo?.[0] || "N/A",
                ownerName: task?.assignee?.[0] || task?.assignTo?.[0] || "N/A", // Display name for tasks
                ownerRole: "Task",
                weight: 0,
                rewardPoints: parseFloat(task.dynamicRewardPoints) || 0, // Reward points for tasks
                status: task.isApproved || task.approvalRequired || "N/A",
                isApproved: task.isApproved || "",
                pending: task.pending || null,
                type: "task",
                objectiveIsApproved: item.isApproved,
                keyResultIsApproved: kr.isApproved,
                statusDisplay:
                  task.status ||
                  task.statusLabel ||
                  task.workflowStatus ||
                  null,
                // Inherit parent's weight calculation
                employeeTotalWeight: employeeTotalWeight,
                canSubmitForApproval: canSubmitForApproval,
                // Store complete task data for approval
                title: task.title,
                startDate: task.startDate,
                actualCompletionDate: task.actualCompletionDate,
                linkToKR: task.linkToKr,
                assignTo: task.assignTo || [],
                priority: task.priority,
                comments: task.comments,
                attachments: task.attachments,
                krReferenceId: task.krReferenceId || kr._id,
                objectiveReferenceId: item._id,
                recurrence: task.recurrence,
                recurrenceDetails: task.recurrenceDetails,
                mainTask: task.mainTask,
                functionName: task.functionName || kr.functionName || item.functionName || "",
                designation: task.designation || kr.designation || item.designation || "",
              })) || [],
          })) || [],
      };
    }) || [];

  const searchLower = search.trim().toLowerCase();

  const filteredData = mappedData.filter((item) => {
    const searchMatch = (text) =>
      text?.toString().toLowerCase().includes(searchLower);
    const { label: statusLabel, displayLabel } = getProgressLabel(item.progress);

    const matchesObjective = [
      item.task,
      item.description,
      item.owner,
      item.ownerRole,
      item.ownerName,
      item.employeeName,
      item.objective,
      statusLabel,
      displayLabel,
      item.progress?.toString(),
      item.weight
    ].some(searchMatch);

    const matchesNested = item.children?.some((kr) => {
      const krStatus = getProgressLabel(kr.progress);

      const krMatch = [kr.task, kr.keyResultName,
      kr.description, kr.owner, kr.ownerName, kr.kpiName, kr.percent, krStatus.label,
      krStatus.displayLabel,
      ].some(searchMatch);
      const taskMatch = kr.children?.some((task) =>
        [task.task, task.title, task.description,
        task.owner, task.ownerName, task.progressStatus,
        task.weight].some(searchMatch)
      );
      return krMatch || taskMatch;
    });

    const matchesSearch = matchesObjective || matchesNested;

    const { label } = getProgressLabel(item.progress);
    const matchesStatus = selectedStatus.includes(label);

    const isCompanyOKR = item.isAlignedToCompany === true || item.isAlignedToCompany === "Yes" ||
      item.children?.some((kr) => kr.isAlignedToCompany === true || kr.isAlignedToCompany === "Yes");
    const passesCompanyOKRFilter = !isCompanyOKRsFilterActive || isCompanyOKR;

    return matchesSearch && matchesStatus && passesCompanyOKRFilter;
  });

  useEffect(() => {
    setPage(0);
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleCheckboxChange = (row) => {
    setSelectedTasks((prev) => {
      const isSelected = prev.some((item) => item.id === row.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== row.id);
      } else {
        return [...prev, row];
      }
    });
  };

  const handleEdit = (row) => {
    const { type, id, objectiveId, keyResultId } = row || {};
    const fullRow = paginatedData?.find((item) => item.id === row.id);

    if (!type || !id) {
      console.error("Missing required fields in row:", row);
      return;
    }

    const basePath = "/admin/objectives";
    const params = new URLSearchParams({ isEdit: "true" });
    const routeState = { rowData: row };

    let pathname = "";

    switch (type) {
      case "objective":
        pathname = `${basePath}/objective`;
        params.append("objectiveId", id);
        break;
      case "keyresult":
        if (!objectiveId) {
          console.error("Missing objectiveId for keyresult");
          return;
        }
        pathname = `${basePath}/details`;
        params.append("objectiveId", objectiveId);
        params.append("keyResultId", id);
        break;
      case "task":
        if (!objectiveId || !keyResultId) {
          console.error("Missing IDs for task", { objectiveId, keyResultId });
          return;
        }
        pathname = `${basePath}/task`;
        params.append("objectiveId", objectiveId);
        params.append("keyResultId", keyResultId);
        params.append("taskId", id);
        break;
      default:
        console.error("Unknown type:", type);
        return;
    }

    history.push({
      pathname,
      search: params.toString(),
      state: routeState,
    });
  };

  const handleDelete = (row) => {
    try {
      const response = dispatch(
        deleteObjectives(row)
      );
      response.then(({ success, message }) => {
        if (success) {
          refetchObjectives();
        } else {
          console.error(message);
        }
      });
    } catch (error) {
      console.error(error.toString());
    }
  };

  const handleSubmitForApproval = async (row) => {
    console.log("=== SUBMIT FOR APPROVAL CLICKED ===", row);

    try {
      setApprovingId(row.id);

      if (row.type === "objective") {
        // Build objective update payload to set pending approval
        const payload = {
          comments: row.comments || "",
          objective: row.objective || row.task,
          weight: String(row.weight),
          owner: row.owner,
          dueDate: row.dueDateRaw ?? null,
          dimension: row.dimension,
          progressStatus: row.progress,
          feedAttachment: row.feedAttachment || "",
          employeeName: row.employeeName,
          employeeReferenceId: row.employeeReferenceId,
          okrPeriod: row.okrPeriod || "Q1",
          companyId: companyId,
          okrYear: row.okrYear || new Date().getFullYear(),
          totalWeight: 0,
          approvalRequired: true,
          isApproved: "pending",  // Set to pending approval
          pending: {
            submittedAt: new Date(),
            status: "pending"
          }
        };

        const response = await dispatch(updateObjective(row.id, payload));
        if (response.success) {
          refetchObjectives();
        }
      }
    } catch (error) {
      console.error("Error in handleSubmitForApproval:", error);
    } finally {
      setApprovingId(null);
    }
  };

  const handleSubmitAllForApproval = async () => {
    console.log("=== SUBMIT ALL FOR APPROVAL CLICKED ===");

    try {
      setIsSubmittingAll(true);

      // Filter objectives that can be submitted (not submitted or rejected, and weight = 100)
      const objectivesToSubmit = mappedData.filter(obj => {
        const isNotSubmitted = !obj.isApproved || obj.isApproved === "" || obj.isApproved === "not_submitted";
        const isRejected = obj.isApproved === "rejected";
        return obj.type === "objective" && obj.canSubmitForApproval && (isNotSubmitted || isRejected);
      });

      if (objectivesToSubmit.length === 0) {
        Toast({ type: "warning", message: "No objectives available to submit. Ensure total weight equals 100%", time: 3000 });
        return;
      }

      // Submit all objectives
      const promises = objectivesToSubmit.map(obj => {
        const payload = {
          comments: obj.comments || "",
          objective: obj.objective || obj.task,
          weight: String(obj.weight),
          owner: obj.owner,
          dueDate: obj.dueDateRaw ?? null,
          dimension: obj.dimension,
          progressStatus: obj.progress,
          feedAttachment: obj.feedAttachment || "",
          employeeName: obj.employeeName,
          employeeReferenceId: obj.employeeReferenceId,
          okrPeriod: obj.okrPeriod || "Q1",
          companyId: companyId,
          okrYear: obj.okrYear || new Date().getFullYear(),
          totalWeight: 0,
          approvalRequired: true,
          isApproved: "pending",
          pending: {
            submittedAt: new Date(),
            status: "pending"
          }
        };

        return dispatch(updateObjective(obj.id, payload));
      });

      const results = await Promise.all(promises);
      const allSuccess = results.every(r => r.success);

      if (allSuccess) {
        Toast({ type: "success", message: `${objectivesToSubmit.length} objective(s) submitted for approval`, time: 3000 });
        refetchObjectives();
      } else {
        Toast({ type: "error", message: "Some objectives failed to submit", time: 3000 });
      }
    } catch (error) {
      console.error("Error in handleSubmitAllForApproval:", error);
      Toast({ type: "error", message: "Failed to submit objectives", time: 3000 });
    } finally {
      setIsSubmittingAll(false);
    }
  };

  const handleApprove = async (row) => {
    // console.log("=== APPROVE CLICKED ===", row);

    try {
      setApprovingId(row.id);

      if (row.type === "task") {
        // Handle task approval
        const isSubTask = row.mainTask && row.mainTask !== "";
        const taskOwnerId = row.assignTo?.[0] || row.owner;

        const rewardConfig = isSubTask
          ? getSubTaskRewardPoints({
            userId: taskOwnerId,
            rewardSchemes,
            privilegeGroups
          })
          : getTaskRewardPoints({
            userId: taskOwnerId,
            rewardSchemes,
            privilegeGroups
          });

        const dynamicRewardPoints = rewardConfig?.points || 0;

        // Build complete task update payload
        const payload = {
          title: row.task,
          description: row.description,
          startDate: row.startDate,
          dueDate: row.dueDateRaw ?? null,
          actualCompletionDate: row.actualCompletionDate || null,
          linkToKr: row.linkToKR || row.krReferenceId || null,
          assignTo: row.assignTo || [],
          priority: row.priority,
          status: row.status,
          comments: row.comments || "",
          attachments: row.attachments || "",
          krReferenceId: row.krReferenceId || "",
          objectiveReferenceId: row.objectiveReferenceId || null,
          recurrence: row.recurrence || false,
          recurrenceDetails: row.recurrenceDetails || null,
          progressStatus: row.progress,
          mainTask: row.mainTask || null,
          companyId: companyId,
          userId: user?._id,
          dynamicRewardPoints: dynamicRewardPoints,
          approvalRequired: false,
          isApproved: "approved"
        };

        const response = await dispatch(updateTask(row.id, payload));
        if (response.success) {
          refetchObjectives();
        }
      } else if (row.type === "keyresult") {
        // Handle key result approval
        const krOwnerId = row.userId || row.owner;

        const rewardConfig = getKRRewardPoints({
          userId: krOwnerId,
          rewardSchemes,
          privilegeGroups
        });

        const dynamicRewardPoints = rewardConfig?.points || 0;

        // Build complete key result update payload
        const payload = {
          keyResultName: row.keyResultName || row.task,
          okrName: row.okrName || row.keyResultName || row.task,
          source: row.source || "",
          polarity: row.polarity || "positive",
          target: row.target || 0,
          targetDate: row.targetDate,
          actual: row.actual || 0,
          actualDate: row.actualDate || null,
          feedAttachment: row.feedAttachment || "",
          objectiveId: row.objectiveId,
          userId: row.userId,
          status: row.status || "",
          kpiName: row.kpiName || "",
          unit: row.unit || "",
          comments: row.comments || "",
          dynamicRewardPoints: dynamicRewardPoints,
          approvalRequired: false,
          isApproved: "approved"
        };

        const response = await dispatch(updatekeyResult(row.id, payload));
        if (response.success) {
          refetchObjectives();
        }
      } else if (row.type === "objective") {
        // Handle objective approval
        const objectiveOwnerId = row.employeeReferenceId || row.owner;

        const rewardConfig = getObjectiveRewardPoints({
          userId: objectiveOwnerId,
          rewardSchemes,
          privilegeGroups
        });

        const dynamicRewardPoints = rewardConfig?.points || 0;

        // Build complete objective update payload
        const payload = {
          comments: row.comments || "",
          objective: row.objective || row.task,
          weight: String(row.weight),
          owner: row.owner,
          dueDate: row.dueDateRaw ?? null,
          dimension: row.dimension,
          progressStatus: row.progress,
          feedAttachment: row.feedAttachment || "",
          employeeName: row.employeeName,
          employeeReferenceId: row.employeeReferenceId,
          okrPeriod: row.okrPeriod || "Q1",
          companyId: companyId,
          okrYear: row.okrYear || new Date().getFullYear(),
          totalWeight: 0,
          dynamicRewardPoints: dynamicRewardPoints,
          approvalRequired: false,
          isApproved: "approved"
        };

        const response = await dispatch(updateObjective(row.id, payload));
        if (response.success) {
          refetchObjectives();
        }
      }
    } catch (error) {
      console.error("Error in handleApprove:", error);
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (row) => {
    // console.log("=== REJECT CLICKED ===", row);

    try {
      setApprovingId(row.id);

      if (row.type === "task") {
        // Handle task rejection
        const payload = {
          title: row.task,
          description: row.description,
          startDate: row.startDate,
          dueDate: row.dueDateRaw ?? null,
          actualCompletionDate: row.actualCompletionDate || null,
          linkToKr: row.linkToKR || row.krReferenceId || null,
          assignTo: row.assignTo || [],
          priority: row.priority,
          status: row.status,
          comments: row.comments || "",
          attachments: row.attachments || "",
          krReferenceId: row.krReferenceId || "",
          objectiveReferenceId: row.objectiveReferenceId || null,
          recurrence: row.recurrence || false,
          recurrenceDetails: row.recurrenceDetails || null,
          progressStatus: row.progress,
          mainTask: row.mainTask || null,
          companyId: companyId,
          userId: user?._id,
          dynamicRewardPoints: 0,
          approvalRequired: false,
          isApproved: "rejected"
        };

        const response = await dispatch(updateTask(row.id, payload));
        if (response.success) {
          Toast({ type: "success", message: "Task rejected successfully", time: 3000 });
          refetchObjectives();
        } else {
          throw new Error(response.message || "Failed to reject task");
        }
      } else if (row.type === "keyresult") {
        // Handle key result rejection
        const payload = {
          keyResultName: row.keyResultName || row.task,
          okrName: row.okrName || row.keyResultName || row.task,
          source: row.source || "",
          polarity: row.polarity || "positive",
          target: row.target || 0,
          targetDate: row.targetDate,
          actual: row.actual || 0,
          actualDate: row.actualDate || null,
          feedAttachment: row.feedAttachment || "",
          objectiveId: row.objectiveId,
          userId: row.userId,
          status: row.status || "",
          kpiName: row.kpiName || "",
          unit: row.unit || "",
          comments: row.comments || "",
          dynamicRewardPoints: 0,
          approvalRequired: false,
          isApproved: "rejected"
        };

        const response = await dispatch(updatekeyResult(row.id, payload));
        if (response.success) {
          Toast({ type: "success", message: "Key Result rejected successfully", time: 3000 });
          refetchObjectives();
        } else {
          throw new Error(response.message || "Failed to reject key result");
        }
      } else if (row.type === "objective") {
        // Handle objective rejection
        const payload = {
          comments: row.comments || "",
          objective: row.objective || row.task,
          weight: String(row.weight),
          owner: row.owner,
          dueDate: row.dueDateRaw ?? null,
          dimension: row.dimension,
          progressStatus: row.progress,
          feedAttachment: row.feedAttachment || "",
          employeeName: row.employeeName,
          employeeReferenceId: row.employeeReferenceId,
          okrPeriod: row.okrPeriod || "Q1",
          companyId: companyId,
          okrYear: row.okrYear || new Date().getFullYear(),
          totalWeight: 0,
          dynamicRewardPoints: 0,
          approvalRequired: false,
          isApproved: "rejected"
        };

        const response = await dispatch(updateObjective(row.id, payload));
        if (response.success) {
          Toast({ type: "success", message: "Objective rejected successfully", time: 3000 });
          refetchObjectives();
        } else {
          throw new Error(response.message || "Failed to reject objective");
        }
      }
    } catch (error) {
      console.error("Error in handleReject:", error);
    } finally {
      setApprovingId(null);
    }
  };

  const handleUnlock = async (row) => {
    console.log("=== UNLOCK CLICKED ===", row);

    try {
      setApprovingId(row.id);

      if (row.type === "objective") {
        // Unlock objective by setting it to not approved and not requiring approval
        const payload = {
          comments: row.comments || "",
          objective: row.objective || row.task,
          weight: String(row.weight),
          owner: row.owner,
          dueDate: row.dueDateRaw ?? null,
          dimension: row.dimension,
          progressStatus: row.progress,
          feedAttachment: row.feedAttachment || "",
          employeeName: row.employeeName,
          employeeReferenceId: row.employeeReferenceId,
          okrPeriod: row.okrPeriod || "Q1",
          companyId: companyId,
          okrYear: row.okrYear || new Date().getFullYear(),
          totalWeight: 0,
          dynamicRewardPoints: parseFloat(row.rewardPoints) || 0,
          approvalRequired: false,
          isApproved: "",  // Reset approval status
          isLocked: false   // Unlock the objective
        };

        const response = await dispatch(updateObjective(row.id, payload));
        if (response.success) {
          Toast({ type: "success", message: "Objective unlocked successfully. User can now edit and resubmit.", time: 3000 });
          refetchObjectives();
        } else {
          throw new Error(response.message || "Failed to unlock objective");
        }
      }
    } catch (error) {
      console.error("Error in handleUnlock:", error);
      Toast({ type: "error", message: "Failed to unlock objective", time: 3000 });
    } finally {
      setApprovingId(null);
    }
  };

  const handleParentWithChildrenSelection = (parentRow) => {
    setSelectedTasks((prev) => {
      const parentSelected = prev.some((item) => item.id === parentRow.id);

      if (parentSelected) {
        return prev.filter(
          (item) =>
            item.id !== parentRow.id &&
            !parentRow.children?.some((child) => child.id === item.id)
        );
      } else {
        const newSelection = [...prev, parentRow];
        if (parentRow.children) {
          parentRow.children.forEach((child) => {
            if (!newSelection.some((item) => item.id === child.id)) {
              newSelection.push(child);
            }
          });
        }
        return newSelection;
      }
    });
  };

  const transformedTasks = selectedTasks.map((task, index) => (task));

  const handleBulkDelete = () => {
    try {
      if (selectedTasks.length > 0) {
        const response = dispatch(deleteObjectives(transformedTasks));
        response.then(({ success, message }) => {
          if (success) {
            setSelectedTasks([]);
            refetchObjectives();
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproveAll = async () => {
    try {
      setIsApprovingAll(true);
      const response = await dispatch(approveAllObjectives(companyId, user?._id));
      if (response.success) {
        refetchObjectives();
      }
    } catch (error) {
      console.error("Error in handleApproveAll:", error);
    } finally {
      setIsApprovingAll(false);
    }
  };

  const hasPendingApprovals = Array.isArray(data?.data) && data.data.some(obj => obj.isApproved === "pending");
  const isManagerView = ["myteam", "mycompany"].includes(selectedTab);
  const canShowApproveRejectButtons = isManagerView && hasPendingApprovals;
  const columns = [
    {
      id: "Objective",
      label: t("ObjectivesTable.Columns.Objectives"),
      headerCheckbox: true,
      renderHeader: (selectedCount, totalCount, onSelectAll) => {
        const allSelected = selectedCount === totalCount && totalCount > 0;
        const someSelected = selectedCount > 0 && selectedCount < totalCount;

        return (
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            overflowX: isMobile || isTablet ? "auto" : "hidden",
            width: "100%",
            minWidth: isMobile ? "200px" : isTablet ? "250px" : "auto",
            "&::-webkit-scrollbar": {
              height: isMobile || isTablet ? "4px" : "0px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: isMobile || isTablet ? "#c1c1c1" : "transparent",
              borderRadius: "2px",
              "&:hover": {
                backgroundColor: isMobile || isTablet ? "#a8a8a8" : "transparent",
              },
            },
          }}>
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              icon={
                <Box
                  sx={{
                    width: isMobile ? 20 : isTablet ? 22 : 24,
                    height: isMobile ? 20 : isTablet ? 22 : 24,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #535353",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              }
              checkedIcon={
                <Box
                  sx={{
                    width: isMobile ? 20 : isTablet ? 22 : 24,
                    height: isMobile ? 20 : isTablet ? 22 : 24,
                    backgroundColor: "#837F39",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckIcon sx={{
                    fontSize: isMobile ? 14 : isTablet ? 16 : 18,
                    color: "#FFFFFF"
                  }} />
                </Box>
              }
              indeterminateIcon={
                <Box
                  sx={{
                    width: isMobile ? 20 : isTablet ? 22 : 24,
                    height: isMobile ? 20 : isTablet ? 22 : 24,
                    backgroundColor: "#837F39",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RemoveIcon sx={{
                    fontSize: isMobile ? 14 : isTablet ? 16 : 18,
                    color: "#FFFFFF"
                  }} />
                </Box>
              }
              sx={{
                padding: 0,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                tabIndex: 0,
                fontFamily: "Montserrat",
                fontSize: isMobile ? "14px" : isTablet ? "15px" : "16px",
                color: "rgba(0, 0, 0, 0.87)",
                fontWeight: "600",
                whiteSpace: isMobile || isTablet ? "nowrap" : "normal",
                flexShrink: 0,
                minWidth: isMobile ? "100px" : isTablet ? "120px" : "auto",
              }}
            >
              {t("ObjectivesTable.Columns.Objectives")}
            </Typography>
          </Box>
        );
      },
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "start", gap: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Checkbox
              checked={selectedTasks.some((item) => item.id === row.id)}
              onChange={() =>
                row.children
                  ? handleParentWithChildrenSelection(row)
                  : handleCheckboxChange(row)
              }
              icon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #535353",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              }
              checkedIcon={
                <Box
                  sx={{
                    width: row.type === "task" ? 18 : 24,
                    height: row.type === "task" ? 18 : 24,
                    backgroundColor: "#837F39",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckIcon sx={{ fontSize: 18, color: "#FFFFFF" }} />
                </Box>
              }
              sx={{ padding: 0 }}
            />
            {row.type !== "task" ? <img
              src={row.type === "objective" ? taskIcon : row.type === "keyresult" ? task2Icon : row.type === "task" ? AssignmentIcon : task2Icon}
              alt="icon"
              style={{ width: "20px", height: "20px" }}
            /> : <AssignmentIcon sx={{ width: "20px", height: "20px", color: "grey" }} color="grey" />}
          </Box>
          <Box
            sx={{
              tabIndex: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Box
              component="button"
              sx={{
                tabIndex: 0,
                fontSize: isMobile ? "14px" : isTablet ? "15px" : "16px",
                lineHeight: "19px",
                color: "#0E0E0E",
                fontFamily: "Work Sans",
                fontWeight: "600",
                maxWidth: "320px",
                whiteSpace: "normal",
                wordWrap: "break-word",
                textAlign: "left",
                textDecoration: "none",
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
                "&:hover": {
                  textDecoration: "none",
                },
              }}
              onClick={() => {
                if (row.type === "objective") {
                  history.push(
                    `/admin/objectives/objective?objectiveId=${row.id}`
                  );
                } else if (row.type === "keyresult") {
                  history.push(
                    `/admin/objectives/details?objectiveId=${row.objectiveId}&keyResultId=${row.id}`
                  );
                } else if (row.type === "task") {
                  history.push(
                    `/admin/objectives/task?objectiveId=${row.objectiveId}&keyResultId=${row.keyResultId}&taskId=${row.id}`
                  );
                }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                {row.task}
                {(row.isAlignedToCompany || row.cascadeAssigneeType) && (
                  <Chip
                    label={
                      row.cascadeAssigneeType
                        ? row.cascadeAssigneeType === "teams"
                          ? t("OKR Details.Team")
                          : t(`OKR Details.${row.cascadeAssigneeType.charAt(0).toUpperCase() + row.cascadeAssigneeType.slice(1)}`) || row.cascadeAssigneeType.charAt(0).toUpperCase() + row.cascadeAssigneeType.slice(1)
                        : (t("ObjectivesTable.Company") || "Company")
                    }
                    size="small"
                    sx={{
                      height: isMobile ? "18px" : isTablet ? "20px" : "22px",
                      fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
                      fontWeight: 600,
                      backgroundColor: "#E8F5E9",
                      color: "#2E7D32",
                      borderRadius: "4px",
                    }}
                  />
                )}
              </Box>
            </Box>
            {row.description && renderTextWithLinks(row.description, {
              fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
              lineHeight: "19px",
              color: "#535353",
              fontFamily: "Work Sans",
              fontWeight: "400",
              maxWidth: "320px",
              whiteSpace: "normal",
              wordWrap: "break-word",
            })}
          </Box>
        </Box>
      ),
    },
    {
      id: "progress",
      label: t("ObjectivesTable.Columns.Progress"),
      sortable: true,
      render: (row) => {
        const cappedProgress = Math.min(row.progress, 100); // Cap to 100 for visual
        const { label, displayLabel, color, backgroundColor } = getProgressLabel(row.progress);
        const isEditable = ["myteam", "mycompany"].includes(selectedTab);

        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap={1.5}
            sx={{
              pointerEvents: isEditable ? "auto" : "none",
              opacity: isEditable ? 1 : 0.7,
              cursor: isEditable ? "pointer" : "default",
              userSelect: isEditable ? "auto" : "none",
            }}
          >
            <Box sx={{ display: "flex", gap: "5px" }}>
              <Typography
                sx={{
                  fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
                  fontWeight: 500,
                  color: backgroundColor,
                  fontFamily: "Work Sans",
                }}
              >
                {Number(row.progress).toFixed(2)}%
              </Typography>
              <Typography
                sx={{
                  fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
                  fontWeight: "500",
                  color,
                  padding: isMobile ? "3px" : isTablet ? "4px" : "5px",
                  backgroundColor,
                  borderRadius: "50px",
                  fontFamily: "Work Sans",
                }}
              >
                {displayLabel}
              </Typography>
            </Box>

            <Box sx={{ position: "relative", width: isMobile ? 90 : isTablet ? 100 : 110, height: 11 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(row.progress, 1000)}
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
                  fontSize: isMobile ? "8px" : isTablet ? "9px" : "10px",
                  fontFamily: "Work Sans",
                }}
              >
                {Number(row.progress).toFixed(2)}%
              </Typography>
            </Box>

            <Chip
              label={row.dueDate || "--"}
              size="small"
              sx={{
                backgroundColor: color,
                color: "#FFFFFF",
                height: isMobile ? "15px" : isTablet ? "16px" : "17px",
                borderRadius: "100px",
                fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
              }}
            />
          </Box>
        );
      },
    },
    {
      sortable: true,

      id: "weight",
      label: t("ObjectivesTable.Columns.Weight"),
      render: (row) => (
        <>
          {(row.type === "objective" || row.type === "keyresult") && row.weight > 0 ? <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Chip
              label={`${row.weight}%`}
              size="small"
              sx={{
                backgroundColor: row.type === "keyresult" ? "#EAF4FF" : "#C5FFE4",
                color: row.type === "keyresult" ? "#1565C0" : "#26925F",
                fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
                height: isMobile ? "20px" : isTablet ? "21px" : "22px",
                minWidth: isMobile ? "2.5rem" : isTablet ? "2.8rem" : "3rem",
                fontWeight: 600,
              }}
            />
          </Box> : "--"}
        </>

      ),
    },
    {
      sortable: true,
      id: "owner",
      label: (
        <Box
          display="flex"
          justifyContent="center"
          width="100%"
          sx={{ textAlign: "center" }}
        >
          <Typography
            sx={{
              fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
              fontWeight: "600",
              whiteSpace: isMobile || isTablet ? "nowrap" : "normal",
              minWidth: isMobile ? "60px" : isTablet ? "70px" : "auto",
            }}
          >
            {t("ObjectivesTable.Columns.Owner")}
          </Typography>
        </Box>
      ),
      render: (row) => (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
          gap={0.5}
          sx={{ textAlign: "center" }}
        >
          <Typography
            sx={{
              fontSize: isMobile ? "12px" : isTablet ? "13px" : "16px",
              width: "100%",
              textAlign: "center",
              fontFamily: "Work Sans",
              color: "#707070",
              whiteSpace: isMobile || isTablet ? "nowrap" : "normal",
              overflow: isMobile || isTablet ? "scroll" : "",
              textOverflow: isMobile || isTablet ? "ellipsis" : "clip",
              maxWidth: isMobile ? "80px" : isTablet ? "90px" : "100%",
            }}
          >
            {row?.ownerName || row?.owner || "--"}
          </Typography>
        </Box>
      ),
    },
    {
      sortable: true,
      id: "dueDate",
      label: (
        <Box
          display="flex"
          justifyContent="center"
          width="100%"
          sx={{ textAlign: "center" }}
        >
          <Typography
            sx={{
              fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
              fontWeight: "600",
              whiteSpace: isMobile || isTablet ? "nowrap" : "normal",
              minWidth: isMobile ? "70px" : isTablet ? "80px" : "auto",
            }}
          >
            {t("ObjectivesTable.Columns.DueDate")}
          </Typography>
        </Box>
      ),
      render: (row) => (
        <Box
          display="flex"
          justifyContent="center"
          width="100%"
        >
          <Typography
            sx={{
              fontSize: isMobile ? "11px" : isTablet ? "12px" : "14px",
              fontFamily: "Work Sans",
              color: "#707070",
              fontWeight: "400",
              whiteSpace: isMobile || isTablet ? "nowrap" : "normal",
              overflow: isMobile || isTablet ? "scroll" : "",
              textOverflow: isMobile || isTablet ? "ellipsis" : "clip",
              maxWidth: isMobile ? "70px" : isTablet ? "80px" : "100%",
            }}
          >
            {row.dueDateDisplay || "--"}
          </Typography>
        </Box>
      ),
    },


    {
      id: "status",
      label: (
        <Box
          display="flex"
          justifyContent="center"
          width="100%"
          sx={{ textAlign: "center" }}
        >
          <Typography
            sx={{
              fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
              fontWeight: "600",
              whiteSpace: isMobile || isTablet ? "nowrap" : "normal",
              minWidth: isMobile ? "80px" : isTablet ? "90px" : "auto",
            }}
          >
            {t("ObjectivesTable.Columns.ApproveReject")}
          </Typography>
        </Box>
      ),
      render: (row) => {
        const formatStatusLabel = (status) => {
          switch (status) {
            case "notstarted":
              return t("ObjectivesTable.Status.NotStarted");

            case "inprogress":
              return t("ObjectivesTable.Status.InProgress");

            case "Submit":
              return t("ObjectivesTable.Status.Submit");

            case "Draft":
              return t("ObjectivesTable.Status.Draft");

            case "Approval Pending":
              return t("ObjectivesTable.Status.ApprovalPending");

            case "approved":
              return t("ObjectivesTable.Status.Approved") || "Approved";

            case "rejected":
              return t("ObjectivesTable.Status.Rejected") || "Rejected";

            case "pending":
              return t("ObjectivesTable.Status.PendingApproval") || "Pending Approval";

            default:
              return "--";   // default shows --
          }
        };
        const getStatusColor = (status) => {
          switch (status) {
            case "Submit":
              return { backgroundColor: "#26925F", color: "#FFFFFF" };
            case "Draft":
              return { backgroundColor: "#FFA500", color: "#FFFFFF" };
            case "Approval Pending":
              return { backgroundColor: "#847f3b", color: "#FFFFFF" };
            case "Approval Required":
              return { backgroundColor: "#9E9E9E", color: "#FFFFFF" };
            case "pending":
              return { backgroundColor: "#2196F3", color: "#FFFFFF" };
            case "approved":
              return { backgroundColor: "#4CAF50", color: "#FFFFFF" };
            case "rejected":
              return { backgroundColor: "#F44336", color: "#FFFFFF" };
            default:
              return { backgroundColor: "#F5F5F5", color: "#707070" };
          }
        };

        // Determine approval status and what to show
        const isObjective = row.type === "objective";
        const isApproving = approvingId === row.id;
        const ownApproval = normalizeApprovalString(row.isApproved);
        const effectiveApproval = getEffectiveApprovalForDisplay(row);

        const isPendingOwn = ownApproval === "pending";
        const isPending = effectiveApproval === "pending";
        const isApproved = effectiveApproval === "approved";
        const isRejected = effectiveApproval === "rejected";

        // Check if selectedTab is myteam or mycompany (manager view)
        const isManagerView = ["myteam", "mycompany"].includes(selectedTab);

        // Manager actions use this row's own workflow state (not inherited)
        const canShowApproveRejectButtons = isManagerView && isPendingOwn;

        // Unlock is implemented for objectives only
        const canShowUnlockButton =
          isManagerView && ownApproval === "approved" && isObjective;

        return (
          <Box display="flex" justifyContent="center" width="100%" gap={0.5}>
            {canShowApproveRejectButtons ? (
              <Box display="flex" gap={0.5} alignItems="center">
                {isApproving ? (
                  <CircularProgress size={isMobile ? 20 : isTablet ? 22 : 24} sx={{ color: "#837F39" }} />
                ) : (
                  <>
                    <Tooltip title={t("ObjectivesTable.Actions.Approve") || "Approve"}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(row);
                        }}
                        disabled={isApproving}
                        sx={{
                          color: "#4CAF50",
                          backgroundColor: "#E8F5E9",
                          padding: isMobile ? "4px" : isTablet ? "5px" : "6px",
                          "&:hover": {
                            backgroundColor: "#C8E6C9",
                          },
                          "&:disabled": {
                            opacity: 0.5,
                          },
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: isMobile ? 16 : isTablet ? 18 : 20 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("ObjectivesTable.Actions.Reject") || "Reject"}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(row);
                        }}
                        disabled={isApproving}
                        sx={{
                          color: "#F44336",
                          backgroundColor: "#FFEBEE",
                          padding: isMobile ? "4px" : isTablet ? "5px" : "6px",
                          "&:hover": {
                            backgroundColor: "#FFCDD2",
                          },
                          "&:disabled": {
                            opacity: 0.5,
                          },
                        }}
                      >
                        <CancelIcon sx={{ fontSize: isMobile ? 16 : isTablet ? 18 : 20 }} />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            ) : canShowUnlockButton ? (
              // Show Unlock button for manager when objective is approved
              <Box display="flex" gap={0.5} alignItems="center">
                {isApproving ? (
                  <CircularProgress size={isMobile ? 20 : isTablet ? 22 : 24} sx={{ color: "#FF9800" }} />
                ) : (
                  <>
                    <Chip
                      label={formatStatusLabel("approved")}
                      size="small"
                      sx={{
                        fontWeight: 400,
                        fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
                        height: isMobile ? "20px" : isTablet ? "21px" : "23px",
                        borderRadius: "100px",
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        "& .MuiChip-label": {
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          whiteSpace: "nowrap",
                        },
                        ...getStatusColor("approved"),
                      }}
                    />
                    <Tooltip title={t("Unlock for Editing") || "Unlock for Editing"}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnlock(row);
                        }}
                        disabled={isApproving}
                        sx={{
                          color: "#FF9800",
                          backgroundColor: "#FFF3E0",
                          padding: isMobile ? "4px" : isTablet ? "5px" : "6px",
                          "&:hover": {
                            backgroundColor: "#FFE0B2",
                          },
                          "&:disabled": {
                            opacity: 0.5,
                          },
                        }}
                      >
                        <LockOpenIcon sx={{ fontSize: isMobile ? 16 : isTablet ? 18 : 20 }} />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            ) : isApproved ? (
              // Show Approved chip only (for user view)
              <Chip
                label={formatStatusLabel("approved")}
                size="small"
                sx={{
                  fontWeight: 400,
                  fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
                  height: isMobile ? "20px" : isTablet ? "21px" : "23px",
                  borderRadius: "100px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: isMobile ? "80px" : isTablet ? "90px" : "100%",
                  "& .MuiChip-label": {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    whiteSpace: isMobile || isTablet ? "nowrap" : "normal",
                    overflow: isMobile || isTablet ? "scroll" : "",
                    textOverflow: isMobile || isTablet ? "ellipsis" : "clip",
                  },
                  ...getStatusColor("approved"),
                }}
              />
            ) : isRejected ? (
              // Show Rejected chip
              <Chip
                label={formatStatusLabel("rejected")}
                size="small"
                sx={{
                  fontWeight: 400,
                  fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
                  height: isMobile ? "20px" : isTablet ? "21px" : "23px",
                  borderRadius: "100px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: isMobile ? "80px" : isTablet ? "90px" : "100%",
                  "& .MuiChip-label": {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    whiteSpace: isMobile || isTablet ? "nowrap" : "normal",
                    overflow: isMobile || isTablet ? "scroll" : "",
                    textOverflow: isMobile || isTablet ? "ellipsis" : "clip",
                  },
                  ...getStatusColor("rejected"),
                }}
              />
            ) : isPending ? (
              // Show Pending Approval chip
              <Chip
                label={formatStatusLabel("pending")}
                size="small"
                sx={{
                  fontWeight: 400,
                  fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
                  height: isMobile ? "20px" : isTablet ? "21px" : "23px",
                  borderRadius: "100px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: isMobile ? "80px" : isTablet ? "90px" : "100%",
                  "& .MuiChip-label": {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    whiteSpace: isMobile || isTablet ? "nowrap" : "normal",
                    overflow: isMobile || isTablet ? "scroll" : "",
                    textOverflow: isMobile || isTablet ? "ellipsis" : "clip",
                  },
                  ...getStatusColor("pending"),
                }}
              />
            ) : (
              <Typography
                sx={{
                  fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
                  fontWeight: "400",
                  color: "#707070",
                }}
              >
                --
              </Typography>
            )}
          </Box>

        );
      },
    },
    {
      id: "actions",
      label: (
        <Box
          display="flex"
          justifyContent="center"
          width="100%"
          sx={{ textAlign: "center" }}
        >
          <Typography
            sx={{
              fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
              fontWeight: "600",
              whiteSpace: isMobile || isTablet ? "nowrap" : "normal",
              minWidth: isMobile ? "60px" : isTablet ? "70px" : "auto",
            }}
          >
            {t("ObjectivesTable.Columns.Actions")}
          </Typography>
        </Box>
      ),
      render: (row) => {
        // Check if this is the first objective in paginatedData
        const isFirstRow = paginatedData[0]?.id === row.id && row.type === "objective";
        return (
          <ActionMenu
            tabIndex={0}
            row={row}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}
            t={t}
            hasEditPrivilege={hasEditPrivilege}
            hasDeletePrivilege={hasDeletePrivilege}
            actionMenuRef={actionMenuRef}
            editButtonRef={editButtonRef}
            isFirstRow={isFirstRow}
          />
        );
      },
    },
    {
      id: "Add KR",
      label: (
        <Box
          display="flex"
          justifyContent="end"
          width="100%"
          sx={{ textAlign: "end" }}
        >
          <Typography
            sx={{
              fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px",
              fontWeight: "600",
              whiteSpace: isMobile || isTablet ? "nowrap" : "normal",
              minWidth: isMobile ? "50px" : isTablet ? "60px" : "auto",
            }}
          >
            {t("ObjectivesTable.Columns.AddKRTask")}
          </Typography>
        </Box>
      ),
      render: (row) => {
        const handleClick = () => {
          if (row.type === "objective") {
            history.push(`/admin/objectives/details?objectiveId=${row.id}`);
          } else if (row.type === "keyresult") {
            history.push(
              `/admin/objectives/task?objectiveId=${row.objectiveId}&keyResultId=${row.id}`
            );
          }
        };

        const getTooltipTitle = () => {
          if (row.type === "objective") return t("ObjectivesTable.Tooltips.AddKeyResult");
          if (row.type === "keyresult") return t("ObjectivesTable.Tooltips.AddTask");
          return t("ObjectivesTable.Tooltips.Add");
        };

        // Check if this is the first objective in paginatedData
        const isFirstObjective = paginatedData[0]?.id === row.id && row.type === "objective";

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            {(row.type == "objective" || row.type == "keyresult") && <Tooltip title={getTooltipTitle()}>
              <img
                tabIndex={0}
                ref={isFirstObjective ? addKRRef : null}
                src={addButtonIcon}
                alt="Add"
                style={{
                  cursor: "pointer",
                  width: isMobile ? "16px" : isTablet ? "18px" : "20px",
                  height: isMobile ? "16px" : isTablet ? "18px" : "20px",
                }}
                onClick={handleClick}
              />
            </Tooltip>}
          </Box>
        );
      },
    },
  ];

  // Filter columns based on visibility and privileges
  const columnsToRender = columns.filter((col) => {
    // Hide actions column if user has no edit or delete privileges
    if (col.id === "actions" && !hasEditPrivilege && !hasDeletePrivilege) {
      return false;
    }
    // Hide Add KR column if user has no edit privilege
    if (col.id === "Add KR" && !hasEditPrivilege) {
      return false;
    }
    return visibleColumns.includes(col.id);
  });

  // Calculate objectives that can be submitted
  const objectivesReadyToSubmit = mappedData.filter(obj => {
    const isNotSubmitted = !obj.isApproved || obj.isApproved === "" || obj.isApproved === "not_submitted";
    const isRejected = obj.isApproved === "rejected";
    return obj.type === "objective" && obj.canSubmitForApproval && (isNotSubmitted || isRejected);
  });

  const isUserView = ["me"].includes(selectedTab);
  const showSubmitAllButton = isUserView && objectivesReadyToSubmit.length > 0;

  return (
    <Box sx={{
      width: "100%",
      overflowX: isMobile || isTablet ? "auto" : "",
      "&::-webkit-scrollbar": {
        height: isMobile || isTablet ? "6px" : "8px",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "#f1f1f1",
        borderRadius: "3px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#c1c1c1",
        borderRadius: "3px",
        "&:hover": {
          backgroundColor: "#a8a8a8",
        },
      },
    }}>
      {orderModalShow4 && (
        <CascadedPopup
          show={orderModalShow4}
          onHide={() => {
            setOrderModalShow4(false);
            refetchObjectives();
          }}
          selectedObjective={
            multipleObjectives ? objectiveId : selectedObjective
          }
          handleCallback={handlecallback}
        />
      )}

      {showSubmitAllButton && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: isMobile ? "8px 12px" : isTablet ? "10px 16px" : "12px 20px",
            gap: 2,
            backgroundColor: "#FAFAFA",
            borderRadius: "8px 8px 0 0",
            borderBottom: "1px solid #E0E0E0"
          }}
        >
          <Box
            component="button"
            onClick={handleSubmitAllForApproval}
            disabled={isSubmittingAll}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              padding: isMobile ? "8px 20px" : isTablet ? "10px 24px" : "10px 28px",
              backgroundColor: isSubmittingAll ? "#CCCCCC" : "#837F39",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontSize: isMobile ? "13px" : isTablet ? "14px" : "15px",
              fontWeight: 600,
              fontFamily: "Work Sans",
              cursor: isSubmittingAll ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              minWidth: isMobile ? "100px" : "120px",
              "&:hover": {
                backgroundColor: isSubmittingAll ? "#CCCCCC" : "#6D6D30",
                transform: isSubmittingAll ? "none" : "translateY(-1px)",
                boxShadow: isSubmittingAll ? "none" : "0 2px 8px rgba(131, 127, 57, 0.3)",
              },
              "&:active": {
                transform: isSubmittingAll ? "none" : "translateY(0)",
              },
            }}
          >
            {isSubmittingAll ? (
              <>
                <CircularProgress size={isMobile ? 16 : isTablet ? 18 : 20} sx={{ color: "#FFFFFF" }} />
                <span>{t("Submitting...") || "Submitting..."}</span>
              </>
            ) : (
              <span>{t("Submit") || "Submit"}</span>
            )}
          </Box>
        </Box>
      )}

      {(canShowApproveRejectButtons) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: isMobile ? "8px 12px" : isTablet ? "10px 16px" : "12px 20px",
            gap: 2,
            backgroundColor: "#FAFAFA",
            borderRadius: showSubmitAllButton ? "0" : "8px 8px 0 0",
            borderBottom: "1px solid #E0E0E0"
          }}
        >
          <Box
            component="button"
            onClick={handleApproveAll}
            disabled={isApprovingAll}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              padding: isMobile ? "8px 20px" : isTablet ? "10px 24px" : "10px 28px",
              backgroundColor: isApprovingAll ? "#CCCCCC" : "#4CAF50",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontSize: isMobile ? "13px" : isTablet ? "14px" : "15px",
              fontWeight: 600,
              fontFamily: "Work Sans",
              cursor: isApprovingAll ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              minWidth: isMobile ? "100px" : "120px",
              "&:hover": {
                backgroundColor: isApprovingAll ? "#CCCCCC" : "#388E3C",
                transform: isApprovingAll ? "none" : "translateY(-1px)",
                boxShadow: isApprovingAll ? "none" : "0 2px 8px rgba(76, 175, 80, 0.3)",
              },
              "&:active": {
                transform: isApprovingAll ? "none" : "translateY(0)",
              },
            }}
          >
            {isApprovingAll ? (
              <>
                <CircularProgress size={isMobile ? 16 : isTablet ? 18 : 20} sx={{ color: "#FFFFFF" }} />
                <span>{t("Approving...") || "Approving..."}</span>
              </>
            ) : (
              <>
                <CheckIcon sx={{ fontSize: isMobile ? 16 : isTablet ? 18 : 20 }} />
                <span>{t("Approve All") || "Approve All"}</span>
              </>
            )}
          </Box>
        </Box>
      )}

      <CustomTable
        columns={columns}
        data={paginatedData || []}
        pagination={true}
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalCount={mappedData.length}
        setPage={setPage}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        rowsPerPageOptions={[5, 8, 10, 20]}
        columnsToRender={columnsToRender}
        skipInternalFilter={true}
        setVisibleColumns={setVisibleColumns}
        visibleColumns={visibleColumns}
        loading={isLoading}
        search={search}
        setSearch={setSearch}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        handleBulkDelete={handleBulkDelete}
        selectedCount={selectedTasks.length}
        totalCountChecked={filteredData.length}
        selectedItems={selectedTasks}
        filteredData={filteredData}
        setSelectedItems={setSelectedTasks}
        onSelectAll={(select) => {
          if (select) {
            setSelectedTasks(filteredData);
          } else {
            setSelectedTasks([]);
          }
        }}
        isCompanyOKRsFilterActive={isCompanyOKRsFilterActive}
        setIsCompanyOKRsFilterActive={setIsCompanyOKRsFilterActive}
        handleCascade={() =>
          handleCascade(
            setMultipleObjectives,
            selectedTasks,
            setObjectiveId,
            setOrderModalShow4,
            setSelectedObjective
          )
        }
        createOKRRef={createOKRRef}
      />
    </Box>
  );
};

export default TaskTable3;
