import { Box, Container, Typography } from "@mui/material";
import React from "react";

const PdfFooter = ({ displayAddress = true, sx = {},position }) => {
  return (
    <Box
      sx={{
        position: position,
        display: "flex",
        justifyContent: "center",
        bottom: 10,
        left: 10,
        right: 10,

        width: "100%",

        textAlign: "center",
        borderBottom: "10px solid gray",
        padding: "0.5rem 0",
        margin: "1rem 0 0 0",
        ...sx,
      }}
    >
      {displayAddress && (
        <Typography variant="body2">
          61, Blue Marino, Chepaluppada, Visakhapatnam, Andhra Pradesh, 531163
        </Typography>
      )}
    </Box>
  );
};

export default PdfFooter;
