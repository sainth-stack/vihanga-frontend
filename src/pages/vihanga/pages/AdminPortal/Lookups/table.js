import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Checkbox,
  CircularProgress,
  TextField,
  Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateTable from "./createTable";
import DeleteIcon from "@mui/icons-material/Delete";
import { Toast } from '../../../../../service/toast';
import { useTranslation } from "react-i18next";
import { canEdit, canDelete } from "utilities/privilegeHelper";

// Create separate components for input fields to use hooks properly
const InputFieldComponent = ({ row, field, type, multiline, rows, placeholder, onRowChange }) => {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);
  
  // Set focus if this input was previously focused
  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);
  
  const handleFocus = () => {
    setFocused(true);
  };
  
  const handleBlur = () => {
    setFocused(false);
  };
  
  return (
    <TextField
      inputRef={inputRef}
      variant="standard"
      fullWidth
      type={type}
      multiline={multiline}
      rows={multiline ? rows : 1}
      value={row[field] || ""}
      onChange={(e) => onRowChange(row.id, field, e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={!canEdit()}
      InputProps={{
        disableUnderline: true,
        style: { 
          whiteSpace: multiline ? "normal" : "nowrap", 
          wordBreak: multiline ? "break-word" : "normal", 
          backgroundColor: field === "code" ? "#f4f4f4" : "#FFFFFF",
          border: "1px solid #F4F4F4",
          borderRadius: "9px",        
          padding: "8px 12px", 
          boxShadow: "0px 0.9px 1.8px 0px #1018280D",
          fontSize: "14px",
          fontFamily: "Work Sans, sans-serif"
        },
      }}
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "14px",
          fontFamily: "Work Sans, sans-serif"
        }
      }}
    />
  );
};

const DateFieldComponent = ({ row, field, onRowChange }) => {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);
  
  // Set focus if this input was previously focused
  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);
  
  const handleFocus = () => {
    setFocused(true);
  };
  
  const handleBlur = () => {
    setFocused(false);
  };
  
  return (
    <TextField
      inputRef={inputRef}
      type="date"
      variant="standard"
      fullWidth
      value={row[field] || ""}
      onChange={(e) => onRowChange(row.id, field, e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={!canEdit()}
      InputProps={{
        disableUnderline: true,
        style: {
          backgroundColor: "#FFFFFF",
          border: "1px solid #F4F4F4",
          borderRadius: "9px",
          padding: "4px 8px",
          boxShadow: "0px 0.9px 1.8px 0px #1018280D",
          fontSize: "14px",
          fontFamily: "Work Sans, sans-serif"
        },
      }}
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "14px",
          fontFamily: "Work Sans, sans-serif"
        }
      }}
    />
  );
};

