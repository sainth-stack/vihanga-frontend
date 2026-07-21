import React, { useState, useEffect } from "react";
import { Button, Popover, Box, GlobalStyles } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import { DateRange } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DateFilterButton = ({ 
  onApply, 
  buttonText = "Filter Date",
  initialStartDate = null,
  initialEndDate = null,
  disabled = false
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [range, setRange] = useState([
    {
      startDate: initialStartDate ? new Date(initialStartDate) : new Date(),
      endDate: initialEndDate ? new Date(initialEndDate) : new Date(),
      key: "selection",
    },
  ]);

  // Update range when initial dates change
  useEffect(() => {
    if (initialStartDate || initialEndDate) {
      setRange([
        {
          startDate: initialStartDate ? new Date(initialStartDate) : new Date(),
          endDate: initialEndDate ? new Date(initialEndDate) : new Date(),
          key: "selection",
        },
      ]);
    }
  }, [initialStartDate, initialEndDate]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Helper function to format date as YYYY-MM-DD in local timezone
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      {/* Custom global styles */}
      <GlobalStyles
        styles={{
          ".rdrMonthAndYearWrapper": {
            justifyContent: "space-between",
            padding: "0 8px",
          },
          ".rdrMonthAndYearWrapper button": {
            background: "none",
            border: "none",
            fontSize: "18px",
            color: "#8a884c",
            cursor: "pointer",
            padding: "2px 6px",
          },
          ".rdrMonthAndYearPickers select": {
            color: "#8a884c",
            fontSize: "12px",
            fontWeight: 500,
            border: "1px solid #cfcba3",
            borderRadius: "4px",
            padding: "2px 6px",
            margin: "0 2px",
          },
          ".rdrCalendarWrapper": {
            display: "flex",
            gap: "12px",
            borderRadius: "10.54px",
            border: "0.5px solid #cfcba3",
            padding: "8px",
            backgroundColor: "#fff",
          },
          ".rdrMonth": {
            border: "none",
            borderRadius: "8px",
            padding: "6px",
            width: "100%",
          },
          ".rdrDateInputWrapper": {
            marginBottom: "6px",
          },
          ".rdrDateInput input": {
            border: "1px solid #cfcba3",
            borderRadius: "4px",
            padding: "6px",
            fontSize: "12px",
            color: "#333",
          },
          ".rdrDateInput input:focus": {
            outline: "none",
            borderColor: "#8a884c",
          },
          ".rdrDaySelected, .rdrDayStartPreview, .rdrDayEndPreview": {
            backgroundColor: "#B79B6C !important",
            color: "white !important",
          },
          ".rdrDayInRange": {
            backgroundColor: "rgba(183, 155, 108, 0.2) !important",
          },
          ".rdrDayToday .rdrDayNumber span:after": {
            background: "#8a884c",
          },
          ".rdrDay:hover": {
            backgroundColor: "rgba(183, 155, 108, 0.1) !important",
          },
          ".rdrWeekDay": {
            color: "#8a884c",
            fontWeight: 600,
            fontSize: "12px",
          },
          ".rdrDayNumber": {
            fontSize: "13px",
          },
          ".rdrDayNumber span": {
            fontSize: "13px",
          },
        }}
      />

      <Button
        variant="outlined"
        startIcon={<CalendarToday />}
        onClick={handleClick}
        disabled={disabled}
        sx={{
          borderColor: 'rgb(153, 150, 94)',
          color: 'rgb(153, 150, 94)',
          '&:hover': {
            borderColor: 'rgb(153, 150, 94)',
            backgroundColor: 'rgba(153, 150, 94, 0.1)',
          },
          '&:disabled': {
            borderColor: 'rgba(153, 150, 94, 0.5)',
            color: 'rgba(153, 150, 94, 0.5)',
          }
        }}
      >
        {buttonText}
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            width: "580px",
            maxWidth: "90vw",
            padding: "12px",
            borderRadius: "10.54px",
            border: "0.5px solid #cfcba3",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            overflow: "visible",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={range}
            rangeColors={["#B79B6C"]}
            months={2}
            direction="horizontal"
            showDateDisplay={true}
            showMonthAndYearPickers={true}
          />

          <Box sx={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            gap: 1, 
            mt: 0.5,
            pt: 1,
            borderTop: "1px solid #eee"
          }}>
            <Button
              onClick={() => {
                setRange([
                  {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: "selection",
                  },
                ]);
                // Notify parent component to clear dates
                if (onApply) {
                  onApply(null, null);
                }
                handleClose();
              }}
              sx={{
                color: "#8a884c",
                fontWeight: 600,
                textTransform: "none",
                minWidth: "80px",
              }}
            >
              Clear
            </Button>
            <Button
              onClick={() => {
                if (onApply && range[0]?.startDate && range[0]?.endDate) {
                  // Format dates as YYYY-MM-DD in local timezone
                  const startDate = formatLocalDate(range[0].startDate);
                  const endDate = formatLocalDate(range[0].endDate);
                  onApply(startDate, endDate);
                }
                handleClose();
              }}
              variant="contained"
              sx={{
                backgroundColor: "#8a884c",
                color: "white",
                fontWeight: 600,
                textTransform: "none",
                minWidth: "80px",
                "&:hover": {
                  backgroundColor: "#6b6940",
                },
              }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default DateFilterButton;
