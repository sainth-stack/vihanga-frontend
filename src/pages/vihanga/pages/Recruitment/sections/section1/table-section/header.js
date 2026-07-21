import React, { useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Checkbox,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import {
  CloseOutlined as CrossIcon,
  FilterListOutlined as FilterIcon,
  SystemUpdateAltOutlined as ExportIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomButton from "../../../../../components/Button/CustomButton";
import FilterComponent from "./filter";
import { useLocation } from "react-router-dom";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ArrowDownwardOutlinedIcon from "../../../../../../../assets/svg/ExportSvg.svg";
import { useTranslation } from "react-i18next";
const TableHeader = ({
  search,
  setSearch,
  selectedItems,
  setSelectedItems,
  setPage,
  filters,
  setFilters,
  filteredData,
  columns
}) => {
  const location = useLocation();
  const allowedRoutes = ["leave-type", "apply-leave", "eligibitity-criteria"];
 const shouldShowFilters = allowedRoutes.some((route) =>
   location.pathname.includes(route)
 );
  
  const [exportAnchorEl, setExportAnchorEl] = React.useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = React.useState(null);
  const {t} = useTranslation()

  const handleClickExport = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleCloseExport = () => {
    setExportAnchorEl(null);
  };

  const handleClickFilter = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterAnchorEl(null);
  };

  const handleCheckboxChange = (itemText) => {
    setSelectedItems(itemText);
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      candidateId: "",
      candidateName: "",
      department: "",
      position: "",
      stage: "",
      fromDate: "",
      toDate: ""
    });
  };

  const applyFilters = () => {
    handleCloseFilter();
  };

  // Export options and logic (copied and adapted from THeader.js)
  const exportOptions = [
    { text: t("TimeLogin.exportOptions.exportCSV"), format: "csv", icon: ArrowDownwardOutlinedIcon },
    { text: t("TimeLogin.exportOptions.exportExcel"), format: "excel", icon: ArrowDownwardOutlinedIcon },
    { text:t("TimeLogin.exportOptions.exportPDF"), format: "pdf", icon: ArrowDownwardOutlinedIcon },
  ];

  // Helper function to convert field names to Title Case
  const formatLabelToTitleCase = (label) => {
    if (!label) return "";
    // Handle camelCase: convert "candidateId" to "Candidate Id"
    // Handle snake_case: convert "candidate_id" to "Candidate Id"
    // Handle kebab-case: convert "candidate-id" to "Candidate Id"
    return label
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/[_\-]/g, " ") // Replace underscores and hyphens with spaces
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleExport = (format) => {
    // Use selectedItems if any, otherwise use filteredData
    const dataToExport = (selectedItems && selectedItems?.length > 0 && Array.isArray(selectedItems))? selectedItems : filteredData;
    if (!dataToExport || dataToExport?.length === 0) {
      alert("No data to export");
      return;
    }
    // Example: flatten data if needed (customize for your data structure)
    const exportData = dataToExport?.map((item) => ({ ...item }));

    // Get the original keys and create formatted labels
    const originalKeys = Object.keys(exportData[0] || {});
    const formattedLabels = originalKeys.map(key => formatLabelToTitleCase(key));
    
    // Create a mapping object for formatted data
    const formattedData = exportData.map(item => {
      const formattedItem = {};
      originalKeys.forEach((key, index) => {
        formattedItem[formattedLabels[index]] = item[key];
      });
      return formattedItem;
    });

    switch (format) {
      case "csv": {
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        saveAs(new Blob([csv], { type: "text/csv" }), "export.csv");
        break;
      }
      case "excel": {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "export.xlsx");
        break;
      }
      case "pdf": {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.text("Export Report", 14, 16);
        doc.setFontSize(10);
        doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 24);
        if (formattedData.length > 0) {
          doc.autoTable({
            head: [formattedLabels],
            body: formattedData.map((item) => formattedLabels.map(label => item[label])),
            startY: 30,
            styles: { cellPadding: 3, fontSize: 8, valign: "middle", halign: "left", textColor: [40, 40, 40] },
            headStyles: { fillColor: [131, 127, 57], textColor: 255, fontStyle: "bold", halign: "left" },
            alternateRowStyles: { fillColor: [245, 245, 245], halign: "left" },
            margin: { top: 30 },
            tableWidth: "wrap",
          });
        }
        doc.save("export.pdf");
        break;
      }
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: !shouldShowFilters ? "space-between" : "flex-end",

        alignItems: "center",
        width: "100%",
        padding: "16px 24px 16px 24px",
      }}
    >
      {!shouldShowFilters && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <CustomButton
              iconPosition="start"
              iconExists={true}
              IconProp={FilterIcon}
              key={"filters"}
              text={"Filter"}
              fontSize={"12px"}
              variant={"outlined"}
              color={"#000"}
              onClick={handleClickFilter}
              sx={{
                px: 2,
                py: 1,
                fontWeight: 550,
                border: "1px solid #85803c",
                borderRadius: "5rem",
                height: "34px",
                fontFamily: "Work Sans",
                fontSize: "12px",
              }}
            />

            <FilterComponent
              filterAnchorEl={filterAnchorEl}
              handleCloseFilter={handleCloseFilter}
              filters={filters}
              handleFilterChange={handleFilterChange}
              resetFilters={resetFilters}
              applyFilters={applyFilters}
            />
          </Box>
        </>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <TextField
          placeholder={t("AbsenceTime.searchHear")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 240,
            border: "1px solid #837F39",
            borderRadius: "5rem",
            "& fieldset": { border: "none" },
            height: "34px",
            "& .MuiInputBase-root": {
              height: "34px",
              px: 1.5,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#85803c" }} />
              </InputAdornment>
            ),
            sx: {
              "& input": {
                p: 0,
              },
            },
          }}
        />

        <CustomButton
          iconPosition="start"
          iconExists={true}
          onClick={handleClickExport}
          IconProp={ExportIcon}
          key={"export"}
          text={t("TimeLogin.exportOptions.export")}
          variant={"outlined"}
          color={"#000"}
          sx={{
            px: 2,
            py: 1,
            fontWeight: 550,
            border: "1px solid #85803c",
            borderRadius: "5rem",
            height: "34px",
            fontFamily: "Work Sans",
            fontSize: "12px",
          }}
        />

        <Menu
          anchorEl={exportAnchorEl}
          open={Boolean(exportAnchorEl)}
          onClose={handleCloseExport}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            sx: {
              borderRadius: "1rem",
              border: "1px solid #fff",
              mt: 0.5,
            },
          }}
        >
          {exportOptions.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleExport(item.format);
                handleCloseExport();
              }}
            >
              <ListItemIcon sx={{ minWidth: "30px" }}>
                <img src={item.icon} alt={item.text} width="18" height="18" />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: "#6D6D6D",
                  fontWeight: "500",
                  fontSize: "14px",
                  letterSpacing: "1%",
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default TableHeader;