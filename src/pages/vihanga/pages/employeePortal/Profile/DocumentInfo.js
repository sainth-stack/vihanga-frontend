import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import Grid2 from "@mui/material/Unstable_Grid2";
import FilePreview from "pages/vihanga/components/FilePreview.js/FilePreview";

const DocumentInfo = ({ data = {} }) => {
  const getDocumentLabel = (type) => {
    const documentOptions = [
      { label: "Aadhaar Card", value: "AADHAAR" },
      { label: "PAN Card", value: "PAN" },
      { label: "Passport", value: "PASSPORT" },
      { label: "Driving License", value: "DL" },
      { label: "Voter ID", value: "VOTER_ID" },
      { label: "Previous Payslips", value: "PAYSLIPS" },
      { label: "Experience Letter", value: "EXPERIENCE_LETTER" },
      { label: "Utility Bill", value: "UTILITY_BILL" },
      { label: "Others", value: "OTHERS" }
    ];
    
    return documentOptions.find(opt => opt.value === type)?.label || type;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Box
        sx={{
          padding: "1rem",

          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          sx={{
            fontSize: "32px",
            fontWeight: "600",
            fontFamily: `"Montserrat"`,
            color: "#0E0E0E",
          }}
        >
          Document Info
        </Typography>
        <Box
          sx={{
            paddingBottom: "70px",
            bgcolor: "#fff",
            padding: ".5rem",
            borderRadius: "1.5rem",
          }}
        >
          {data?.certificates?.length > 0 ? (
            <Grid2 container rowSpacing={2} columnSpacing={4}>
              {data.certificates.map((file, index) => (
                <Grid2 item xs={12} sm={6} key={index}>
                  <FilePreview
                    fileHeader={getDocumentLabel(file.type)}
                    fileName={file.fileName}
                    fileSize={formatFileSize(parseInt(file.fileSize || 0))}
                    fileUrl={file.fileUrl}
                    showDownload
                  />
                </Grid2>
              ))}
            </Grid2>
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", p: 2 }}>
              No documents available
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default DocumentInfo;