// CalendarView.jsx
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import "./calendarStyles.css";

const CalendarView = ({
  initialView = "dayGridMonth",
  onEventClick,
  onDateChange,
  showLeftCalendar = false,
  events: propEvents = [],
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());
  const [localEvents, setLocalEvents] = useState([]);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start: null,
    end: null,
  });

  // Sync external events to local state if passed
  useEffect(() => {
    setLocalEvents(propEvents);
  }, [propEvents]);

  const handlePrev = (calendar) => {
    const newDate = new Date(
      calendar === "main" ? currentDate : miniCalendarDate
    );
    newDate.setMonth(newDate.getMonth() - 1);
    calendar === "main"
      ? setCurrentDate(newDate)
      : setMiniCalendarDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };

  const handleNext = (calendar) => {
    const newDate = new Date(
      calendar === "main" ? currentDate : miniCalendarDate
    );
    newDate.setMonth(newDate.getMonth() + 1);
    calendar === "main"
      ? setCurrentDate(newDate)
      : setMiniCalendarDate(newDate);
    if (onDateChange) onDateChange(newDate);
  };

  const handleMiniCalendarDateChange = (date) => {
    setMiniCalendarDate(date);
    setCurrentDate(date);
    if (onDateChange) onDateChange(date);
  };

  const handleDateClick = (info) => {
    const clickedDate = new Date(info.date);
    setNewEvent({
      title: "",
      description: "",
      start: clickedDate,
      end: new Date(clickedDate.getTime() + 24 * 60 * 60 * 1000),
    });
    setOpenEventDialog(true);
  };

  const handleEventSubmit = () => {
    if (!newEvent.title) return;

    const eventToAdd = {
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      backgroundColor: getRandomColor(),
      extendedProps: {
        description: newEvent.description,
      },
    };

    setLocalEvents((prev) => [...prev, eventToAdd]);
    setOpenEventDialog(false);
    setNewEvent({ title: "", description: "", start: null, end: null });
  };

  const formatMonthYear = (date) =>
    date.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <Box sx={{ display: "flex", gap: 2, padding: 2 }}>
      {/* Mini Calendar */}
      {showLeftCalendar && (
        <Box
          sx={{
            width: "200px",
            border: "1px solid #ddd",
            borderRadius: 2,
            padding: 1,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <IconButton onClick={() => handlePrev("mini")}>
              <ArrowBackIos fontSize="small" />
            </IconButton>
            <Typography variant="h6">
              {formatMonthYear(miniCalendarDate)}
            </Typography>
            <IconButton onClick={() => handleNext("mini")}>
              <ArrowForwardIos fontSize="small" />
            </IconButton>
          </Box>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            initialDate={miniCalendarDate}
            headerToolbar={false}
            height="auto"
            events={[]} // No events in mini calendar
            dateClick={(info) => handleMiniCalendarDateChange(info.date)}
            dayCellClassNames={(arg) =>
              arg.date.toDateString() === currentDate.toDateString()
                ? "fc-day-selected"
                : ""
            }
          />
        </Box>
      )}

      {/* Main Calendar */}
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => handlePrev("main")}>
              <ArrowBackIos fontSize="small" />
            </IconButton>
            <Typography variant="h6">{formatMonthYear(currentDate)}</Typography>
            <IconButton onClick={() => handleNext("main")}>
              <ArrowForwardIos fontSize="small" />
            </IconButton>
            <Select size="small" value="Month">
              <MenuItem value="Month">Month</MenuItem>
            </Select>
          </Box>
        </Box>

        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView={initialView}
          initialDate={currentDate}
          events={localEvents}
          headerToolbar={false}
          height="auto"
          dateClick={handleDateClick}
          eventClick={(info) => onEventClick?.(info.event)}
          eventDisplay="block"
          eventContent={(eventInfo) => renderEventContent(eventInfo)}
        />
      </Box>

      {/* Event Dialog */}
      <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            fullWidth
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Date"
            fullWidth
            disabled
            value={newEvent.start ? formatDate(newEvent.start) : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEventDialog(false)}>Cancel</Button>
          <Button onClick={handleEventSubmit} disabled={!newEvent.title}>
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

function renderEventContent(eventInfo) {
  const styles = {
    backgroundColor: eventInfo.event.backgroundColor || "lightgreen",
    color: "#000",
    border: "none",
  };

  return (
    <Box
      sx={{
        ...styles,
        padding: "2px 6px",
        borderRadius: 1,
        fontSize: "12px",
        overflow: "hidden",
        whiteSpace: "normal",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="caption" fontWeight="bold">
        {eventInfo.event.title}
      </Typography>
      {eventInfo.event.extendedProps?.description && (
        <Typography variant="caption">
          {eventInfo.event.extendedProps.description}
        </Typography>
      )}
      <Typography variant="caption">
        {formatDate(eventInfo.event.start)} - {formatDate(eventInfo.event.end)}
      </Typography>
    </Box>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getRandomColor() {
  const colors = [
    "#FFB6C1",
    "#FFD700",
    "#ADFF2F",
    "#40E0D0",
    "#87CEFA",
    "#FFA07A",
    "#DA70D6",
    "#00FA9A",
    "#FF69B4",
    "#B0C4DE",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default CalendarView;
