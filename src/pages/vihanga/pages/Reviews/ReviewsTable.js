import React, { useEffect, useState } from "react";
import "./styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { deleteReviewForm } from "action/ReviewFormAct";
import { useDispatch } from "react-redux";
import { updateReviewForm } from "action/ReviewFormAct";
import useGetReview from "./hooks/usegetReview";
import ReviewAction from "./ReviewAction";
import CustomTable from "pages/vihanga/components/CustomTable";
import { useQueryClient } from "@tanstack/react-query";
import MoveAsModal from "./ObjectiveMobile/movePopup";
import { t } from "i18next";
import ArrowDownwardOutlinedIcon from "../../../../assets/svg/ExportSvg.svg";
import { exportToCSV, exportToExcel, exportToPDF } from "utilities/ExportFunctions";
import { formatLabelToTitleCase } from "./ReviewsTableHeader";
import { 
  useMediaQuery, 
  useTheme, 
  Box, 
  InputAdornment, 
  IconButton,
  Button,
  Menu,
  MenuItem,
  Typography,
  TablePagination,
  CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GetAppIcon from "@mui/icons-material/GetApp";
import MobileLeaveCard from "../../components/MobileLeaveCard/MobileLeaveCard";
import { InputTextComponent } from "../../components/input-elements/text";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getThemeColors } from "utilities/getThemeColors";

