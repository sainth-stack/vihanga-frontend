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
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { appURL } from "./../../../../../utilities/baseurl";
import { Toast } from "service/toast";
import ArrowDownwardOutlinedIcon from "../../../../../assets/svg/ExportSvg.svg";
import { exportToCSV, exportToExcel, exportToPDF } from "utilities/ExportFunctions";
import { canEdit, canDelete } from "utilities/privilegeHelper";

const DocumentTypeTable = ({ onEdit, refreshTable, privilegeGroupsData, isHR = true }) => {
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

  // Calculate employee count for a specific row's privilege group
  const getEmployeeCountForRow = (row) => {
    if (!row.privilegeGroup) {
      return "N/A";
    }

    if (!privilegeGroupsData || privilegeGroupsData.length === 0) {
      return "N/A";
    }

    // Find the privilege group by name
    const group = privilegeGroupsData.find(g => g.groupName === row.privilegeGroup);
    
    if (group && group.activeGroupMembers) {
      return group.activeGroupMembers.length;
    }

    return 0;
  };

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${appURL}/recruitment/document-type`,
        {
          params: {
            companyId,
            page: page + 1,
            limit: rowsPerPage,
            search,
            ...filters,
          },
        }
      );
      const responseData = response?.data?.data || {};
      setData(responseData.data || []);
      setTotalPages(responseData.totalPages || 1);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(
        err.response?.data?.message || "Failed to fetch document types"
      );
      Toast({
        message: err.response?.data?.message || "Failed to fetch document types",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, search, filters, refreshTable, companyId]);

  const handleDelete = async (row) => {
    const confirmMessage = 
      `Are you sure you want to delete this document type?\n\n` +
      `⚠️ WARNING: This will also delete ALL related submissions (pending, approved, rejected).\n\n` +
      `This action cannot be undone!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await axios.delete(`${appURL}/recruitment/document-type`, {
        params: { id: row._id },
      });
      
      const deletedSubmissions = response?.data?.data?.deletedSubmissions || 0;
      
      Toast({
        message: response?.data?.message || 
          `Document type and ${deletedSubmissions} submission(s) deleted successfully`,
        type: "success",
      });
      fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
      Toast({
        message: err.response?.data?.message || "Failed to delete document type",
        type: "error",
      });
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`${appURL}/recruitment/document-type`, {
        params: { companyId, limit: 10000 },
      });
      const allData = response?.data?.data?.data || [];

      // Create export data with only the fields we want, excluding internal MongoDB fields like __v
      const exportData = allData.map((item) => {
        const cleanItem = {
          "Document Type Name": item.documentTypeName,
          Code: item.documentCode,
          Status: item.status,
          "Employee Count": getEmployeeCountForRow(item),
          "Number of Fields": item.dynamicFields?.length || 0,
        };
        return cleanItem;
      });

      // Additional filter to ensure no internal fields are present
      const filteredExportData = exportData.map((item) => {
        const filtered = {};
        Object.keys(item).forEach((key) => {
          // Exclude MongoDB internal fields and any other unwanted fields
          if (!key.startsWith("_") && key !== "__v") {
            filtered[key] = item[key];
          }
        });
        return filtered;
      });

      if (format === "csv") {
        exportToCSV(filteredExportData, "document_types");
      } else if (format === "excel") {
        exportToExcel(filteredExportData, "document_types");
      } else if (format === "pdf") {
        exportToPDF(filteredExportData, "document_types");
      }
    } catch (err) {
      console.error("Export Error:", err);
      Toast({
        message: "Failed to export data",
        type: "error",
      });
    }
  };

  const columns = [
    {
      id: "documentTypeName",
      label: "Document Type Name",
      sortable: true,
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row?.documentTypeName || "N/A"}
        </span>
      ),
    },
    {
      id: "code",
      label: "Code",
      sortable: true,
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row?.documentCode || "N/A"}
        </span>
      ),
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span
          style={{
            color: row?.status === "active" ? "#4caf50" : "#999",
            fontWeight: 500,
            textTransform: "capitalize",
          }}
        >
          {row?.status || "N/A"}
        </span>
      ),
    },
    {
      id: "employeeCount",
      label: "Employee Count",
      sortable: false,
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {getEmployeeCountForRow(row)}
        </span>
      ),
    },
    {
      id: "fieldsCount",
      label: "Fields Count",
      sortable: false,
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row?.dynamicFields?.length || 0}
        </span>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => {
        const hasEditPermission = canEdit();
        const hasDeletePermission = canDelete();
        
        // Don't render actions column if user has no permissions
        if (!hasEditPermission && !hasDeletePermission) {
          return null;
        }
        
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            {hasEditPermission && (
              <IconButton 
                onClick={() => onEdit(row)} 
                size="small"
                sx={{
                  color: "#837F39",
                  "&:hover": {
                    backgroundColor: "#837F3920",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <BorderColorIcon fontSize="small" />
                </ListItemIcon>
              </IconButton>
            )}
            {hasDeletePermission && (
              <IconButton 
                onClick={() => handleDelete(row)} 
                size="small"
                sx={{
                  color: "#d32f2f",
                  "&:hover": {
                    backgroundColor: "#d32f2f20",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
              </IconButton>
            )}
          </Stack>
        );
      },
    },
  ];

  // Filter columns based on privileges
  const columnsToRender = columns.filter((col) => {
    // Hide actions column if user has no edit or delete privileges
    if (col.id === "actions" && !canEdit() && !canDelete()) {
      return false;
    }
    return true;
  });

  const menuItemsStage = [
    { value: "newapplied", text: "New Applied", progress: 10 },
    { value: "psychometrictest", text: "Psychometric Test", progress: 20 },
  ];

  const menuItemsExportOptions = [
    { text: "Export as CSV", format: "csv", icon: ArrowDownwardOutlinedIcon },
    {
      text: "Export as Excel",
      format: "excel",
      icon: ArrowDownwardOutlinedIcon,
    },
    { text: "Export as PDF", format: "pdf", icon: ArrowDownwardOutlinedIcon },
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
        Document Types List
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <CustomTable
        onExport={handleExport}
        columns={columnsToRender}
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

export default DocumentTypeTable;

