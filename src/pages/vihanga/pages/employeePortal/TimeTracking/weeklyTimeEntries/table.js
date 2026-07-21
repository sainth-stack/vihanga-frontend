import React, { useState } from "react";
import CustomTable from "../../../../components/CustomTable/index";
import {
  IconButton,
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import MobileLeaveCard from "pages/vihanga/components/MobileLeaveCard/MobileLeaveCard";
import { attendanceWeekly } from "../WeeklyTime/weeklyTimeEntries/data";

const getStatusColor = (status) => {
  switch (status) {
    case "Rejected":
      return "#DB5930";
    case "Approved":
      return "#84823F";
    case "Clocked In":
      return "#4CAF50";
    case "Completed":
      return "#2196F3";
    case "pending":
      return "#FFA000";
    default:
      return "#000";
  }
};

const LeaveTable3 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 960px

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedData = [...attendanceWeekly].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const columns = [
    {
      id: "day",
      label: (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Day</span>
          <SwapVertIcon
            style={{
              fontSize: 16,
              color: sortField === "date" ? "#000" : "#777",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSort("date");
            }}
          />
        </Box>
      ),
      sortable: false,
    },
    {
      id: "date",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Date</span>
          <SwapVertIcon
            style={{
              fontSize: 16,
              color: sortField === "date" ? "#000" : "#777",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSort("date");
            }}
          />
        </div>
      ),
      sortable: false,
    },
    {
      id: "timeIn",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Time in</span>
          <SwapVertIcon style={{ fontSize: 16, color: "#777" }} />
        </div>
      ),
      sortable: false,
    },
    {
      id: "timeOut",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Time out</span>
          <SwapVertIcon style={{ fontSize: 16, color: "#777" }} />
        </div>
      ),
      sortable: false,
    },
    {
      id: "hours",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Hours</span>
          <SwapVertIcon style={{ fontSize: 16, color: "#777" }} />
        </div>
      ),
      sortable: false,
    },
    {
      id: "method",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Source</span>
          <SwapVertIcon style={{ fontSize: 16, color: "#777" }} />
        </div>
      ),
      sortable: false,
    },
    {
      id: "remarks",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Remarks</span>
          <SwapVertIcon style={{ fontSize: 16, color: "#777" }} />
        </div>
      ),
      sortable: false,
      render: (row) => row.remarks || "-",
    },
    {
      id: "status",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Status</span>
          <SwapVertIcon style={{ fontSize: 16, color: "#777" }} />
        </div>
      ),
      sortable: false,
      render: (row) => (
        <span style={{ color: getStatusColor(row.status), fontWeight: 500 }}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <>
      <Box
        sx={{
          paddingBottom: isMobile ? "30px" : "70px",
          margin: isMobile ? "1rem .5rem" : "1rem",
          bgcolor: "#fff",
          padding: isMobile ? "10px" : "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        {isMobile && (
          <div>
            <>
              <Typography
                sx={{
                  fontSize: isMobile ? "10px" : isTablet ? "20px" : "24px",
                  marginBottom: "10px",
                }}
              >
                Week : 07 Apr 2025 To 23 Apr 2025{" "}
              </Typography>
            </>
          </div>
        )}

        <div>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column-reverse" : "row",
              justifyContent: isMobile ? "space-between" : "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              width: "100%",
            }}
          >
            <div
              style={{
                paddingLeft: isMobile ? "12px" : "22px",
                marginTop: isMobile ? "0" : 0,
              }}
            >
              <Typography
                sx={{
                  color: "#0E0E0E",
                  fontWeight: "600",
                  fontSize: isMobile ? "10px" : isTablet ? "20px" : "24px",
                  fontFamily: "Montserrat",
                  marginBottom: isMobile ? "8px" : "30px",
                }}
              >
                Weekly Time Entries
              </Typography>
            </div>
            <div
              style={{
                alignSelf: isMobile ? "flex-end" : "unset",
                marginRight: isMobile ? "5px" : "20px",
                marginTop: isMobile ? ".5rem" : "",
              }}
            >
              <Button
                sx={{
                  backgroundColor: "#837F39",
                  color: "#FFFFFF",
                  fontWeight: "500",
                  fontSize: isMobile ? "10px" : isTablet ? "20px" : "24px",
                  fontFamily: "Work Sans",
                  borderRadius: "20px",
                  textTransform: "capitalize",
                }}
              >
                Total:0h 0m
              </Button>
            </div>
          </div>

          {!isMobile && (
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: isMobile ? "10px" : "15px",
                  color: "#707070",
                  fontFamily: "Work Sans",
                  fontWeight: "500",
                  fontSize: isMobile ? "10px" : isTablet ? "20px" : "24px",
                  marginBottom: isMobile ? "30px" : "50px",
                  marginLeft: "22px",
                }}
              >
                <>
                  <Typography>week : 07 Apr 2025 Start </Typography>
                  <Typography>week : 12 Apr 2025 End </Typography>
                </>
              </div>
            </div>
          )}

          {isMobile ? (
            <>
              {sortedData.map((row, index) => {
                const customFields = [
                  { key: "day", label: "Day" },
                  { key: "dateString", label: "Date" },
                  { key: "timeIn", label: "Time In" },
                  { key: "timeOut", label: "Time Out" },
                  { key: "hours", label: "Hours" },
                  { key: "source", label: "Source" },
                  { key: "remarks", label: "Remarks", render: (value, row) => row.remarks || "-" },
                  { key: "status", label: "Status" },
                ];

                return (
                  <MobileLeaveCard
                    key={index}
                    row={row}
                    fields={customFields}
                    // onEdit={() => handleEdit(row)}
                    // onDelete={() => handleDelete(row)}
                  />
                );
              })}
            </>
          ) : (
            <div>
              <CustomTable
                columns={columns}
                data={sortedData}
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                totalPages={Math.ceil(attendanceWeekly.length / rowsPerPage)}
                pagination
              />
            </div>
          )}
        </div>
      </Box>
    </>
  );
};

export default LeaveTable3;