export default function ReviewsTable() {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Changed to 'md' to include tablets
  const [, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [, setError] = useState("");
  const [filterText, setFilterText] = useState("all");
  const [selectedData, setSelectedData] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState(""); // <-- add search state
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const { data: ReviewResponse, isLoading: ReviewLoading, error: ReviewError } = useGetReview();

  const opt1 = [
    { key: "Self submission", value: "Submit" },
    { key: "Manager Review", value: "Manager Review" },
    { key: "HR Calibration", value: "HR Review" },
    { key: "Manager Signoff", value: "Manager Signoff" },
    { key: "Employee Sign off", value: "Employee Sign off" },
    { key: "Completed", value: "Completed" },
  ];
  const { primaryColor, secondaryColors } = getThemeColors();
  const handleDelete = (id) => {
    let response = dispatch(deleteReviewForm(id));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        queryClient.invalidateQueries("reviewsForm");
      } else {
        setLoading(false);
      }
    });
  };
  
  const handleCallback2 = (selectedUserId) => {
    if (selectedData) {
      let response = dispatch(updateReviewForm(selectedData._id, { ...selectedData, status: selectedUserId }, false));
      response.then(({ success, message }) => {
        if (success) {
          setLoading(false);
          setShowModal(false);
          queryClient.invalidateQueries("reviewsForm");
        } else {
          setLoading(false);
        }
      });
    }
  };

  // Mobile card action handlers
  const handleEdit = (row) => {
    window.location.href = `/admin/reviews/${row._id}`;
  };

  const handleViewReport = (row) => {
    window.open(`/admin/reviews-report/${row._id}/${row.employeeId}`, '_blank', 'noopener,noreferrer');
  };

  const handleMove = (row) => {
    setShowModal(true);
    setSelectedData(row);
  };

  // Define fields for mobile card display
  const cardFields = [
    {
      key: "employeeFullName",
      label: t("Reviews.employee"),
      render: (value) => value || "N/A"
    },
    {
      key: "startDate",
      label: t("Reviews.startDate"),
      render: (value) => value || "N/A"
    },
    {
      key: "endDate",
      label: t("Reviews.endDate"),
      render: (value) => value || "N/A"
    },
    {
      key: "createdAt",
      label: t("Reviews.createdAt"),
      render: (value) => value ? window.moment(value).format("YYYY-MM-DD") : "N/A"
    },
    {
      key: "updatedAt",
      label: t("Reviews.updatedAt"),
      render: (value) => value ? window.moment(value).format("YYYY-MM-DD") : "N/A"
    },
    {
      key: "templateName",
      label: t("Reviews.template"),
      render: (value) => value || "N/A"
    },
    {
      key: "status",
      label: t("Reviews.status"),
      render: (value) => value === 'Submit' ? t("Reviews.selfSubmission") : value
    }
  ];

  // Check if user can move reviews (not an employee)
  const canMove = !JSON.parse(localStorage.getItem("user") || '{}')?.role?.includes('Employee');

  const columns = [
    {
      id: "employeeFullName",
      label: t("Reviews.employee"),
      sortable: true,
      render: (row) => (
        <div>
          <a href={`/admin/reviews/${row?._id}`}>{row?.employeeFullName}</a>
          <i className="fa fa-trash cursor-pointer ml-2" onClick={() => handleDelete(row?._id)} />
        </div>
      ),
      exportValue: (row) => row?.employeeFullName || row?.employeeFullName || "",
    },
    {
      id: "startDate",
      label: t("Reviews.startDate"),
      sortable: true,
      render: (row) => <div>{row?.startDate}</div>,
      exportValue: (row) => row?.startDate || "",
    },
    {
      id: "endDate",
      label: t("Reviews.endDate"),
      sortable: true,
      render: (row) => <div>{row?.endDate}</div>,
      exportValue: (row) => row?.endDate || "",
    },
    {
      id: "createdAt",
      label: t("Reviews.createdAt"),
      sortable: true,
      render: (row) => <div>{window.moment(row.createdAt).format("YYYY-MM-DD")}</div>,
      exportValue: (row) => row.createdAt ? window.moment(row.createdAt).format("YYYY-MM-DD") : "",
    },
    {
      id: "updatedAt",
      label: t("Reviews.updatedAt"),
      sortable: true,
      render: (row) => <div>{window.moment(row.updatedAt).format("YYYY-MM-DD")}</div>,
      exportValue: (row) => row.updatedAt ? window.moment(row.updatedAt).format("YYYY-MM-DD") : "",
    },
    {
      id: "templateName",
      label: t("Reviews.template"),
      sortable: true,
      render: (row) => <div>{row?.templateName}</div>,
      exportValue: (row) => row?.templateName || "",
    },
    {
      id: "move",
      label: t("Reviews.move"),
      sortable: true,
      hide: localStorage.getItem("user") !== null && JSON.parse(localStorage.getItem("user"))?.role.includes('Employee'),
      render: (row) => (
        <div>
          <button className="btn btn-primary bg-brown" onClick={() => { setShowModal(true); setSelectedData(row); }}>
            {t("Reviews.move")}
          </button>
        </div>
      ),
    },
    {
      id: "status",
      label: t("Reviews.status"),
      sortable: true,
      render: (row) => (
        <div>
          {row.status === 'Submit' ? t("Reviews.selfSubmission") : row.status}
        </div>
      ),
      exportValue: (row) => row.status === 'Submit' ? t("Reviews.selfSubmission") : row.status,
    },
    {
      id: "action",
      label: t("Reviews.action"),
      sortable: true,
      render: (row) => <ReviewAction row={row} />,
      // Remove exportValue so it is not included in export
    },
  ].filter(column => !column.hide);

  const getAllReview = () => {
    try {
      setLoading(true);

      const { data = [], success, message } = ReviewResponse;

      if (data && data.length > 0) {
        setReviews(data);
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  useEffect(() => {
    getAllReview();
  }, [ReviewResponse]);

  const filteredReviews = reviews.filter((items) => {
    if (filterText === "all") {
      return items;
    } else if (filterText === "In Progress") {
      return items.status !== "Submit" && items.status !== "Completed";
    } else if (filterText === "Completed") {
      return items.status === "Completed";
    }
    return false;
  })
  // Add search filter
  .filter((item) => {
    if (!search) return true;
    return Object.values(item).some(val =>
      typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())
    );
  });

  const paginatedData = filteredReviews.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  // Export handler
  const handleExport = (format) => {
    // Prepare columns for export: only visible columns, use label as header
    const exportColumns = columns.filter(col => col.id && !col.hide && col.id !== 'action' && col.id !== 'move');
    const exportData = filteredReviews.map(item => {
      const row = {};
      exportColumns.forEach(col => {
        // Format label to Title Case
        const formattedLabel = formatLabelToTitleCase(col.label || col.id);
        // Use exportValue if provided, else use raw value
        if (typeof col.exportValue === 'function') {
          row[formattedLabel] = col.exportValue(item);
        } else {
          row[formattedLabel] = item?.[col.id];
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
    setExportAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderMobileHeader = () => (
    <Box sx={{ 
      mb: 3, 
    }}>
      {/* Header Title */}
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: '#2c3e50',
            fontSize: '1.1rem'
          }}
        >
          Reviews 
        </Typography>
      
      </Box>

      {/* Search and Actions Row */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1.5, 
        alignItems: 'center',
        justifyContent: 'space-between'
        }}>
        <InputTextComponent
          id="search"
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          endIcon={true}
          noMargin={true}
          sx={{ 
            flexGrow: 1, 
            minWidth: '200px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#85803c',
                }
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#85803c',
                }
              }
            }
          }}
        />
        
        <IconButton
          onClick={(e) => setExportAnchorEl(e.currentTarget)}
          sx={{
            backgroundColor: '#ffffff',
            border: "2px solid #85803c",
            borderRadius: "10px",
            color: "#85803c",
            minWidth: '44px',
            minHeight: '44px',
            '&:hover': {
              backgroundColor: '#85803c',
              color: '#ffffff',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(133, 128, 60, 0.3)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <GetAppIcon sx={{ fontSize: '1.2rem' }} />
        </IconButton>
      </Box>

      

      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={() => setExportAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '160px'
          }
        }}
      >
        <MenuItem 
          onClick={() => handleExport('csv')}
          sx={{ 
            fontSize: '0.9rem',
            '&:hover': { backgroundColor: '#f8f9fa' }
          }}
        >
          Export CSV
        </MenuItem>
        <MenuItem 
          onClick={() => handleExport('excel')}
          sx={{ 
            fontSize: '0.9rem',
            '&:hover': { backgroundColor: '#f8f9fa' }
          }}
        >
          Export Excel
        </MenuItem>
        <MenuItem 
          onClick={() => handleExport('pdf')}
          sx={{ 
            fontSize: '0.9rem',
            '&:hover': { backgroundColor: '#f8f9fa' }
          }}
        >
          Export PDF
        </MenuItem>
      </Menu>
    </Box>
  );

  const renderMobileCards = () => {
    if (ReviewLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No reviews found
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        {paginatedData.map((review) => (
          <MobileLeaveCard
            key={review._id}
            row={review}
            fields={cardFields}
            onEdit={handleEdit}
            onDelete={() => handleDelete(review._id)}
            onViewDetails={handleViewReport}
            onMove={handleMove} // Add Move handler
            canEdit={true}
            canDelete={true}
            canViewDetails={true}
            canMove={canMove} // Add Move permission
            textColor="#707070"
            cardStyle={{
              boxShadow: "0px 0.5px 0px rgba(0,0,0,0.2)",
              border: "1px solid #e0e0e0",
            }}
          />
        ))}

        <TablePagination
          component="div"
          count={filteredReviews.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15, 20]}
          sx={{
            mt: 2,
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            '& .MuiTablePagination-toolbar': {
              minHeight: '52px'
            }
          }}
        />
      </Box>
    );
  };

  return (
    <div className={`${isMobile ? "m-2" : " rounded-12 mh-100 m-4"}`} style={{padding:isMobile ? ".2rem" : "2rem",backgroundColor: secondaryColors.white,}}>
      <div>
        <div
  tabIndex={0}
  role="button"
  onClick={() => setFilterText("all")}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      setFilterText("all");
    }
  }}
  className={`text-decoration-none nav cursor-pointer ${filterText === "all" ? "activeLink" : ""}`}
