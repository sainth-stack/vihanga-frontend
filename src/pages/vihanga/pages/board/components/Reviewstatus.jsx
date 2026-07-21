import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Box, Typography } from "@mui/material";
import Header from "../components/Header";
import downloadIcon from "assets/images/downloadIcon.png";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const labels = [
  "Employee Submission",
  "Employee Submission",
  "Off-Track",
  "Off-Track",
  "Off-Track",
  "Off-Track",
];

const colors = [
  "#8A9B50", // Olive Green
  "#C2C96D", // Light Olive
  "#E5B436", // Yellow
  "#F0D865", // Light Yellow
  "#E0582D", // Red
  "#F47B62", // Light Red
];

const data = {
  labels,
  datasets: [
    {
      data: [25, 10, 30, 30, 15, 10],
      backgroundColor: colors,
      borderWidth: 0,
      cutout: "40%",
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  hover: {
    mode: null, // disables segment enlargement on hover
  },
  interaction: {
    mode: null, // disables pointer interactions on chart
  },
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      color: "#fff",
      font: {
        weight: "bold",
        size: 16,
      },
      formatter: (value, ctx) => {
        const total = ctx.chart.data.datasets[0].data.reduce(
          (acc, val) => acc + val,
          0
        );
        const percentage = Math.round((value / total) * 100);
        return `${percentage}%`;
      },
      anchor: "center",
      align: "center",
    },
    tooltip: {
      enabled: true,
    },
  },
};

const ReviewStatus = () => {
  return (
    <Box
      sx={{
        maxWidth: "100%",
        height: "100%",
        padding: 3,
        borderRadius: 4,
        backgroundColor: "#fff",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",

          mb: 2,
          gap: "10px",
        }}
      >
        <Header text="Performance Form Review Status" />

        <Box
          component="img"
          src={downloadIcon}
          alt="Download icon"
          sx={{ width: 24, height: 24 }}
        />
      </Box>

      {/* Chart Centered */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 260,
        }}
      >
        <Box sx={{ width: 260, height: 260 }}>
          <Doughnut data={data} options={options} />
        </Box>
      </Box>

      {/* Custom Legend in Two Columns */}
      <Box display="flex" justifyContent="center" gap={6} mt={3}>
        {[0, 1].map((col) => (
          <Box key={col} display="flex" flexDirection="column" gap={1}>
            {labels
              .filter((_, i) => i % 2 === col)
              .map((label, i) => {
                const index = col + i * 2;
                return (
                  <Box
                    key={index}
                    width={"100%"}
                    display="flex"
                    alignItems="center"
                    gap={"10px"}
                  >
                    <Box
                      width={15}
                      height={15}
                      borderRadius="50%"
                      bgcolor={colors[index]}
                    />
                    <Typography variant="body2">{label}</Typography>
                  </Box>
                );
              })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ReviewStatus;
