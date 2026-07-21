import React, { useState } from "react";
import { Box,Grid, Typography, Button, Select, MenuItem } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DashboardCards from "./components/Card";
import RewardLeaderboard from "./components/Leaderboard";
import OKRProgress from "./components/Progress";
import RewardsList from "./components/Reward";
import TasksOverview from "./components/Overview";
import { useHistory } from "react-router-dom"; // ✅ Correct import for React Router v5

const Dashboard2 = () => {
  const [selected, setSelected] = useState("Me");
  const history = useHistory(); // ✅ useHistory instead of useNavigate

  const handleSelection = (option) => {
    setSelected(option);
    if (option === "My Team") {
      history.push("/admin/previlages/board"); // ✅ Navigate using history
    }
  };

  const buttonStyle = (option) => ({
    width: "110px",
    backgroundColor: selected === option ? "#7F7F3F" : "rgba(241, 241, 241, 1)",
    color: selected === option ? "#fff" : "#7F7F3F",
    padding: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "10px",
   borderRadius: selected === option ? "4rem" : "8px",
    transition: "all 0.2s ease-in-out",
  });

  return (
    <Box
      sx={{
        maxWidth: "100%",
        height: "100%",
        margin: "0 auto",
        background: "rgba(242, 242, 242, 1)",
      }}
    >
      <Box sx={{ display: "flex", gap: "10px", padding: "20px" }}>
        <button onClick={() => handleSelection("Me")} style={buttonStyle("Me")}>
          Me
        </button>
        <button
          onClick={() => handleSelection("My Team")}
          style={buttonStyle("My Team")}
        >
          My Team
        </button>
      </Box>
      <Box sx={{ p: 2 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Typography
            sx={{
              background: "rgba(255, 252, 210, 1)",
              padding: "10px",
              fontWeight: 500,
            }}
          >
            Hello Boss - You have 45 tasks and 13 objectives remaining to
            complete.
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
              }}
            >
              Period:
            </Typography>
            <Select defaultValue="yearly" size="small" sx={{ width: "120px" }}>
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
          <DashboardCards />
        </Box>
      </Box>

      <Grid
        container
        spacing={2}
        sx={{
          width: "100%",
          maxWidth: "100%",
          padding: "15px",
        }}
      >
        {/* Left Side: OKR + Rewards List */}
        <Grid item xs={12} md={5} >
          <Box>
            <OKRProgress />
            <Box mt={2} mb={2}>
              <RewardsList />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={7} >
         
            <RewardLeaderboard />
          
        </Grid>
      </Grid>

      <Grid item xs={12}  padding={2}>
        <TasksOverview />
      </Grid>
    </Box>
  );
};

export default Dashboard2;
