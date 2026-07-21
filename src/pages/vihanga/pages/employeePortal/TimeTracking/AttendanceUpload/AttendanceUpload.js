import React, { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress, Paper, IconButton, Dialog, DialogTitle, DialogContent, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Stack, Menu, MenuItem, Alert, AlertTitle } from "@mui/material";
import { useTranslation } from 'react-i18next';
import * as XLSX from "xlsx";
import axios from "axios";
import { Toast } from "service/toast";
import FileUploadCustom from "pages/vihanga/components/filesUplode/draganddropFile";
import AttendaanceTempalte from "./AttendaanceTempalte";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getSelectedTabType } from "utilities/getLocalStorageItem";
import { appURL } from "utilities";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import SystemUpdateAltOutlinedIcon from "@mui/icons-material/SystemUpdateAltOutlined";
import { saveAs } from "file-saver";
import DateFilterButton from "pages/vihanga/pages/board/components/Date";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import FilePreview from "./FilePreview";
import { calculateHoursFormatted } from "../utils/timeCalculations";
import { canEdit, canDelete } from "utilities/privilegeHelper";

// Static template data for Excel download (no network)
const TEMPLATE_DATA = [
  { EmpId: "E000000", Date: "8-8-25", TimeIn: "08:00:00", TimeOut: "18:00:00", Method: "Bio", Remarks: "" },
  { EmpId: "FN0001", Date: "8-8-25", TimeIn: "09:00:00", TimeOut: "18:00:00", Method: "Bio", Remarks: "Leave" },
];

