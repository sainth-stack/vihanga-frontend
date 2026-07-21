import React, { useState, useMemo, useEffect } from "react";
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
  isSameDay,
  parseISO,
  isSameYear,
  isAfter,
  isBefore,
} from "date-fns";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Tooltip from "@mui/material/Tooltip"; 

const TasksCalendar = ({
  tasks = [],
  viewMode: initialViewMode = "month",
  showEditPopup,
  setOrderModalShow,
  selectedDate = new Date(),
  onDateChange,
  showLeftCalendar = true,
  showToolbar = true,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [selectedMiniDate, setSelectedMiniDate] = useState(null);
  const [viewMode, setViewMode] = useState(initialViewMode);

  // Keep internal date in sync if parent changes selectedDate
  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  // Notify parent when date changes
  useEffect(() => {
    if (onDateChange) {
      onDateChange(currentDate);
    }
  }, [currentDate, onDateChange]);

  const events = useMemo(() => {
    return tasks.map((item) => ({
      id: item.id,
      start: parseISO(item.startDate || new Date().toISOString()),
      end: parseISO(item.dueDate || new Date().toISOString()),
      title: `${item.title}${item.owner ? ` - ${item.owner}` : ""}`,
      color:
        item.status === "completed"
          ? "#2A7A7B"
          : item.status === "inprogress"
          ? "orange"
          : "#FF0000",
    }));
  }, [tasks]);

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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
          sx={{
            borderBottom: "1px solid #eee",
            pb: 1,
          }}
        >
          <IconButton size="small" onClick={handlePrevMonth}><ChevronLeftIcon /></IconButton>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#444",
              letterSpacing: "0.5px",
            }}
          >

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
        const dayEvents = events.filter((e) => {
          try {
            const start = e.start;
            const end = e.end;
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
              }}
              onClick={() => {
                setOrderModalShow(true);
                showEditPopup(false);
                setCurrentDate(cloneDay);
              }}
            >
              <Typography variant="caption" fontWeight={500}>
                {format(cloneDay, "d")}
              </Typography>
              {dayEvents.map((event, idx) => (
                <Box
                  key={idx}
                  sx={{
                    backgroundColor: event.color || "#2A7A7B",
                    color: "#fff",
                    fontSize: 12,
                    px: 0.5,
                    py: 0.2,
                    borderRadius: 1,
                    mt: 1,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    showEditPopup(event.id);
                  }}
                >
                  {event.title}
                </Box>
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
        mt: 3,
      }}
    >
 {showLeftCalendar && renderMiniCalendar()}
      <Box
        flex={1}
        sx={{
          borderLeft: "1px solid #85803c",
        }}
      >
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

        <Grid container spacing={0}mt={1}>
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

export default TasksCalendar;