import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  parseISO,
  isBefore,
  isAfter,
  isSameDay,
  isSameYear,
} from "date-fns";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
const defaultColors = [
  { label: "Green", value: "#a2e3c4" },
  { label: "Yellow", value: "#f3c552" },
  { label: "Blue", value: "#90caf9" },
  { label: "Red", value: "#e51473" },
];

const EventCalendar = ({
  events = [],
  allowAdd = false,
  showToolbar = true,
  showLeftCalendar = true,
  customColors = defaultColors,
  onVisibleRangeChange,
}) => {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMiniDate, setSelectedMiniDate] = useState(null);
  const [viewMode, setViewMode] = useState("month");
  const [filterEmployee, setFilterEmployee] = useState("");
const {t} = useTranslation()

  useEffect(() => {
    if (!onVisibleRangeChange) return;

    let rangeStart;
    let rangeEnd;

    if (viewMode === "week") {
      rangeStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      rangeEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      rangeStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      rangeEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    }

    onVisibleRangeChange({
      startDate: format(rangeStart, "yyyy-MM-dd"),
      endDate: format(rangeEnd, "yyyy-MM-dd"),
      currentDate,
      viewMode,
    });
  }, [currentDate, viewMode, onVisibleRangeChange]);
  const handlePrevMonth = () =>
    setCurrentDate((prev) =>
      viewMode === "month"
        ? subMonths(startOfMonth(prev), 1)
        : subMonths(prev, 1)
    );
  const handleNextMonth = () =>
    setCurrentDate((prev) =>
      viewMode === "month"
        ? addMonths(startOfMonth(prev), 1)
        : addMonths(prev, 1)
    );

  // Handle date selection from mini calendar
  const handleMiniCalendarDateSelect = (date) => {
    setCurrentDate(date);
    setSelectedMiniDate(date);
  };

  // Filtered events for mini calendar
  const filteredEvents = filterEmployee
    ? events.filter((e) => e.employeeName === filterEmployee)
    : events;

  // Render Mini Calendar
  const renderMiniCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <Grid item xs={1.7} key={cloneDay * Math.random()}>
            <Box
              onClick={() => handleMiniCalendarDateSelect(cloneDay)}
              sx={{
                border: "1px solid #e0e0e0",
                height: 32,
                backgroundColor: isSameDay(cloneDay, selectedMiniDate)
                  ? "#85803c"
                  : isSameMonth(cloneDay, monthStart)
                  ? "#ffffff"
                  : "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.2s ease, transform 0.1s ease",
                "&:hover": {
                  backgroundColor: isSameDay(cloneDay, selectedMiniDate)
                    ? "#85803c"
                    : "#e8f0fe",
                  transform: "scale(1.05)",
                },
                borderRadius: "4px",
                boxShadow: isSameMonth(cloneDay, monthStart)
                  ? "0 1px 3px rgba(0,0,0,0.05)"
                  : "none",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isSameMonth(cloneDay, monthStart) ? 500 : 400,
                  color: isSameDay(cloneDay, selectedMiniDate)
                    ? "#fff"
                    : isSameMonth(cloneDay, monthStart)
                    ? "#333"
                    : "#999",
                  fontSize: "0.75rem",
                }}
              >
                {format(cloneDay, "d")}
              </Typography>
            </Box>
          </Grid>
        );
        day = addDays(day, 1);
      }
    }

    return (
      <Box
        sx={{
          width: 250,
          pr: 2,
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "12px",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        {/* Filter Dropdown */}
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="caption" sx={{ mr: 1, fontWeight: 600 }}>
            {t("AbsenceTime.EventCalender.filter")}
          </Typography>
          <Select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            size="small"
            displayEmpty
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">{t("AbsenceTime.TeamLeave.all")}</MenuItem>
            {[...new Set(events.map((e) => e.employeeName).filter(Boolean))].map((name) => (
              <MenuItem key={name} value={name}>{name}</MenuItem>
            ))}
          </Select>
        </Box>
        {/* Month/Year Navigation */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <IconButton size="small" onClick={handlePrevMonth}><ChevronLeftIcon /></IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {format(currentDate, "MMMM yyyy")}
          </Typography>
          <IconButton size="small" onClick={handleNextMonth}><ChevronRightIcon /></IconButton>
        </Box>
        <Grid container spacing={0}>
          {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
            <Grid item xs={1.7} key={day}>
              <Typography
                align="center"
                variant="caption"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "#666",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={1}>
          {days}
        </Grid>
      </Box>
    );
  };

  const renderGrid = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

    const startDate =
      viewMode === "month"
        ? startOfWeek(monthStart, { weekStartsOn: 1 })
        : weekStart;
    const endDate =
      viewMode === "month" ? endOfWeek(monthEnd, { weekStartsOn: 1 }) : weekEnd;

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = filteredEvents.filter((e) => {
          try {
            const start = parseISO(e.start);
            const end = parseISO(e.end);
            return (
              isSameDay(cloneDay, start) ||
              isSameDay(cloneDay, end) ||
              (isAfter(cloneDay, start) && isBefore(cloneDay, end))
            );
          } catch (error) {
            console.error("Error parsing event dates:", e, error);
            return false;
          }
        });

        days.push(
          <Grid item xs={12} sm={1.7} key={cloneDay}>
            <Box
              sx={{
                overflow: "auto",
                border: "1px solid #ddd",
                height: viewMode === "month" ? 100 : 500,
                backgroundColor:
                  viewMode === "month"
                    ? isSameMonth(cloneDay, monthStart)
                      ? "#fff"
                      : "#f3f3f3"
                    : "#fff",
                padding: 1,
                position: "relative",
                cursor: dayEvents.length ? "pointer" : "default",
                transition: "box-shadow 0.2s",
                boxShadow: dayEvents.length ? "0 2px 8px rgba(133,128,60,0.08)" : "none",
                '&:hover': dayEvents.length ? { boxShadow: "0 4px 16px rgba(133,128,60,0.18)" } : {},
              }}
            >
              <Typography variant="caption" fontWeight={500}>
                {format(cloneDay, "d")}
              </Typography>
              {dayEvents.map((event, idx) => (
                <Tooltip
                  key={idx}
                  title={event.type === "leave"
                    ? `${event.employeeName ? event.employeeName + " - " : ""}${event.absenceType}`
                    : event.title}
                  arrow
                  placement="top"
                >
                  <Box
                    sx={{
                      backgroundColor: event.color || "#a2e3c4",
                      color: "#222",
                      fontSize: 12,
                      px: 0.5,
                      py: event.halfDay ? 0.1 : 0.2,
                      borderRadius: 1,
                      mt: 1,
                      mb: 0.5,
                      fontWeight: 600,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                      transition: "background 0.2s, color 0.2s",
                      '&:hover': {
                        backgroundColor: event.type === "leave" ? "#f3c552" : "#e57373",
                        color: "#000",
                      },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {event.type === "leave"
                      ? <><span style={{ fontWeight: 700 }}>{event.employeeName}</span>{event.employeeName ? " - " : ""}{event.absenceType}</>
                      : <span style={{ fontWeight: 700 }}>{event.title}</span>}
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Grid>
        );

        day = addDays(day, 1);
      }
      if (viewMode === "week") break;
    }
    return days;
  };

  const getWeekRange = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const startFormat = isSameMonth(weekStart, weekEnd)
      ? "d"
      : isSameYear(weekStart, weekEnd)
      ? "d MMM"
      : "d MMM yyyy";
    const endFormat = "d MMM yyyy";
    return `${format(weekStart, startFormat)} - ${format(weekEnd, endFormat)}`;
  };

  return (
    <Box
      display="flex"
      sx={{
        borderTop: "1px solid #85803c",
      }}
    >
      {showLeftCalendar && renderMiniCalendar()}

      <Box
        flex={1}
        sx={{
          borderLeft: "1px solid #85803c",
        }}
      >
        {showToolbar && (
          <Box display="flex" alignItems="center" mt={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton onClick={handlePrevMonth}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6">
                {viewMode === "week"
                  ? getWeekRange()
                  : format(currentDate, "MMMM yyyy")}
              </Typography>
              <IconButton onClick={handleNextMonth}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
            <Select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              size="small"
            >
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="week">Week</MenuItem>
            </Select>
          </Box>
        )}

        <Grid container spacing={0}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <Grid item xs={12} sm={1.7} key={day}>
              <Typography align="center" variant="subtitle2" sx={{ mb: 1 }}>
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={0}>
          {renderGrid()}
        </Grid>
      </Box>
    </Box>
  );
};

export default EventCalendar;
