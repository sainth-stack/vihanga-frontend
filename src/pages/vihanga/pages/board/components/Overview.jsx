import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import { CalendarToday, Add, OpenInNew } from "@mui/icons-material";
import Header from "../components/Header";
import DateFilterButton from "../components/Date";

const tasks = [
  {
    date: "2025-03-31",
    description:
      "Partner with local organizations to provide access to education and skill development opportunities",
  },
  {
    date: "2025-03-31",
    description:
      "Partner with local organizations to provide access to education and skill development opportunities",
  },
  {
    date: "2025-03-31",
    description:
      "Partner with local organizations to provide access to education and skill development opportunities",
  },
  // Add more tasks here for testing pagination
  {
    date: "2025-04-01",
    description:
      "Coordinate with industry leaders for guest speakers and workshops",
  },
  {
    date: "2025-04-02",
    description:
      "Plan and schedule workshops for skill development in local communities",
  },
];

const TasksOverview = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 3; // Number of tasks to display per page
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBackClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <Box
      sx={{
        borderRadius: "20px",
        width: "100%",
      padding:"1rem",
        height: "100%",
     
        bgcolor: "rgba(251, 253, 252, 1)",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Header text="Tasks Overview" style={{ padding: "10px" }} />

        <Stack direction="row" spacing={2}>
          {/* <Button
            variant="outlined"
            startIcon={<CalendarToday />}
            sx={{
              borderColor: "#8a884c",
              color: "#8a884c",
              borderRadius: "67px",
            }}
          >
            Filter Date
          </Button> */}
          <DateFilterButton />
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: "#8a884c",
              "&:hover": { backgroundColor: "#7b7942" },
              borderRadius: "67px",
            }}
          >
            Create Task
          </Button>
        </Stack>
      </Stack>

      {/* Task Cards */}
      <Stack spacing={2}>
        {currentTasks.map((task, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "rgba(251, 253, 252, 1)",
              borderRadius: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                {task.date}
              </Typography>
              <Typography variant="body1" mt={0.5}>
                {task.description}
              </Typography>
            </Box>
            <IconButton>
              <OpenInNew sx={{ color: "#c7b68d" }} />
            </IconButton>
          </Paper>
        ))}
      </Stack>
      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleBackClick}
          disabled={currentPage === 1}
          style={{
            color:
              currentPage === 1
                ? "rgba(131, 127, 57, 0.5)"
                : "rgba(131, 127, 57, 1)",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            backgroundColor: "transparent",
            border: "none",
            padding: "5px 10px",
          }}
        >
          &lt; Back
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            style={{
              margin: "0 5px",
              color:
                currentPage === index + 1
                  ? "rgba(131, 127, 57, 1)"
                  : "rgba(131, 127, 57, 1)",
              backgroundColor: "transparent",
              border: "none",
              padding: "5px 10px",
              fontWeight: currentPage === index + 1 ? "bold" : "normal",
              textDecoration: currentPage === index + 1 ? "underline" : "none",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages}
          style={{
            color:
              currentPage === totalPages
                ? "rgba(131, 127, 57, 0.5)"
                : "rgba(131, 127, 57, 1)",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            backgroundColor: "transparent",
            border: "none",
            padding: "5px 10px",
          }}
        >
          Next &gt;
        </button>
      </div>
    </Box>
  );
};

export default TasksOverview;