const AttendanceUpload = () => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [processedData, setProcessedData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [loadingUploads, setLoadingUploads] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [records, setRecords] = useState([]);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [recordsPage, setRecordsPage] = useState(0);
  const [recordsRowsPerPage, setRecordsRowsPerPage] = useState(10);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [uploadErrors, setUploadErrors] = useState([]);

  const companyId = getItemFromLocalStorage("companyId");

  // Render helpers
  const formatDateDDMonYYYY = (dateString) => {
    if (!dateString || dateString === "-") return "-";
    
    try {
      const trimmed = dateString.trim();
      
      // If already in "DD Mon YYYY" format, return as is
      const ddmonyyyyPattern = /^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/i;
      if (ddmonyyyyPattern.test(trimmed)) {
        // Normalize to ensure consistent format (e.g., "12 Dec 2025")
        const parts = trimmed.split(/\s+/);
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
          const year = parts[2];
          return `${day} ${month} ${year}`;
        }
        return trimmed;
      }
      
      // Handle MM/DD/YYYY or MM/DD/YY format
      const slashPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
      const slashMatch = trimmed.match(slashPattern);
      if (slashMatch) {
        const month = parseInt(slashMatch[1], 10);
        const day = parseInt(slashMatch[2], 10);
        let year = parseInt(slashMatch[3], 10);
        // Handle 2-digit years
        if (year < 100) {
          year = year < 50 ? 2000 + year : 1900 + year;
        }
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          return `${day} ${monthNames[month - 1]} ${year}`;
        }
      }
      
      // Try parsing with Date constructor for other formats
      const date = new Date(trimmed);
      
      // Check if date is valid
      if (!isNaN(date.getTime())) {
        // Format as "DD Mon YYYY"
        const day = date.getDate();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}`;
      }
      
      // Return original if all parsing attempts fail
      return dateString;
    } catch (error) {
      // If any error occurs, return original string
      return dateString;
    }
  };

  const formatTimeHM = (val) => {
    if (val == null || val === "") return "-";
    // Already HH:mm
    if (typeof val === "string" && val.includes(":")) {
      const [h = 0, m = 0] = val.split(":").map((n) => parseInt(n, 10) || 0);
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }
    const num = typeof val === "number" ? val : parseFloat(val);
    if (!Number.isFinite(num)) return String(val);
    let hours;
    if (num >= 0 && num <= 1) {
      // Excel day fraction
      hours = num * 24;
    } else if (num > 1 && num < 24) {
      // Decimal hours
      hours = num;
    } else {
      // Fallback
      hours = num;
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  // Convert various time inputs to HH:mm format string for backend
  const toTimeHHMM = (val) => {
    if (val == null || val === "") return "";
    
    // If already HH:mm or HH:mm:ss format, normalize it
    if (typeof val === "string" && val.includes(":")) {
      const parts = val.split(":").map(n => parseInt(n, 10) || 0);
      const h = parts[0] || 0;
      const m = parts[1] || 0;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }
    
    let hours = 0;
    
    // If it's a number, convert to hours
    if (typeof val === "number") {
      // Excel time day fractions are between 0 and 1
      if (val >= 0 && val < 1) {
        hours = val * 24; // day fraction to hours
      } else if (val >= 1 && val < 24) {
        hours = val; // already decimal hours
      } else {
        return ""; // invalid
      }
    } else {
      // String conversion
      const s = String(val).trim();
      if (!s) return "";
      
      // AM/PM format: 9:45 AM, 6:30 PM
      const ampm = s.match(/^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?\s*([AaPp][Mm])$/);
      if (ampm) {
        let h = parseInt(ampm[1] || "0", 10);
        const m = parseInt(ampm[2] || "0", 10);
        const sec = parseInt(ampm[3] || "0", 10);
        const mer = ampm[4].toUpperCase();
        if (mer === 'PM' && h !== 12) h += 12;
        if (mer === 'AM' && h === 12) h = 0;
        hours = h + m / 60 + sec / 3600;
      }
      // Dot separated like 9.28 or 9.28 AM
      else if (s.match(/^(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?\s*([AaPp][Mm])?$/)) {
        const dot = s.match(/^(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?\s*([AaPp][Mm])?$/);
        let h = parseInt(dot[1] || "0", 10);
        const m = parseInt(dot[2] || "0", 10);
        const sec = parseInt(dot[3] || "0", 10);
        const mer = (dot[4] || '').toUpperCase();
        if (mer) {
          if (mer === 'PM' && h !== 12) h += 12;
          if (mer === 'AM' && h === 12) h = 0;
        }
        hours = h + m / 60 + sec / 3600;
      }
      // Try parsing as number string
      else {
        const num = parseFloat(s);
        if (Number.isFinite(num)) {
          if (num >= 0 && num < 1) {
            hours = num * 24; // day fraction
          } else if (num >= 1 && num < 24) {
            hours = num; // decimal hours
          } else {
            return ""; // invalid
          }
        } else {
          return "";
        }
      }
    }
    
    // Convert hours to HH:mm
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const fetchUploads = async () => {
    try {
      setLoadingUploads(true);
      const res = await axios.get(`${appURL}/recruitment/time-tracking/uploads`, { params: { companyId, limit: 25 } });
      setUploads(res.data?.data || []);
    } catch (e) {
      // ignore
    } finally {
      setLoadingUploads(false);
    }
  };

  useEffect(() => {
    fetchUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = async ({ file, data }) => {
    if (!file) return;
    setUploadErrors([]);
    setUploading(true);
  
    try {
      let json = data;
  
      if (
        !json &&
        (file.name.endsWith('.xls') ||
          file.name.endsWith('.xlsx') ||
          file.name.endsWith('.csv'))
      ) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, {
          cellDates: false, 
        });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        json = XLSX.utils.sheet_to_json(sheet, {
          raw: true,       
          defval: ""
        });
      }
  
      if (!json || json.length === 0) {
        setUploading(false);
        setUploadErrors(["Uploaded file appears to be empty or unreadable."]);
        return;
      }
  
      // Normalize rows for backend compatibility (dates and times)
      const normalized = json.map((row) => {
        const out = { ...row };
        // Convert time values to HH:mm format strings
        if (Object.prototype.hasOwnProperty.call(out, 'TimeIn')) {
          const v = toTimeHHMM(out.TimeIn);
          out.TimeIn = v === "" ? "" : v;
        }
        if (Object.prototype.hasOwnProperty.call(out, 'TimeOut')) {
          const v = toTimeHHMM(out.TimeOut);
          out.TimeOut = v === "" ? "" : v;
        }
        // Keep Method casing but trim
        if (typeof out.Method === 'string') out.Method = out.Method.trim();
        return out;
      });

      // Group rows by EmpId
      const groupedByUser = {};
      normalized.forEach(row => {
        const empid = row.EmpId;
        if (!empid) return;
        if (!groupedByUser[empid]) groupedByUser[empid] = [];
        groupedByUser[empid].push(row);
      });

      if (Object.keys(groupedByUser).length === 0) {
        setUploading(false);
        setUploadErrors(["No rows with EmpId found. Please ensure the 'EmpId' column is present and filled."]);
        return;
      }
  
      setProcessedData({ json: normalized, groupedByUser });
      setUploadedFile(file);
    } catch (err) {
      console.error(err);
      const errorMessage = err?.message || "Error processing file. Please verify the format.";
      setUploadErrors([errorMessage]);
    } finally {
      setUploading(false);
      setFileInputKey(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!processedData) return;
    setUploadErrors([]);
    setSubmitting(true);

    try {
      // 1) Upload original file to S3 via backend for traceability/rollback
      let fileMeta = null;
      if (uploadedFile) {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        const uploadRes = await axios.post(`${appURL}/recruitment/time-tracking/uploads/file`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        fileMeta = uploadRes.data?.data || null;
      }

      // 2) Post bulk upload with grouped data and file metadata
      const response = await axios.post(
        `${appURL}/recruitment/bulk-upload/time-tracking?companyId=${companyId}`,
        {
          uploading: true,
          data: processedData.groupedByUser,
          type: getSelectedTabType(),
          fileMeta
        }
      );

      // Check if the response indicates success
      if (response.data && response.data.success === false) {
        const msg = response.data.message || "Failed to submit data. Please try again.";
        setUploadErrors([msg]);
        Toast({ message: msg, type: "error" });
        return;
      }

      Toast({
        message: `Successfully submitted ${processedData.json.length} time entries for approval.`,
        type: "success",
      });
      
      // Reset form after successful submission
      setProcessedData(null);
      setUploadedFile(null);

      // Refresh uploads list
      fetchUploads();
    } catch (err) {
      console.error(err);
      
      // Extract error message from API response
      const errorMessage = err.response?.data?.message || err.message || "Failed to submit data. Please try again.";
      
      setUploadErrors([errorMessage]);
      Toast({ message: errorMessage, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };
  
  const openView = async (batch) => {
    setSelectedBatch(batch);
    setViewOpen(true);
    setRecordsPage(0);
    await loadBatchRecords(batch._id, 0, recordsRowsPerPage);
  };

  const loadBatchRecords = async (batchId, page, limit) => {
    try {
      setRecordsLoading(true);
      const res = await axios.get(`${appURL}/recruitment/time-tracking/uploads/${batchId}/records`, {
        params: { companyId, page: page + 1, limit }
      });
      setRecords(res.data?.data || []);
      setRecordsTotal(res.data?.total || 0);
    } catch (_) {
      setRecords([]);
      setRecordsTotal(0);
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleChangePage = async (_e, newPage) => {
    setRecordsPage(newPage);
    if (selectedBatch) await loadBatchRecords(selectedBatch._id, newPage, recordsRowsPerPage);
  };

  const handleChangeRowsPerPage = async (e) => {
    const newSize = parseInt(e.target.value, 10);
    setRecordsRowsPerPage(newSize);
    setRecordsPage(0);
    if (selectedBatch) await loadBatchRecords(selectedBatch._id, 0, newSize);
  };

  const handleRollback = async (batch) => {
    if (!window.confirm(t("Are you sure you want to rollback this upload?"))) return;
    try {
      await axios.delete(`${appURL}/recruitment/time-tracking/uploads/${batch._id}/rollback`, {
        params: { companyId }
      });
      Toast({ message: t("Rollback completed."), type: "success" });
      fetchUploads();
      if (selectedBatch?._id === batch._id) setViewOpen(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || t("Failed to rollback");
      Toast({ message: errorMessage, type: "error" });
    }
  };

  const handleDeleteBatch = async (batch) => {
    if (!window.confirm(t("Delete this upload record? This cannot be undone."))) return;
    try {
      await axios.delete(`${appURL}/recruitment/time-tracking/uploads/${batch._id}`, {
        params: { companyId }
      });
      Toast({ message: t("Upload deleted."), type: "success" });
      fetchUploads();
      if (selectedBatch?._id === batch._id) setViewOpen(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || t("Failed to delete upload");
      Toast({ message: errorMessage, type: "error" });
    }
  };

  const handleExportClick = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchor(null);
  };

  // Use common utility function for hours calculation

  const handleExport = async (format) => {
    handleExportClose();
    
    if (!dateFrom || !dateTo) {
      Toast({
        message: t("Please select both From and To dates for export"),
        type: "error",
      });
      return;
    }

    setExportLoading(true);
    try {
      // Fetch attendance data with date range and method filters
      const params = {
        companyId,
        from: dateFrom,
        to: dateTo,
        method: methodFilter,
        limit: 10000000,
        page: 1
      };
      
      // Add method filter if not "all"
      if (methodFilter && methodFilter !== "all") {
        params.method = methodFilter;
      }

      const response = await axios.get(`${appURL}/recruitment/time-tracking`, { params });
      // Response structure: { success: true, data: { data: [...], totalRecords: ... } }
      const attendanceData = response.data?.data?.data || [];

      // Format data for export - matching exact column names as specified
      const exportData = attendanceData.map((item) => {
        // Derive calendar year from dateString or createdAt
        let year = "-";
        try {
          const dateSource = item.dateString || item.createdAt;
          if (dateSource) {
            const d = new Date(dateSource);
            if (!isNaN(d)) year = d.getFullYear();
          }
        } catch (_) {
          year = "-";
        }        
        // Format coordinates for display
        const formatCoordinates = (coords) => {
          if (!coords || (coords.latitude == null && coords.longitude == null)) return "-";
          const lat = coords.latitude != null ? coords.latitude : "";
          const lon = coords.longitude != null ? coords.longitude : "";
          return lat && lon ? `${lat}, ${lon}` : "-";
        };
        return {
          EmployeeName: item.employeeInfo?.name || "-",
          EmployeeId: item.employeeInfo?.employeeNumber || "-",
          EmployeeMail: item.employeeInfo?.email || "-",
          Day: item.day || "-",
          Date: formatDateDDMonYYYY(item.dateString),
          TimeIn: formatTimeHM(item.timeIn),
          TimeOut: formatTimeHM(item.timeOut),
          Hours: calculateHoursFormatted(item.timeIn, item.timeOut) || "-",
          Method: item.method || "-",
          DistanceTravelled: item.distanceTraveled?.distanceInKm || "00km 00m",
          location: item?.employeeInfo?.location || "-",
          ClockInCoordinates: formatCoordinates(item.distanceTraveled?.clockInCoordinates),
          ClockOutCoordinates: formatCoordinates(item.distanceTraveled?.clockOutCoordinates),
          Remarks: item.Remarks || item.comments || "-",
          Status: item.status || "-",
          Year: year
        };
      });

      // Console log before export for validation
      console.log("Export Data:", exportData);
      console.log("Total Records:", exportData.length);
      console.log("Date Range:", { from: dateFrom, to: dateTo });
      console.log("Method Filter:", methodFilter);

      // Handle different export formats
      switch (format) {
        case "csv":
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const csv = XLSX.utils.sheet_to_csv(worksheet);
          saveAs(new Blob([csv], { type: "text/csv" }), `attendance_export_${dateFrom}_to_${dateTo}.csv`);
          break;

        case "excel":
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(exportData);
          XLSX.utils.book_append_sheet(wb, ws, "Attendance");
          XLSX.writeFile(wb, `attendance_export_${dateFrom}_to_${dateTo}.xlsx`);
          break;

        case "pdf":
          // Create a simple print-friendly table and print directly
          const printWindow = window.open('', '_blank');
          const exportHeaders = ["EmployeeMail", "Day", "Date", "TimeIn", "TimeOut", "Hours", "Method", "DistanceTravelled", "ClockInCoordinates", "ClockOutCoordinates", "Remarks", "Status", "Year"];
          const tableData = exportData.map(item => `
            <tr>
              ${exportHeaders.map((header) => `<td>${item[header] || '-'}</td>`).join('')}
            </tr>
          `).join('');

          printWindow.document.write(`
            <html>
              <head>
                <title>Attendance Export Report</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                  th { background-color: rgb(153, 150, 94); color: white; font-weight: bold; }
                  h1 { color: rgb(153, 150, 94); }
                  @media print {
                    body { margin: 0; }
                  }
                </style>
              </head>
              <body>
                <h1>Attendance Export Report</h1>
                <p>Exported on ${new Date().toLocaleDateString()}</p>
                <p>Date Range: ${dateFrom} to ${dateTo}</p>
                <p>Total Records: ${exportData.length}</p>
                <table>
                  <thead>
                    <tr>
                      ${exportHeaders.map((header) => `<th>${header}</th>`).join('')}
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

      Toast({
        message: t("Attendance data exported successfully"),
        type: "success",
      });
    } catch (err) {
      console.error("Export error:", err);
      const errorMessage = err.response?.data?.message || err.message || t("Failed to export data");
      Toast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setExportLoading(false);
    }
  };


  return (
    <Box sx={{  margin:"0 1.3rem 0 1.3rem", mt: 6, p: 4,
          borderRadius: "1rem",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        border: "1px solid #eee", }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <CloudUploadIcon sx={{ fontSize: 40, mr: 1, color: 'rgb(153, 150, 94)' }} />
        <Typography variant="h5" fontWeight={700}>{t("AttendanceUpload.PageTitle")}</Typography>
      </Box>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {t("AttendanceUpload.PageDescription")}
      </Typography>
      
      {/* Inline error banner */}
      {uploadErrors && uploadErrors.length > 0 && (
        <Alert severity="error" onClose={() => setUploadErrors([])} sx={{ mb: 2 }}>
          <AlertTitle>{t("Errors while processing upload")}</AlertTitle>
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {uploadErrors.map((e, i) => (
              <li key={i}>
                <Typography variant="body2">{e}</Typography>
              </li>
            ))}
          </ul>
        </Alert>
      )}
      
      {/* Date Range and Export Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          fontWeight={700} 
          sx={{ 
            mb: 3,
            color: '#424242',
            fontSize: '1.5rem'
          }}
        >
          {t("Export Attendance Data")}
        </Typography>
        <Box sx={{ 
          display: "flex", 
          gap: 3, 
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          <DateFilterButton
            onApply={(startDate, endDate) => {
              if (startDate && endDate) {
                setDateFrom(startDate);
                setDateTo(endDate);
              } else {
                // Clear dates when Clear button is clicked
                setDateFrom("");
                setDateTo("");
              }
            }}
            buttonText={
              dateFrom && dateTo 
                ? `${dateFrom} to ${dateTo}` 
                : t("Select Date Range")
            }
            initialStartDate={dateFrom || null}
            initialEndDate={dateTo || null}
            disabled={exportLoading}
          />
          <Box sx={{ minWidth: 220 }}>
            <SelectComponent
              id="methodFilter"
              label={t("Method")}
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              options={[
                { label: t("All Methods"), value: "all" },
                { label: t("Manual"), value: "manual" },
                { label: t("Geo"), value: "geo" }
              ]}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: 'rgb(153, 150, 94)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgb(153, 150, 94)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'rgb(153, 150, 94)',
                },
              }}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={exportLoading ? <CircularProgress size={18} color="inherit" /> : <SystemUpdateAltOutlinedIcon />}
            onClick={handleExportClick}
            disabled={exportLoading || !dateFrom || !dateTo}
            sx={{
              borderColor: 'rgb(153, 150, 94)',
              color: '#fff',
              backgroundColor: 'rgb(153, 150, 94)', // Ensure theme color, not blue
              '&:hover': {
                borderColor: 'rgb(153, 150, 94)',
                backgroundColor: 'rgba(153, 150, 94, 0.8)', // Slightly darker on hover
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(153,150,94,0.3)',
                color: '#fff',
              },
            }}
          >
            {exportLoading ? t("Exporting...") : t("EXPORT")}
          </Button>
         
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ 
              borderColor: 'rgb(153, 150, 94)',
              color: 'rgb(153, 150, 94)',
              '&:hover': {
                borderColor: 'rgb(153, 150, 94)',
                backgroundColor: 'rgba(153, 150, 94, 0.1)',
              }
            }}
            onClick={() => {
              const wb = XLSX.utils.book_new();
              const ws = XLSX.utils.json_to_sheet(TEMPLATE_DATA, {
                header: ["EmpId", "Date", "TimeIn", "TimeOut", "Method", "Remarks"]
              });
              XLSX.utils.book_append_sheet(wb, ws, "Template");
              XLSX.writeFile(wb, "Attendance-Template.xlsx");
            }}
          >
            {t("AttendanceUpload.DownloadTemplate")}
          </Button>
        </Box>
        <Menu
          anchorEl={exportMenuAnchor}
          open={Boolean(exportMenuAnchor)}
          onClose={handleExportClose}
          PaperProps={{
            sx: {
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
              mt: 1,
            }
          }}
        >
          <MenuItem 
            onClick={() => handleExport("csv")}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(153, 150, 94, 0.1)',
              },
            }}
          >
            {t("Export as CSV")}
          </MenuItem>
          <MenuItem 
            onClick={() => handleExport("excel")}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(153, 150, 94, 0.1)',
              },
            }}
          >
            {t("Export as Excel")}
          </MenuItem>
          <MenuItem 
            onClick={() => handleExport("pdf")}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(153, 150, 94, 0.1)',
              },
            }}
          >
            {t("Export as PDF")}
          </MenuItem>
        </Menu>
      </Box>

     

      {canEdit() && (
        <FileUploadCustom
          key={fileInputKey}
          label={t("AttendanceUpload.UploadFileLabel")}
          id="attendance-upload-input"
          onFileUpload={handleFileUpload}
          sx={{ minHeight: 180, mb: 2 }}
        />
      )}
      
      {/* File Preview */}
      {canEdit() && processedData && processedData.json && uploadedFile && !uploading && (
        <FilePreview 
          data={processedData.json} 
          fileName={uploadedFile.name}
        />
      )}
      
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {uploadedFile && !uploading ? (
            <>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {t("AttendanceUpload.UploadedFile")} <b>{uploadedFile.name}</b>
              </Typography>
              <IconButton size="small" onClick={() => {
                setUploadedFile(null);
                setProcessedData(null);
              }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t("AttendanceUpload.NoFileUploaded")}
            </Typography>
          )}
        </Box>
        
        {canEdit() && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!processedData || submitting}
            sx={{
              backgroundColor: 'rgb(153, 150, 94)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgb(133, 130, 74)',
              },
              '&:disabled': {
                backgroundColor: 'rgba(153, 150, 94, 0.5)',
              },
              minWidth: 120,
            }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : t("AttendanceUpload.Submit")}
          </Button>
        )}
      </Box>

      {/* Recent Uploads */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>{t("Recent Uploads")}</Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          {loadingUploads ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : uploads.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{t("No uploads yet.")}</Typography>
          ) : (
            <Box>
              {uploads.map((u) => {
                const rolledBack = u.status === 'rolled_back';
                return (
                  <Box key={u._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                    <Box>
                      <Typography variant="body2"><b>{u.filename || t("File")}</b> · {new Date(u.createdAt).toLocaleString()}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t("Records")}: {u.successCount}/{u.totalRecords} · {t("Status")}: {u.status}</Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openView(u)}
                        disabled={rolledBack}
                        sx={{
                          borderColor: 'rgb(153, 150, 94)',
                          color: 'rgb(153, 150, 94)',
                          borderRadius: '5rem',
                          px: 2,
                          '&:hover': { borderColor: 'rgb(153, 150, 94)', backgroundColor: 'rgba(153,150,94,0.08)' },
                          '&.Mui-disabled': { color: 'rgba(0,0,0,0.26)', borderColor: '#e0e0e0' }
                        }}
                      >
                        {t("View")}
                      </Button>
                      {rolledBack && u.s3Url ? (
                        <Button
                          size="small"
                          variant="outlined"
                          component="a"
                          href={u.s3Url}
                          target="_blank"
                          rel="noopener"
                          sx={{
                            borderColor: 'rgb(153, 150, 94)',
                            color: 'rgb(153, 150, 94)',
                            borderRadius: '5rem',
                            px: 2,
                            '&:hover': { borderColor: 'rgb(153, 150, 94)', backgroundColor: 'rgba(153,150,94,0.08)' }
                          }}
                        >
                          {t("Download")}
                        </Button>
                      ) : null}
                      {canEdit() && (
                        <Button
                          size="small"
                          variant={rolledBack ? 'outlined' : 'contained'}
                          color="error"
                          disabled={rolledBack}
                          onClick={() => handleRollback(u)}
                          sx={{ borderRadius: '5rem', px: 2 }}
                        >
                          {rolledBack ? t("Rolled Back") : t("Rollback")}
                        </Button>
                      )}
                      {canDelete() && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteBatch(u)}
                          disabled={!rolledBack && u.status !== 'failed'}
                          sx={{ borderRadius: '5rem', px: 2 }}
                        >
                          {t("Delete")}
                        </Button>
                      )}
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      </Box>

      {/* View Records Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{t("Upload Records")}{selectedBatch?.filename ? ` - ${selectedBatch.filename}` : ''}</DialogTitle>
        <DialogContent>
          {selectedBatch?.status === 'rolled_back' ? (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {t("This upload was rolled back. The created records were deleted.")}
              {selectedBatch?.s3Url ? (
                <> {t("You can still download the original file")} <a href={selectedBatch.s3Url} target="_blank" rel="noopener">{t("here")}</a>.</>
              ) : null}
            </Typography>
          ) : recordsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t("Employee")}</TableCell>
                    <TableCell>{t("Date")}</TableCell>
                    <TableCell>{t("Time In")}</TableCell>
                    <TableCell>{t("Time Out")}</TableCell>
                    <TableCell>{t("Method")}</TableCell>
                    <TableCell>{t("Status")}</TableCell>
                    <TableCell>{t("Remarks")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>{r.employeeInfo?.name || '-'}</TableCell>
                      <TableCell>{formatDateDDMonYYYY(r.dateString)}</TableCell>
                      <TableCell>{formatTimeHM(r.timeIn)}</TableCell>
                      <TableCell>{formatTimeHM(r.timeOut)}</TableCell>
                      <TableCell>{r.method || '-'}</TableCell>
                      <TableCell>{r.status || '-'}</TableCell>
                      <TableCell>{r.Remarks || r.comments || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={recordsTotal}
                page={recordsPage}
                onPageChange={handleChangePage}
                rowsPerPage={recordsRowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AttendanceUpload;
