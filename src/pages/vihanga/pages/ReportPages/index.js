import React, { useState, useEffect } from "react";
import { Button, Box } from "@mui/material";
import Page1 from "./Page1";
import Page2 from "./Page2";
import html2pdf from "html2pdf.js";
import Section3 from "../Recruitment/sections/candidateDetails/downlode/section3";
import Section4 from "../Recruitment/sections/candidateDetails/downlode/section4";
import axios from "axios";
import { useParams } from "react-router-dom";
import { appURL, PsychometricURL } from "utilities";

const ReportPage = () => {
  const [candidateData, setCandidateData] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState(null);
  const { id } = useParams();
  const candidateId = id;
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        const response = await axios.get(
          `${PsychometricURL}/users/user-results?candidateId=${candidateId}`
        );
        console.log("response for results", response);
        setCandidateData(response.data);
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      }
    };

    const fetchCandidateDetails = async () => {
      try {
        const response = await axios.get(
          `${appURL}/recruitment/getCandidateById?_id=${candidateId}`
        );

        const candidateData = response?.data?.data?.[0];
        setCandidateDetails(candidateData);
      } catch (error) {
        console.error("Error fetching candidate details:", error);
      }
    };

    if (candidateId) {
      fetchCandidateData();
      fetchCandidateDetails();
    }
  }, [candidateId]);
console.log("candidateDetails", candidateDetails);
  const handleDownloadPDF = () => {
    const element = document.getElementById("pdf-content");

    const opt = {
      margin: [0, 0.5, 0.5, 0.5], // Consistent margins (top, right, bottom, left) in inches
      filename: "report.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["css", "legacy"], avoid: ".pdf-page" },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (!candidateData) return <div>Loading...</div>;
  if (Array.isArray(candidateData) && candidateData.length === 0)
    return <div>No Results Found...</div>;

  return (
<Box sx={{display:'flex',justifyContent:'center',width:'100%',flexDirection:'column',alignItems:'center'}}>
      <style>
        {`
          @media print {
            .pdf-page {
              page-break-before: always; /* Start each section on a new page */
              page-break-after: always; /* Ensure no content spills to next page */
              break-inside: avoid; /* Prevent content from splitting across pages */
              width: 210mm; /* A4 width */
              min-height: 297mm; /* A4 height, ensures empty space if content is short */
              box-sizing: border-box; /* Include padding/margins in dimensions */
            }
          }
          .pdf-page {
            width: 210mm;
            height: 297mm;
            box-sizing: border-box;
          }
        `}
      </style>

      <Box display="flex" justifyContent="start" m={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadPDF}
          sx={{ px: 4, py: 1 }}
        >
          Download PDF
        </Button>
      </Box>

<Box sx={{background:'white'}}>
<Box id="pdf-content">
        <div className="pdf-page">
          <Page1 />
        </div>
        <div className="pdf-page">
          <Page2 data={candidateData} candidateDetails={candidateDetails}/>
        </div>
        <div className="pdf-page">
          <Section3 data={candidateData} />
        </div>
        <div className="pdf-page">
          <Section4 data={candidateData} candidateDetails={candidateDetails}/>
        </div>
      </Box>
</Box>
</Box>
  );
};

export default ReportPage;
