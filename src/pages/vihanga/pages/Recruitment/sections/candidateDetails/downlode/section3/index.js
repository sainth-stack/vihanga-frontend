import React, { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import topbimg from "../../../../../../../../assets/images/bgimgs3.png";
import { Doughnut } from "react-chartjs-2";
import vihanga from "../../../../../../../../assets/images/vihanga.png";
import bgimgs32 from "../../../../../../../../assets/images/bgimgs32.png";
import bgimgs33 from "../../../../../../../../assets/images/bgimgs33.png";
import bgimgs34 from "../../../../../../../../assets/images/bgimgs34.png";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Section3 = ({ data }) => {
  const [chartValues, setChartValues] = useState([0, 0, 0]);

  useEffect(() => {
    if (data?.results) {
      const results = data.results;
      const total =
        results.ImplementationSpecialists +
        results.RealWorlders +
        results.DisruptiveInnovator;

      const implementationSpecialistValue = total
        ? ((results.ImplementationSpecialists / total) * 100).toFixed(1)
        : 0;
      const realWorlderValue = total
        ? ((results.RealWorlders / total) * 100).toFixed(1)
        : 0;
      const disruptiveInnovatorValue = total
        ? ((results.DisruptiveInnovator / total) * 100).toFixed(1)
        : 0;

      setChartValues([
        parseFloat(implementationSpecialistValue),
        parseFloat(realWorlderValue),
        parseFloat(disruptiveInnovatorValue),
      ]);
    }
  }, [data]);

  const colors = ["#84823F", "#EBBE2E", "#DB5930"];
  const chartLabels = [
    "Implementation Specialist",
    "Real Worlder",
    "Disruptive Innovator",
  ];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: colors,
        borderWidth: 0,
        cutout: "35%",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.formattedValue}%`,
        },
      },
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => `${value}%`,
      },
    },
  };

  const LegendItem = ({ color, label, value }) => (
    <Box display="flex" alignItems="center" gap={1}>
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: color,
          marginTop: "10px",
        }}
      />
      <Typography
        sx={{
          fontFamily: "Work Sans",
          fontWeight: "500",
          fontSize: "16px",
          color: "#000000",
          marginTop: "10px",
        }}
      >
        <strong>{value}</strong> {label}
      </Typography>
    </Box>
  );

  return (
    <Box
    sx={{
      width: "210mm",
      height: "297mm",
      borderRadius: "8px",
      backgroundColor: "#fff",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      padding: "20px",
      position: "relative",
      "@media print": {
        width: "210mm",
        height: "297mm",
        margin: 0,
        padding: "10mm",
        boxShadow: "none",
      },
    }}
    >
      {/* Top Background */}
      <Box
        component="img"
        src={topbimg}
        alt="Background"
        sx={{
          position: "absolute",
          top: "0px",
          left: "0px",
          width: "100%",
          height: "338px",
          zIndex: 0,
          color: "#BEA781",
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 1, flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontFamily: "Work Sans",
            color: "#0E0E0E",
            marginBottom: "13px",
            fontSize: "16px",
          }}
        >
          Psychometric Assessment & Situational Judgement Test
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            fontFamily: "Work Sans",
            color: "#0E0E0E",
            fontSize: "16px",
            marginBottom: "85px",
          }}
        >
          The Candidate Test Result Shown As A Following
        </Typography>

        {/* Chart Section */}
        <Box sx={{ position: "relative", height: "500px" }}>
          <Box sx={{ width: "355px", mx: "auto", zIndex: 10 }}>
            <Doughnut data={chartData} options={options} />
          </Box>
        </Box>
      </Box>

      <Box
  sx={{
    position: "absolute",
    bottom: 300,
    left: 0,
    right: 0,
    width: "100%",
    display: "flex", // Add flexbox to center content
    justifyContent: "center", // Center horizontally
    alignItems: "center", // Center vertically
    flexDirection: "column", // Stack children vertically
  }}
>
  <Box
    sx={{
      fontWeight: 600,
      fontFamily: "Work Sans",
      textAlign: "center", // Center the Typography text
      width: "100%", // Ensure the box takes full width for centering
    }}
  >
    <Typography
      sx={{
        fontWeight: 600,
        fontFamily: "Work Sans",
        fontSize: "16px",
        mb: 2,
      }}
    >
      Personality Breakdown
    </Typography>
  </Box>
  <Box
    sx={{
      pt: 3,
      display: "flex", // Add flexbox to center the Stack
      justifyContent: "center", // Center the Stack horizontally
      width: "100%", // Ensure the box takes full width for centering
    }}
  >
    <Stack
      spacing={1}
      alignItems="flex-start"
      sx={{
        width: "80%", // Keep the width as specified
        maxWidth: "fit-content", // Ensure the Stack doesn't stretch unnecessarily
      }}
    >
      <LegendItem
        color={colors[0]}
        label="Implementation Specialist"
        value={`${chartValues[0]}%`}
      />
      <LegendItem
        color={colors[1]}
        label="Real Worlder"
        value={`${chartValues[1]}%`}
      />
      <LegendItem
        color={colors[2]}
        label="Disruptive Innovator"
        value={`${chartValues[2]}%`}
      />
    </Stack>
  </Box>
</Box>

      <Box
        sx={{
          position: "relative",
          height: "743px", // Total height to accommodate all boxes (330px + 270px + 143px)
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end", // Align children towards the bottom
        }}
      >
        {/* Parent Box (Bottom) */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundImage: `url(${bgimgs32})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            // backgroundPosition: "center",
            height: "330px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1, // Lowest z-index
          }}
        />

        {/* Second Box (Middle) */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            backgroundImage: `url(${bgimgs33})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "270px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2, // Middle z-index
          }}
        />

        {/* Third Box (Top) */}
        <Box
          sx={{
            position: "absolute",
            bottom: "0", // Aligned to the bottom
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "143px",
            px: 3,
            borderRadius: "8px",
            backgroundImage: `url(${bgimgs34})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            zIndex: 3, // Highest z-index
            mt: "auto",
            mb: 0,
          }}
        >
          <img
            src={vihanga}
            alt="vihanga img"
            style={{
              display: "block",
              width: "106px",
              height: "25px",
            }}
          />
          <Typography
            sx={{
              fontFamily: "Work Sans",
              fontWeight: "500",
              fontSize: "16px",
              color: "#0E0E0E",
            }}
          >
            03
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Section3;
