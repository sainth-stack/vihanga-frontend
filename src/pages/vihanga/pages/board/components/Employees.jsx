import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Box } from "@mui/material";
import Header from "./Header";
import downloadIcon from "assets/images/downloadIcon.png";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Chart data
const data = {
  labels: ["01", "02", "03", "04", "05"],
  datasets: [
    {
      label: "No. of Employees",
      data: [5, 16, 8, 24, 13],
      backgroundColor: "#B79B6C",
      borderRadius: 8,
      barThickness: 40,
    },
  ],
};

// Chart options
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    // Disable datalabels if plugin is registered globally
    datalabels: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 5,
        color: "#333",
        font: {
          size: 12,
        },
      },
      title: {
        display: true,
        text: "No. of Employees",
        font: {
          size: 14,
        },
      },
    },
    x: {
      ticks: {
        color: "#333",
        font: {
          size: 12,
        },
      },
      title: {
        display: true,
        text: "Rating",
        font: {
          size: 14,
        },
      },
    },
  },
};

// Component
export default function DashboardEmployeesChart() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        padding: "20px",
        borderRadius: "16px",
        backgroundColor: "#fff",
        
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Header text="Dashboard Employees" />
        <Box>
          <img
            src={downloadIcon}
            alt="Download Icon"
            style={{ width: "24px", height: "24px", cursor: "pointer" }}
          />
        </Box>
      </Box>

      <Box sx={{ width: "380px", height: 370 }}>
        <Bar data={data} options={options} />
      </Box>
    </Box>
  );
}
