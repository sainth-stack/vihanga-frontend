import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  TextField,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as XLSX from "xlsx";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import { createTimeTrackingEntry } from "service/timeTrackingApi";
import CustomSwitchButton from "pages/vihanga/components/SwitchButton/CustomSwitch";
import { useHistory } from "react-router-dom";
import { Toast } from "service/toast";
import { CloudUpload, CloudDownload } from "@mui/icons-material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import axios from "axios";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getSelectedTabType } from "utilities/getLocalStorageItem";
import { calculateHours } from "utilities/formatInputs";

import moment from "moment";
import { appURL } from "utilities";
import { canEdit } from "utilities/privilegeHelper";

const WeeklyTimeCard = ({
  startDate: propStartDate,
  endDate: propEndDate,
  currentWeek,
  companyId,
  userId,
  fetchTimeEntries,
  onSubmissionSuccess,
  loading: parentLoading,
  timeEntries = []
}) => {
  // Date range state
  const [startDate, setStartDate] = useState(propStartDate ? new Date(propStartDate) : new Date(currentWeek?.startDate || Date.now()));
  const [endDate, setEndDate] = useState(propEndDate ? new Date(propEndDate) : new Date(currentWeek?.endDate || Date.now()));

  // Regenerate weekDays when startDate or endDate changes
  useEffect(() => {
    setWeekDays(generateWeekDays(startDate));
  }, [startDate]);

  const buttons = [
    {
      label: "Download",
      icon: <CloudDownload sx={{ width: 20, height: 20 }} />,
      link: "https://talent-spotify-templates.s3.ap-southeast-1.amazonaws.com/TimeLogin-Template_.csv",
    },
    {
      label: "Upload",
      icon: <CloudUpload sx={{ width: 20, height: 20 }} />,
      isUpload: true,
    },
  ];

  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [selectedSwitch, setSelectedSwitch] = useState("manual");
  const [loading, setLoading] = useState(false);
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  // Generate week days with dates
  const generateWeekDays = (customStartDate) => {
    // Always derive the weekday name from the actual date to avoid
    // mismatches (e.g. 07 Dec 2025 showing as Saturday instead of Sunday)
    const start = customStartDate ? new Date(customStartDate) : new Date(currentWeek.startDate);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      const dayName = date.toLocaleDateString("en-US", {
        weekday: "long",
      });

      return {
        id: index + 1,
        day: dayName,
        date: date,
        dateString: date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        timeIn: "",
        timeOut: "",
        hours: "0hr 0m",
        source: "Manual",
        method: "manual",
        remarks: "",
        reason: "",
        status: "pending",
      };
    });
  };

  const [weekDays, setWeekDays] = useState(generateWeekDays(startDate));
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);

  // Recalculate hours for all days that have both timeIn and timeOut
  // This ensures hours are calculated even when timeIn/timeOut are already present
  useEffect(() => {
    setWeekDays(prev => {
      let hasChanges = false;
      const updated = prev.map(day => {
        if (day.timeIn && day.timeOut) {
          const calculatedHours = calculateHours(day.timeIn, day.timeOut);
          // Update if hours are not calculated or are incorrect
          if (day.hours === "0hr 0m" || (calculatedHours !== "0hr 0m" && day.hours !== calculatedHours)) {
            hasChanges = true;
            return { ...day, hours: calculatedHours };
          }
        } else if (!day.timeIn || !day.timeOut) {
          // Reset hours if either time is missing
          if (day.hours !== "0hr 0m") {
            hasChanges = true;
            return { ...day, hours: "0hr 0m" };
          }
        }
        return day;
      });
      return hasChanges ? updated : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekDays.map(d => d.timeIn).join(','), weekDays.map(d => d.timeOut).join(',')]); // Recalculate when timeIn or timeOut values change

  useEffect(() => {
    const fetchLeavesAndHolidays = async () => {
      try {
        const cid = companyId || getItemFromLocalStorage("companyId");
        const uid = userId || (getItemFromLocalStorage("user")?._id);
        if (!cid || !uid) return;

        // Fetch leaves
        const leavesResponse = await axios.get(`${appURL}/recruitment/leaves`, {
          params: { companyId: cid, empId: uid, currentUserId: uid, type: getSelectedTabType() }
        });

        // Fetch holidays
        const holidaysResponse = await axios.get(`${appURL}/getAllHolidays`, {
          params: { companyId: cid, empId: uid, type: getSelectedTabType() }
        });

        setLeaves(leavesResponse.data?.data?.data || []);
        setHolidays(holidaysResponse.data?.data || []);
      } catch (err) {
        console.error("Error fetching leaves and holidays:", err);
        setLeaves([]);
        setHolidays([]);
      }
    };
    fetchLeavesAndHolidays();
  }, [companyId, userId, startDate, endDate]);

  // Handle time input change
  const handleTimeChange = (dayId, field, value) => {
    setRowErrors(prev => ({ ...prev, [dayId]: false }));
    setWeekDays(prev => prev.map(day => {
      if (day.id === dayId) {
        const updatedDay = { ...day, [field]: value };

        // Recalculate hours if both times are set
        if (updatedDay.timeIn && updatedDay.timeOut && field !== 'hours') {
          updatedDay.hours = calculateHours(updatedDay.timeIn, updatedDay.timeOut);
        } else if (!updatedDay.timeIn || !updatedDay.timeOut) {
          // Reset hours if either time is cleared
          updatedDay.hours = "0hr 0m";
        }

        return updatedDay;
      }
      return day;
    }));
  };

  // Handle time input focus - set default AM for Time In, PM for Time Out
  const handleTimeFocus = (dayId, field) => {
    setWeekDays(prev => prev.map(day => {
      if (day.id === dayId && !day[field]) {
        // Time In defaults to 09:00 (9 AM)
        if (field === 'timeIn') {
          return { ...day, timeIn: '09:00' };
        }
        // Time Out defaults to 17:00 (5 PM)
        if (field === 'timeOut') {
          return { ...day, timeOut: '17:00' };
        }
      }
      return day;
    }));
  };

  // Add a handler for remarks change
  const handleRemarkChange = (dayId, value) => {
    setRowErrors(prev => ({ ...prev, [dayId]: false }));
    setWeekDays(prev => prev.map(day => day.id === dayId ? { ...day, remarks: value } : day));
  };

  // Handle reset for timeIn and timeOut
  const handleResetTime = (dayId) => {
    setRowErrors(prev => ({ ...prev, [dayId]: false }));
    setWeekDays(prev => prev.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          timeIn: "",
          timeOut: "",
          hours: "0hr 0m"
        };
      }
      return day;
    }));
  };

  // Add error state for validation
  const [rowErrors, setRowErrors] = useState({});

  // Submit time entries
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Filter out days with valid time entries
      const validEntries = weekDays.filter(day =>
        (day.timeIn && day.timeOut) || day.remarks && (day.timeIn !== "" && day.timeOut !== "") || day.remarks !== ""
      );

      if (validEntries.length === 0) {
        Toast({
          message: 'Please add at least one time entry (with remarks) before submitting.',
          type: "error",
        });
        return;
      }

      const submissionPromises = validEntries.map(day => {
        // Convert hours string to decimal, rounded to 2 places
        const hoursMatch = day.hours.match(/(\d+)hr\s*(\d+)m/);
        const rawHours = hoursMatch ? parseInt(hoursMatch[1]) + (parseInt(hoursMatch[2]) / 60) : 0;
        const hours = Math.round(rawHours * 100) / 100;

        // Ensure timeIn and timeOut are in HH:mm:ss format
        const formatTime = (time) => time && time.length === 5 ? `${time}:00` : time;
        const timeInFormatted = formatTime(day.timeIn);
        const timeOutFormatted = formatTime(day.timeOut);

        const entryData = {
          companyId: companyId,
          userId: userId,
          day: day.day,
          date: day.date,
          dateString: day.dateString,
          timeIn: timeInFormatted,
          timeOut: timeOutFormatted,
          hours: hours,
          method: day.method,
          remarks: day.remarks,
          reason: day.reason || 'Weekly time entry'
        };

        return createTimeTrackingEntry(entryData);
      });

      await Promise.all(submissionPromises);

      Toast({
        message: `Successfully submitted ${validEntries.length} time entries for approval.`,
        type: "success",
      });

      // Notify parent component
      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }

    } catch (err) {
      console.error('Error submitting time entries:', err);
      Toast({
        message: err.message || 'Failed to submit time entries. Please try again.',
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Cancel and reset
  const handleCancel = () => {
    setWeekDays(generateWeekDays(startDate));
  };

  // Filter data based on search and filters
  const filteredData = weekDays.filter(day => {
    const matchesSearch = searchTerm === "" ||
      day.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
      day.dateString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      day.source.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || day.status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });


  // Helper: check if a day is a leave day
  const isLeaveDay = (date) => {
    return leaves.some(leave => {
      if (!leave.absenceType || !leave.from || !leave.to) return false;

      if (!/leave/i.test(leave.absenceType)) return false;
      const from = new Date(leave.from);
      const to = new Date(leave.to);

      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const f = new Date(from.getFullYear(), from.getMonth(), from.getDate());
      const t = new Date(to.getFullYear(), to.getMonth(), to.getDate());
      return d >= f && d <= t;
    });
  };

  // Helper: check if a date already has a time entry with approved or pending status
  const hasExistingTimeEntry = (dateOrString) => {
    if (!timeEntries || timeEntries.length === 0) return false;

    // Convert dateOrString to Date object for comparison
    let targetDate;
    if (dateOrString instanceof Date) {
      targetDate = dateOrString;
    } else if (typeof dateOrString === 'string') {
      // Parse the dateString
      const parsedDate = moment(dateOrString, ["DD MMM YYYY", "MM/DD/YYYY", "YYYY-MM-DD", moment.ISO_8601], true);
      if (!parsedDate.isValid()) {
        return false; // Invalid date string
      }
      targetDate = parsedDate.toDate();
    } else {
      return false; // Invalid input
    }

    // Normalize target date to compare only date part (ignore time)
    const targetDateNormalized = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    // Check if any time entry matches this date AND has approved or pending status
    return timeEntries.some(entry => {
      if (!entry?.dateString) return false;

      // Only consider approved or pending entries
      const status = entry?.status?.toLowerCase();
      if (status !== 'approved' && status !== 'pending') return false;

      // Parse the entry's dateString
      const entryDate = moment(entry.dateString, ["DD MMM YYYY", "MM/DD/YYYY", "YYYY-MM-DD", moment.ISO_8601], true);
      if (!entryDate.isValid()) return false;

      // Normalize entry date to compare only date part (ignore time)
      const entryDateObj = entryDate.toDate();
      const entryDateNormalized = new Date(entryDateObj.getFullYear(), entryDateObj.getMonth(), entryDateObj.getDate());

      // Compare normalized dates
      return targetDateNormalized.getTime() === entryDateNormalized.getTime();
    });
  };

  // Helper: check if a date should be disabled (has existing time entry with approved or pending status, or is a holiday/leave)
  const isDateDisabled = (dateOrString) => {
    // Check for existing time entry
    if (hasExistingTimeEntry(dateOrString)) {
      return true;
    }


    let targetDate;
    if (dateOrString instanceof Date) {
      targetDate = dateOrString;
    } else if (typeof dateOrString === 'string') {
      // Parse the dateString
      const parsedDate = moment(dateOrString, ["DD MMM YYYY", "MM/DD/YYYY", "YYYY-MM-DD", moment.ISO_8601], true);
      if (!parsedDate.isValid()) {
        return false; // Invalid date string
      }
      targetDate = parsedDate.toDate();
    } else {
      return false; // Invalid input
    }

    // Check if it's a leave day or holiday
    return isLeaveDay(targetDate) || isHolidayDay(targetDate);
  };

  // Helper: get the reason why a date is disabled
  const getDateDisabledReason = (dateOrString) => {
    // Check for existing time entry first
    if (hasExistingTimeEntry(dateOrString)) {
      return 'Time entry already exists for this date';
    }

    // Convert dateOrString to Date object for holiday/leave checks
    let targetDate;
    if (dateOrString instanceof Date) {
      targetDate = dateOrString;
    } else if (typeof dateOrString === 'string') {
      // Parse the dateString
      const parsedDate = moment(dateOrString, ["DD MMM YYYY", "MM/DD/YYYY", "YYYY-MM-DD", moment.ISO_8601], true);
      if (!parsedDate.isValid()) {
        return ''; // Invalid date string
      }
      targetDate = parsedDate.toDate();
    } else {
      return ''; // Invalid input
    }

    // Check if it's a leave day or holiday
    if (isLeaveDay(targetDate)) {
      return 'Time entry not allowed on leave days';
    }
    if (isHolidayDay(targetDate)) {
      return 'Time entry not allowed on holidays';
    }

    return '';
  };

  // Helper: check if a day is a holiday
  const isHolidayDay = (date) => {
    return holidays.some(holiday => {
      if (!holiday.fromDate || !holiday.toDate) return false;

      const holidayStart = new Date(holiday.fromDate);
      const holidayEnd = new Date(holiday.toDate);

      // Normalize dates to ignore time
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const start = new Date(holidayStart.getFullYear(), holidayStart.getMonth(), holidayStart.getDate());
      const end = new Date(holidayEnd.getFullYear(), holidayEnd.getMonth(), holidayEnd.getDate());

      // Check if date falls within the range (inclusive)
      return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
    });
  };

  // Helper: get the type of day (leave, holiday, or normal)
  const getDayType = (date) => {
    if (isLeaveDay(date)) return 'leave';
    if (isHolidayDay(date)) return 'holiday';
    return 'normal';
  };

  // Helper: get background color for day type
  const getDayBackgroundColor = (date) => {
    const dayType = getDayType(date);
    switch (dayType) {
      case 'leave':
        return '#ffeaea'; // Light red for leaves
      case 'holiday':
        return '#fff3e0'; // Light orange for holidays
      default:
        return undefined;
    }
  };

  // Helper: get hover background color for day type
  const getDayHoverBackgroundColor = (date) => {
    const dayType = getDayType(date);
    switch (dayType) {
      case 'leave':
        return '#ffd6d6'; // Darker red for hover
      case 'holiday':
        return '#ffe0b2'; // Darker orange for hover
      default:
        return '#f5f5f5';
    }
  };

  return (
    <Box
      sx={{
        margin: isMobile ? "1rem .5rem" : "1rem",
        bgcolor: "#fff",
        padding: isMobile ? "10px" : "2rem",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      {/* Switch Button */}
      <CustomSwitchButton
        iconExists={false}
        options={[
          { label: "Manual / Bio", value: "manual" },
          { label: "Geo", value: "geo" },
        ]}
        activeOption={selectedSwitch}
        onChange={(value) => {
          setSelectedSwitch(value);
          if (value === "manual") {
            // Stay on current page
          } else if (value === "geo") {
            history.push("/admin/previlages/time-history");
          }
        }}
      />

      {/* Responsive: Mobile/Tablet Card View */}
      {(isMobile || isTablet) ? (
        <Box>
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 600, color: "#837F39", mb: 2, textAlign: "center" }}>
            Weekly Time Card
          </Typography>
          <Typography sx={{ fontSize: "0.95rem", color: "#555", textAlign: "center", mb: 2 }}>
            {moment(startDate).format("DD MMM YYYY")} - {moment(endDate).format("DD MMM YYYY")}
          </Typography>
          {/* Template Buttons always visible on mobile/tablet */}
          { /*  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <TemplateButtons buttons={buttons} companyId={companyId} userId={userId} fetchTimeEntries={fetchTimeEntries} />
          </Box> */}
          <Stack spacing={2}>
            {filteredData.map((day) => (
              <Paper key={day.id} sx={{ p: 2, borderRadius: 2, boxShadow: 1, backgroundColor: getDayBackgroundColor(day.date) }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{day.day}</Typography>
                    {getDayType(day.date) !== 'normal' && (
                      <Chip
                        label={getDayType(day.date) === 'leave' ? 'Leave' : 'Holiday'}
                        size="small"
                        sx={{
                          backgroundColor: getDayType(day.date) === 'leave' ? '#ffcdd2' : '#ffcc80',
                          color: getDayType(day.date) === 'leave' ? '#c62828' : '#e65100',
                          fontSize: '10px',
                          height: '20px'
                        }}
                      />
                    )}
                  </Box>
                  <Typography sx={{ fontSize: "0.9rem", color: "#837F39" }}>{day.dateString}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} mb={1} alignItems="center">
                  <TextField
                    variant="outlined"
                    id={`timeIn-${day.id}`}
                    type="time"
                    label="Time In"
                    value={day.timeIn}
                    onChange={(e) => handleTimeChange(day.id, 'timeIn', e.target.value)}
                    onFocus={() => handleTimeFocus(day.id, 'timeIn')}
                    size="small"
                    disabled={isDateDisabled(day.dateString) || !canEdit()}
                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { height: '36px', fontSize: '14px' } }}
                  />
                  <TextField
                    variant="outlined"
                    id={`timeOut-${day.id}`}
                    type="time"
                    label="Time Out"
                    value={day.timeOut}
                    onChange={(e) => handleTimeChange(day.id, 'timeOut', e.target.value)}
                    onFocus={() => handleTimeFocus(day.id, 'timeOut')}
                    size="small"
                    disabled={isDateDisabled(day.dateString) || !canEdit()}
                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { height: '36px', fontSize: '14px' } }}
                  />
                  {(day.timeIn || day.timeOut) && !isDateDisabled(day.dateString) && canEdit() && (
                    <IconButton
                      size="small"
                      onClick={() => handleResetTime(day.id)}
                      sx={{
                        color: '#837F39',
                        '&:hover': { backgroundColor: '#837F3920' },
                        padding: '8px'
                      }}
                      title="Reset Time In/Out"
                    >
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
                <Typography sx={{ fontSize: '0.95rem', color: '#555', mb: 1 }}>
                  Hours: <b>{day.hours}</b> | Source: <b>{day.source}</b>
                </Typography>
                {isDateDisabled(day.dateString) && (
                  <Typography sx={{ fontSize: '0.85rem', color: '#d32f2f', mb: 1, fontStyle: 'italic' }}>
                    {getDateDisabledReason(day.dateString)}
                  </Typography>
                )}
                {canEdit() && (
                  <Button
                    fullWidth
                    variant={day.timeIn && day.timeOut ? 'contained' : 'outlined'}
                    onClick={() => {
                      const timeInInput = document.querySelector(`#timeIn-${day.id}`);
                      if (timeInInput) timeInInput.focus();
                    }}
                    disabled={isDateDisabled(day.dateString) || (day.timeIn && day.timeOut)}
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      border: '1px solid #837F39',
                      color: day.timeIn && day.timeOut ? '#fff' : '#837F39',
                      backgroundColor: day.timeIn && day.timeOut ? '#837F39' : '#fff',
                      fontSize: '14px',
                      minHeight: '36px',
                      mb: 1,
                      '&:hover': {
                        backgroundColor: '#837F39',
                        color: 'white'
                      },
                      '&:disabled': {
                        border: '1px solid #ccc',
                        color: '#999',
                        backgroundColor: '#eee'
                      }
                    }}
                  >
                    {day.timeIn && day.timeOut ? 'Added' : 'Add +'}
                  </Button>
                )}
              </Paper>
            ))}
          </Stack>
          {/* Footer & Actions */}
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ color: "#666", fontWeight: 400, fontSize: "13px", mb: 2, textAlign: "center" }}>
              All entries are reviewed by management.
            </Typography>
            <Stack spacing={1} direction="column">
              <Button
                onClick={handleCancel}
                variant="outlined"
                sx={{ color: "#666", borderColor: "#ddd", fontWeight: 500, borderRadius: "8px", textTransform: "none", minWidth: "100px" }}
                disabled={loading}
                fullWidth
              >
                Cancel
              </Button>
              {canEdit() && (
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{ backgroundColor: "#6B7A3F", color: "#FFFFFF", fontWeight: 500, borderRadius: "8px", textTransform: "none", minWidth: "100px", '&:hover': { backgroundColor: "#5a6535" } }}
                  disabled={loading || parentLoading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
                </Button>
              )}
            </Stack>
          </Box>
        </Box>
      ) : (
        <>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            mb: 2, // optional margin bottom
          }}>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#837F39",
              }}
            >
              Weekly Time Card
            </Typography>

            {/*   <TemplateButtons buttons={buttons} companyId={companyId} userId={userId} fetchTimeEntries={fetchTimeEntries} /> */}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
            <Typography
              sx={{
                fontSize: "0.875rem",
                mt: 1,
                fontWeight: 400,
                color: "#555",
              }}
            >
              Week: {moment(startDate).format("DD MMM YYYY")}  Start
            </Typography>

            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: 400,
                mt: 1,
                color: "#555",
              }}
            >
              Week: {moment(endDate).format("DD MMM YYYY")} End
            </Typography>
            {/* Data Table */}
            {/* Single Date Picker for Week Selection - styled and compact */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 1 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #827e39',
                borderRadius: '2rem',
                background: '#fff',
                px: 2,
                py: 0.5,
                minHeight: 40,
              }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={startDate}
                    onChange={(date) => {
                      if (date) {
                        setStartDate(date);
                        const newEnd = new Date(date);
                        newEnd.setDate(newEnd.getDate() + 6);
                        setEndDate(newEnd);
                      }
                    }}
                    inputFormat="dd-MM-yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        sx={{
                          minWidth: 130,
                          background: '#fff',
                          borderRadius: '2rem',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '2rem',
                            fontWeight: 600,
                            fontSize: 16,
                            color: '#222',
                            borderColor: 'transparent',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                          },
                          mx: 1
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>

            </Box>
            <TableContainer component={Paper} sx={{ boxShadow: 'none', mt: 1, border: '1px solid #827e39', borderRadius: '.5rem' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#333', padding: '16px' }}>Day</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', padding: '16px' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', padding: '16px' }}>Time In</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', padding: '16px' }}>Time Out</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', padding: '16px' }}>Hours</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', padding: '16px' }}>Source</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', padding: '16px' }}>Remarks</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#333', padding: '16px', textAlign: 'center' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((day) => (
                    <TableRow
                      key={day.id}
                      sx={{
                        backgroundColor: getDayBackgroundColor(day.date),
                        '&:hover': { backgroundColor: getDayHoverBackgroundColor(day.date) },
                        borderBottom: '1px solid #e0e0e0'
                      }}
                    >
                      <TableCell sx={{ padding: '16px', color: '#666' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{day.day}</span>
                          {getDayType(day.date) !== 'normal' && (
                            <Chip
                              label={getDayType(day.date) === 'leave' ? 'Leave' : 'Holiday'}
                              size="small"
                              sx={{
                                backgroundColor: getDayType(day.date) === 'leave' ? '#ffcdd2' : '#ffcc80',
                                color: getDayType(day.date) === 'leave' ? '#c62828' : '#e65100',
                                fontSize: '10px',
                                height: '20px'
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: '16px', color: '#666' }}>{day.dateString}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TextField
                            id={`timeIn-${day.id}`}
                            type="time"
                            value={day.timeIn}
                            onChange={(e) => handleTimeChange(day.id, 'timeIn', e.target.value)}
                            onFocus={() => handleTimeFocus(day.id, 'timeIn')}
                            size="small"
                            placeholder="00:00"
                            disabled={isDateDisabled(day.dateString) || !canEdit()}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                height: '32px',
                                fontSize: '14px',
                                width: '100px'
                              }
                            }}
                          />
                          {(day.timeIn || day.timeOut) && !isDateDisabled(day.dateString) && canEdit() && (
                            <IconButton
                              size="small"
                              onClick={() => handleResetTime(day.id)}
                              sx={{
                                color: '#837F39',
                                padding: '4px',
                                '&:hover': { backgroundColor: '#837F3920' }
                              }}
                              title="Reset Time In/Out"
                            >
                              <RefreshIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: '16px' }}>
                        <TextField
                          id={`timeOut-${day.id}`}
                          type="time"
                          value={day.timeOut}
                          onChange={(e) => handleTimeChange(day.id, 'timeOut', e.target.value)}
                          onFocus={() => handleTimeFocus(day.id, 'timeOut')}
                          size="small"
                          placeholder="00:00"
                          disabled={isDateDisabled(day.dateString) || !canEdit()}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: '32px',
                              fontSize: '14px',
                              width: '100px'
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: '16px', color: '#666' }}>{day.hours}</TableCell>
                      <TableCell sx={{ padding: '16px', color: '#666' }}>{day.source}</TableCell>
                      <TableCell sx={{ padding: '16px', color: '#666' }}>
                        <InputTextComponent
                          noMargin={true}
                          id={`remarks-${day.id}`}
                          value={day.remarks}
                          onChange={e => handleRemarkChange(day.id, e.target.value)}
                          placeholder="Enter remarks"
                          fullWidth={false}
                          disabled={isDateDisabled(day.dateString) || !canEdit()}
                          sx={{ minWidth: 120, fontSize: '14px', borderRadius: '8px', marginBottom: '0px !important' }}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: '16px', textAlign: 'center' }}>
                        {isDateDisabled(day.dateString) ? (
                          <Typography sx={{ fontSize: '0.75rem', color: '#d32f2f', fontStyle: 'italic' }}>
                            {getDateDisabledReason(day.dateString)}
                          </Typography>
                        ) : canEdit() ? (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              // Validate: require (timeIn && timeOut) OR remarks
                              if (!((day.timeIn && day.timeOut) || day.remarks)) {
                                setRowErrors(prev => ({ ...prev, [day.id]: true }));
                                Toast({ message: 'Enter Time In & Time Out or Remarks!', type: 'error' });
                                return;
                              }
                              setRowErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors[day.id];
                                return newErrors;
                              });
                              // Clear the fields for this row
                              setWeekDays(prev => prev.map(d =>
                                d.id === day.id ? { ...d, timeIn: '', timeOut: '', remarks: '' } : d
                              ));
                            }}
                            disabled={((day.timeIn && day.timeOut) || day.remarks)}
                            sx={{
                              borderRadius: '20px',
                              textTransform: 'none',
                              border: '1px solid #837F39',
                              color: ((day.timeIn && day.timeOut) || day.remarks) ? '#fff' : '#837F39',
                              fontSize: '12px',
                              minWidth: '70px',
                              height: '28px',
                              backgroundColor: ((day.timeIn && day.timeOut) || day.remarks) ? '#837F39' : '#fff',
                              '&:hover': {
                                backgroundColor: '#837F39',
                                color: 'white'
                              },
                              '&:disabled': {
                                border: '1px solid #ccc',
                                color: '#999',
                                backgroundColor: '#eee'
                              }
                            }}
                          >
                            {((day.timeIn && day.timeOut) || day.remarks) ? 'Added' : 'Add +'}
                          </Button>
                        ) : null}
                        {rowErrors[day.id] && (
                          <Typography sx={{ color: 'red', fontSize: 12, mt: 0.5 }}>Time In & Time Out or Remarks required</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Add Submit button below the table for bigger screens */}
            {canEdit() && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{ backgroundColor: '#827e39', color: '#FFFFFF', fontWeight: 500, borderRadius: '8px', textTransform: 'none', minWidth: '120px', '&:hover': { backgroundColor: '#5a6535' } }}
                  disabled={loading || parentLoading}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
                </Button>
              </Box>
            )}
          </Box>
        </>
      )}


    </Box>
  );
};

export default WeeklyTimeCard;



