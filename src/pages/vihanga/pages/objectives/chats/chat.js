import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { CommonDoughnutChart } from '../../../../../components/chatjs/commonChatjs';

export const DoughnutChartComponent1 = ({topData,}) => {
  const totalWeightPercent = Math.min(100, Math.max(0, topData?.totalWeights || 0));
  const value=parseInt(topData["totalWeights"] ||0)
  const chartConfig = {
    chartData: {
      datasets: [
        {
          data: [totalWeightPercent, 100 - totalWeightPercent],  // 100% filled
          backgroundColor: ["#847F3B", "#E0E0E0"], // Main color and light grey
          hoverBackgroundColor: ["#847F3B", "#E0E0E0"],
          borderWidth: 0,
        },
      ],
    },
      percentage: totalWeightPercent,
    centerLabel: "Total Weight ",
  };

  if (!chartConfig) {
    return <Typography>Error: Chart configuration not found!</Typography>;
  }

  return (
    <Card
      sx={{
        width: "100%",
        height:"100%",
        borderRadius: 2,
        backgroundColor: "#FFFFFF",
        boxShadow: "6px 6px 54px 0px #0000000D",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 220,
            height: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CommonDoughnutChart
            chartData={chartConfig.chartData}
            percentage={chartConfig.percentage}
            centerLabel={chartConfig.centerLabel}
          />
          {/* Optional center content inside chart */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            {/* Add center text here if needed */}
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {chartConfig.chartData?.labels?.map((label, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: chartConfig.chartData?.datasets[0]?.backgroundColor[index],
                }}
              />
              <Typography sx={{ fontSize: "14px", color: "#707070", fontFamily: "Work Sans" }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
