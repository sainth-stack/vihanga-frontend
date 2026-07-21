import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  SystemUpdateAltOutlined as ExportIcon,
} from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ArrowDownwardOutlinedIcon from "../../../../../../assets/svg/ExportSvg.svg";

import CustomButton from "../../../../components/Button/CustomButton";
import CheckboxDropdown from "../../dashboard/tableHeader/DisplayOptions";

import displayOptions from "../../../../../../assets/svg/displayOptionsIconDashboard.svg";
import buildingIcon from "../../../../../../assets/svg/apartmentinDashboard.svg";

const TableHeader7 = ({
  search,
  setSearch,
  selectedItems,
  columns,
  setVisibleColumns,
  visibleColumns,
  selectedStatus,
  setSelectedStatus,
  handleBulkDelete,
  setIsCompanyOKRsFilterActive,
  isCompanyOKRsFilterActive,
  filteredData,
  handleCascade
}) => {
  const history = useHistory();
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [displayAnchorEl, setDisplayAnchorEl] = useState(null);
 console.log(filteredData)
  const exportOptions = [
    { text: "Export as CSV", format: "csv", icon: ArrowDownwardOutlinedIcon },
    {
      text: "Export as Excel",
      format: "excel",
      icon: ArrowDownwardOutlinedIcon,
    },
    { text: "Export as PDF", format: "pdf", icon: ArrowDownwardOutlinedIcon },
  ];

  const handleStatusToggle = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status]
    );
  };

  const handleExport = (format) => {
    const dataToExport = selectedItems.length > 0 ? selectedItems : filteredData;

    if (!dataToExport || dataToExport.length === 0) {
      alert("No data to export");
      return;
    }

    // Function to flatten the nested OKR structure
    const flattenOKRs = (items, level = 0) => {
      let result = [];

      items.forEach((item) => {
        // Create base record for current item
        const baseRecord = {
          Type: level === 0 ? "Objective" : level === 1 ? "Key Result" : "Task",
          Title: item.title || item.task || "N/A",
          Description: item.description || "N/A",
          Progress: `${item.progress || 0}%`,
          Status: getStatusLabel(item.progress || 0),
          Owner: item.owner?.name || item.owner || "N/A",
          Weight: item.weight ? `${item.weight}%` : "N/A",
          "Start Date": item.startDate
            ? new Date(item.startDate).toLocaleDateString()
            : "N/A",
          "Due Date": item.dueDate
            ? new Date(item.dueDate).toLocaleDateString()
            : "N/A",
          Alignment: item.isAlignedToCompany ? "Company OKR" : "Individual OKR",
          "Created At": item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "N/A",
        };

        result.push(baseRecord);

        // Recursively add children if they exist
        if (item.children && item.children.length > 0) {
          result = result.concat(flattenOKRs(item.children, level + 1));
        }
      });

      return result;
    };

    // Helper function to determine status label
    const getStatusLabel = (progress) => {
      if (progress >= 80) return "On Track";
      if (progress >= 50) return "At Risk";
      return "Off Track";
    };

    // Get flattened data
    const exportData = flattenOKRs(dataToExport);

    // Handle different export formats
    switch (format) {
      case "csv":
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        saveAs(new Blob([csv], { type: "text/csv" }), "okrs_export.csv");
        break;

      case "excel":
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, "OKRs");
        XLSX.writeFile(wb, "okrs_export.xlsx");
        break;

      case "pdf":
        const doc = new jsPDF();
        // Title
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.text("OKRs Export Report", 14, 16);

        // Subtitle with date
        doc.setFontSize(10);
        doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 24);

        // AutoTable configuration
        doc.autoTable({
          head: [Object.keys(exportData[0])],
          body: exportData.map((item) => Object.values(item)),
          startY: 30,
          styles: {
            cellPadding: 3,
            fontSize: 8,
            valign: "middle",
            halign: "left",
            textColor: [40, 40, 40],
          },
          headStyles: {
            fillColor: [131, 127, 57], // Your theme color
            textColor: 255,
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          margin: { top: 30 },
          tableWidth: "wrap",
        });

        doc.save("okrs_export.pdf");
        break;

      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0 1rem",
        alignItems: "center",
        margin: ".3rem 0px 1rem 0px",
        gap: "20px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
        <CheckboxDropdown
          anchorEl={displayAnchorEl}
          setAnchorEl={setDisplayAnchorEl}
          options={columns.map((col) => col.label)}
          selectedOptions={visibleColumns.map(
            (id) => columns.find((col) => col.id === id)?.label
          )}
          onToggle={(label) => {
            const column = columns.find((col) => col.label === label);
            if (!column) return;
            setVisibleColumns((prev) =>
              prev.includes(column.id)
                ? prev.filter((id) => id !== column.id)
                : [...prev, column.id]
            );
          }}
          icon={<img src={displayOptions} alt="Display Options" />}
          label="Display Options"
        />

        <Button
          variant="outlined"
          startIcon={
            <img src={buildingIcon} width={20} height={20} alt="Building" />
          }
          sx={{
            width: "175px",
            height: "34px",
            borderRadius: "100px",
            border: "1px solid #837F39",
            gap: "8px",
            backgroundColor: isCompanyOKRsFilterActive ? "#837F39" : "#FEFEFE",
            color: isCompanyOKRsFilterActive ? "#FFFFFF" : "#0E0E0E",
            fontWeight: 600,
            fontSize: "12px",
            textTransform: "none",
            marginLeft: "10px",
            "&:hover": {
              backgroundColor: isCompanyOKRsFilterActive
                ? "#837F39"
                : "#FEFEFE",
            },
          }}
          onClick={() =>
            setIsCompanyOKRsFilterActive(!isCompanyOKRsFilterActive)
          }
        >
          Company OKRs
        </Button>

           {/* <Button
          variant="outlined"
          sx={{
            width: "100px",
            height: "34px",
            borderRadius: "100px",
            border: "1px solid #837F39",
            gap: "4px",
            backgroundColor: isCompanyOKRsFilterActive ? "#837F39" : "#FEFEFE",
            color: isCompanyOKRsFilterActive ? "#FFFFFF" : "#0E0E0E",
            fontWeight: 600,
            fontSize: "12px",
            textTransform: "none",
            marginLeft: "10px",
            "&:hover": {
              backgroundColor: isCompanyOKRsFilterActive ? "#837F39" : "#FEFEFE",
            },
          }}
   onClick={() => {
                  handleCascade();
                }}        >
          {'Cascade'}
        </Button> */}


        {/* <Button
          variant="outlined"
          startIcon={
            <img src={buildingIcon} width={20} height={20} alt="Delete" />
          }
          onClick={handleBulkDelete}
          disabled={selectedItems.length === 0}
          sx={{
            width: "100px",
            height: "34px",
            borderRadius: "100px",
            border: "1px solid #837F39",
            gap: "8px",
            backgroundColor: "#FEFEFE",
            color: "#0E0E0E",
            fontWeight: 600,
            fontSize: "12px",
            textTransform: "none",
            marginLeft: "10px",
          }}
        >
          Delete
        </Button> */}

        <Box ml={2}>
          <CheckboxDropdown
            anchorEl={statusAnchorEl}
            setAnchorEl={setStatusAnchorEl}
            options={["On Track", "At Risk", "Off Track"]}
            selectedOptions={selectedStatus}
            onToggle={handleStatusToggle}
            label="Status"
            useCustomIcons={true}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: "1rem", marginTop: "15px" }}>
        <TextField
          placeholder="Search here.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: "300px",
            height: "34px",
            border: "1px solid #837F39",
            padding: ".3rem",
            borderRadius: "5rem",
            "& fieldset": { border: "none" },
            ".MuiInputBase-root": {
              height: "100%",
              alignItems: "center",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#85803c" }} />
              </InputAdornment>
            ),
            sx: {
              height: "100%",
              padding: "0 12px",
              "& input": {
                padding: "0",
                fontSize: "12px",
              },
            },
          }}
        />

        <CustomButton
          iconPosition="start"
          iconExists={true}
          onClick={(e) => setExportAnchorEl(e.currentTarget)}
          IconProp={ExportIcon}
          text="Export"
          variant="outlined"
          color="#000"
          sx={{
            margin: "0 0 .3rem .5rem",
            fontWeight: 550,
            border: "1px solid #85803c",
            borderRadius: "5rem",
            height: "34px",
            marginTop: "10px",
          }}
        />

        <Menu
          anchorEl={exportAnchorEl}
          open={Boolean(exportAnchorEl)}
          onClose={() => setExportAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            sx: {
              borderRadius: "1rem",
              border: "1px solid #ddd",
              mt: "10px",
            },
          }}
        >
          {exportOptions.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                handleExport(item.format);
                setExportAnchorEl(null);
              }}
            >
              <ListItemIcon sx={{ minWidth: "30px" }}>
                <img src={item.icon} alt={item.text} width={18} height={18} />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: "#6D6D6D",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              />
            </MenuItem>
          ))}
        </Menu>

        {/* <Button
          variant="outlined"
          startIcon={<AddIcon sx={{ width: 20, height: 20 }} />}
          sx={{
            width: "160px",
            height: "34px",
            borderRadius: "100px",
            border: "1px solid #837F39",
           
            gap: "8px",
            backgroundColor: "#837F39",
            color: "#FFFFFF",
            fontWeight: 500,
            fontSize: "11px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#837F39",
              color: "#FFFFFF",
            },
          }}
          onClick={() => history.push("/admin/objectives/objective")}
        >
          Create OKR
        </Button> */}
      </Box>
    </Box>
  );
};

export default TableHeader7;
