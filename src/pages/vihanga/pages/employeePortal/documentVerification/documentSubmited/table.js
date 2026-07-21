import React, { useState } from "react";
import CustomTable from "../../../../components/CustomTable/index";
import { documentVerificationData } from "./data"; // updated import
import { IconButton, Box, Typography, Button, LinearProgress } from "@mui/material";
import SwapVertIcon from '@mui/icons-material/SwapVert';

const LeaveTable5 = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const [sortField, setSortField] = useState(null);
const [sortOrder, setSortOrder] = useState("asc");
  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedData = [...documentVerificationData].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });


const columns = [
  {
    id: "documentType",
    label: (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span style={{ fontWeight: 500 }}>Document Type</span>
      </Box>
    ),
    sortable: false,
  },
  {
    id: "attached",
    label: (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span style={{ fontWeight: 500 }}>Attached</span>
      </Box>
    ),
    render: (row) => (
      <Box>
        <span style={{ color: row.attachedColor, fontWeight: 500 }}>
          {row.attached}
        </span>
        <Box mt={1}>
          <LinearProgress
            variant="determinate"
            value={row.progress} // You can control percentage based on attached status
            sx={{
              height: "10px",
              borderRadius: "20px",
              backgroundColor: "#ddd",
              "& .MuiLinearProgress-bar": {
                backgroundColor: row.attachedColor,
              },
            }}
          />
        </Box>
      </Box>
    ),
    sortable: false,
  },
  {
    id: "verified",
    label: (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span style={{ fontWeight: 500 }}>Verified</span>
      </Box>
    ),
    render: (row) => (
      <Box>
        <span style={{ color: row.verifiedColor, fontWeight: 500 }}>
          {row.verified}
        </span>
        <Box mt={1}>
          <LinearProgress
            variant="determinate"
            value={row.progress} // Similarly based on verified status
            sx={{
              height: "10px",
              borderRadius: "20px",
              backgroundColor: "#ddd",
              "& .MuiLinearProgress-bar": {
                backgroundColor: row.verifiedColor,
              },
            }}
          />
        </Box>
      </Box>
    ),
    sortable: false,
  },
];

  return (
    <Box
      sx={{
        paddingBottom: "70px",
        margin: "1rem",
        bgcolor: "#fff",
        padding: "2rem",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: "#0E0E0E",
            fontWeight: 600,
            fontSize: "24px",
            fontFamily: "Montserrat",
            marginBottom: "30px",
            paddingLeft: "22px",
          }}
        >
          Document Submitted for Verification
        </Typography>
        {/* <Button
          sx={{
            backgroundColor: "#837F39",
            color: "#FFFFFF",
            fontWeight: 500,
            fontFamily: "Work Sans",
            marginRight: "20px",
            borderRadius: "20px",
          }}
        >
          Total Documents: {documentVerificationData.length}
        </Button> */}
      </div>

      <CustomTable
        columns={columns}
        data={sortedData}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalPages={Math.ceil(documentVerificationData.length / rowsPerPage)}
        pagination
      />
    </Box>
  );
};

export default LeaveTable5;
