import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
  Grid,  useTheme,
Alert,Stack,
  useMediaQuery
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import axios from "axios";
import CustomTable from "pages/vihanga/components/CustomTable/index";
import { appURL } from "utilities";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getThemeColors } from "utilities/getThemeColors";
import ArrowDownwardOutlinedIcon from "../../../assets/svg/ExportSvg.svg";
import { exportToCSV, exportToExcel, exportToPDF, toCamelCase } from "utilities/ExportFunctions";
import MobileLeaveCard from "pages/vihanga/components/MobileLeaveCard/MobileLeaveCard";
import { flexibleCompare } from "@fullcalendar/react";
import { useTranslation } from "react-i18next";


const StatusCell = ({ row }) => {
  const rewardPoints = Number(row.rewardPoints) || 0;
  const progressValue = Math.min(100, Math.max(0, rewardPoints)); // Clamp to 0–100

  // 🎯 Determine bar color based on thresholds
  const getBarColor = () => {
    if (progressValue < 30) return "#EF3838"; // red
    if (progressValue < 70) return "#FBC02D"; // yellow
    return "#388e3c"; // green
  };
  const { t } = useTranslation();

  return (
    <Grid style={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography fontSize="14px" sx={{ fontFamily: "Work Sans" }}>
          {rewardPoints} 
        </Typography>
      </Box>

      <Box mt={1} sx={{ width: "100px" }}>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            height: "10px",
            borderRadius: "20px",
            backgroundColor: "#eee",
            "& .MuiLinearProgress-bar": {
              backgroundColor: getBarColor(),
              borderRadius: "20px",
            },
          }}
        />
      </Box>
    </Grid>
  );
};

const StatusTextCell = ({ status }) => {
  const lowerStatus = status?.toLowerCase();
  const isActive = lowerStatus === "active";
  const isInactive = lowerStatus === "inactive";

  const getColor = () => {
    if (isActive) return "#2e7d32";       
    if (isInactive) return "#d32f2f";     
    return "#f9a825";                     // yellow (for unknown or others)
  };

  return (
    <Typography
      sx={{
        color: getColor(),
        fontWeight: 600,
        textTransform: "capitalize",
        fontSize: "14px",
        fontFamily: "Work Sans",
      }}
    >
      {status || "Unknown"}
    </Typography>
  );
};



