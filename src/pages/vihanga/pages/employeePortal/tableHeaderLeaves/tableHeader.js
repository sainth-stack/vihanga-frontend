import React,{useState} from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Checkbox,
  ListItemIcon,
  ListItemText,
  Menu,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  CloseOutlined as CrossIcon,
  FilterListOutlined as FilterIcon,
  SystemUpdateAltOutlined as ExportIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomButton from '../../../components/Button/CustomButton'
import TuneIcon from '@mui/icons-material/Tune';
import Close from '../../../../../assets/svg/close.svg';
import Filter from '../../../../../assets/svg/filter_list.svg'
import CheckboxDropdown from "../../objectives/dashboard/tableHeader/DisplayOptions";
import displayOptions from "../../../../../assets/svg/displayOptionsIconDashboard.svg";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ArrowDownwardOutlinedIcon from "../../../../../assets/svg/ExportSvg.svg";
import { useTranslation } from 'react-i18next';
const TableHeader4 = ({
  onExport, // Add this prop back
  search,
  setSearch,
  selectedItems,
  setSelectedItems,
  isCompany,
  isEmployee,
  columns,
  setVisibleColumns,
  visibleColumns = [],
  handleEmployeeExport,
  setStatusAnchorEl,
  statusAnchorEl,
  statusOptions,
  handleStatusToggle,
  selectedStatus,
  showSearch = true,
  showFilterButton,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  filteredData,
  leaveStatusFilter,
  setLeaveStatusFilter,
}) => {

  console.log("showSearch", showSearch);
  const [exportAnchorEl, setExportAnchorEl] = React.useState(null);
  const [displayAnchorEl, setDisplayAnchorEl] = useState(null);
  console.log("visibleColumns", visibleColumns,columns);
  const handleClickExport = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleCloseExport = () => {
    setExportAnchorEl(null);
  };

  const {t} = useTranslation()

  const handleCheckboxChange = (itemText) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemText)
        ? prevSelected.filter((text) => text !== itemText)
        : [...prevSelected, itemText]
    );
  };

  // Export options and logic
  const exportOptions = [
    { text: t("TimeLogin.exportOptions.exportCSV"), format: "csv", icon: ArrowDownwardOutlinedIcon },
    { text: t("TimeLogin.exportOptions.exportExcel"), format: "excel", icon: ArrowDownwardOutlinedIcon },
    { text: t("TimeLogin.exportOptions.exportPDF"), format: "pdf", icon: ArrowDownwardOutlinedIcon },
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
    if (onExport) {
      onExport({ format });
      return;
    }

    // Fallback to local export logic for other components
    const dataToExport = selectedItems && selectedItems.length > 0 ? selectedItems : filteredData;
    if (!dataToExport || dataToExport.length === 0) {
      alert("No data to export");
      return;
    }
    const exportData = dataToExport.map((item) => ({ ...item }));

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
            headStyles: { fillColor: [131, 127, 57], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [245, 245, 245] },
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 1rem",
    margin: ".3rem 0 1rem 0",
    width: "100%",
    flexWrap: "wrap",
    marginTop:'20px'
  }}
>
  {/* LEFT SIDE — Display Options & Status */}
  {(isEmployee || isCompany) && (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <CheckboxDropdown
        anchorEl={displayAnchorEl}
        setAnchorEl={setDisplayAnchorEl}
        options={columns.map((col) => col.label)}
        selectedOptions={visibleColumns?.map(
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
        label={t("task.Display_options")}
      />

      <CheckboxDropdown
        anchorEl={statusAnchorEl}
        setAnchorEl={setStatusAnchorEl}
        options={statusOptions}
        selectedOptions={selectedStatus}
        onToggle={handleStatusToggle}
        label={t("Tasks.Status")}
        useCustomIcons
      /> 
    </Box>
  )}

  {/* RIGHT SIDE — Date, Filter, Search, Export */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      mt: isEmployee || isCompany ? 0 : "10px", // Add margin-top only if no left content
      flexWrap: "wrap",
      justifyContent:'space-between'
    }}
  >
    {/* Conditionally Render Date & Filter for Non-Employees/Companies */}
    {( !showFilterButton && !showSearch) ? (
      // Only show Date and Export (no Filter, no Search)
      <>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #837F39',
            borderRadius: '24px',
            background: '#FEFEFE',
            px: 2,
            py: 0.5,
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            minHeight: 40,
          }}>
  
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 18,
                fontFamily: 'Work Sans',
                color: '#0E0E0E',
                padding: '4px 8px',
                borderRadius: 4,
                minWidth: 110
              }}
            />
            <span style={{ margin: '0 8px', color: '#837F39', fontWeight: 600 }}>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e)=> setEndDate(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 18,
                fontFamily: 'Work Sans',
                color: '#0E0E0E',
                padding: '4px 8px',
                borderRadius: 4,
                minWidth: 110
              }}
            />
          </Box>
          {typeof setLeaveStatusFilter === "function" && (
            <FormControl
              size="small"
              sx={{
                minWidth: 170,
                ml: { xs: 0, sm: 2 },
                mt: { xs: 1, sm: 0 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "24px",
                  background: "#FEFEFE",
                },
              }}
            >
              <InputLabel id="leave-history-status-filter">{t("AbsenceTime.tableColumn.status")}</InputLabel>
              <Select
                labelId="leave-history-status-filter"
                label={t("AbsenceTime.tableColumn.status")}
                value={leaveStatusFilter || "all"}
                onChange={(e) => setLeaveStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
      </>
    ) : (
      <>
        {/* Default: Date & Filter buttons */}
        { !showFilterButton && [
          { label: "Date", icon: Close },
          { label: "Filter", icon: Filter }
        ].map(({ label, icon }) => (
          <Button
            key={label}
            variant="outlined"
            startIcon={<img src={icon} style={{ width: 20, height: 20 }} />}
            sx={{
              width: 151,
              height: 34,
              borderRadius: "100px",
              border: "1px solid #837F39",
              px: 2,
              backgroundColor: "#FEFEFE",
              color: "#0E0E0E",
              fontFamily: "Work Sans",
              fontWeight: 600,
              fontSize: "12px",
              textTransform: "none",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </Button>
        ))}
        {/* Search Field */}
        {showSearch && (
         
          <TextField
            placeholder={t("task.Search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              minWidth: 294,
              border: "1px solid #837F39",
              px: 1,
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
              sx: { "& input": { padding: 0 } },
            }}
          />
        )}
      </>
    )}

    <CustomButton
      iconPosition="start"
      iconExists
      onClick={isEmployee ? handleEmployeeExport : handleClickExport}
      IconProp={ExportIcon}
      text={t("TimeLogin.exportOptions.export")}
      variant="outlined"
      color="#000"
       hoverColor="#fff"
      sx={{
        fontWeight: 550,
        border: "1px solid #85803c",
        borderRadius: "5rem",
        height: "34px",
        "& .MuiInputBase-root": {
          height: "34px",
          px: 1.5,
        },
      }}
    />

    {/* Export Dropdown Menu */}
    {!isEmployee && (
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
          <MenuItem key={index} onClick={() => handleExport(item.format)}

           
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
    )}
  </Box>
</Box>


  );
};

export default TableHeader4;