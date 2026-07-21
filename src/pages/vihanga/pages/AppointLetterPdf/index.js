import React from "react";
import { Box, Button } from "@mui/material";
import Page1 from "./Page1";
import Page2 from "./Page2";
// import Page3 from "./Page3";
// import Page4 from "./Page4";


const AppointmentPDFLetter = ({ onClick }) => {
  

  return (
    <Box
      sx={{
        fontFamily: "'Times New Roman', serif",
        color: "#000000",
        fontStyle: "italic",
      }}
    >
      {/* Print Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          my: 2, // margin top and bottom
          "@media print": {
            display: "none",
          },
        }}
      >
        <Button variant="contained" color="primary" >
          Print Appointment Letter
        </Button>
      </Box>

      {/* Page 1 */}
      <Box
        sx={{
          pageBreakAfter: "always",
          minHeight: "29.7cm",
          maxHeight: "29.7cm",
          width: "21cm",
          boxSizing: "border-box",
        }}
      >
        <Page1 />
      </Box>

      {/* Page 2 */}
      <Box
        sx={{
          pageBreakAfter: "always",
          minHeight: "29.7cm",
          maxHeight: "29.7cm",
          width: "21cm",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <Page2 />
      </Box>

      {/* <Box
        sx={{
          pageBreakAfter: "always",
          minHeight: "29.7cm",
          maxHeight: "29.7cm",
          width: "21cm",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <Page3 />
      </Box>

      <Box
        sx={{
          pageBreakAfter: "always",
          minHeight: "29.7cm",
          maxHeight: "29.7cm",
          width: "21cm",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <Page4 />
      </Box> */}
    </Box>
  );
};

export default AppointmentPDFLetter;
