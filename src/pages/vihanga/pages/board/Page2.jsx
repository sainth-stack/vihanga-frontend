import React, { useState } from "react";
import { Box, Card, Typography, Button, Select, MenuItem } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DashboardCards from "./components/Card";
import RewardLeaderboard from "./components/Leaderboard";
import OKRProgress from "./components/Progress";
import RewardsList from "./components/Reward";
import TasksOverview from "./components/Overview";
import ReviewStatus from "./components/Reviewstatus";
import DashboardEmployeesChart from "./components/Employees";
import { Grid } from "@mui/material";
const Dashboard3 = () => {
  const [selected, setSelected] = useState("My Team");

  const buttonStyle = (option) => ({
    width: "110px",
    backgroundColor: selected === option ? "#7F7F3F" : "rgba(241, 241, 241, 2)",
    color: selected === option ? "#fff" : "#7F7F3F",
    padding: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "10px",
    borderRadius: selected === option ? "4rem" : "8px",
    transition: "all 0.2s ease-in-out",
    //  border: "1px solid #7F7F3F", // optional: adds nice contrast
  });

  return (
    <>
      <div
        style={{
          maxWidth: "100%",

          margin: "0 auto", // centers the container
          background: " rgba(242, 242, 242, 1)",
        }}
      >
        <div style={{ display: "flex", gap: "10px", padding: "20px" }}>
          <button onClick={() => setSelected("Me")} style={buttonStyle("Me")}>
            Me
          </button>
          <button
            onClick={() => setSelected("My Team")}
            style={buttonStyle("My Team")}
          >
            My Team
          </button>
        </div>

        <Box sx={{ p: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Box>
              <Typography
                sx={{
                  background: "rgba(255, 252, 210, 1)",
                  padding: "10px",
                  fontWeight: 500,
                }}
              >
                Hello Pushpa - You have 45 tasks and 13 objectives remaining to
                complete.
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="body2"
                display="inline"
                sx={{
                  fontWeight: 600,
                }}
              >
                Period:
              </Typography>
              <Select
                defaultValue="yearly"
                size="small"
                sx={{ width: "120px" }}
              >
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
              </Select>
              <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  textTransform: "none",
                }}
              >
                Export
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {" "}
            <DashboardCards />{" "}
          </Box>
        </Box>

        <Grid container spacing={2} padding={3}>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardEmployeesChart />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ReviewStatus />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <OKRProgress />
          </Grid>
        </Grid>

        <Grid container spacing={2} padding={3}>
          <Grid item xs={12} md={6}>
            <TasksOverview />
          </Grid>
          <Grid item xs={12} md={6}>
            <RewardLeaderboard />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Dashboard3;
