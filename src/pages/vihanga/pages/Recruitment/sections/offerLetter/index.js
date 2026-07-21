import React, { useState, useEffect } from "react";
import { Button, Box, CircularProgress, Typography } from "@mui/material";
import html2pdf from "html2pdf.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import Page1 from "pages/vihanga/pages/AppointLetterPdf/Page1";
import Page2 from "pages/vihanga/pages/AppointLetterPdf/Page2";
import { appURL } from "utilities";

const AppointmentLetter = () => {
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: candidateId } = useParams();
console.log(candidateData)
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${appURL}/recruitment/getCandidateById?_id=${candidateId}`
        );
        
        // Check if response data is valid
        if (response?.data?.data) {
          setCandidateData(response.data.data);
        } else {
          setError("No candidate data found");
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
        setError("Failed to load candidate data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidateData();
    } else {
      setError("No candidate ID provided");
      setLoading(false);
    }
  }, [candidateId]);

  const handleDownloadPDF = () => {
    const element = document.getElementById("pdf-content");
    if (!element) {
      console.error("PDF content element not found");
      return;
    }

    const opt = {
      margin: [0, 0.5, 0.5, 0.5],
      filename: "appointment_letter.pdf",
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading candidate data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Typography variant="h6" color="error">{error}</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!candidateData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">No candidate data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <style>
        {`
          @media print {
            .pdf-page {
              page-break-before: always;
              page-break-after: always;
              break-inside: avoid;
              width: 210mm;
              min-height: 297mm;
              box-sizing: border-box;
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

      <Box sx={{ background: 'white' }}>
        <Box id="pdf-content">
          <Box className="pdf-page">
            <Page1 candidateData={candidateData?.length>0 ?candidateData[0] :{}} />
          </Box>
          <Box className="pdf-page">
            <Page2 candidateData={candidateData?.length>0 ?candidateData[0] :{}} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppointmentLetter;