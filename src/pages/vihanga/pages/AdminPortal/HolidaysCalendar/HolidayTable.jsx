import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import CustomTable from "pages/vihanga/components/CustomTable";
import {
  Box,
  Stack,
  IconButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { appURL } from "./../../../../../utilities/baseurl";
import { Toast } from "service/toast";

const HolidayTable = ({ onEdit, refreshTable }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const companyId =
  localStorage.getItem("companyId") !== null
    ? JSON.parse(localStorage.getItem("companyId"))
    : null;
  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {

      const response = await axios.get(`${appURL}/getAllHolidays`, {
  params: {
    companyId, // your company ID
  },
});

      setData(response?.data?.data || []);
     
       setTotalPages(response?.data?.data?.totalPages);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
      Toast({
        message: err.response?.data?.message || "Failed to fetch data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when page, rowsPerPage, search, or filters change
  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, search, filters, refreshTable]);

  // Handle delete
  const handleDelete = async (row) => {
    setLoading(true);
    try {
       await axios.delete(`${appURL}/deleteHoliday`, {
        params: {
          id: row._id,
          companyId,
        },
      });
      Toast({
        message: "Record deleted successfully",
        type: "success",
      });
      fetchData(); // Refresh data after deletion
    } catch (err) {
      console.error("Delete Error:", err);
      Toast({
        message: err.response?.data?.message || "Failed to delete record",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

 


  const columns = [
    {
      id: "holidayName",
      label: t("HolidayTable.TableHeaders.HolidayName"),
      sortable: true,
      render: (row) => (
          row?.holidayName || "N/A"
      ),
    },
    {
      id: "type",
      label: t("HolidayTable.TableHeaders.Type"),
      sortable: true,
      render: (row) => (
          row?.type || "N/A"
      ),
    },
    {
      id: "fromDate",
      label: "From Date",
      render: (row) => {
        const date = new Date(row.fromDate);
        if (isNaN(date.getTime())) return "N/A";
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      },
    },
    {
      id: "toDate",
      label: "To Date",
      render: (row) => {
        const date = new Date(row.toDate);
         if (isNaN(date.getTime())) return "N/A";
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      },
    },
    {
      id: "holidayDuration",
      label: "Holiday Duration",
     render: (row) => (
          row?.holidayDuration || "N/A"
      ),
    },
    
    {
      id: "actions",
      label: t("HolidayTable.TableHeaders.Actions"),
      render: (row) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => onEdit(row)} size="small">
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <BorderColorIcon fontSize="small" />
            </ListItemIcon>
          </IconButton>
          <IconButton onClick={() => handleDelete(row)} size="small">
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
          </IconButton>
        </Stack>
      ),
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
      <Typography
        sx={{
          fontSize: "32px",
          fontWeight: "600",
          fontFamily: `"Montserrat"`,
          color: "#0E0E0E",
        }}
      >
       {t("HolidayTable.HolidaysHistory")}
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <CustomTable
        columns={columns}
        data={data}
        onEdit={onEdit}
        onDelete={handleDelete}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalPages={totalPages}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        loading={loading}
      />
    </Box>
  );
};

export default HolidayTable;
