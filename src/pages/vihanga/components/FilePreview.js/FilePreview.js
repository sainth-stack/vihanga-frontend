import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';

const FilePreview = ({ fileHeader, fileName, fileSize, fileDate, onClose,fileUrl }) => {
  return (
    <Box sx={{ width: "100%" }}>
      {fileHeader && (
        <Typography
          variant="body1"
          sx={{ fontWeight: "600", color: "#85803c" }}
        >
          {fileHeader}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "2px solid #837F39",
          borderRadius: "10px",
          padding: "1rem",
          backgroundColor: "#fff",
          width: "100%",
          marginBottom: "8px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ImageIcon sx={{ color: "#757575", marginRight: "8px" }} />
          <Box>
            {fileUrl ? (
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "500",
                  textTransform: "capitalize",
                  color: "black",
                }}
              >
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {fileName}
                </a>
              </Typography>
            ) : (
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {fileName}
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: "#757575" }}>
              {fileSize} · {fileDate}
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ color: "#757575" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FilePreview;