>
  All
</div>

<div
  tabIndex={0}
  role="button"
  onClick={() => setFilterText("In Progress")}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      setFilterText("In Progress");
    }
  }}
  className={`text-decoration-none nav ml-3 cursor-pointer ${filterText === "In Progress" ? "activeLink" : ""}`}
>
  In progress
</div>

<div
  tabIndex={0}
  role="button"
  onClick={() => setFilterText("Completed")}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      setFilterText("Completed");
    }
  }}
  className={`text-decoration-none nav ml-3 cursor-pointer ${filterText === "Completed" ? "activeLink" : ""}`}
>
  Completed
</div>
        <div className="mt-4">
          {isMobile ? (
            <Box>
              {renderMobileHeader()}
              {renderMobileCards()}
            </Box>
          ) : (
            <CustomTable
              columns={columns}
              data={paginatedData.map(item => ({ ...item, id: item._id }))}
              loading={ReviewLoading}
              page={page}
              totalPages={Math.ceil(filteredReviews.length / rowsPerPage)}
              rowsPerPage={rowsPerPage}
              setPage={setPage}
              setRowsPerPage={setRowsPerPage}
              setSelectedItems={setSelectedUsers}
              selectedItems={selectedUsers}
              showHeader={true}
              search={search}
              setSearch={setSearch}
              onExport={handleExport}
              showExport={true}
              filteredData={filteredReviews}
            />
          )}
        </div>
        {showModal && <MoveAsModal
          show={showModal}
          onHide={() => setShowModal(false)}
          employees={opt1}
          data={selectedData}
          handlecallback={(data) => handleCallback2(data)}
        />}
      </div>
    </div>
  );
}
