import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { appURL } from "utilities/baseurl";
import axios from "axios";
import { canEdit, canDelete } from "utilities/privilegeHelper";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ArrowDownwardOutlinedIcon from "../../../../../assets/svg/ExportSvg.svg";
import { useTranslation } from "react-i18next";
// Match existing admin theme (DocumentType, LeaveType, AdminPage)
const THEME_PRIMARY = "#837F39";
const THEME_PRIMARY_HOVER = "#6a6630";
const THEME_TEXT = "#0E0E0E";
const THEME_TEXT_SECONDARY = "#707070";
const THEME_BORDER = "#E9EAEC";
const THEME_BG_SUBTLE = "#f9f9f9";

const CareerJobs = () => {
  const { t } = useTranslation();
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    department: "",
    status: "open",
  });
  const [submitting, setSubmitting] = useState(false);
  const [applicationsDialog, setApplicationsDialog] = useState({
    open: false,
    job: null,
    applications: [],
    loading: false,
  });
  const [editingJob, setEditingJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = () => {
    setLoading(true);
    axios
      .get(`${appURL}/landing/jobs/all`)
      .then((res) => {
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setJobs(res.data.data);
        }
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const resetJobForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      department: "",
      status: "open",
    });
    setEditingJob(null);
  };

  const openAddJobDialog = () => {
    resetJobForm();
    setShowAddForm(true);
  };

  const openEditJobDialog = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      department: job.department || "",
      status: job.status === "closed" ? "closed" : "open",
    });
    setShowAddForm(true);
  };

  const closeJobDialog = () => {
    setShowAddForm(false);
    resetJobForm();
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    setSubmitting(true);
    const req = editingJob
      ? axios.put(`${appURL}/landing/jobs/${editingJob._id}`, formData, {
          headers: { "Content-Type": "application/json" },
        })
      : axios.post(`${appURL}/landing/jobs`, formData, {
          headers: { "Content-Type": "application/json" },
        });
    req
      .then((res) => {
        if (res.data && res.data.success) {
          closeJobDialog();
          fetchJobs();
        } else {
          alert(res.data.message || (editingJob ? "Failed to update job" : "Failed to create job"));
        }
      })
      .catch((err) => {
        alert(
          err.response?.data?.message ||
            (editingJob ? "Failed to update job" : "Failed to create job")
        );
      })
      .finally(() => setSubmitting(false));
  };

  const confirmDeleteJob = () => {
    if (!jobToDelete) return;
    setDeleting(true);
    axios
      .delete(`${appURL}/landing/jobs/${jobToDelete._id}`)
      .then((res) => {
        if (res.data && res.data.success) {
          setJobToDelete(null);
          fetchJobs();
        } else {
          alert(res.data.message || "Failed to delete job");
        }
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to delete job");
      })
      .finally(() => setDeleting(false));
  };

  const handleViewApplications = (job) => {
    setApplicationsDialog({ open: true, job, applications: [], loading: true });
    axios
      .get(`${appURL}/landing/jobs/${job._id}/applications`)
      .then((res) => {
        if (res.data && res.data.success && res.data.data) {
          setApplicationsDialog((prev) => ({
            ...prev,
            applications: res.data.data.applications || [],
            loading: false,
          }));
        } else {
          setApplicationsDialog((prev) => ({ ...prev, loading: false }));
        }
      })
      .catch(() => {
        setApplicationsDialog((prev) => ({ ...prev, loading: false }));
      });
  };

  const closeApplicationsDialog = () => {
    setApplicationsDialog({ open: false, job: null, applications: [], loading: false });
  };

  const exportOptions = [
    { text: t("TimeLogin.exportOptions.exportCSV"), format: "csv", icon: ArrowDownwardOutlinedIcon },
    { text: t("TimeLogin.exportOptions.exportExcel"), format: "excel", icon: ArrowDownwardOutlinedIcon },
    { text: t("TimeLogin.exportOptions.exportPDF"), format: "pdf", icon: ArrowDownwardOutlinedIcon },
  ];

  const handleClickExport = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleCloseExport = () => {
    setExportAnchorEl(null);
  };

  const formatLabelToTitleCase = (label) => {
    if (!label) return "";
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/[_\-]/g, " ")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getJobsExportRows = () =>
    jobs.map((job) => ({
      title: job.title || "",
      location: job.location || "",
      department: job.department || "",
      status: job.status === "open" ? "Open" : "Closed",
    }));

  const handleExport = (format) => {
    const dataToExport = getJobsExportRows();
    if (!dataToExport.length) {
      alert("No data to export");
      return;
    }
    const exportData = dataToExport.map((item) => ({ ...item }));
    const originalKeys = Object.keys(exportData[0] || {});
    const formattedLabels = originalKeys.map((key) => formatLabelToTitleCase(key));
    const formattedData = exportData.map((item) => {
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
        saveAs(new Blob([csv], { type: "text/csv" }), "career-jobs-export.csv");
        break;
      }
      case "excel": {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(wb, ws, "Career Jobs");
        XLSX.writeFile(wb, "career-jobs-export.xlsx");
        break;
      }
      case "pdf": {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.text("Career Jobs", 14, 16);
        doc.setFontSize(10);
        doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 24);
        if (formattedData.length > 0) {
          doc.autoTable({
            head: [formattedLabels],
            body: formattedData.map((item) =>
              formattedLabels.map((label) => item[label])
            ),
            startY: 30,
            styles: {
              cellPadding: 3,
              fontSize: 8,
              valign: "middle",
              halign: "left",
              textColor: [40, 40, 40],
            },
            headStyles: {
              fillColor: [131, 127, 57],
              textColor: 255,
              fontStyle: "bold",
              halign: "left",
            },
            alternateRowStyles: { fillColor: [245, 245, 245], halign: "left" },
            margin: { top: 30 },
            tableWidth: "wrap",
          });
        }
        doc.save("career-jobs-export.pdf");
        break;
      }
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        margin: "20px",
        borderRadius: "16px",
        paddingBottom: "10px",
        backgroundColor: "#fff",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        overflowY: "auto",
      }}
    >
      <Box sx={{ padding: "30px" }}>
        <Typography
          sx={{
            fontSize: "32px",
            fontWeight: 600,
            fontFamily: "Montserrat",
            color: THEME_TEXT,
            mb: 1,
          }}
        >
          Career Jobs
        </Typography>
        <Typography
          sx={{
            color: THEME_TEXT_SECONDARY,
            fontSize: 16,
            fontFamily: "Work Sans",
            mb: 3,
          }}
        >
          Add job openings and view applications for each role.
        </Typography>

        {/* Add Job card - matches AdminPage card hover style */}
        <Card
          onClick={openAddJobDialog}
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            cursor: "pointer",
            border: `2px dashed ${THEME_PRIMARY}`,
            "&:hover": {
              boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
              backgroundColor: "rgba(131, 127, 57, 0.06)",
            },
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "#fff",
                border: `2px solid ${THEME_PRIMARY}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AddIcon sx={{ fontSize: 32, color: THEME_PRIMARY }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 18, color: THEME_TEXT, fontFamily: "Work Sans" }}>
                Add Job
              </Typography>
              <Typography sx={{ color: THEME_TEXT_SECONDARY, fontSize: 14, fontFamily: "Work Sans" }}>
                Create a new job opening to appear on the careers page
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Add Job form dialog - DialogTitle/Actions match DocumentType */}
        <Dialog open={showAddForm} onClose={closeJobDialog} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              backgroundColor: THEME_PRIMARY,
              color: "white",
              fontWeight: 600,
              fontFamily: "Work Sans",
            }}
          >
            {editingJob ? "Edit Job Opening" : "Add Job Opening"}
          </DialogTitle>
        <form onSubmit={handleSaveJob}>
          <DialogContent sx={{ fontFamily: "Work Sans" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputTextComponent
                  id="title"
                  name="title"
                  label="Job Title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <InputTextComponent
                  id="description"
                  name="description"
                  label="Description (Job description / JD)"
                  required
                  multiline
                  minRows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputTextComponent
                  id="location"
                  name="location"
                  label="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, location: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputTextComponent
                  id="department"
                  name="department"
                  label="Department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, department: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <SelectComponent
                  id="status"
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, status: e.target.value }))
                  }
                  options={[
                    { label: "Open", value: "open" },
                    { label: "Closed", value: "closed" },
                  ]}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, backgroundColor: THEME_BG_SUBTLE }}>
            <Button
              onClick={closeJobDialog}
              sx={{
                fontFamily: "Work Sans",
                fontWeight: 500,
                color: THEME_PRIMARY,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                backgroundColor: THEME_PRIMARY,
                color: "#FFFFFF",
                fontFamily: "Work Sans",
                fontWeight: 500,
                borderRadius: "20px",
                textTransform: "none",
                "&:hover": { backgroundColor: THEME_PRIMARY_HOVER },
              }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : editingJob ? (
                "Save changes"
              ) : (
                "Create Job"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

        {/* List of jobs */}
      <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Typography
          sx={{
            fontWeight: 600,
            fontSize: "24px",
            fontFamily: "Montserrat",
            color: THEME_TEXT,
            mb: 2,
          }}
        >
          Job Openings
        </Typography>
        <Button
          variant="contained"
          onClick={handleClickExport}
          sx={{
            backgroundColor: "#837F39",
            color: "white",
            borderRadius: "100px",
            marginBottom: "10px",
            "&:hover": {
              backgroundColor: "#837F39",
            },
          }}
        >
          {t("TimeLogin.exportOptions.export")}
        </Button>
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
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: THEME_PRIMARY }} />
          </Box>
        ) : jobs.length === 0 ? (
          <Typography sx={{ color: THEME_TEXT_SECONDARY, py: 3, fontFamily: "Work Sans" }}>
            No jobs yet. Click "Add Job" to create one.
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: `1px solid ${THEME_BORDER}`,
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: THEME_BG_SUBTLE }}>
                  <TableCell sx={{ fontWeight: 600, fontFamily: "Work Sans", color: THEME_TEXT }}>
                    Title
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: "Work Sans", color: THEME_TEXT }}>
                    Location
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontFamily: "Work Sans", color: THEME_TEXT }}>
                    Status
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, fontFamily: "Work Sans", color: THEME_TEXT }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id} hover>
                    <TableCell sx={{ fontFamily: "Work Sans" }}>
                      <Typography fontWeight={500} sx={{ color: THEME_TEXT }}>
                        {job.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Work Sans", color: THEME_TEXT_SECONDARY }}>
                      {job.location || "—"}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Work Sans" }}>
                      <Chip
                        label={job.status === "open" ? "Open" : "Closed"}
                        size="small"
                        color={job.status === "open" ? "success" : "default"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="flex-end"
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewApplications(job)}
                          sx={{
                            color: THEME_PRIMARY,
                            fontFamily: "Work Sans",
                            textTransform: "none",
                          }}
                        >
                          View applications
                        </Button>
                        {canEdit() && (
                          <IconButton
                            size="small"
                            aria-label="Edit job"
                            onClick={() => openEditJobDialog(job)}
                            sx={{ color: THEME_PRIMARY }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                        {canDelete() && (
                          <IconButton
                            size="small"
                            aria-label="Delete job"
                            onClick={() => setJobToDelete(job)}
                            sx={{ color: THEME_TEXT_SECONDARY }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Applications dialog - title/actions match DocumentType */}
        <Dialog
          open={applicationsDialog.open}
          onClose={closeApplicationsDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              backgroundColor: THEME_PRIMARY,
              color: "white",
              fontWeight: 600,
              fontFamily: "Work Sans",
            }}
          >
            Applications
            {applicationsDialog.job && (
              <Typography component="span" sx={{ fontWeight: 500, fontSize: 14, color: "rgba(255,255,255,0.9)", ml: 1 }}>
                — {applicationsDialog.job.title}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent sx={{ fontFamily: "Work Sans" }}>
            {applicationsDialog.loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: THEME_PRIMARY }} />
              </Box>
            ) : applicationsDialog.applications.length === 0 ? (
              <Typography sx={{ color: THEME_TEXT_SECONDARY, py: 2 }}>
                No applications yet for this job.
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: THEME_BG_SUBTLE }}>
                      <TableCell sx={{ fontWeight: 600, color: THEME_TEXT }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: THEME_TEXT }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: THEME_TEXT }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: THEME_TEXT }}>LinkedIn</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: THEME_TEXT }}>CV</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: THEME_TEXT }}>Applied at</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applicationsDialog.applications.map((app) => (
                      <TableRow key={app._id}>
                        <TableCell sx={{ color: THEME_TEXT }}>{app.name}</TableCell>
                        <TableCell sx={{ color: THEME_TEXT_SECONDARY }}>{app.email}</TableCell>
                        <TableCell sx={{ color: THEME_TEXT_SECONDARY }}>{app.phone}</TableCell>
                        <TableCell>
                          {app.linkedinURL ? (
                            <a
                              href={app.linkedinURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: THEME_PRIMARY, fontFamily: "Work Sans" }}
                            >
                              Link
                            </a>
                          ) : "—"}
                        </TableCell>
                        <TableCell>
                          {app.cvURL ? (
                            <a
                              href={app.cvURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: THEME_PRIMARY, fontFamily: "Work Sans" }}
                            >
                              CV
                            </a>
                          ) : "—"}
                        </TableCell>
                        <TableCell sx={{ color: THEME_TEXT_SECONDARY }}>
                          {app.createdAt
                            ? new Date(app.createdAt).toLocaleDateString()
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, backgroundColor: THEME_BG_SUBTLE }}>
            <Button
              onClick={closeApplicationsDialog}
              variant="contained"
              sx={{
                backgroundColor: THEME_PRIMARY,
                color: "white",
                fontFamily: "Work Sans",
                fontWeight: 500,
                borderRadius: "20px",
                textTransform: "none",
                "&:hover": { backgroundColor: THEME_PRIMARY_HOVER },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={Boolean(jobToDelete)} onClose={() => !deleting && setJobToDelete(null)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontFamily: "Work Sans", fontWeight: 600, color: THEME_TEXT }}>
            Delete job opening?
          </DialogTitle>
          <DialogContent sx={{ fontFamily: "Work Sans", color: THEME_TEXT_SECONDARY }}>
            {jobToDelete
              ? `"${jobToDelete.title}" will be removed. Applications submitted for this role will also be deleted.`
              : null}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, backgroundColor: THEME_BG_SUBTLE }}>
            <Button
              onClick={() => setJobToDelete(null)}
              disabled={deleting}
              sx={{ fontFamily: "Work Sans", color: THEME_PRIMARY, textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteJob}
              variant="contained"
              disabled={deleting}
              sx={{
                backgroundColor: "#b71c1c",
                color: "#fff",
                fontFamily: "Work Sans",
                textTransform: "none",
                borderRadius: "20px",
                "&:hover": { backgroundColor: "#8c1616" },
              }}
            >
              {deleting ? <CircularProgress size={22} color="inherit" /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default CareerJobs;