const LookupsTable = ({ ratingScaleData = [], onRatingScaleChange }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  // Ensure at least one row exists by notifying parent once on mount
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && (!ratingScaleData || ratingScaleData.length === 0)) {
      const defaultRow = {
        id: `rating-${Date.now()}`,
        code: "",
        meaning: "",
        dateStart: "",
        dateEnd: "",
        enabled: true,
      };
      onRatingScaleChange?.([defaultRow]);
      initializedRef.current = true;
    }
  }, [ratingScaleData, onRatingScaleChange]);

  // Keep a ref of the latest data to avoid re-creating handlers on each change
  const dataRef = useRef(ratingScaleData);
  useEffect(() => {
    dataRef.current = ratingScaleData;
  }, [ratingScaleData]);

  // Add new row
  const handleAddRow = useCallback(() => {
    const newRow = {
      id: `rating-${Date.now()}`,
      code: "",
      meaning: "",
      dateStart: "",
      dateEnd: "",
      enabled: true,
    };
    const current = dataRef.current || [];
    const newData = [...current, newRow];
    onRatingScaleChange?.(newData);
  }, [onRatingScaleChange]);

  // Delete row
  const handleDeleteRow = useCallback((rowId) => {
    const current = dataRef.current || [];
    // Don't allow deleting the last row - always keep at least one
    if ((current.length || 0) <= 1) {
      Toast({ type: "warning", message: "At least one rating scale row is required" });
      return;
    }

    const newData = current.filter(row => row.id !== rowId);
    onRatingScaleChange?.(newData);
  }, [onRatingScaleChange]);

  // Update row data - optimized to prevent focus loss
  const handleRowChange = useCallback((rowId, field, value) => {
    const current = dataRef.current || [];
    const newData = current.map(row =>
      row.id === rowId ? { ...row, [field]: value } : row
    );
    onRatingScaleChange?.(newData);
  }, [onRatingScaleChange]);

  const data = ratingScaleData || [];
  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      if (!sortField) return 0;
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [data, sortField, sortOrder, page, rowsPerPage]);

  const columns = useMemo(() => [
    {
      id: "code",
      label: t("LookUpScreen.Code"), 
      render: (row) => (
        <InputFieldComponent 
          row={row} 
          field="code" 
          type="number" 
          placeholder="Enter code" 
          onRowChange={handleRowChange}
        />
      ),
    },
    {
      id: "meaning",
      label: t("LookUpScreen.Meaning"),
      render: (row) => (
        <InputFieldComponent 
          row={row} 
          field="meaning" 
          multiline={true} 
          rows={2} 
          placeholder="Enter meaning" 
          onRowChange={handleRowChange}
        />
      ),
    },
    {
      id: "dateStart",
      label: t("LookUpScreen.DateStart"),
      render: (row) => (
        <DateFieldComponent 
          row={row} 
          field="dateStart" 
          onRowChange={handleRowChange}
        />
      ),
    },
    {
      id: "dateEnd",
      label: t("LookUpScreen.DateEnd"),
      render: (row) => (
        <DateFieldComponent 
          row={row} 
          field="dateEnd" 
          onRowChange={handleRowChange}
        />
      ),
    },
    {
      id: "enabled",
      label: t("LookUpScreen.Enabled"),
      render: (row) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center !important",
            alignItems: "center !important",
            height: "100%",
          }}
        >
          <Checkbox
            checked={Boolean(row.enabled)}
            onChange={(e) => handleRowChange(row.id, "enabled", e.target.checked)}
            disabled={!canEdit()}
            sx={{
              padding: 0,
              color: "#837F39",
              "&.Mui-checked": {
                color: "#837F39",
              },
              "& .MuiSvgIcon-root": {
                fontSize: 28,
              },
            }}
          />
        </Box>
      ),
    },
    {
      id: "actions",
       label: t("LookUpScreen.Actions"),
      render: (row) => {
        if (!canDelete()) return null;
        
        return (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => handleDeleteRow(row.id)}
              disabled={(data.length || 0) <= 1}
              sx={{
                minWidth: "auto",
                padding: "8px",
                color: (data.length || 0) <= 1 ? "#ccc" : "#d32f2f",
                "&:hover": {
                  backgroundColor: (data.length || 0) <= 1 ? "transparent" : "rgba(211, 47, 47, 0.1)",
                },
                "&.Mui-disabled": {
                  color: "#ccc",
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </Box>
        );
      },
    },
  ], [handleRowChange, handleDeleteRow, data.length]);

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        width: "100%",
      }}
    >
      {/* Add Row Button */}
      {canEdit() && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
            sx={{
              backgroundColor: "#837F39",
              "&:hover": { backgroundColor: "#6f6b32" },
              fontFamily: "Work Sans, sans-serif",
              fontWeight: "500",
              borderRadius: "20px",
              fontSize: "14px",
              textTransform: "none",
              px: 3,
              py: 1
            }}
          >
            {t("LookUpScreen.Add")} 
          </Button>
        </Box>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
      ) : (
        <CreateTable
          columns={columns}
          data={sortedData}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={Math.ceil(data.length / rowsPerPage)}
          pagination
        />
      )}
    </Box>
  );
};

export default LookupsTable;