const RewardsTable = () => {
  ///local storage data---
const companyId = getItemFromLocalStorage("companyId");

  // ------
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const userRoleId = getItemFromLocalStorage("user");
  const theme = useTheme();
  const { t } = useTranslation();
  
  const { primaryColor, secondaryColors } = getThemeColors();
 const mobileFields = [
  {
    label:(<>Reward<br/>Name</>),
    key: "rewardName",
    render: (value) => (
      <Typography 
        sx={{ 
          fontSize: "16px", 
          color: "#2c3e50",
          lineHeight: 1.5,
          ml:6
        }}
      >
        {value || "N/A"}
      </Typography>
    )
  },
  {
    label: (
  <>
    Reward <br /> Points
  </>
),
    key: "rewardPoints",
    render: (value, data) => {
      const rewardPoints = Number(data.rewardPoints) || 0;
      const progressValue = Math.min(100, Math.max(0, rewardPoints));

      const getBarColor = () => {
        if (progressValue < 30) return "#EF3838";
        if (progressValue < 70) return "#FBC02D";
        return "#388e3c";
      };

      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1.5 }}>
          <Typography 
            fontSize="16px" 
            sx={{ 
              fontFamily: "Work Sans", 
              fontWeight: 600,
              color: "#2c3e50",
              ml:6
            }}
          >
            {rewardPoints}
          </Typography>
          <Box sx={{ width: "100px" }}>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: "10px",
                borderRadius: "20px",
                backgroundColor: "#f5f5f5",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: getBarColor(),
                  borderRadius: "20px",
                },
              }}
            />
          </Box>
        </Box>
      );
    }
  },
  {
    label: "Reward Status",
    key: "rewardStatus",
    render: (value) => {
      const lowerStatus = value?.toLowerCase();
      const isActive = lowerStatus === "active";
      const isInactive = lowerStatus === "inactive";

      const getColor = () => {
        if (isActive) return "#2e7d32";
        if (isInactive) return "#d32f2f";
        return "#f9a825";
      };

      return (
        <Box
          sx={{
            backgroundColor: isActive ? "#e8f5e8" : isInactive ? "#ffebee" : "#fff3e0",
            color: getColor(),
            px: 2,
            py: 0.8,
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: 600,
            textTransform: "capitalize",
            border: `1px solid ${getColor()}30`,
            display: "inline-block",
            minWidth: "80px",
            textAlign: "center",ml:6
          }}
        >
          {value || "Unknown"}
        </Box>
      );
    }
  },
  {
    label: "Date",
    key: "createdAt",
    render: (value) => {
      if (!value) return (
        <Typography sx={{ fontSize: "15px", fontWeight: 500, color: "#666" }}>
          N/A
        </Typography>
      );
      const date = new Date(value);
      return (
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 500,
            color: "#546e7a",
            lineHeight: 1.4,
            ml:6
          }}
        >
          {date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Typography>
      );
    }
  }
];
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${appURL}/rewards/getAllRewards/${companyId}`
      );
      let rewards = res.data.data;
      if (!Array.isArray(rewards)) {
        rewards = rewards ? [rewards] : [];
      }

      setData(
        rewards.map((item) => ({
          id: item._id || item.id,
          createdAt: item.createdAt,
          companyId: item?.companyId || "",
          rewardAmount: item?.rewardAmount || "",
          rewardApprover: item?.rewardApprover || "",
          rewardCode: item?.rewardCode || "",
          rewardDescription: item?.rewardDescription || "",
          rewardIcon: item?.rewardIcon || "",
          rewardName: item?.rewardName || "",
          rewardPoints: Number(item?.rewardPoints) || 0,
          rewardStatus: item?.rewardStatus || "",
          rewardType: item?.rewardType || "",
          status: item?.status || "",
          updatedAt: item?.updatedAt || "",
        }))
      );
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch rewards.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortOrder]);

  useEffect(() => {
    if ( rowsPerPage) {
      setTotalPages(Math.ceil(sortedData.length / rowsPerPage));
      console.log("roh sorted data",sortedData)
    }
  }, [sortedData, rowsPerPage]);

const paginatedData = useMemo(() => {
  const start = page * rowsPerPage;
  return sortedData.slice(start, start + rowsPerPage);
}, [sortedData, page, rowsPerPage]);

 const handleViewDetails=()=>{
  console.log("ro dat-",data)
 }


handleViewDetails()
  // Sorting logic
  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const renderHeader = (label, field) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontWeight: 500 }}>{label}</span>
      <SwapVertIcon
      tabIndex={0}
        fontSize="small"
        sx={{ cursor: "pointer", color: "#777" }}
        onClick={(e) => {
          e.stopPropagation();
          handleSort(field);
        }}
      />
    </Box>
  );

  const handleExport = async ({format}) => {
    try {
      if (!data || data.length === 0) {
        alert("No data to export");
        return;
      }

      // Format data for export - exclude React components and format dates
      const exportData = data.map((item) => ({
        [toCamelCase("Reward Name")]: item.rewardName || "",
        [toCamelCase("Reward Points")]: item.rewardPoints || 0,
        [toCamelCase("Reward Status")]: item.rewardStatus || "",
        [toCamelCase("Reward Type")]: item.rewardType || "",
        [toCamelCase("Reward Amount")]: item.rewardAmount || "",
        [toCamelCase("Reward Code")]: item.rewardCode || "",
        [toCamelCase("Reward Description")]: item.rewardDescription || "",
        [toCamelCase("Date Created")]: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }) : "",
        [toCamelCase("Last Updated")]: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }) : "",
      }));

      switch (format) {
        case "csv":
          exportToCSV(exportData);
          break;
        case "excel":
          exportToExcel(exportData);
          break;
        case "pdf":
          exportToPDF(exportData);
          break;
        default:
          alert(`Unknown export format: ${format}`);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
    }
  };
  const menuItemsExportOptions = [
    { text: "Export as CSV", format: "csv", icon: ArrowDownwardOutlinedIcon },
    {
      text: "Export as Excel",
      format: "excel",
      icon: ArrowDownwardOutlinedIcon,
    },
    { text: "Export as PDF", format: "pdf", icon: ArrowDownwardOutlinedIcon },
  ]


  // Table column definitions
  const columns = [
    {
      id: "rewardName",
      label: renderHeader("Reward Name", "rewardName"),
      render: (row) => row.rewardName,
    },
    // {
    //   id: "rewardPoints",
    //   label: renderHeader("Reward Points", "rewardPoints"),
    //   render: (row) => row.rewardPoints,
    // },
   {
  id: "rewardPoints",
  label: renderHeader("Reward Points", "rewardPoints"),
  render: (row) => <StatusCell row={row} />,
},


    // {
    //   id: "rewardPoints",
    //   label: renderHeader("Reward Points", "rewardPoints"),
    //   render: (row) => (
    //     <StatusCell
    //       row={row}
    //       onChange={(rewardPoints) => {
    //         row.status = rewardPoints;
    //         console.log("Updated points:", newStatus);
    //       }}
    //     />
    //   ),
    // },
{
      id: "rewardStatus",
      label: renderHeader("Reward Status", "rewardStatus"),
  render: (row) => <StatusTextCell status={row.rewardStatus} />,
    },
  
    {
  id: "createdAt",
  label: renderHeader("Date", "createdAt"),
  render: (row) => {
    const date = new Date(row.createdAt);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  },
},
    
   
  ];
  // Render loading, error, or table
  if (loading) {
    return (
      <Box
        sx={{
          m: 2,
          p: 2,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          m: 2,
          p: 4,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Typography color="error" sx={{ textAlign: "center" }}>
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        my: 2,
        mx:"auto",
        p: 2,
        bgcolor: secondaryColors.white,
        borderRadius: 2,
        boxShadow: 2,
        pb: {xs:4,sm:6,md:8},
        overflowX: "auto", 
      }}
    >
      <Box
  display="flex"
  flexDirection="column"
  alignItems="flex-start"
>
  <Typography sx={{ fontSize: {xs:16,sm:20,md:22}, fontWeight: 600, mb: 1 }}>
    {t("Rewards.cardTitle")}
  </Typography>
  <Typography sx={{ fontSize: {xs:16,sm:20,md:22}, fontWeight: 600,mb:{xs:1,sm:2}}}>
  {t("Rewards.history")}
  </Typography>
</Box>

      {sortedData.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 100,
            color: "#777",
            fontSize: 18,
          }}
        >
          No rewards found
        </Box>
      ) : (
        <Box
                sx={{
                 paddingBottom: "70px",
                  // margin: 2,
                  bgcolor: secondaryColors.white,
                  padding: isMobile ? ".5" : ".5",
                  borderRadius: "1.5rem",
                  boxShadow: "0px 0.5px 0px rgba(0,0,0,0.2)",
                }}
              > 

      {!isMobile && (  <CustomTable
          columns={columns}
            data={paginatedData}        
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          search={search}
          setSearch={setSearch}
          totalPages={totalPages}
              pagination
              onExport={handleExport}
              menuItemsExportOptions={menuItemsExportOptions}
        />  )}

{isMobile && (
  <Box>
    {loading ? (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    ) : error ? (
      <Alert severity="error">{error}</Alert>
    ) : (
      <Stack >
        {paginatedData.map((row, index) => (
          <MobileLeaveCard
            key={row.id || index}
            row={row}
            fields={mobileFields}
            textColor="#707070"
            cardStyle={{
              height:"auto"
            }}
          />
        ))}
       </Stack>
    )}
  </Box>
)}
        
        </Box>
      )}
  
    </Box>
  );
};

export default RewardsTable;
