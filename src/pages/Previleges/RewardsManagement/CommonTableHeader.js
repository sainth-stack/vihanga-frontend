import React, { useState } from "react";
import {
  Box,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CustomButton from "pages/vihanga/components/Button/CustomButton";
import { SystemUpdateAltOutlined as ExportIcon } from "@mui/icons-material";
import { ReactComponent as ExportSvgIcon } from "../../../assets/svg/export.svg";
import { useTranslation } from "react-i18next";

const exportOptions = [
  {
    type: "csv",
    label: "csv",
    icon: <ExportSvgIcon style={{ width: 18, height: 18, color: "#837F39" }} />,
  },
  {
    type: "excel",
    label: "excel",
    icon: <ExportSvgIcon style={{ width: 18, height: 18, color: "#837F39" }} />,
  },
  {
    type: "pdf",
    label: "pdf",
    icon: <ExportSvgIcon style={{ width: 18, height: 18, color: "#837F39" }} />,
  },
];

const CommonTableHeader = ({
  searchText,
  setSearchText,
  handleExport,
  sx = {},
}) => {
  const { t } = useTranslation(); // Translation hook
  const [exportAnchorEl, setExportAnchorEl] = useState(null);

  const handleExportMenuClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = (type) => {
    setExportAnchorEl(null);
    if (type) handleExport(type);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
        alignItems: "center",
        margin: ".5rem .5rem .5rem 0",
        ...sx,
      }}
    >
      <TextField
        placeholder={t("common.searchHere")} // తెలుగు placeholder
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{
          width: 240,
          border: "1px solid #837F39",
          borderRadius: "5rem",
          "& fieldset": { border: "none" },
          height: "34px",
          "& .MuiInputBase-root": { height: "34px", px: 1.5 },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#85803c" }} />
            </InputAdornment>
          ),
          sx: { "& input": { p: 0 } },
        }}
        variant="outlined"
      />

      <CustomButton
        iconPosition="start"
        iconExists={true}
        onClick={handleExportMenuClick}
        IconProp={ExportIcon}
        key={"export"}
        text={t("common.export")} // తెలుగు button text
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
        onClose={() => handleExportMenuClose()}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {exportOptions.map((opt) => (
          <MenuItem
            key={opt.type}
            onClick={() => handleExportMenuClose(opt.type)}
          >
            <ListItemIcon>{opt.icon}</ListItemIcon>
            <ListItemText>{t(`common.${opt.label}`)}</ListItemText>{" "}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default CommonTableHeader;
