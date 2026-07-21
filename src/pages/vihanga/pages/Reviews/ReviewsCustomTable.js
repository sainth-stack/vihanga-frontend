import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Box,
  Menu,
  Button,
  MenuItem,
  TableSortLabel,
  Select,
  LinearProgress,
  CircularProgress,
  Typography,
  Checkbox,
} from "@mui/material";
import {
  KeyboardDoubleArrowLeft as KeyboardDoubleArrowLeftIcon,
  KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
  MoreVert as MoreVertIcon,
  KeyboardArrowRight,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { Collapse } from "@mui/material";
import ReviewsTableHeader, { formatLabelToTitleCase } from './ReviewsTableHeader';
import { exportToCSV, exportToExcel, exportToPDF } from "utilities/ExportFunctions";
// Removed unused imports and variables

const ReviewsCustomTable = ({
  loading,
  columns,
  data = [],
  sx = {},
  rowsPerPageOptions = [8, 10, 15],
  pagination = true,
  page = 0,
  totalPages = 1,
  rowsPerPage = 8,
  setRowsPerPage = () => {},
  setPage = () => {},
  setSelectedItems = () => {},
  selectedItems = [],
  search = "",
  setSearch = () => {},
  visibleColumns,
  setVisibleColumns = () => {},
  columnsToRender,
  selectedStatus,
  setSelectedStatus,
  filters,
  setFilters,
  selectedCount = 0,
  totalCountChecked = 0,
  onSelectAll = () => {},
  handleBulkDelete = () => {},
  filteredData = [],
  showHeader = true,
  getRowSx,
  header,
  onRowsPerPageChange,
  totalCount,
  rowsPerPageOptions: customRowsPerPageOptions,
}) => {
  const { tableSx, headerSx, columnSx, rowSx } = sx;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [openRows, setOpenRows] = React.useState({});

  const sortedData = [...data]
    .filter((row) =>
      columns
        .filter((col) => col.id !== "actions")
        .some((col) => {
          const value = row[col.id];
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(search.toLowerCase())
          );
        })
    )
    .sort((a, b) => {
      if (orderBy) {
        const aValue = a[orderBy] ?? "";
        const bValue = b[orderBy] ?? "";
        if (typeof aValue === "number") {
          return order === "asc" ? aValue - bValue : bValue - aValue;
        } else {
          return order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      }
      return 0;
    });

  const handleSelectAll = (shouldSelect) => {
    if (shouldSelect) {
      const newSelected = [...new Set([...selectedItems, ...sortedData])];
      setSelectedItems(newSelected);
    } else {
      const newSelected = selectedItems?.filter(
        selectedItem => !sortedData?.some(row => row.id === selectedItem.id)
      );
      setSelectedItems(newSelected);
    }
  };

  const TableHeaderCell = ({ column }) => {
    if (!column) return null;

    if (column?.headerCheckbox && column?.renderHeader) {
      const visibleSelectedCount = Array.isArray(selectedItems) && Array.isArray(sortedData)
        ? (sortedData || []).filter(row =>
            selectedItems?.some(item => item.id === row.id)
          ).length
        : 0;

      return column.renderHeader(
        visibleSelectedCount,
        sortedData.length,
        handleSelectAll
      );
    }

    if (column.sortable) {
      return (
        <TableSortLabel
          active={orderBy === column.id}
          direction={orderBy === column.id ? order : "asc"}
          onClick={() => handleSort(column.id)}
        >
          {column.label || ''}
        </TableSortLabel>
      );
    }

    return <>{column.label || ''}</>;
  };

  // toggleRow function is used in RenderRow component

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    }
  };

  // Add export logic
  const handleExport = (format) => {
    // Use only visible columns for export
    const exportColumns = (columnsToRender?.length > 0 ? columnsToRender : columns).filter(col => col.id && !col.hide && col.id !== 'action' && col.id !== 'move');
    const exportData = data.map(item => {
      const row = {};
      exportColumns.forEach(col => {
        // Format label to Title Case
        const formattedLabel = formatLabelToTitleCase(col.label || col.id);
        if (typeof col.exportValue === 'function') {
          row[formattedLabel] = col.exportValue(item);
        } else {
          row[formattedLabel] = item[col.id];
        }
      });
      return row;
    });
    if (!exportData.length) {
      alert('No data to export');
      return;
    }
    switch (format) {
      case 'csv':
        exportToCSV(exportData);
        break;
      case 'excel':
        exportToExcel(exportData);
        break;
      case 'pdf':
        exportToPDF(exportData);
        break;
      default:
        alert(`Unknown export format: ${format}`);
    }
  };

  const RenderRow = ({
    row,
    level = 0,
    indexPath = [],
    toggleRow,
    openRows,
    columns,
    lastRow
  }) => {
    const indexKey = indexPath.join("-");
  
    return (
      <React.Fragment key={row._id || row.id || indexKey}>
        <TableRow sx={getRowSx ? getRowSx(row) : undefined}>
          {columns?.map((column) => (
            <TableCell 
              key={column.id} 
              sx={{ 
                width: column.width || "auto",
                borderBottom: lastRow ? "none" : "1px solid #F4F4F4",
              }}
            >
              {column.id === "actions" ? (
                column.render(row)
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  ml={`${level * 24}px`}
                  gap="20px"
                >
                  {row.children?.length > 0 && column.id === columns[0].id && (
                    <IconButton
                      size="small"
                      onClick={() => toggleRow(indexKey)}
                      sx={{ padding: 0 }}
                    >
                      {openRows[indexKey] ? (
                        <KeyboardArrowDown sx={{ color: "black" }} tabindex="0" />
                      ) : (
                        <KeyboardArrowRight sx={{ color: "black" }} tabindex="0" />
                      )}
                    </IconButton>
                  )}
                  {column.render ? column.render(row) : row[column.id]}
                </Box>
              )}
            </TableCell>
          ))}
        </TableRow>
  
        {row.children?.length > 0 && openRows[indexKey] && (
          <TableRow>
            <TableCell
              style={{ paddingBottom: 0, paddingTop: 0 }}
              colSpan={columns.length}
            >
              <Collapse in={openRows[indexKey]} timeout="auto" unmountOnExit>
                <Box margin={1}>
                  {row.children.map((child, childIndex) => (
                    <RenderRow
                      key={child._id || child.id || `${indexKey}-${childIndex}`}
                      row={child}
                      level={level + 1}
                      indexPath={[...indexPath, childIndex]}
                      toggleRow={toggleRow}
                      openRows={openRows}
                      columns={columns}
                    />
                  ))}
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{marginBottom: "1rem"}}>
      <Box
        sx={{
          border: "1px solid #85803c",
          borderRadius: "1rem",
        }}
      >
        <ReviewsTableHeader
          search={search}
          setSearch={setSearch}
          title="Reviews"
          showSearch={true}
          showAdd={false}
          showExport={true}
          onExport={handleExport}
        />

        <TableContainer
          sx={{
            borderTop: "1px solid #85803c",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                padding: 2,
              }}
            >
              <CircularProgress />
              <Box
                sx={{
                  marginTop: 2,
                  color: "#85803c",
                  fontSize: "16px",
                }}
              >
                Loading...
              </Box>
            </Box>
          ) : (
            <>
              <Table sx={{ ...tableSx }}>
                <TableHead
                  sx={{
                    ...headerSx,
                    background: "#F4F4F4",
                    borderBottom: "none",
                  }}
                >
                  <TableRow sx={{ display: "contents", ...rowSx }}>
                    {(columnsToRender?.length > 0
                      ? columnsToRender
                      : columns
                    )?.map((col) => (
                      <TableCell
                        key={col.id}
                        sx={{
                          fontSize: "16px",
                          fontWeight: 600,
                          fontFamily: "Montserrat",
                          borderBottom: "none",
                          ...columnSx,
                        }}
                      >
                        <TableHeaderCell column={col} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                {sortedData.length === 0 ? (
                  <>
                    <TableRow>
                      <TableCell
                        colSpan={
                          columnsToRender?.length > 0
                            ? columnsToRender.length
                            : columns.length
                        }
                        sx={{
                          textAlign: "center",
                          fontSize: "16px",
                          fontFamily: "Montserrat",
                          color: "#85803c",
                          padding: "2rem",
                        }}
                      >
                        Oops! It looks like there's No data available ....!
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  sortedData.map((row, idx) => (
                    <RenderRow
                      key={row._id || row.id || idx}
                      row={row}
                      lastRow={idx === sortedData.length - 1}
                      indexPath={[idx]}
                      toggleRow={(key) =>
                        setOpenRows((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                      openRows={openRows}
                      columns={
                        columnsToRender?.length > 0 ? columnsToRender : columns
                      }
                    />
                  ))
                )}
              </Table>
            </>
          )}
        </TableContainer>
      </Box>
      
    
    </Box>
  );
};

export default ReviewsCustomTable; 