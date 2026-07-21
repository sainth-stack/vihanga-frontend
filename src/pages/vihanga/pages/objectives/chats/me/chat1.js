// features/yourModule/path/DoughnutChartComponent1.jsx

import React from "react";
import { Card, CardContent, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { CommonDoughnutChart } from "../../../../../../components/chatjs/commonChatjs";
import { chartConfigs } from "../../../../../../components/chatjs/data";
import { useTranslation } from 'react-i18next';

export const DoughnutChartComponent3 = ({topData,setCompanyInfo, companyInfo}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  console.log(topData,'dfsiufhs')
   const currentYear = companyInfo?.okrYear || "2025";
  // Prepare legend labels and colors independent of chart dataset
  const legendLabels = [
    `${t("OKRCharts.Q1")} ${currentYear}`,
    `${t("OKRCharts.Q2")} ${currentYear}`,
    `${t("OKRCharts.Q3")} ${currentYear}`,
    `${t("OKRCharts.Q4")} ${currentYear}`,
  ];
  const legendColors = ["#DB5C32", "#FCD964", "#519D74", "#BEA781"];

  const q1 = parseInt(topData?.totalQ1 || 0);
  const q2 = parseInt(topData?.totalQ2 || 0);
  const q3 = parseInt(topData?.totalQ3 || 0);
  const q4 = parseInt(topData?.totalQ4 || 0);
  const hasQuarterData = [q1, q2, q3, q4].some((v) => v > 0);
console.log(topData,'topData')
  const chartConfig = {
    chartData: {
      labels: legendLabels,
      datasets: [
        hasQuarterData
          ? {
              data: [q1, q2, q3, q4],
              backgroundColor: legendColors,
              hoverBackgroundColor: ["#DD5A22", "#F4CA3E", "#55844F", "#C2AA81"],
              borderWidth: 0,
            }
          : {
              data: [0, 100],
              backgroundColor: ["#847F3B", "#E0E0E0"],
              hoverBackgroundColor: ["#847F3B", "#E0E0E0"],
              borderWidth: 0,
            },
      ],
    },
    percentage: Math.min(100, Math.max(0, Number(topData?.totalWeightsPercent) || 0)),
    centerLabel: t("OKRCharts.TotalWeightAchievement"),
  }

  if (!chartConfig) {
    return <Typography>Error: Chart configuration not found!</Typography>;
  }

  return (
    <Card
      sx={{
        // width: "100%",
        height:"100%",
        borderRadius: 2,
        backgroundColor: "#FFFFFF",
        boxShadow: "6px 6px 54px 0px #0000000D",
        display: "flex",
        flexDirection: 'column',
        alignItems: "start",
        justifyContent: "center",
      
      }}
    >
      <CardContent sx={{ display: "flex", gap: isMobile ? '20px' : '50px', alignItems: "center", justifyContent:"space-between" }}>
        <Box sx={{ position: "relative", width: 220, height: 220 }}>
          <CommonDoughnutChart
            chartData={chartConfig.chartData}
            percentage={chartConfig.percentage}
            centerLabel={chartConfig.centerLabel}
          />
        </Box>

        {/* Dynamic Legend */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {legendLabels.map((label, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: legendColors[index],
                }}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontSize: "14px", fontWeight: 400, color: "#707070", fontFamily: "Work Sans" }}>
                  {label}
                </Typography>
                <Typography sx={{ fontSize: "16px", fontWeight: 700, fontFamily: "Montserrat", color: "#0E0E0E" }}>
                  {[q1, q2, q3, q4][index]}%
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
