import React from "react";
import bgimge from "../../../../assets/svg/bg-tile.svg";
import vihanga_heading from "../../../../assets/images/Heading_vihanga.png";
import sjtReport from "../../../../assets/svg/sjtReport.svg";
import vector from "../../../../assets/images/Vector.png";
import { Box, Typography } from "@mui/material";

const devSjtReport = require("../../../../assets/svg/dev-placeholder.svg");
const isDev = process.env.NODE_ENV === 'development';
 
const PAge1 = () => {
  return (
    <Box>
      <Box
        id="print-container"
        sx={{
          width: "210mm", // A4 width
          height: "297mm", // A4 height
          padding: "15mm", // safe print area
          boxSizing: "border-box",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          backgroundImage: `url(${bgimge})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "60% auto",
          backgroundPosition: "100% center",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 2 }}>
          <img
            src={vihanga_heading}
            alt="vihanga_heading"
            style={{
              maxWidth: "138px",
              marginBottom: "1rem",
            }}
          />
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "24px",
              color: "#837F39",
              maxWidth: "60%",
            }}
          >
            Psychometric Assessment & Situational Judgement Test
          </Typography>
          <Typography
            sx={{
              fontWeight: "600",
              fontFamily: "Montserrat",
              fontSize: "16px",
              color: "#0E0E0E",
              mt: 1,
              maxWidth: "60%",
            }}
          >
            SJT Report
          </Typography>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "start",
            mt: 5,
            mb: 2,
          }}
        >
          <img
            src={sjtReport}
            alt="sjt_report"
            style={{
              width: "100%",
              maxWidth: "400px",
              maxHeight: "250px",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Footer Section */}

        <Box
  sx={{
    width: "90%",
    height: "80px",
    position: "absolute",
    bottom: "0px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <Box
    sx={{
      width: "100%",
      height: "100%",
      position: "absolute",
      backgroundImage: `url(${vector})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "right",
      zIndex: -1, 
    }}
  />
  
  {/* Left-aligned image */}
  <img
    src={vihanga_heading}
    alt="vihanga_heading"
    style={{
      maxWidth: "128px",
      marginLeft: "1.5rem",
    }}
  />
  
  {/* Right-aligned typography */}
  <Typography
    sx={{
      fontFamily: "Work Sans",
      fontWeight: "500",
      fontSize: "16px",
      color: "#0E0E0E",
      marginRight: "1.5rem",
    }}
  >
    01
  </Typography>
</Box>
      </Box>
    </Box>
  );
};

export default PAge1;
