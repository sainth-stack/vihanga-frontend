import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Stack,
  Chip
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import * as XLSX from "xlsx";
import axios from "axios";
import { Toast } from "service/toast";
import FileUploadCustom from "pages/vihanga/components/filesUplode/draganddropFile";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { appURL } from "utilities";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FilePreview from "pages/vihanga/pages/employeePortal/TimeTracking/AttendanceUpload/FilePreview";
import { canEdit, canDelete } from "utilities/privilegeHelper";
import { mapOKRImportData, downloadTemplate2 } from './utils';

const OKRBulkUpload = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [processedData, setProcessedData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [loadingUploads, setLoadingUploads] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [records, setRecords] = useState([]);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [recordsPage, setRecordsPage] = useState(0);
  const [recordsRowsPerPage, setRecordsRowsPerPage] = useState(10);
  const [recordsLoading, setRecordsLoading] = useState(false);

  const companyId = getItemFromLocalStorage("companyId");

  const fetchUploads = async () => {
    try {
      setLoadingUploads(true);
      const res = await axios.get(`${appURL}/okrManagement/uploads`, { 
        params: { companyId, limit: 25 } 
      });
      const uploads = res.data?.data || [];
      console.log("Fetched uploads:", uploads);
      setUploads(uploads);
    } catch (e) {
      console.error("Error fetching uploads:", e);
      setUploads([]);
    } finally {
      setLoadingUploads(false);
    }
  };

  useEffect(() => {
    fetchUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = async ({ file, data }) => {
    if (!file) return;
    setUploading(true);

    try {
      let json = data;

      if (
        !json &&
        (file.name.endsWith('.xls') ||
          file.name.endsWith('.xlsx') ||
          file.name.endsWith('.csv'))
      ) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { cellDates: false });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        json = XLSX.utils.sheet_to_json(sheet, {
          raw: false,
          defval: "",
          dateNF: "yyyy-mm-dd"
        });
      }

      if (!json || json.length === 0) {
        Toast({
          message: "No data found in file",
          type: "warning",
        });
        setUploading(false);
        return;
      }

      setProcessedData({ json });
      setUploadedFile(file);
    } catch (err) {
      console.error(err);
      Toast({
        message: "Error processing file. Please check the format.",
        type: "error",
      });
    } finally {
      setUploading(false);
      setFileInputKey(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!processedData) return;
    setSubmitting(true);

    try {
      const mappedData = mapOKRImportData(processedData.json);

      // Upload original file to S3 for traceability
      let fileMeta = null;
      if (uploadedFile) {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append("companyId", companyId);
        
        const uploadRes = await axios.post(
          `${appURL}/okrManagement/uploads/file`, 
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        fileMeta = uploadRes.data?.data || null;
      }

      // Submit bulk OKR data
      const response = await axios.post(
        `${appURL}/okrManagement/createObjectivesAndKeyResults`,
        {
          data: mappedData,
          fileMeta: fileMeta,
          companyId: companyId
        }
      );

      if (response.data && response.data.success) {
        const result = response.data.data;
        
        Toast({
          message: `OKR data uploaded successfully! ${result.objectivesCreated || 0} objectives, ${result.keyResultsCreated || 0} key results, ${result.tasksCreated || 0} tasks created.`,
          type: "success",
        });

        // Reset form
        setProcessedData(null);
        setUploadedFile(null);
        
        // Refresh uploads list
        fetchUploads();
        
        // Notify parent component
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.data?.message || "Failed to process OKR data");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to submit data. Please try again.";
      
      Toast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openView = async (batch) => {
    setSelectedBatch(batch);
    setViewOpen(true);
    setRecordsPage(0);
    await loadBatchRecords(batch.uploadBatchId || batch._id, 0, recordsRowsPerPage);
  };

  const loadBatchRecords = async (batchId, page, limit) => {
    try {
      setRecordsLoading(true);
      const res = await axios.get(`${appURL}/okrManagement/uploads/${batchId}/records`, {
        params: { companyId, page: page + 1, limit }
      });
      setRecords(res.data?.data || []);
      setRecordsTotal(res.data?.total || 0);
    } catch (err) {
      console.error("Error loading batch records:", err);
      setRecords([]);
      setRecordsTotal(0);
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleChangePage = async (_e, newPage) => {
    setRecordsPage(newPage);
    if (selectedBatch) {
      const batchId = selectedBatch.uploadBatchId || selectedBatch._id;
      await loadBatchRecords(batchId, newPage, recordsRowsPerPage);
    }
  };

  const handleChangeRowsPerPage = async (e) => {
    const newSize = parseInt(e.target.value, 10);
    setRecordsRowsPerPage(newSize);
    setRecordsPage(0);
    if (selectedBatch) {
      const batchId = selectedBatch.uploadBatchId || selectedBatch._id;
      await loadBatchRecords(batchId, 0, newSize);
    }
  };

  const handleRollback = async (batch) => {
    if (!window.confirm("Are you sure you want to rollback this upload? This will remove all objectives, key results, and tasks from this upload.")) return;
    
    try {
      const batchId = batch.uploadBatchId || batch._id;
      await axios.delete(`${appURL}/okrManagement/uploads/${batchId}/rollback`, {
        params: { companyId }
      });
      Toast({ message: "Rollback completed successfully.", type: "success" });
      fetchUploads();
      if (selectedBatch?.uploadBatchId === batch.uploadBatchId || selectedBatch?._id === batch._id) {
        setViewOpen(false);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to rollback";
      Toast({ message: errorMessage, type: "error" });
    }
  };

  const handleDeleteBatch = async (batch) => {
    if (!window.confirm("Delete this upload record? This cannot be undone.")) return;
    
    try {
      const batchId = batch.uploadBatchId || batch._id;
      await axios.delete(`${appURL}/okrManagement/uploads/${batchId}`, {
        params: { companyId }
      });
      Toast({ message: "Upload deleted successfully.", type: "success" });
      fetchUploads();
      if (selectedBatch?.uploadBatchId === batch.uploadBatchId || selectedBatch?._id === batch._id) {
        setViewOpen(false);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete upload";
      Toast({ message: errorMessage, type: "error" });
    }
  };

  const handleDownloadTemplate = () => {
    downloadTemplate2();
    Toast({
      message: "Template downloaded successfully!",
      type: "success",
    });
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AssignmentIcon sx={{ fontSize: 32, mr: 1, color: 'rgb(136, 130, 59)' }} />
            <Typography variant="h5" fontWeight={700}>
              OKR Bulk Upload
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Upload multiple objectives, key results, and tasks at once using an Excel file.
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadTemplate}
            sx={{
              backgroundColor: 'rgb(136, 130, 59)',
              color: '#fff',
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgb(116, 110, 39)',
              }
            }}
          >
            Download Template
          </Button>
        </Box>

        {/* File Upload Section */}
        {canEdit() && (
          <FileUploadCustom
            key={fileInputKey}
            label="Upload OKR Excel File"
            id="okr-bulk-upload-input"
            onFileUpload={handleFileUpload}
            sx={{ minHeight: 180, mb: 2 }}
            acceptedFiles={['.xlsx', '.xls', '.csv']}
          />
        )}

        {/* File Preview */}
        {canEdit() && processedData && processedData.json && uploadedFile && !uploading && (
          <FilePreview
            data={processedData.json}
            fileName={uploadedFile.name}
          />
        )}

        {/* File Status and Submit Section */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {uploadedFile && !uploading ? (
              <>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Uploaded: <b>{uploadedFile.name}</b>
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    setUploadedFile(null);
                    setProcessedData(null);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No file uploaded
              </Typography>
            )}
          </Box>

          {canEdit() && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!processedData || submitting}
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              sx={{
                backgroundColor: 'rgb(136, 130, 59)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgb(116, 110, 39)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(136, 130, 59, 0.5)',
                },
                minWidth: 120,
              }}
            >
              {submitting ? "Uploading..." : "Submit"}
            </Button>
          )}
        </Box>

        {/* Recent Uploads */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Recent Uploads
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            {loadingUploads ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : uploads.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No uploads yet.
              </Typography>
            ) : (
              <Box>
                {uploads.map((u) => {
                  const rolledBack = u.status === 'rolled_back';
                  return (
                    <Box
                      key={u._id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 1.5,
                        borderBottom: '1px solid #eee',
                        '&:last-child': { borderBottom: 'none' }
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2">
                          <b>{u.filename || "File"}</b> · {new Date(u.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Objectives: {u.objectivesCount || 0} · Key Results: {u.keyResultsCount || 0} · Tasks: {u.tasksCount || 0}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            label={u.status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                            size="small"
                            color={rolledBack ? "default" : u.status === 'completed' ? "success" : "primary"}
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Box>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openView(u)}
                          disabled={rolledBack}
                          sx={{
                            borderColor: 'rgb(136, 130, 59)',
                            color: 'rgb(136, 130, 59)',
                            borderRadius: '20px',
                            px: 2,
                            '&:hover': {
                              borderColor: 'rgb(136, 130, 59)',
                              backgroundColor: 'rgba(136,130,59,0.08)'
                            },
                            '&.Mui-disabled': {
                              color: 'rgba(0,0,0,0.26)',
                              borderColor: '#e0e0e0'
                            }
                          }}
                        >
                          View
                        </Button>
                        {rolledBack && u.s3Url ? (
                          <Button
                            size="small"
                            variant="outlined"
                            component="a"
                            href={u.s3Url}
                            target="_blank"
                            rel="noopener"
                            sx={{
                              borderColor: 'rgb(136, 130, 59)',
                              color: 'rgb(136, 130, 59)',
                              borderRadius: '20px',
                              px: 2,
                              '&:hover': {
                                borderColor: 'rgb(136, 130, 59)',
                                backgroundColor: 'rgba(136,130,59,0.08)'
                              }
                            }}
                          >
                            Download
                          </Button>
                        ) : null}
                        {canEdit() && (
                          <Button
                            size="small"
                            variant={rolledBack ? 'outlined' : 'contained'}
                            color="error"
                            disabled={rolledBack}
                            onClick={() => handleRollback(u)}
                            sx={{ borderRadius: '20px', px: 2 }}
                          >
                            {rolledBack ? "Rolled Back" : "Rollback"}
                          </Button>
                        )}
                        {canDelete() && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteBatch(u)}
                            disabled={!rolledBack && u.status !== 'failed'}
                            sx={{ borderRadius: '20px', px: 2 }}
                          >
                            Delete
                          </Button>
                        )}
                      </Stack>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Box>

        {/* View Records Dialog */}
        <Dialog
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Upload Records
            {selectedBatch?.filename ? ` - ${selectedBatch.filename}` : ''}
          </DialogTitle>
          <DialogContent>
            {selectedBatch?.status === 'rolled_back' ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                This upload was rolled back. All data was reverted.
                {selectedBatch?.s3Url ? (
                  <>
                    {" "}You can still download the original file{" "}
                    <a href={selectedBatch.s3Url} target="_blank" rel="noopener">
                      here
                    </a>
                    .
                  </>
                ) : null}
              </Typography>
            ) : recordsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Employee</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {records.map((r) => (
                        <TableRow key={r._id}>
                          <TableCell>
                            <Chip
                              label={r.type?.toUpperCase() || '-'}
                              size="small"
                              color={
                                r.type === 'obj' ? 'primary' :
                                r.type === 'kr' ? 'secondary' :
                                'default'
                              }
                            />
                          </TableCell>
                          <TableCell>{r.title || r.objective || r.keyResultName || '-'}</TableCell>
                          <TableCell>{r.employeeNumber || '-'}</TableCell>
                          <TableCell>{r.status || '-'}</TableCell>
                          <TableCell>
                            {r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={recordsTotal}
                  page={recordsPage}
                  onPageChange={handleChangePage}
                  rowsPerPage={recordsRowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[10, 25, 50]}
                />
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Instructions */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            Instructions
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            1. Download the template Excel file using the button above
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            2. Fill in your objectives, key results, and tasks following the template format
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            3. Upload the completed Excel file using the upload area
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            4. Review the preview and click Submit to create all OKR data
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, fontWeight: 500, color: 'rgb(136, 130, 59)' }}>
            Note: Use rollback to undo an upload if needed. Rolled back uploads can be deleted.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OKRBulkUpload;
