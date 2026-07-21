import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import axios from "axios";
import CustomTable from "../../../../components/CustomTable";
import ActionDropdown from "../../../../components/ActionDropdown/ActionDropdown";
import {Toast} from '../../../../../../service/toast'
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { appURL } from "utilities";



const ExitInterviewTable = ({ onEdit, refreshTrigger }) => {

  ///locals
const companyId = getItemFromLocalStorage("companyId")


    const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});


  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${appURL}/recruitment/allExitInterView?companyId=${companyId}`);
      
      let ExitInterviews = res.data.data;
      if (!Array.isArray(ExitInterviews)) {
        ExitInterviews = ExitInterviews ? [ExitInterviews] : [];
      }

      const enrichedData = ExitInterviews.map((item) => ({
        id: item._id || item.id,
        employeeId: item.employeeId || "",
        employeeName: item.employeeName || "",
        employeeNumber: item.employeeNumber || "",
        q1: item.exitInterview?.q1 || "",
        q2: item.exitInterview?.q2 || "",
        q3: item.exitInterview?.q3 || "",
        q4: item.exitInterview?.q4 || "",
        q5: item.exitInterview?.q5 || "",
        q6: item.exitInterview?.q6 || "",
        createdAt: item.createdAt || "",
      }));

      setData(enrichedData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch exit interview questions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleDelete = async (row,companyId) => {
    console.log("row--at delete----------",row)
    try {
      await axios.delete(`${appURL}/recruitment/deleteExitInterView?id=${row.employeeId}&companyId=${companyId}`, {
        
      });
      Toast({ type: "success", message: "Feedback deleted successfully." });
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      Toast({ type: "error", message: "Failed to delete. Please try again." });
    }
  };

 

// const handleEdit = (rowId) => {
//     const item = data.find((row) => row.id === rowId);
//     if (item) {
//       setEditData(item);
    
//     }
//   };


//   const handleMenuOpen = (event, rowId) => {
//     setSelectedRowId(rowId);
//     setMenuAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchorEl(null);
//     setSelectedRowId(null);
//   };


  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (!sortField) return 0;
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortField, sortOrder, data]);

  const paginatedData = useMemo(() => {
  const start = page * rowsPerPage;
  const end = start + rowsPerPage;
  return sortedData.slice(start, end);
}, [sortedData, page, rowsPerPage]);


 useEffect(() => {
  setTotalPages(Math.ceil(sortedData.length / rowsPerPage));
}, [sortedData, rowsPerPage]);

  const renderHeaderWithSort = (label, field) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <span style={{ fontWeight: 500 }}>{label}</span>
      <SwapVertIcon
        style={{ fontSize: 16, color: "#777", cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          handleSort(field);
        }}
      />
    </Box>
  );

  const columns = [
    { 
      id: "sno", 
      label: <span style={{ fontWeight: 500 }}>S.No</span>, 
      render: (row) => {
        const rowIndex = paginatedData.findIndex(item => item.id === row.id);
        return page * rowsPerPage + rowIndex + 1;
      }
    },
    { 
      id: "employeeName", 
      label: renderHeaderWithSort("Employee Name", "employeeName"), 
      render: (row) => row.employeeName || "N/A"
    },
    { 
      id: "employeeNumber", 
      label: renderHeaderWithSort("Employee Number", "employeeNumber"), 
      render: (row) => row.employeeNumber || "N/A"
    },
    { 
      id: "question1", 
      label: renderHeaderWithSort("Q1", "question1"), 
      render: (row) => (
        <Box sx={{ maxWidth: 200, wordWrap: 'break-word' }}>
          {row.q1 || "N/A"}
        </Box>
      )
    },
    { 
      id: "question2", 
      label: renderHeaderWithSort("Q2", "question2"), 
      render: (row) => (
        <Box sx={{ maxWidth: 200, wordWrap: 'break-word' }}>
          {row.q2 || "N/A"}
        </Box>
      )
    },
    { 
      id: "question3", 
      label: renderHeaderWithSort("Q3", "question3"), 
      render: (row) => (
        <Box sx={{ maxWidth: 200, wordWrap: 'break-word' }}>
          {row.q3 || "N/A"}
        </Box>
      )
    },
    {
      id: "question4",
      label: renderHeaderWithSort("Q4", "question4"),
      render: (row) => (
        <Box sx={{ maxWidth: 200, wordWrap: 'break-word' }}>
          {row.q4 || "N/A"}
        </Box>
      )
    },
    { 
      id: "question5", 
      label: renderHeaderWithSort("Q5", "question5"), 
      render: (row) => (
        <Box sx={{ maxWidth: 200, wordWrap: 'break-word' }}>
          {row.q5 || "N/A"}
        </Box>
      )
    },
    { 
      id: "question6", 
      label: renderHeaderWithSort("Q6", "question6"), 
      render: (row) => (
        <Box sx={{ maxWidth: 200, wordWrap: 'break-word' }}>
          {row.q6 || "N/A"}
        </Box>
      )
    },
    {
      id: "createdAt",
      label: renderHeaderWithSort("Created Date", "createdAt"),
      render: (row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      },
      // render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"
    },
    {
      id: "action",
      label: <span style={{ fontWeight: 500 }}>Action</span>,
      render: (row) => (
        <ActionDropdown
          row={row}
          actions={[
            {
              label: "Edit",
              icon: <BorderColorIcon fontSize="small" />,
              onClick: () => {
                onEdit(row)
                console.log("row----",row)
              }
            },
            {
              label: "Delete",
              icon: <DeleteIcon fontSize="small" />,
              onClick: () => handleDelete(row,companyId),
            },
          ]}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          margin: "1rem",
          bgcolor: "#fff",
          padding: "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
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
          margin: "1rem",
          bgcolor: "#fff",
          padding: "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Typography color="error" sx={{textAlign:"center"}}>Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        margin: "1rem",
        padding: "2rem",
        bgcolor: "#fff",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        paddingBottom: "70px",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            color: "#0E0E0E",
            fontWeight: "600",
            fontSize: "24px",
            fontFamily: "Montserrat",
            mb: "30px",
            pl: "22px",
          }}
        >
         Exit Interview Records
        </Typography>
      </Box>

      {sortedData.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
            color: "#777",
            fontSize: "18px",
          }}
        >
          No data found
        </Box>
      ) : (
        <CustomTable
          columns={columns}
          data={paginatedData}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          search={search}
          setSearch={setSearch}
          onEdit={onEdit}
          totalPages={totalPages}
          pagination
        />
       )} 
    </Box>
  );
};

export default ExitInterviewTable;
