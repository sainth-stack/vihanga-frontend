import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
  InputLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";

const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const Recurrence = ({ open, setOpen, setRecurrenceDetails }) => {
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [repeat, setRepeat] = useState("Weekly");
  const [weekCount, setWeekCount] = useState("01");
  const [selectedDays, setSelectedDays] = useState(["WE"]);
  const [endType, setEndType] = useState("On this Day");
  const [endDate, setEndDate] = useState("");

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const repeatOptions = [
    { value: "Week", label: "Weekly" },
    { value: "Month", label: "Monthly" },
    { value: "Quarter", label: "Quarterly" },
  ];

  const weekCountOptions = Array.from({ length: 4 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, "0"),
    label: (i + 1).toString().padStart(2, "0"),
  }));

  const handleSave = () => {
    const dayIndexMap = {
      SU: 0,
      MO: 1,
      TU: 2,
      WE: 3,
      TH: 4,
      FR: 5,
      SA: 6,
    };

    const mappedDays = selectedDays
      .map((day) => dayIndexMap[day])
      .filter((n) => n !== undefined);

    const formatted = {
      repeat: repeat,
      every: parseInt(weekCount, 10) || 1,
      onDays: mappedDays,
      end: endType,
      endDate: endDate || null,
    };

    setRecurrenceDetails(formatted);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      
      maxWidth={isMobile ? "sm" : isTablet ? "md" : "lg"}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius:  "20px",
          width: isMobile ? "100%" : isTablet ? "90%" : "850px",
          maxWidth: isMobile ? "90%" : "90vw",
          maxHeight: isMobile ? "90vh" : "90vh",
          padding: isMobile ? ".5rem" : "20px",
          margin: isMobile ? "0" : "auto",
        },
      }}
    >
      <DialogContent sx={{ 
        p: isMobile ? 2 : 4, 
        position: "relative",
        overflow: "auto",
        maxHeight: isMobile ? "calc(100vh - 20px)" : "none"
      }}>
        <IconButton
          sx={{ 
            position: "absolute", 
            top: isMobile ? 8 : 16, 
            right: isMobile ? 8 : 16,
            zIndex: 1
          }}
          onClick={() => setOpen(false)}
        >
          <CloseIcon />
        </IconButton>
        
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          fontWeight={700} 
          mb={isMobile ? 2 : 4}
          sx={{ pr: isMobile ? 4 : 0 }}
        >
          Recurrence
        </Typography>

        {/* Repeat & Every */}
        <Box mb={3}>
          <Box 
            display="flex" 
            gap={isMobile ? 2 : 3} 
            alignItems="flex-start" 
            flexWrap="wrap"
            flexDirection={isMobile ? "column" : "row"}
          >
            <Box flex={isMobile ? "none" : 1} minWidth={isMobile ? "100%" : 200} width={isMobile ? "100%" : "auto"}>
              <InputLabel sx={{ mb: 1, fontSize: isMobile ? "14px" : "16px" }}>Repeat</InputLabel>
              <SelectComponent
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                options={repeatOptions}
                fullWidth
              />
            </Box>

            <Box flex={isMobile ? "none" : 1} minWidth={isMobile ? "100%" : 200} width={isMobile ? "100%" : "auto"}>
              <InputLabel sx={{ mb: 1, fontSize: isMobile ? "14px" : "16px" }}>Every (week's)</InputLabel>
              <SelectComponent
                value={weekCount}
                onChange={(e) => setWeekCount(e.target.value)}
                options={weekCountOptions}
                fullWidth
              />
            </Box>
          </Box>
        </Box>

        {/* Days Selection */}
        <Box 
          display="flex" 
          flexWrap="wrap" 
          gap={isMobile ? 2 : 4}
          flexDirection={isMobile ? "column" : "row"}
        >
          <Box flex={isMobile ? "none" : 1} minWidth={isMobile ? "100%" : 280} width={isMobile ? "100%" : "auto"}>
            <Typography fontWeight={500} mb={1} fontSize={isMobile ? "14px" : "16px"}>
              On
            </Typography>
            <Box 
              display="flex" 
              gap={isMobile ? 0.5 : 1} 
              flexWrap="wrap"
              justifyContent={isMobile ? "space-between" : "flex-start"}
            >
              {days.map((day) => (
                <Button
                  key={day}
                  onClick={() => toggleDay(day)}
                  variant={
                    selectedDays.includes(day) ? "contained" : "outlined"
                  }
                  sx={{
                    minWidth: isMobile ? 35 : 40,
                    width: isMobile ? "12%" : "auto",
                    padding: isMobile ? "4px" : "6px",
                    borderRadius: "10px",
                    fontSize: isMobile ? "12px" : "14px",
                    backgroundColor: selectedDays.includes(day)
                      ? "#73712A"
                      : "#fff",
                    borderColor: "#DADADA",
                    color: selectedDays.includes(day) ? "#fff" : "#000",
                    "&:hover": {
                      backgroundColor: selectedDays.includes(day)
                        ? "#73712A"
                        : "#f5f5f5",
                    },
                  }}
                >
                  {day}
                </Button>
              ))}
            </Box>
          </Box>

          {/* End Options */}
          <Box flex={isMobile ? "none" : 1} minWidth={isMobile ? "100%" : 280} width={isMobile ? "100%" : "auto"}>
            <Typography fontWeight={500} mb={1} fontSize={isMobile ? "14px" : "16px"}>
              End
            </Typography>
            <Box 
              display="flex" 
              gap={isMobile ? 1 : 2} 
              alignItems="center"
              flexDirection={isMobile ? "column" : "row"}
            >
              <Box flex={1} width={isMobile ? "100%" : "auto"}>
                <SelectComponent
                  value={endType}
                  options={[{ value: "On this Day", label: "On this Day" }]}
                  fullWidth
                />
              </Box>
              <Box flex={1} width={isMobile ? "100%" : "auto"}>
                <InputTextComponent
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box 
          display="flex" 
          justifyContent="center" 
          gap={isMobile ? 2 : 3} 
          mt={isMobile ? 3 : "15px"}
          flexDirection={isMobile ? "column" : "row"}
          alignItems={isMobile ? "stretch" : "center"}
        >
          <Button
            variant="outlined"
            sx={{
              px: isMobile ? 3 : 4,
              py: isMobile ? 1.5 : 1,
              borderRadius: "25px",
              borderColor: "#73712A",
              color: "#73712A",
              fontWeight: "bold",
              fontSize: isMobile ? "14px" : "16px",
              textTransform: "none",
              minWidth: isMobile ? "100%" : "auto",
            }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              px: isMobile ? 3 : 4,
              py: isMobile ? 1.5 : 1,
              borderRadius: "25px",
              backgroundColor: "#73712A",
              color: "#fff",
              fontWeight: "bold",
              fontSize: isMobile ? "14px" : "16px",
              textTransform: "none",
              minWidth: isMobile ? "100%" : "auto",
              "&:hover": {
                backgroundColor: "#5e5b21",
              },
            }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Recurrence;
