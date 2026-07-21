import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Plus } from "lucide-react";
import Button from "@mui/material/Button";
import { Box, Card } from "@mui/material";
import Header from "../components/Header";
import downloadIcon from "assets/images/downloadIcon.png";

ChartJS.register(ArcElement, Legend, ChartDataLabels);

const chartData = {
  labels: ["On-Track", "Off-Track", "At Risk"],
  datasets: [
    {
      data: [50, 30, 20],
      backgroundColor: ["#E0582D", "#E5B436", "#8A9B50"],
      borderColor: ["#E0582D", "#E5B436", "#8A9B50"],
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  rotation: -90,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      color: "#FFFFFF",
      font: {
        weight: "bold",
        size: 14,
      },
      formatter: (value, ctx) => {
        let dataset = ctx.chart.data.datasets[0].data;
        let total = dataset.reduce((acc, current) => acc + current, 0);
        let percentage = Math.round((value / total) * 100);
        return `${percentage}%`;
      },
      anchor: "center",
      align: "center",
    },
    tooltip: {
      enabled: false,
    },
  },
};

export default function OKRProgress() {
  return (
    <Card
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
        <Header text="OKR Progress" />
        <Box display="flex" alignItems="center" gap={4}>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#708238",
              color: "white",
              textTransform: "none",
              borderRadius: "65px",
              "&:hover": {
                backgroundColor: "#708238", // Prevent hover color change
              },
            }}
            startIcon={<Plus size={16} />}
          >
            Add OKR
          </Button>

          <img
            src={downloadIcon}
            alt="icon"
            style={{ width: "24px", height: "24px" }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "264px",
        }}
      >
        <Box sx={{ width: "264px", height: "264px" }}>
          <Pie data={chartData} options={chartOptions} />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "16px",
          mt: 8,
        }}
      >
        <Box display="flex" alignItems="center" fontWeight="bold" gap="15px">
          <Box fontWeight="bold">🟠 On-Track</Box>
          <Box fontWeight="bold">🟡 Off-Track</Box>
          <Box
            width={15}
            height={15}
            borderRadius="50%"
            bgcolor="rgba(131, 127, 57, 1)"
            mr={0}
          />
          At Risk
        </Box>
      </Box>
    </Card>
  );
}
