import { Box } from '@mui/material';
import React from 'react'
import defaultLogo from "../../../../assets/images/AppNewLogo.png";
const PdfHeader = () => {
  const companyId =
    localStorage.getItem("companyId") !== null
      ? JSON.parse(localStorage.getItem("companyId"))
      : null;
  let themeLogo = null;
  try {
    if (companyId) {
      const key = `theme_${companyId}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const theme = JSON.parse(raw);
        themeLogo = theme?.logoUrl || null;
      }
    }
  } catch {}
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <img
          src={themeLogo || defaultLogo}
          alt="Logo"
          style={{
            height: "40px",
            margin: "-.5rem 0 0 0",
            boxShadow: "1px 0px 0px gray",
            margin: ".5rem  0 1.5rem 0 ",
          }}
        />
      </Box>
    </>
  );
}

export default PdfHeader
