import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  SystemUpdateAltOutlined as ExportIcon,
} from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ArrowDownwardOutlinedIcon from "../../../../../../assets/svg/ExportSvg.svg";
import PopupOKRLibrary from "../../../../../../pages/Objectives/PopupOKRLibrary";
import useGetEmployees from "../../../../../../pages/Objectives/hooks/useGetEmployees";
import { useTranslation } from 'react-i18next';
import { getEmployeesAll } from "action/EmployeeAct";

import CustomButton from "../../../../components/Button/CustomButton";
import CheckboxDropdown from "./DisplayOptions";

import displayOptions from "../../../../../../assets/svg/displayOptionsIconDashboard.svg";
import buildingIcon from "../../../../../../assets/svg/apartmentinDashboard.svg";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { canEdit } from "utilities/privilegeHelper";

const TableHeader3 = ({
  search,
  setSearch,
  selectedItems,
  columns,
  setVisibleColumns,
  visibleColumns,
  selectedStatus,
  setSelectedStatus,
  handleBulkDelete,
  setIsCompanyOKRsFilterActive,
  isCompanyOKRsFilterActive,
  filteredData,
  handleCascade,
  createOKRRef
}) => {
  const { t } = useTranslation();

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 960px)");

  // Privileges can be null from localStorage, or empty if user has no Cascade Objectives permission
  const allPrivileges = getItemFromLocalStorage("privileges") || [];
  const cascadePrivilege = Array.isArray(allPrivileges)
    ? allPrivileges.find((item) => item?.page === "Cascade Objectives")
    : null;
  const hasCascadePermission =
    cascadePrivilege && (cascadePrivilege.view || cascadePrivilege.edit || cascadePrivilege.delete);


  const history = useHistory();
  const dispatch = useDispatch();
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [displayAnchorEl, setDisplayAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showLibraryPopup, setShowLibraryPopup] = useState(false); // 🔥 Modal control state
  const [allEmployees, setAllEmployees] = useState([]);

  // Fetch all employees on component mount
  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const response = await dispatch(getEmployeesAll());
        if (response.success && response.data) {
          setAllEmployees(response.data);
        }
      } catch (error) {
        console.error("Error fetching all employees:", error);
      }
    };
    
    fetchAllEmployees();
  }, [dispatch]);


  const exportOptions = [
    { text: t("ObjectivesTable.TableHeader.ExportOptions.ExportCSV"), format: "csv", icon: ArrowDownwardOutlinedIcon },
    {
      text: t("ObjectivesTable.TableHeader.ExportOptions.ExportExcel"),
      format: "excel",
      icon: ArrowDownwardOutlinedIcon,
    },
    { text: t("ObjectivesTable.TableHeader.ExportOptions.ExportPDF"), format: "pdf", icon: ArrowDownwardOutlinedIcon },
  ];

  const { data: employeesResponse } = useGetEmployees();

  const employeeNameMap = useMemo(() => {
    const map = new Map();
    const employees = employeesResponse?.data || [];

    employees.forEach((employee) => {
      if (!employee) return;
      const id = employee._id || employee.id || employee.userId;
      if (!id) return;

      const firstName = employee?.personalInformation?.firstName;
      const lastName = employee?.personalInformation?.lastName;
      const preferredName = employee?.personalInformation?.preferredName;
      const nameParts = [firstName, lastName].filter(Boolean);
      const fullName = nameParts.join(" ").trim();

      const resolvedName =
        preferredName?.trim() ||
        fullName ||
        employee?.userName ||
        employee?.username ||
        employee?.email ||
        employee?.name ||
        "";

      if (resolvedName) {
        map.set(String(id), resolvedName);
      }
    });

    return map;
  }, [employeesResponse]);

  const exportLabels = {
    Type: "Type",
    Title: "Title",
    Description: "Description",
    TargetResult: "Target Result",
    ActualResult: "Actual Result",
    Progress: "Progress",
    Status: "Status",
    Owner: "Owner",
    FunctionName: "Function Name",
    Designation: "Designation",
    Weight: "Weight",
    StartDate: "Start Date",
    DueDate: "Due Date",
    Alignment: "Alignment",
    CreatedAt: "Created At",
    Objective: "Objective",
    KeyResult: "Key Result",
    Task: "Task",
    CompanyOKR: "Company OKR",
    IndividualOKR: "Individual OKR",
    ExportedOn: "Exported On:",
    OKRsExportReport: "OKRs Export Report",
    NoDataToExport: "No Data To Export",
  };

  const taskExportLabels = {
    ActualCompletionDate: "Actual Completion Date",
    LinkedKR: "Linked KR",
    Priority: "Priority",
    AssignedTo: "Assigned To",
  };

  const exportHeaderOrder = [
    exportLabels.Type,
    exportLabels.Title,
    exportLabels.Description,
    exportLabels.TargetResult,
    exportLabels.ActualResult,
    exportLabels.Progress,
    exportLabels.Status,
    exportLabels.Owner,
    exportLabels.FunctionName,
    exportLabels.Designation,
    exportLabels.Weight,
    exportLabels.StartDate,
    exportLabels.DueDate,
    exportLabels.Alignment,
    exportLabels.CreatedAt,
    taskExportLabels.ActualCompletionDate,
    taskExportLabels.LinkedKR,
    taskExportLabels.Priority,
    taskExportLabels.AssignedTo,
  ];

  
  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleStatusToggle = (translatedStatus) => {
    // Map translated status back to internal value
    const statusMap = {
      [t("ObjectivesTable.TableHeader.StatusOptions.OnTrack")]: "OnTrack",
      [t("ObjectivesTable.TableHeader.StatusOptions.AtRisk")]: "AtRisk",
      [t("ObjectivesTable.TableHeader.StatusOptions.OffTrack")]: "OffTrack"
    };
    
    const internalStatus = statusMap[translatedStatus];
    
    setSelectedStatus((prev) =>
      prev.includes(internalStatus)
        ? prev.filter((item) => item !== internalStatus)
        : [...prev, internalStatus]
    );
  };

  
  const handleNonLibraryClick = () => {
    handleClose();
    history.push("/admin/objectives/objective");
  };

  const handleLibraryClick = () => {
    handleClose();
    setShowLibraryPopup(true); // 👈 Open modal
  };


  const handleExport = (format) => {
    const dataToExport = selectedItems.length > 0 ? selectedItems : filteredData;

    if (!dataToExport || dataToExport.length === 0) {
      alert(exportLabels.NoDataToExport);
      return;
    }

    // Function to flatten the nested OKR structure
    const taskTitleMap = new Map();
    const keyResultTitleMap = new Map();
    const objectiveTitleMap = new Map();

    const getStringFromValue = (value) => {
      if (!value && value !== 0) return null;
      if (typeof value === "string") return value;
      if (typeof value === "number") return value.toString();
      if (typeof value === "object") {
        return (
          value.title ||
          value.name ||
          value.label ||
          value.fullName ||
          value.username ||
          value.displayName ||
          value.email ||
          value.id ||
          value._id ||
          null
        );
      }
      return null;
    };

    const getIdFromValue = (value) => {
      if (!value && value !== 0) return null;
      if (typeof value === "string" || typeof value === "number") return value;
      if (typeof value === "object") {
        return value.id || value._id || value.value || value.key || null;
      }
      return null;
    };

    const buildTitleMaps = (items, level = 0) => {
      if (!Array.isArray(items)) return;

      items.forEach((item) => {
        if (!item) return;

        const resolvedTitle =
          item.title ||
          item.task ||
          item.name ||
          item.okrName ||
          item.keyResultName ||
          item.krName ||
          item.mainTaskTitle ||
          item.label ||
          "N/A";

        const itemId =
          item.id ||
          item._id ||
          item.taskId ||
          item.value ||
          item.key ||
          item.krReferenceId ||
          null;

        if (itemId !== null && itemId !== undefined) {
          const idKey = String(itemId);
          if (level === 0) {
            if (!objectiveTitleMap.has(idKey)) {
              objectiveTitleMap.set(idKey, resolvedTitle);
            }
          } else if (level === 1) {
            if (!keyResultTitleMap.has(idKey)) {
              keyResultTitleMap.set(idKey, resolvedTitle);
            }
          } else {
            if (!taskTitleMap.has(idKey)) {
              taskTitleMap.set(idKey, resolvedTitle);
            }
          }
        }

        if (item.children && Array.isArray(item.children)) {
          buildTitleMaps(item.children, level + 1);
        }
      });
    };

    buildTitleMaps(filteredData);
    buildTitleMaps(dataToExport);

    const flattenOKRs = (items, level = 0, lineage = { objectiveTitle: null, keyResultTitle: null }) => {
      let result = [];

      items.forEach((item) => {
        // Create base record for current item
        const resolvedTitle =
          item.title ||
          item.task ||
          item.name ||
          item.okrName ||
          item.keyResultName ||
          item.krName ||
          "N/A";

        const currentLineage = {
          objectiveTitle: lineage.objectiveTitle,
          keyResultTitle: lineage.keyResultTitle,
        };

        if (level === 0) {
          currentLineage.objectiveTitle = resolvedTitle;
        } else if (level === 1) {
          currentLineage.keyResultTitle = resolvedTitle;
        }

        const typeLabel =
          level === 0
            ? exportLabels.Objective
            : level === 1
            ? exportLabels.KeyResult
            : exportLabels.Task;

        const isKeyResult = level === 1;
        const isTask = level >= 2;
        const itemId =
          item.id ||
          item._id ||
          item.taskId ||
          item.value ||
          item.key ||
          null;

        if (itemId !== null && itemId !== undefined) {
          const idKey = String(itemId);
          if (level === 0) {
            objectiveTitleMap.set(idKey, resolvedTitle);
          } else if (level === 1) {
            keyResultTitleMap.set(idKey, resolvedTitle);
          } else {
            taskTitleMap.set(idKey, resolvedTitle);
          }
        }

        const rawTargetValue = isKeyResult
          ? item.target ?? item.targetResult ?? item.targetValue ?? ""
          : "";
        const rawActualValue = isKeyResult
          ? item.actual ?? item.actualResult ?? item.actualValue ?? ""
          : "";

        const hasTargetValue =
          rawTargetValue !== null &&
          rawTargetValue !== undefined &&
          rawTargetValue !== "";
        const hasActualValue =
          rawActualValue !== null &&
          rawActualValue !== undefined &&
          rawActualValue !== "";

        const parsedTarget = hasTargetValue
          ? Number(
              typeof rawTargetValue === "string"
                ? rawTargetValue.replace(/[^0-9.-]+/g, "")
                : rawTargetValue
            )
          : null;
        const parsedActual = hasActualValue
          ? Number(
              typeof rawActualValue === "string"
                ? rawActualValue.replace(/[^0-9.-]+/g, "")
                : rawActualValue
            )
          : null;

        const fallbackProgressNumeric = (() => {
          if (typeof item.progress === "number") {
            return item.progress;
          }
          if (
            typeof item.progress === "string" &&
            item.progress.trim() !== ""
          ) {
            const cleaned = Number(item.progress.replace(/[^0-9.-]+/g, ""));
            return Number.isNaN(cleaned) ? null : cleaned;
          }
          return null;
        })();

        const progressInfo = (() => {
          if (
            isKeyResult &&
            parsedTarget !== null &&
            !Number.isNaN(parsedTarget) &&
            parsedTarget > 0 &&
            parsedActual !== null &&
            !Number.isNaN(parsedActual)
          ) {
            const ratio = (parsedActual / parsedTarget) * 100;
            return {
              numeric: ratio,
              display: `${ratio.toFixed(2)}%`,
            };
          }

          if (typeof item.progress === "number") {
            return {
              numeric: item.progress,
              display: `${item.progress}%`,
            };
          }

          if (
            typeof item.progress === "string" &&
            item.progress.trim() !== ""
          ) {
            return {
              numeric: fallbackProgressNumeric,
              display: item.progress.trim().endsWith("%")
                ? item.progress.trim()
                : `${item.progress}%`,
            };
          }

          return {
            numeric: fallbackProgressNumeric,
            display: "-",
          };
        })();

        const progressNumericForStatus =
          progressInfo.numeric !== null && !Number.isNaN(progressInfo.numeric)
            ? progressInfo.numeric
            : fallbackProgressNumeric !== null &&
              !Number.isNaN(fallbackProgressNumeric)
            ? fallbackProgressNumeric
            : 0;

        const formatDateValue = (dateValue) =>
          dateValue ? new Date(dateValue).toLocaleDateString() : "N/A";

        const linkedKRValue = (() => {
          if (!isTask) return "-";
          if (currentLineage.keyResultTitle) return currentLineage.keyResultTitle;

          const linkedValue =
            item.linkToKR ??
            item.linkToKr ??
            item.linkedKR ??
            item.krReferenceId ??
            item.keyResultId ??
            null;

          const linkedId = getIdFromValue(linkedValue);
          if (linkedId) {
            const linkedKey = String(linkedId);
            const mappedTitle =
              keyResultTitleMap.get(linkedKey) ||
              taskTitleMap.get(linkedKey) ||
              objectiveTitleMap.get(linkedKey);
            if (mappedTitle) return mappedTitle;
          }

          if (typeof linkedValue === "object" && linkedValue) {
            const stringFromObject = getStringFromValue(linkedValue);
            if (stringFromObject) return stringFromObject;
          }

          const fallbackTitle =
            item.okrName ||
            item.keyResultName ||
            item.krName ||
            item.parentKeyResult ||
            null;

          if (fallbackTitle) return fallbackTitle;

          if (typeof linkedId === "string") return linkedId;

          return "N/A";
        })();

        const resolveUserName = (value) => {
          if (!value && value !== 0) return null;

          const hex24Regex = /^[0-9a-fA-F]{24}$/;

          if (typeof value === "string") {
            const trimmed = value.trim();
            if (!trimmed) return null;

            const mapped = employeeNameMap.get(trimmed);
            if (mapped) return mapped;

            if (hex24Regex.test(trimmed)) {
              return null;
            }

            return trimmed;
          }

          if (typeof value === "object") {
            const candidateId =
              value._id ||
              value.id ||
              value.userId ||
              value.value ||
              value.key ||
              value.employeeId;

            if (candidateId !== null && candidateId !== undefined) {
              const mapped = employeeNameMap.get(String(candidateId));
              if (mapped) return mapped;
            }

            const {
              label,
              fullName,
              name,
              displayName,
              username,
              userName,
              firstName,
              lastName,
              email,
            } = value;

            if (label) return label;
            if (fullName) return fullName;
            if (name) return name;
            if (displayName) return displayName;
            if (username) return username;
            if (userName) return userName;
            const combined = [firstName, lastName]
              .filter(Boolean)
              .join(" ")
              .trim();
            if (combined) return combined;
            if (email) return email;
          }

          return null;
        };

        const assignedToValue = (() => {
          if (!isTask) return "-";

          const assignmentCandidates = [
            item.assignee,
            item.assigneeNames,
            item.assignedUsers,
            item.assignedTo,
            item.assignTo,
          ];

          let assignmentList = [];

          for (const candidate of assignmentCandidates) {
            if (!candidate) continue;
            const arrayCandidate = Array.isArray(candidate)
              ? candidate
              : [candidate];
            if (arrayCandidate.length > 0) {
              assignmentList = arrayCandidate;
              break;
            }
          }

          if (!assignmentList.length && item.ownerName) {
            assignmentList = [item.ownerName];
          }

          if (!assignmentList.length && item.assignToUserNames) {
            assignmentList = Array.isArray(item.assignToUserNames)
              ? item.assignToUserNames
              : [item.assignToUserNames];
          }

          const names = assignmentList
            .map((assignee) => {
              if (!assignee && assignee !== 0) return null;
              return resolveUserName(assignee);
            })
            .filter(Boolean);

          return names.length > 0 ? names.join(", ") : "N/A";
        })();

        const ownerName = (() => {
          const ownerCandidates = [
            item.ownerName,
            item.owner,
            item.ownerId,
            item.owner?._id,
            item.owner?.userId,
            item.owner?.name,
            item.owner?.fullName,
            item.owner?.username,
            item.owner?.userName,
            item.owner?.displayName,
            item.owner?.email,
          ];

          for (const candidate of ownerCandidates) {
            const resolved = resolveUserName(candidate);
            if (resolved) return resolved;
          }

          return "N/A";
        })();

        const formatStatusString = (value) => {
          if (!value) return null;
          const trimmed = value
            .replace(/_/g, " ")
            .replace(/-/g, " ")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .trim()
            .toLowerCase();

          if (!trimmed) return null;

          return trimmed
            .split(" ")
            .filter(Boolean)
            .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
            .join(" ");
        };

        const statusValue = (() => {
          const candidates = [
            item.statusDisplay,
            item.statusText,
            item.statusLabel,
            item.status,
            item.taskStatus,
            item.workflowStatus,
            item.progressStatusLabel,
            item.progressStatusName,
            item.isApproved,
            item.approvalStatus,
          ];

          for (const candidate of candidates) {
            if (candidate === null || candidate === undefined) continue;

            if (typeof candidate === "string") {
              const trimmed = candidate.trim();
              if (!trimmed) continue;
              if (trimmed.toLowerCase() === "true" || trimmed.toLowerCase() === "false") {
                continue;
              }
              const formatted = formatStatusString(trimmed);
              if (formatted) return formatted;
            }

            if (typeof candidate === "boolean") {
              return candidate ? "Approved" : "Not Approved";
            }
          }

          if (typeof item.isApproved === "string" && item.isApproved.trim() !== "") {
            const formatted = formatStatusString(item.isApproved);
            if (formatted) return formatted;
          }

          return getStatusLabel(progressNumericForStatus);
        })();

        const baseRecord = {
          [exportLabels.Type]: typeLabel,
          [exportLabels.Title]: item.title || item.task || "N/A",
          [exportLabels.Description]: item.description || "N/A",
          [exportLabels.TargetResult]:
            isKeyResult && hasTargetValue ? rawTargetValue : "-",
          [exportLabels.ActualResult]:
            isKeyResult && hasActualValue ? rawActualValue : "-",
          [exportLabels.Progress]: progressInfo.display,
          [exportLabels.Status]: statusValue,
          [exportLabels.Owner]: ownerName,
          [exportLabels.FunctionName]: item.functionName || "-",
          [exportLabels.Designation]: item.designation || "-",
          [exportLabels.Weight]: item.weight ? `${item.weight}%` : "N/A",
          [exportLabels.StartDate]: item.startDate
            ? new Date(item.startDate).toLocaleDateString()
            : "N/A",
          [exportLabels.DueDate]: item.dueDate
            ? new Date(item.dueDate).toLocaleDateString()
            : "N/A",
          [exportLabels.Alignment]: item.isAlignedToCompany ? exportLabels.CompanyOKR : exportLabels.IndividualOKR,
         
          [taskExportLabels.ActualCompletionDate]:
            isTask ? formatDateValue(item.actualCompletionDate) : "-",
          [taskExportLabels.LinkedKR]: linkedKRValue,
          [taskExportLabels.Priority]: isTask ? item.priority || "N/A" : "-",
          [taskExportLabels.AssignedTo]: assignedToValue,
        };

        result.push(baseRecord);

        // Recursively add children if they exist
        if (item.children && item.children.length > 0) {
          result = result.concat(
            flattenOKRs(item.children, level + 1, currentLineage)
          );
        }
      });

      return result;
    };

    // Helper function to determine status label
    const getStatusLabel = (progress) => {
      if (progress >= 80) return t("ObjectivesTable.TableHeader.StatusOptions.OnTrack");
      if (progress >= 50) return t("ObjectivesTable.TableHeader.StatusOptions.AtRisk");
      return t("ObjectivesTable.TableHeader.StatusOptions.OffTrack");
    };

    // Get flattened data
    const exportData = flattenOKRs(dataToExport);

    // Handle different export formats
    switch (format) {
      case "csv":
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        saveAs(new Blob([csv], { type: "text/csv" }), "okrs_export.csv");
        break;

      case "excel":
        const wb = XLSX.utils.book_new();
        
        // Sheet 1: OKR Data
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, "OKRs");
        
        // Sheet 2: Employees Without OKRs
        console.log("=== OBJECTIVES EXPORT DEBUG ===");
        console.log("All employees count:", allEmployees.length);
        console.log("Filtered data count:", filteredData.length);
        
        // Extract unique employee IDs (MongoDB _id) from OKR data
        const employeesWithOKRsById = new Set();
        filteredData.forEach(objective => {
          // Add objective owner by employeeReferenceId or owner
          const objOwnerId = objective.employeeReferenceId || objective.owner;
          if (objOwnerId) employeesWithOKRsById.add(String(objOwnerId));
          
          // Add key result owners
          if (objective.children) {
            objective.children.forEach(kr => {
              const krOwnerId = kr.userId || kr.owner;
              if (krOwnerId) employeesWithOKRsById.add(String(krOwnerId));
              
              // Add task assignees
              if (kr.children) {
                kr.children.forEach(task => {
                  const taskOwners = task.assignTo || [];
                  taskOwners.forEach(ownerId => {
                    if (ownerId) employeesWithOKRsById.add(String(ownerId));
                  });
                });
              }
            });
          }
        });
        
        console.log("Employees with OKRs (IDs):", Array.from(employeesWithOKRsById));
        
        // Find employees without OKRs
        // Check if employee's _id is in the set of employees with OKRs
        const employeesWithoutOKRs = allEmployees
          .filter(emp => {
            const empId = emp._id;
            const empNumber = emp.employeeNumber || emp.employmentInformation?.employeeNumber;
            // Only include employees with employee numbers
            // Check if this employee's ID is NOT in the set of employees with OKRs
            return empNumber && empId && !employeesWithOKRsById.has(String(empId));
          })
          .map(emp => ({
            "Employee ID": emp.employeeNumber || emp.employmentInformation?.employeeNumber || "N/A",
            "Employee Name": `${emp.personalInformation?.firstName || ""} ${emp.personalInformation?.lastName || ""}`.trim() || "N/A",
            "OKR Percentage": "0%"
          }));
        
        console.log("Employees without OKRs count:", employeesWithoutOKRs.length);
        console.log("Employees without OKRs:", employeesWithoutOKRs);
        
        // Add the "No OKR Employee" sheet - ALWAYS create this sheet
        const wsNoOKR = XLSX.utils.json_to_sheet(
          employeesWithoutOKRs.length > 0 
            ? employeesWithoutOKRs 
            : [{ "Employee ID": "N/A", "Employee Name": "No employees without OKRs", "OKR Percentage": "N/A" }]
        );
        XLSX.utils.book_append_sheet(wb, wsNoOKR, "No OKR Employee");
        
        XLSX.writeFile(wb, "okrs_export.xlsx");
        break;

      case "pdf":
        // Create a simple print-friendly table and print directly
        const printWindow = window.open('', '_blank');
        const tableData = exportData.map(item => `
          <tr>
            ${exportHeaderOrder.map((header) => `<td>${item[header] || '-'}</td>`).join('')}
          </tr>
        `).join('');

        printWindow.document.write(`
          <html>
            <head>
              <title>${exportLabels.OKRsExportReport}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #837F39; color: white; font-weight: bold; }
                h1 { color: #837F39; }
                @media print {
                  body { margin: 0; }
                }
              </style>
            </head>
            <body>
              <h1>${exportLabels.OKRsExportReport}</h1>
              <p>${exportLabels.ExportedOn} ${new Date().toLocaleDateString()}</p>
              <table>
                <thead>
                  <tr>
                    ${exportHeaderOrder.map((header) => `<th>${header}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${tableData}
                </tbody>
              </table>
            </body>
          </html>
        `);
        printWindow.document.close();
        
        // Auto-print after content loads
        printWindow.onload = function() {
          printWindow.print();
          printWindow.close();
        };
        
        // Fallback if onload doesn't work
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
        break;

      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isMobile || isTablet ? "flex-start" : "space-between",
        padding: isMobile ? "0 0.5rem" : isTablet ? "0 0.3rem" : "0 1rem",
        alignItems: "center",
        margin:  isMobile || isTablet ? "0.3rem 0px .3rem 0px" : ".3rem 0px 1rem 0px",
        gap: isMobile ? "8px" : isTablet ? "12px" : "20px",
        overflowX: isMobile || isTablet ? "auto" : "visible",
        width: "100%",
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
      }}
    >
      {/* Left Section - Buttons */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        marginTop: isMobile ? "5px" : isTablet ? "8px" : "10px",
        gap: isMobile ? "6px" : isTablet ? "8px" : "10px",
        flexShrink: 0,
        minWidth: isMobile ? "600px" : isTablet ? "700px" : "auto",
      }}>
        <CheckboxDropdown
          anchorEl={displayAnchorEl}
          setAnchorEl={setDisplayAnchorEl}
          options={columns.map((col) => col.label)}
          selectedOptions={visibleColumns.map(
            (id) => columns.find((col) => col.id === id)?.label
          )}
          onToggle={(label) => {
            const column = columns.find((col) => col.label === label);
            if (!column) return;
            setVisibleColumns((prev) =>
              prev.includes(column.id)
                ? prev.filter((id) => id !== column.id)
                : [...prev, column.id]
            );
          }}
          icon={<img src={displayOptions} alt={t("ObjectivesTable.TableHeader.DisplayOptions")} />}
          label={t("ObjectivesTable.TableHeader.DisplayOptions")}
        />

        <Button
          variant="outlined"
          startIcon={
            <img 
              src={buildingIcon} 
              width={isMobile ? 16 : isTablet ? 18 : 20} 
              height={isMobile ? 16 : isTablet ? 18 : 20} 
              alt={t("ObjectivesTable.TableHeader.CompanyOKRs")} 
            />
          }
          sx={{
            width: isMobile ? "140px" : isTablet ? "160px" : "175px",
            height: isMobile ? "30px" : isTablet ? "32px" : "34px",
            borderRadius: "100px",
            border: "1px solid #837F39",
            gap: "8px",
            backgroundColor: isCompanyOKRsFilterActive ? "#837F39" : "#FEFEFE",
            color: isCompanyOKRsFilterActive ? "#FFFFFF" : "#0E0E0E",
            fontWeight: 600,
            fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
            textTransform: "none",
            marginLeft: isMobile ? "5px" : isTablet ? "8px" : "10px",
            "&:hover": {
              backgroundColor: isCompanyOKRsFilterActive
                ? "#837F39"
                : "#FEFEFE",
            },
          }}
          onClick={() =>
            setIsCompanyOKRsFilterActive(!isCompanyOKRsFilterActive)
          }
        >
          {t("ObjectivesTable.TableHeader.CompanyOKRs")}
        </Button>

        
        {hasCascadePermission&&(
  <Button
          variant="outlined"
          disabled={selectedItems.length === 0}
          sx={{
            width: isMobile ? "80px" : isTablet ? "90px" : "100px",
            height: isMobile ? "30px" : isTablet ? "32px" : "34px",
            borderRadius: "100px",
            border: "1px solid #837F39",
            gap: "4px",
            backgroundColor: selectedItems.length > 0 ? "#837F39" : "#FEFEFE",
            color: selectedItems.length > 0 ? "#FFFFFF" : "#0E0E0E",
            fontWeight: 600,
            fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
            textTransform: "none",
            marginLeft: isMobile ? "5px" : isTablet ? "8px" : "10px",
            opacity: selectedItems.length === 0 ? 0.5 : 1,
            "&:hover": {
              backgroundColor: selectedItems.length > 0 ? "#837F39" : "#FEFEFE",
            },
            "&:disabled": {
              opacity: 0.5,
              cursor: "not-allowed",
            },
          }}
   onClick={() => {
                  handleCascade();
                }}        >
          {t("ObjectivesTable.TableHeader.Cascade")}
        </Button>
)}

        <Button
          variant="outlined"
          startIcon={
            <img 
              src={buildingIcon} 
              width={isMobile ? 16 : isTablet ? 18 : 20} 
              height={isMobile ? 16 : isTablet ? 18 : 20} 
              alt={t("ObjectivesTable.TableHeader.Delete")} 
            />
          }
          onClick={handleBulkDelete}
          disabled={selectedItems.length === 0}
          sx={{
            width: isMobile ? "80px" : isTablet ? "90px" : "100px",
            height: isMobile ? "30px" : isTablet ? "32px" : "34px",
            borderRadius: "100px",
            border: "1px solid #837F39",
            gap: "8px",
            backgroundColor: "#FEFEFE",
            color: "#0E0E0E",
            fontWeight: 600,
            fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
            textTransform: "none",
            marginLeft: isMobile ? "5px" : isTablet ? "8px" : "10px",
          }}
        >
          {t("ObjectivesTable.TableHeader.Delete")}
        </Button>

        <Box ml={isMobile ? 1 : isTablet ? 1.5 : 2}>
          <CheckboxDropdown
            anchorEl={statusAnchorEl}
            setAnchorEl={setStatusAnchorEl}
            options={[
              t("ObjectivesTable.TableHeader.StatusOptions.OnTrack"),
              t("ObjectivesTable.TableHeader.StatusOptions.AtRisk"),
              t("ObjectivesTable.TableHeader.StatusOptions.OffTrack")
            ]}
            selectedOptions={selectedStatus.map(status => {
              const reverseMap = {
                "OnTrack": t("ObjectivesTable.TableHeader.StatusOptions.OnTrack"),
                "AtRisk": t("ObjectivesTable.TableHeader.StatusOptions.AtRisk"),
                "OffTrack": t("ObjectivesTable.TableHeader.StatusOptions.OffTrack")
              };
              return reverseMap[status] || status;
            })}
            onToggle={handleStatusToggle}
            label={t("ObjectivesTable.TableHeader.Status")}
            useCustomIcons={true}
          />
        </Box>
      </Box>

      {/* Right Section - Search and Actions */}
      <Box sx={{ 
        display: "flex", 
        gap: isMobile ? "6px" : isTablet ? "8px" : "1rem", 
        marginTop: isMobile ? "5px" : isTablet ? "8px" : "15px",
        flexShrink: 0,
        alignItems: "center",
      }}>
        <TextField
          placeholder={t("ObjectivesTable.TableHeader.SearchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: isMobile ? "200px" : isTablet ? "250px" : "300px",
            height: isMobile ? "30px" : isTablet ? "32px" : "34px",
            border: "1px solid #837F39",
            padding: ".3rem",
            borderRadius: "5rem",
            "& fieldset": { border: "none" },
            ".MuiInputBase-root": {
              height: "100%",
              alignItems: "center",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ 
                  color: "#85803c",
                  fontSize: isMobile ? 16 : isTablet ? 18 : 20,
                }} />
              </InputAdornment>
            ),
            sx: {
              height: "100%",
              padding: "0 12px",
              "& input": {
                padding: "0",
                fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
              },
            },
          }}
        />

        <CustomButton
          iconPosition="start"
          iconExists={true}
          onClick={(e) => setExportAnchorEl(e.currentTarget)}
          IconProp={ExportIcon}
          text={t("ObjectivesTable.TableHeader.Export")}
          variant="outlined"
          color="#000"
          sx={{
            margin: "0 0 .3rem .5rem",
            fontWeight: 550,
            border: "1px solid #85803c",
            borderRadius: "5rem",
            height: isMobile ? "30px" : isTablet ? "32px" : "34px",
            marginTop: isMobile ? "5px" : isTablet ? "8px" : "10px",
            fontSize: isMobile ? "10px" : isTablet ? "11px" : "12px",
            minWidth: isMobile ? "70px" : isTablet ? "80px" : "auto",
          }}
        />

        <Menu
          anchorEl={exportAnchorEl}
          open={Boolean(exportAnchorEl)}
          onClose={() => setExportAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            sx: {
              borderRadius: "1rem",
              border: "1px solid #ddd",
              mt: "10px",
            },
          }}
        >
          {exportOptions.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleExport(item.format);
                setExportAnchorEl(null);
              }}
            >
              <ListItemIcon sx={{ minWidth: "30px" }}>
                <img src={item.icon} alt={item.text} width={18} height={18} />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: "#6D6D6D",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              />
            </MenuItem>
          ))}
        </Menu>

        {canEdit() && (
          <>
            <Button
              ref={createOKRRef}
              variant="outlined"
              startIcon={<AddIcon sx={{ 
                width: isMobile ? 16 : isTablet ? 18 : 20, 
                height: isMobile ? 16 : isTablet ? 18 : 20 
              }} />}
              sx={{
                width: isMobile ? "120px" : isTablet ? "140px" : "160px",
                height: isMobile ? "30px" : isTablet ? "32px" : "34px",
                borderRadius: "100px",
                border: "1px solid #837F39",
                gap: "8px",
                backgroundColor: "#837F39",
                color: "#FFFFFF",
                fontWeight: 500,
                fontSize: isMobile ? "11px" : isTablet ? "12px" : "14px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#837F39",
                  color: "#FFFFFF",
                },
              }}
              onClick={handleButtonClick}
            >
              {t("ObjectivesTable.TableHeader.CreateOKR")}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleLibraryClick}>{t("ObjectivesTable.TableHeader.Library")}</MenuItem>
              <MenuItem onClick={handleNonLibraryClick}>{t("ObjectivesTable.TableHeader.NonLibrary")}</MenuItem>
            </Menu>
          </>
        )}

      </Box>
      {showLibraryPopup && (
  <PopupOKRLibrary
    show={showLibraryPopup}
    onHide={() => setShowLibraryPopup(false)}
  />
)}

    </Box>
  );
};

export default TableHeader3;
