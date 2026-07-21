// features/yourModule/path/DoughnutChartComponent1.jsx

import React from "react";
import { Card, CardContent, Box, Typography, useMediaQuery } from "@mui/material";
import { CommonDoughnutChart } from "../../../../../components/chatjs/commonChatjs";
// import { chartConfigs } from "../../../../../../components/chatjs/data";

export const DoughnutChartComponent2 = ({topData,setCompanyInfo, companyInfo}) => {
  console.log(topData,'dfsiufhs')
  const isMobile = useMediaQuery('(max-width: 600px)');

   const currentYear = companyInfo?.okrYear || "2025";
  const chartConfig = {
    chartData: {
      labels: [ `Q1 ${currentYear}`, 
        `Q2 ${currentYear}`, 
        `Q3 ${currentYear}`, 
        `Q4 ${currentYear}`],
      datasets: [
        {
          data: [parseInt(topData?.totalQ1 ||0), parseInt(topData?.totalQ2 ||0), parseInt(topData?.totalQ3 ||0), parseInt(topData?.totalQ4 ||0)],
          backgroundColor: ["#DB5C32", "#FCD964", "#519D74", "#BEA781"],
          hoverBackgroundColor: ["#DD5A22", "#F4CA3E", "#55844F", "#C2AA81"],
          borderWidth: 0,
        },
      ],
    },
    percentage: topData?.totalWeightsPercent, // Total Weight Achievement in %
    centerLabel: "Total Weight Achievement",
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
      <CardContent sx={{ display: "flex", gap: "20px", justifyContent:"space-between" }}>
        <Box sx={{ position: "relative", width: 220, height: 220 }}>
          <CommonDoughnutChart
            chartData={chartConfig.chartData}
            percentage={chartConfig.percentage}
            centerLabel={chartConfig.centerLabel}
          />
        </Box>

        {/* Dynamic Legend */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {chartConfig.chartData.labels.map((label, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
           
                  backgroundColor: chartConfig.chartData.datasets[0].backgroundColor[index],
                }}
              />
                
               <Box sx={{display:"flex",flexDirection:"column"}}>
               <Typography sx={{ fontSize: "14px", fontWeight: 400,color:"#707070",fontFamily:"Work Sans" ,}}>{label}</Typography>
                <Typography sx={{ fontSize: "16px", fontWeight: 700,fontFamily:"Montserrat" ,color:"#0E0E0E"}}>
                          {chartConfig.chartData.datasets[0].data[index]}%
                        </Typography>
                
               </Box>
            </Box>
                         
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
