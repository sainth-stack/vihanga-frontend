import React, { useState } from "react";
import {
    Search as SearchIcon,
    Add as AddIcon,
    SystemUpdateAltOutlined as ExportIcon,
  } from "@mui/icons-material";
  
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Menu,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Search,
  FilterList,
  Add,
  Download,
  Close,
  KeyboardArrowDown,
} from "@mui/icons-material";
import CustomButton from "pages/vihanga/components/Button/CustomButton";

// Helper function to convert field names to Title Case
export const formatLabelToTitleCase = (label) => {
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

const ReviewsTableHeader = ({
  search,
  setSearch,
  onAdd,
  onExport,
  title = "Reviews",
  showSearch = true,
  showAdd = false,
  showExport = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [exportAnchorEl, setExportAnchorEl] = useState(null);

  const exportOptions = [
    { text: "Export to Excel", format: "excel", icon: "/path/to/excel-icon.png" },
    { text: "Export to PDF", format: "pdf", icon: "/path/to/pdf-icon.png" },
    { text: "Export to CSV", format: "csv", icon: "/path/to/csv-icon.png" },
  ];

  const handleExport = (format) => {
    if (onExport) {
      onExport(format);
    }
    console.log(`Exporting to ${format}`);
  };

    return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 1,
        backgroundColor: "#fafafa",
        borderRadius: "4rem"
        
      }}
    >
      <Box sx={{ display: "flex", gap: "1rem", marginTop: "15px",overflowX:isMobile ? "scroll" : "hidden" }}>
        {/* Search Field */}
        {showSearch && (
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
        )}

        {/* Export Button */}
        {showExport && (
          <>
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
                minWidth:isMobile ? "100px" : "150px",
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
          </>
        )}
      </Box>
    </Box>
  );
};

export default ReviewsTableHeader; 