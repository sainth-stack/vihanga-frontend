import React, { useState, useEffect } from "react";
import CustomTable from "pages/vihanga/components/CustomTable";
import { useTranslation } from 'react-i18next';
import {
  Box,
  Stack,
  IconButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import ArrowDownwardOutlinedIcon from "../../../../../assets/svg/ExportSvg.svg";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { appURL } from "./../../../../../utilities/baseurl";
import { Toast } from "service/toast";
import { exportToCSV, exportToExcel, exportToPDF } from "utilities/ExportFunctions";
import { canEdit, canDelete } from "utilities/privilegeHelper";

const LeaveTypeTable = ({ onEdit, refreshTable }) => {
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

      const response = await axios.get(`${appURL}/recruitment/leave-type`, {
        params: {
          page: page + 1, // API page is 1-based
          limit: rowsPerPage,
          search,
          companyId, 
          ...filters, // Optional: include other filters if needed
        },
      });
      console.log("response for leav type at get ");
      setData(response.data?.data?.data || []);
     
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
      await axios.delete(
        `${appURL}/recruitment/leave-type?id=${row._id}`
      );
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

  // Handle export
 const handleExport = async (item) => {
   try {
     const response = await axios.get(`${appURL}/recruitment/leave-type`, {
      
       responseType: "json", 
       params: {
        companyId, 
      },
     });

     if (response?.data?.success) {
       // Extract the leave types array from nested response
       const rawData = response.data.data.data;

       // Optional: format rawData to your export fields
       const formattedData = rawData.map((leave) => ({
      
         Name: leave.name || "",
         Code: leave.code || "",
         Eligibility: leave.eligibility || "",
         Status: leave.status || "",
         CreatedAt: new Date(leave.createdAt).toLocaleDateString(),
         UpdatedAt: new Date(leave.updatedAt).toLocaleDateString(),
         CarryOverDate: leave.carryOver?.carryOverDate || "",
         CarryOverExpiry: leave.carryOver?.carryOverExpiry ? "Yes" : "No",
       }));

       // Export according to selected format
       switch (item.format) {
         case "csv":
           exportToCSV(formattedData);
           break;
         case "excel":
           exportToExcel(formattedData);
           break;
         case "pdf":
           exportToPDF(formattedData);
           break;
         default:
           alert(`Unknown export format: ${item.format}`);
           return;
       }

       Toast({
         message: `Exported as ${item.format.toUpperCase()}`,
         type: "success",
       });
     } else {
       alert("Failed to fetch export data.");
     }
   } catch (err) {
     console.error("Export Error:", err);
     Toast({
       message: err.response?.data?.message || "Failed to export data",
       type: "error",
     });
   }
 };


  const columns = [
    {
      id: "name",
      label: t("LeaveTypeTable.TableHeaders.Name"),
      sortable: true,
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row?.name || "N/A"}
        </span>
      ),
    },
    {
      id: "code",
      label: t("LeaveTypeTable.TableHeaders.Code"),
      sortable: true,
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row?.code || "N/A"}
        </span>
      ),
    },
    {
      id: "actions",
      label: t("LeaveTypeTable.TableHeaders.Actions"),
      render: (row) => {
        const actions = [];
        
        if (canEdit()) {
          actions.push(
            <IconButton key="edit" onClick={() => onEdit(row)} size="small">
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <BorderColorIcon fontSize="small" />
            </ListItemIcon>
          </IconButton>
          );
        }
        
        if (canDelete()) {
          actions.push(
            <IconButton key="delete" onClick={() => handleDelete(row)} size="small">
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
          </IconButton>
          );
        }
        
        return actions.length > 0 ? (
          <Stack direction="row" spacing={1} alignItems="center">
            {actions}
        </Stack>
        ) : null;
      },
    },
  ];

  const menuItemsStage = [
    { value: "newapplied", text: "New Applied", progress: 10 },
    { value: "psychometrictest", text: "Psychometric Test", progress: 20 },
  ];

  const menuItemsExportOptions = [
    { text: t("LeaveTypeTable.ExportOptions.ExportAsCSV"), format: "csv", icon: ArrowDownwardOutlinedIcon },
    {
      text: t("LeaveTypeTable.ExportOptions.ExportAsExcel"),
      format: "excel",
      icon: ArrowDownwardOutlinedIcon,
    },
    { text: t("LeaveTypeTable.ExportOptions.ExportAsPDF"), format: "pdf", icon: ArrowDownwardOutlinedIcon },
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
       {t("LeaveTypeTable.PageTitle")}
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <CustomTable
        onExport={handleExport}
        columns={columns}
        data={data}
        menuItemsStage={menuItemsStage}
        menuItemsExportOptions={menuItemsExportOptions}
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

export default LeaveTypeTable;
