import React, { useState, useEffect } from "react";
import CustomTable from "pages/vihanga/components/CustomTable";
import {
  Box,
  Stack,
  IconButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import ArrowDownwardOutlinedIcon from "../../../../../assets/svg/ExportSvg.svg";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { appURL } from "./../../../../../utilities/baseurl";
import { Toast } from "service/toast";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
} from "utilities/ExportFunctions";
import { useTranslation } from "react-i18next";
import { canEdit, canDelete } from "utilities/privilegeHelper";

const EligibilityTable = ({ onEdit, refreshTable }) => {
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

  const companyId = localStorage.getItem("companyId")
    ? JSON.parse(localStorage.getItem("companyId"))
    : null;

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${appURL}/recruitment/eligibility-criteria`,
        {
          params: {
            page: page + 1,
            limit: rowsPerPage,
            search,
            companyId,
            ...filters,
          },
        }
      );
      setData(response.data.data.data || []);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(
        err.response?.data?.message || t("EligibilityTable.Messages.FetchError")
      );
      Toast({
        message:
          err.response?.data?.message ||
          t("EligibilityTable.Messages.FetchError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, search, filters, refreshTable]);

  // Handle delete
  const handleDelete = async (row) => {
    setLoading(true);
    try {
      await axios.delete(
        `${appURL}/recruitment/eligibility-criteria?id=${row._id}`
      );
      Toast({
        message: t("EligibilityTable.Messages.DeleteSuccess"),
        type: "success",
      });
      fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
      Toast({
        message:
          err.response?.data?.message ||
          t("EligibilityTable.Messages.DeleteError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle export
  const handleExport = async (item) => {
    try {
      const response = await axios.get(
        `${appURL}/recruitment/eligibility-criteria`,
        {
          responseType: "json",
          params: { companyId },
        }
      );

      if (response?.data?.success) {
        const rawData = response.data.data.data;
        const formattedData = rawData.map((entry) => ({
          EligibilityName: entry.eligibilityName || "",
          LengthOfService: entry.lengthOfService || "",
          JobName: entry.jobName || "",
          Gender: entry.gender || "",
          Grade: entry.grade || "",
          MaritalStatus: entry.maritalStatus || "",
          Location: entry.location || "",
          ProbationPeriod: entry.probationPeriod || "",
          PersonType: entry.personType || "",
          Position: entry.position || "",
          Age: entry.age || "",
          HireDate: entry.hireDate
            ? new Date(entry.hireDate).toLocaleDateString()
            : "",
          Department: entry.department || "",
          WorkType: entry.workType || "",
          CreatedAt: entry.createdAt
            ? new Date(entry.createdAt).toLocaleDateString()
            : "",
          UpdatedAt: entry.updatedAt
            ? new Date(entry.updatedAt).toLocaleDateString()
            : "",
        }));

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
          message: `${t(
            "EligibilityTable.Messages.ExportSuccess"
          )} ${item.format.toUpperCase()}`,
          type: "success",
        });
      } else {
        alert(t("EligibilityTable.Messages.ExportError"));
      }
    } catch (err) {
      console.error("Export Error:", err);
      Toast({
        message:
          err.response?.data?.message ||
          t("EligibilityTable.Messages.ExportError"),
        type: "error",
      });
    }
  };

  const columns = [
    {
      id: "eligibilityName",
      label: t("EligibilityTable.TableHeaders.EligibilityName"),
      sortable: true,
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row.eligibilityName || "N/A"}
        </span>
      ),
    },
    {
      id: "department",
      label: t("EligibilityTable.TableHeaders.Department"),
      sortable: true,
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row.department || "N/A"}
        </span>
      ),
    },
    {
      id: "actions",
      label: t("EligibilityTable.TableHeaders.Actions"),
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
    {
      value: "newapplied",
      text: t("EligibilityTable.MenuItems.Stage.NewApplied"),
      progress: 10,
    },
    {
      value: "psychometrictest",
      text: t("EligibilityTable.MenuItems.Stage.PsychometricTest"),
      progress: 20,
    },
  ];

  const menuItemsExportOptions = [
    {
      text: t("EligibilityTable.MenuItems.ExportOptions.CSV"),
      format: "csv",
      icon: ArrowDownwardOutlinedIcon,
    },
    {
      text: t("EligibilityTable.MenuItems.ExportOptions.Excel"),
      format: "excel",
      icon: ArrowDownwardOutlinedIcon,
    },
    {
      text: t("EligibilityTable.MenuItems.ExportOptions.PDF"),
      format: "pdf",
      icon: ArrowDownwardOutlinedIcon,
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
        {t("EligibilityTable.Title")}
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
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalPages={totalPages}
        loading={loading}
        menuItemsStage={menuItemsStage}
        menuItemsExportOptions={menuItemsExportOptions}
        onEdit={onEdit}
        onDelete={handleDelete}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
      />
    </Box>
  );
};

export default EligibilityTable;
