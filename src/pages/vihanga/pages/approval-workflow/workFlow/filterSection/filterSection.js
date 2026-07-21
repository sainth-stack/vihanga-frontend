import React from "react";
import {
  Box,
  InputBase,
  IconButton,
  Button,
  MenuItem,
  Select,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTranslation } from "react-i18next";

const WorkflowFilterCard = ({ search, setSearch }) => {
  const { t } = useTranslation();
  const [type, setType] = React.useState("all");

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        m: 2,
        gap: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      {/* 🔍 Search Input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #A09859",
          borderRadius: "100px",
          px: "12px",
          py: "12px",
          minWidth: "444px",
        }}
      >
        <SearchIcon
          fontSize="small"
          sx={{ color: "#837F39", mr: 1, height: "24px", width: "24px" }}
        />
        <InputBase
          placeholder={t("workflowFilter.searchPlaceholder")}
          fullWidth
          sx={{
            color: "#837F39",
            fontSize: "16px",
            fontFamily: "Work Sans",
            fontWeight: "500",
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* 🔽 Filter Button */}
      <Button
        variant="outlined"
        startIcon={
          <FilterListIcon
            sx={{ width: "24px", height: "24px", color: "#837F39" }}
          />
        }
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          borderColor: "#A09859",
          fontFamily: "Work Sans",
          fontWeight: "500",
          fontSize: "16px",
          px: "12px",
          py: "6px",
          color: "#0E0E0E",
          "&:hover": {
            borderColor: "#A09859",
            backgroundColor: "#f6f6f6",
          },
        }}
      >
        {t("workflowFilter.filterButton")}
      </Button>

      {/* 🔘 Type Dropdown */}
      <Select
        value={type}
        onChange={(e) => setType(e.target.value)}
        displayEmpty
        sx={{
          borderRadius: "20px",
          minWidth: "124px",
          height: 34,
          fontSize: "16px",
          fontFamily: "Work Sans",
          fontWeight: "500",
          backgroundColor: "#FFFFFF",
          color: "#0E0E0E",
          padding: "10px 6px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#837F39",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#837F39",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#837F39",
          },
        }}
      >
        <MenuItem value="all">{t("workflowFilter.allTypes")}</MenuItem>
        <MenuItem value="workflow">{t("workflowFilter.workflow")}</MenuItem>
        <MenuItem value="task">{t("workflowFilter.task")}</MenuItem>
      </Select>
    </Paper>
  );
};

export default WorkflowFilterCard;
