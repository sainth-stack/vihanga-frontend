import { Box, Typography } from "@mui/material";
import React from "react";
import HeaderOneSvg from "../../../../assets/svg/headerOneSvg.svg";
import HeaderTwoSvg from "../../../../assets/svg/headerTwoSvg.svg";
import HeaderThreeSvg from "../../../../assets/svg/headerThreeSvg.svg";
import vihanga_heading from "../../../../assets/svg/Vihanga.svg";
import InfoCard from "./CustomCard";

const PAge2 = ({ data, candidateDetails }) => {
  const headingData = [
    { main: "Candidate Name", sub: candidateDetails?.candidateName || "-" },
    { main: "Date", sub: new Date().toLocaleDateString("en-GB") },
    { main: "Candidate ID", sub: data?.candidateId || "-" },
  ];

  return (
    <Box
      id="print-container"
      sx={{
        width: "210mm", // A4 width
        height: "297mm", // A4 height
        padding: "15mm", // safe print area
        boxSizing: "border-box",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* Header Section */}
      <Box>
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "16px",
            fontFamily: "Montserrat",
            color: "#0E0E0E",
            mb: 2,
            textAlign: "start",
          }}
        >
          Psychometric Assessment & Situational Judgement Test
        </Typography>

        {/* Candidate Info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
            gap: 2,
          }}
        >
          {headingData.map((item, index) => (
            <Box key={index} sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontFamily: "Work Sans",
                  fontWeight: "500",
                  color: "#837F39",
                }}
              >
                {item.main}
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontFamily: "Work Sans",
                  fontWeight: "700",
                  color: "#0E0E0E",
                }}
              >
                {item.sub}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography
          sx={{
            fontWeight: "400",
            fontSize: "12px",
            fontFamily: "Work Sans",
            textAlign: "center",
            color: "#0E0E0E",
            mb: 3,
          }}
        >
          TalentSpotify's SJT is designed to assess employees across three distinct work personality
        </Typography>
      </Box>

      {/* Main Content - Cards */}
      <Box sx={{ 
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 2,
        mb: 2
      }}>
        <InfoCard
          headerColor={"#BEA781"}
          circleBg={"#BEA781"}
          icon={HeaderOneSvg}
          title="Implementation Specialist"
          iconText="$"
          description="These individuals are problem solvers who focus on efficiency, execution, and goal achievement. They excel at translating ideas into actionable results and are detail-oriented, structured, and driven by outcomes. Their strengths make them suitable for careers in operations, project management, business execution, and strategy implementation."
        />

        <InfoCard
          headerColor={"#837F39"}
          circleBg={"#837F39"}
          icon={HeaderTwoSvg}
          title="Real Worlders"
          iconText="$"
          description="These candidates are practical and action-oriented, emphasizing tangible, real-world outcomes. They prefer working with concrete data and excel in structured environments that require hands-on problem-solving. Their pragmatic and realistic approach makes them ideal for fields like operations, finance, engineering, data analysis, and environmental science"
        />

        <InfoCard
          headerColor={"#EBBE2E"}
          circleBg={"#EBBE2E"}
          icon={HeaderThreeSvg}
          title="Disruptive Innovators"
          iconText="$"
          description="These individuals are visionary thinkers who embrace risk-taking, adaptability, and innovation. They thrive on challenging the status quo and driving change through creative and unconventional solutions. Their ability to identify new opportunities and think outside the box makes them well-suited for careers in entrepreneurship, product design, development, marketing, and growth strategy."
        />
      </Box>

      {/* Footer */}
      <Box sx={{ mt: "auto", pt: 2,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <img
          src={vihanga_heading}
          alt="vihange_heading"
          style={{
            maxWidth: "138px",
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
            02
          </Typography>
      </Box>
    </Box>
  );
};

export default PAge2;