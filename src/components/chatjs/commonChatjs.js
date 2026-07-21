// components/chatjs/commonChatjs.jsx

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const CommonDoughnutChart = ({
  chartData,
  options,
  percentage = 0,
  centerLabel = "",
  width = "208px",
  height = "208px",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: "220px", sm: width },
        height: { xs: "220px", sm: height },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Doughnut
        data={chartData}
        options={{
          ...options,
          responsive: true,
          maintainAspectRatio: false,
          cutout: "68%",
          plugins: {
            ...options?.plugins,
            legend: {
              display: false,
            },
            datalabels: {
              display: false,
            },
          },
        }}
        style={{ width: "800px", height: "500px" }}
      />

      {/* Center Text */}
      <Box sx={{ position: "absolute", textAlign: "center" }}>
        <Typography
          sx={{
            fontFamily: `"Montserrat" !important`,
            fontSize: isMobile ? "12px !important" : "15.53px !important",
            fontWeight: `600 !important`,
            color: `#0E0E0E !important`,
            marginBottom: "4px",
            maxWidth: isMobile ? "5rem" : "auto",
          }}
        >
          {centerLabel}
        </Typography>

        <Typography
          sx={{
            fontFamily: `"Work Sans" !important`,
            fontSize: `21px !important`,
            fontWeight: `700 !important`,
            color: `#837E3B !important`,
          }}
        >
          {Number(percentage).toFixed(2)}%
        </Typography>
      </Box>
    </Box>
  );
};
