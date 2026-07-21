import React, { useState, useEffect, useRef, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Typography, Box, Grid, Button, CircularProgress, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import FileUploadCustom from "pages/vihanga/components/filesUplode/draganddropFile";
import CustomCheckBoxSwitch from "pages/vihanga/components/CustomCheckSwitch";
import CustomRadio from "pages/vihanga/components/CustomRadio";
import CustomTable from "pages/vihanga/components/CustomTable";
import axios from "axios";
import { Toast } from "service/toast";
import { appURL } from "utilities";
import { getUserData } from "utilities/privilegeHelper";

const DocumentSubmission = () => {
  const history = useHistory();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const submissionId = urlParams.get("submissionId");
  const documentTypeIdFromUrl = urlParams.get("documentTypeId");
  // Always view mode if submissionId exists
  const viewMode = submissionId ? true : false;
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [documentTypes, setDocumentTypes] = useState([]);
  const [documentTypesForTable, setDocumentTypesForTable] = useState([]);
  const [showTableView, setShowTableView] = useState(!submissionId && !documentTypeIdFromUrl);
  const [selectedDocumentType, setSelectedDocumentType] = useState(documentTypeIdFromUrl || "");
  const [documentTypeConfig, setDocumentTypeConfig] = useState(null);
  const [formData, setFormData] = useState({
    documentTypeId: "",
    submissionDate: "",
    uploadedFile: null,
    dynamicFieldValues: {},
  });
  const [existingFileUrl, setExistingFileUrl] = useState(null);
  const [dynamicFileUrls, setDynamicFileUrls] = useState({});
  const submissionDynamicFieldsRef = useRef(null); // Store dynamic fields from submission
  const isInitializingFromSubmission = useRef(false); // Flag to track if we're initializing from submission
  const [search,setSearch]=useState("")
  const companyId =
    localStorage.getItem("companyId") !== null
      ? JSON.parse(localStorage.getItem("companyId"))
      : null;

  const userId =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user"))?._id
      : null;

  // Check if current user is HR Admin
  const userData = useMemo(() => getUserData(), []);
  const isHRAdmin = useMemo(
    () => userData?.role === "HR Admin" || userData?.role === "Super Admin",
    [userData]
  );

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  // Helper function to create label with red asterisk for required fields
  const createRequiredLabel = (labelText) => {
    return (
      <>
        {labelText}{" "}
        <span style={{ color: "red" }}>*</span>
      </>
    );
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "#4caf50";
      case "rejected":
        return "#f44336";
      case "pending":
        return "#ff9800";
      default:
        return "#999";
    }
  };

  // Handle approve
  const handleApprove = async () => {
    if (!isHRAdmin) {
      Toast({
        message: "Only HR Admin can approve documents",
        type: "error",
      });
      return;
    }

    try {
      await axios.put(
        `${appURL}/recruitment/document-submissions/${submissionId}/approve`
      );

      Toast({
        message: "Document approved successfully",
        type: "success",
      });
      
      // Navigate back to submissions table
      setTimeout(() => {
        history.push("/admin/previlages/document-submissions");
      }, 1000);
    } catch (err) {
      console.error("Approve Error:", err);
      Toast({
        message: err.response?.data?.message || "Failed to approve document",
        type: "error",
      });
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!isHRAdmin) {
      Toast({
        message: "Only HR Admin can reject documents",
        type: "error",
      });
      return;
    }

    try {
      await axios.put(
        `${appURL}/recruitment/document-submissions/${submissionId}/reject`,
        {
          rejectionReason: rejectionReason || "",
        }
      );

      Toast({
        message: "Document rejected successfully",
        type: "success",
      });
      setRejectDialogOpen(false);
      setRejectionReason("");
      
      // Navigate back to submissions table
      setTimeout(() => {
        history.push("/admin/previlages/document-submissions");
      }, 1000);
    } catch (err) {
      console.error("Reject Error:", err);
      Toast({
        message: err.response?.data?.message || "Failed to reject document",
        type: "error",
      });
    }
  };

  // Fetch active document types (filtered by privilege group membership in backend)
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      setLoading(true);
      try {
        // Check if userId is available
        if (!userId) {
          Toast({
            message: "Employee information not found. Please log in again.",
            type: "error",
          });
          setLoading(false);
          return;
        }

        // Fetch document types - backend now filters based on privilege group membership
        const response = await axios.get(
          `${appURL}/recruitment/document-type/active`,
          {
            params: { 
              companyId,
              employeeId: userId,
            },
          }
        );
        const types = response?.data?.data || [];
        
        console.log("Document types from backend:", types);
        
        // Store full objects for table view
        setDocumentTypesForTable(types);
        
        // Store options for dropdown (if needed)
        const options = types.map((type) => ({
          label: type.documentTypeName,
          value: type._id,
          id: type._id,
        }));
        setDocumentTypes([{ label: "Select Document Type", value: "" }, ...options]);
      } catch (error) {
        console.error("Error fetching document types:", error);
        const errorMessage = error.response?.data?.message || "Failed to fetch document types";
        Toast({
          message: errorMessage,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (companyId && userId) {
      fetchDocumentTypes();
    } else if (companyId && !userId) {
      setLoading(false);
      Toast({
        message: "Employee information not found. Please log in again.",
        type: "error",
      });
    }
  }, [companyId, userId]);

  // Fetch submission data if in edit mode
  useEffect(() => {
    if (submissionId) {
      const fetchSubmissionData = async () => {
        setLoading(true);
        isInitializingFromSubmission.current = true; // Set flag
        try {
          // Fetch submission data
          const submissionResponse = await axios.get(
            `${appURL}/recruitment/document-submissions/${submissionId}`
          );
          const submission = submissionResponse?.data?.data || {};
          
          const docTypeId = submission.documentTypeId?._id || submission.documentTypeId || "";
          const submissionDynamicFields = submission.dynamicFieldValues || {};
          const submissionDocTypeFields = submission.documentTypeId?.dynamicFields || [];
          const submissionDynamicFileUrls = submission.dynamicFileUrls || {};
          
          // Store original dynamic fields from submission for reference
          submissionDynamicFieldsRef.current = submissionDynamicFields;
          
          setExistingFileUrl(submission.fileUrl);
          setDynamicFileUrls(submissionDynamicFileUrls);
          
          // Fetch document type config before setting form data
          let config = null;
          let mappedDynamicFieldValues = {};
          
          if (docTypeId) {
            try {
              const configResponse = await axios.get(
                `${appURL}/recruitment/document-type/${docTypeId}/form-config`,
                {
                  params: { companyId },
                }
              );
              config = configResponse?.data?.data || null;
              setDocumentTypeConfig(config);
              
              // Map old field IDs to new field IDs based on field order
              // If field IDs don't match, try to map by field order
              if (config?.dynamicFields && submissionDocTypeFields.length > 0) {
                // Create a mapping from old field IDs to new field IDs by matching field order
                const oldFieldIds = Object.keys(submissionDynamicFields);
                submissionDocTypeFields.forEach((oldField, index) => {
                  const oldFieldId = oldField._id || oldField.id;
                  if (oldFieldIds.includes(oldFieldId) && config.dynamicFields[index]) {
                    const newFieldId = config.dynamicFields[index]._id || config.dynamicFields[index].id;
                    mappedDynamicFieldValues[newFieldId] = submissionDynamicFields[oldFieldId];
                  }
                });
                
                // If mapping didn't work (different number of fields), try by field name
                if (Object.keys(mappedDynamicFieldValues).length === 0 && config.dynamicFields.length === submissionDocTypeFields.length) {
                  config.dynamicFields.forEach((newField) => {
                    const matchingOldField = submissionDocTypeFields.find(
                      (oldField) => oldField.fieldName === newField.fieldName && 
                                   oldField.fieldType === newField.fieldType
                    );
                    if (matchingOldField) {
                      const oldFieldId = matchingOldField._id || matchingOldField.id;
                      const newFieldId = newField._id || newField.id;
                      if (submissionDynamicFields[oldFieldId] !== undefined) {
                        mappedDynamicFieldValues[newFieldId] = submissionDynamicFields[oldFieldId];
                      }
                    }
                  });
                }
              }
              
              // If still no mapping, use the original values (might work if IDs happen to match)
              if (Object.keys(mappedDynamicFieldValues).length === 0) {
                mappedDynamicFieldValues = submissionDynamicFields;
              }
              
              // Update the ref with mapped values
              submissionDynamicFieldsRef.current = mappedDynamicFieldValues;
            } catch (configError) {
              console.error("Error fetching document type config:", configError);
              // Fallback to original values
              mappedDynamicFieldValues = submissionDynamicFields;
              submissionDynamicFieldsRef.current = mappedDynamicFieldValues;
            }
          } else {
            // No config, use original values
            mappedDynamicFieldValues = submissionDynamicFields;
            submissionDynamicFieldsRef.current = mappedDynamicFieldValues;
          }
          
          // Set form data with all values
          setFormData({
            documentTypeId: docTypeId,
            submissionDate: submission.submissionDate
              ? new Date(submission.submissionDate).toISOString().split("T")[0]
              : "",
            uploadedFile: null,
            dynamicFieldValues: mappedDynamicFieldValues,
          });
          
          // Set selected document type
          setSelectedDocumentType(docTypeId);
        } catch (error) {
          console.error("Error fetching submission data:", error);
          Toast({
            message: "Failed to fetch submission data",
            type: "error",
          });
        } finally {
          setLoading(false);
          // Reset flag after a short delay
          setTimeout(() => {
            isInitializingFromSubmission.current = false;
          }, 500);
        }
      };
      fetchSubmissionData();
    }
  }, [submissionId, companyId]);

  // Fetch document type configuration when selected (skip if initializing from submission)
  useEffect(() => {
    // Skip if we're currently initializing from submission (config already fetched)
    if (isInitializingFromSubmission.current) {
      return;
    }
    
    if (selectedDocumentType) {
      const fetchDocumentTypeConfig = async () => {
        try {
          const response = await axios.get(
            `${appURL}/recruitment/document-type/${selectedDocumentType}/form-config`,
            {
              params: { companyId },
            }
          );
          const config = response?.data?.data || null;
          setDocumentTypeConfig(config);
          
          // Update form data - preserve dynamic field values in edit mode
          setFormData((prev) => {
            // In edit mode, preserve existing dynamic field values
            // Only reset if not in edit mode
            const shouldPreserveValues = submissionId && (submissionDynamicFieldsRef.current || prev.dynamicFieldValues);
            
            return {
              ...prev,
              documentTypeId: selectedDocumentType,
              // Only reset dynamicFieldValues if not in edit mode
              dynamicFieldValues: shouldPreserveValues 
                ? (submissionDynamicFieldsRef.current || prev.dynamicFieldValues)
                : {},
            };
          });
        } catch (error) {
          console.error("Error fetching document type config:", error);
          Toast({
            message: "Failed to fetch document type configuration",
            type: "error",
          });
        }
      };

      fetchDocumentTypeConfig();
    } else {
      setDocumentTypeConfig(null);
      setFormData((prev) => ({
        ...prev,
        documentTypeId: "",
        dynamicFieldValues: {},
      }));
    }
  }, [selectedDocumentType, companyId, submissionId]);
  
const searchLower = search.trim().toLowerCase();

const filteredDocumentTypes = useMemo(() => {
  if (!searchLower) return documentTypesForTable;

  return documentTypesForTable.filter((item) => {
    const searchMatch = (value) =>
      String(value ?? "").toLowerCase().includes(searchLower);

    return [
      item.documentTypeName,
      String(item.documentCode),
      item.status,
      item._id
    ].some(searchMatch);
  });
}, [documentTypesForTable, searchLower]);


  const handleDocumentTypeChange = (e) => {
    const docTypeId = e.target.value;
    setSelectedDocumentType(docTypeId);
    setFormData((prev) => ({
      ...prev,
      uploadedFile: null,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "submissionDate") {
      setFormData((prev) => ({
        ...prev,
        submissionDate: value,
      }));
    } else if (name.startsWith("dynamic_")) {
      const fieldId = name.replace("dynamic_", "");
      setFormData((prev) => ({
        ...prev,
        dynamicFieldValues: {
          ...prev.dynamicFieldValues,
          [fieldId]: value,
        },
      }));
    }
  };

  const handleFileUpload = (fileData) => {
    const file = fileData?.file || fileData;
    if (file) {
      setFormData((prev) => ({
        ...prev,
        uploadedFile: file,
      }));
    }
  };

  const renderDynamicField = (field) => {
    const fieldId = field.id || field._id;
    const fieldValue = formData.dynamicFieldValues[fieldId] || "";

    switch (field.fieldType) {
      case "text":
        return (
          <InputTextComponent
            id={`dynamic_${fieldId}`}
            name={`dynamic_${fieldId}`}
            label={field.isRequired ? createRequiredLabel(field.fieldName) : field.fieldName}
            type="text"
            value={fieldValue}
            onChange={handleInputChange}
            required={field.isRequired}
            disabled={submitting || viewMode}
          />
        );

      case "number":
        return (
          <InputTextComponent
            id={`dynamic_${fieldId}`}
            name={`dynamic_${fieldId}`}
            label={field.isRequired ? createRequiredLabel(field.fieldName) : field.fieldName}
            type="number"
            value={fieldValue}
            onChange={handleInputChange}
            required={field.isRequired}
            disabled={submitting || viewMode}
          />
        );

      case "date":
        return (
          <InputTextComponent
            id={`dynamic_${fieldId}`}
            name={`dynamic_${fieldId}`}
            label={field.isRequired ? createRequiredLabel(field.fieldName) : field.fieldName}
            type="date"
            value={fieldValue}
            onChange={handleInputChange}
            required={field.isRequired}
            disabled={submitting || viewMode}
            disableFutureDate={true}
          />
        );

      case "dropdown":
        const dropdownOptions = field.fieldOptions
          ? field.fieldOptions.split(",").map((opt) => ({
              label: opt.trim(),
              value: opt.trim(),
            }))
          : [];
        return (
          <SelectComponent
            id={`dynamic_${fieldId}`}
            name={`dynamic_${fieldId}`}
            label={field.isRequired ? createRequiredLabel(field.fieldName) : field.fieldName}
            value={fieldValue}
            onChange={handleInputChange}
            options={dropdownOptions}
            required={field.isRequired}
            disabled={submitting || viewMode}
          />
        );

      case "radio":
        const radioOptions = field.fieldOptions
          ? field.fieldOptions.split(",").map((opt) => ({
              label: opt.trim(),
              value: opt.trim(),
            }))
          : [];
        return (
          <CustomRadio
            label={field.isRequired ? createRequiredLabel(field.fieldName) : field.fieldName}
            name={`dynamic_${fieldId}`}
            options={radioOptions}
            color="#837F39"
            direction="row"
            value={fieldValue}
            onChange={(value) => {
              if (!viewMode) {
                setFormData((prev) => ({
                  ...prev,
                  dynamicFieldValues: {
                    ...prev.dynamicFieldValues,
                    [fieldId]: value,
                  },
                }));
              }
            }}
            disabled={viewMode}
          />
        );

      case "checkbox":
        return (
          <CustomCheckBoxSwitch
            type="checkbox"
            label={field.isRequired ? createRequiredLabel(field.fieldName) : field.fieldName}
            checked={fieldValue === true || fieldValue === "true"}
            onChange={(event) => {
              if (!viewMode) {
                const fieldId = field.id || field._id;
                setFormData((prev) => ({
                  ...prev,
                  dynamicFieldValues: {
                    ...prev.dynamicFieldValues,
                    [fieldId]: event.target.checked,
                  },
                }));
              }
            }}
            disabled={viewMode}
          />
        );

      case "file":
        const fileUrl = dynamicFileUrls[fieldId];
        if (viewMode && fileUrl) {
          return (
            <Box
              sx={{
                border: "1px solid #E9EAEC",
                borderRadius: "10px",
                p: 2,
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  color: "#0E0E0E",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {field.isRequired ? createRequiredLabel(field.fieldName) : field.fieldName}
              </Typography>
              <Button
                variant="contained"
                href={fileUrl}
                target="_blank"
                sx={{
                  backgroundColor: "#837F39",
                  color: "white",
                  fontSize: "12px",
                  padding: "6px 16px",
                  "&:hover": {
                    backgroundColor: "#6a6630",
                  },
                }}
              >
                View File
              </Button>
            </Box>
          );
        }
        return (
          <FileUploadCustom
            id={`dynamic_file_${fieldId}`}
            label={field.isRequired ? createRequiredLabel(field.fieldName) : field.fieldName}
            onFileUpload={(fileData) => {
              const file = fileData?.file || fileData;
              if (file) {
                setFormData((prev) => ({
                  ...prev,
                  dynamicFieldValues: {
                    ...prev.dynamicFieldValues,
                    [fieldId]: file,
                  },
                }));
              }
            }}
            disabled={viewMode}
          />
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.documentTypeId) {
      Toast({
        message: "Please select a document type",
        type: "error",
      });
      return;
    }

    if (!formData.submissionDate) {
      Toast({
        message: "Please select submission date",
        type: "error",
      });
      return;
    }

    // Validate required dynamic fields
    if (documentTypeConfig?.dynamicFields) {
      for (const field of documentTypeConfig.dynamicFields) {
        if (field.isRequired) {
          const fieldId = field.id || field._id;
          const value = formData.dynamicFieldValues[fieldId];
          if (!value || (typeof value === "string" && !value.trim())) {
            Toast({
              message: `Please fill required field: ${field.fieldName}`,
              type: "error",
            });
            return;
          }
        }
      }
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("documentTypeId", formData.documentTypeId);
      formDataToSend.append("submissionDate", formData.submissionDate);
      // Ensure employeeId and companyId are strings (not arrays)
      formDataToSend.append("employeeId", Array.isArray(userId) ? userId[0] : userId);
      formDataToSend.append("companyId", Array.isArray(companyId) ? companyId[0] : companyId);

      if (formData.uploadedFile) {
        formDataToSend.append("documentFile", formData.uploadedFile);
      }

      // Append dynamic field values
      const dynamicFieldValues = {};
      Object.keys(formData.dynamicFieldValues).forEach((fieldId) => {
        const value = formData.dynamicFieldValues[fieldId];
        if (value instanceof File) {
          formDataToSend.append(`dynamicFile_${fieldId}`, value);
        } else {
          dynamicFieldValues[fieldId] = value;
        }
      });
      formDataToSend.append("dynamicFieldValues", JSON.stringify(dynamicFieldValues));

      let response;
      if (submissionId) {
        // Update existing submission
        response = await axios.put(
          `${appURL}/recruitment/document-submissions/${submissionId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new submission
        // Note: employeeId and companyId are already appended above, no need to append again
        response = await axios.post(
          `${appURL}/recruitment/document-submission`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      Toast({
        message: response?.data?.message || (submissionId ? "Document updated successfully" : "Document submitted successfully"),
        type: "success",
      });

      // Navigate back to document submissions table after success
      setTimeout(() => {
        history.push("/admin/previlages/document-submissions");
      }, 1000);
    } catch (error) {
      console.error("Submission error:", error);
      Toast({
        message:
          error.response?.data?.message || "Failed to submit document",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedDocumentType("");
    setDocumentTypeConfig(null);
    setFormData({
      documentTypeId: "",
      submissionDate: "",
      uploadedFile: null,
      dynamicFieldValues: {},
    });
    
    // If coming from table view, go back to table view
    if (!submissionId) {
      setShowTableView(true);
    } else {
      // Navigate back to document submissions table
      history.push("/admin/previlages/document-submissions");
    }
  };

  // Handle document type row click from table
  const handleDocumentTypeClick = (documentType) => {
    setSelectedDocumentType(documentType._id);
    setShowTableView(false);
    // Update URL to include documentTypeId
    history.push(`/admin/previlages/document-submission?documentTypeId=${documentType._id}`);
  };

  // Define table columns for document types
  const documentTypeColumns = [
    {
      id: "documentTypeName",
      label: "Document Type Name",
      sortable: true,
      render: (row) => (
        <span 
          style={{ 
            color: "#837F39", 
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "underline"
          }}
          onClick={() => handleDocumentTypeClick(row)}
        >
          {row?.documentTypeName || "N/A"}
        </span>
      ),
    },
    {
      id: "code",
      label: "Code",
      sortable: true,
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row?.documentCode || "N/A"}
        </span>
      ),
    },
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        console.log(row,"hi------------"),
        <span
          style={{
            color: row?.status === "active" ? "#837F39" : "#707070",
            fontWeight: 500,
            textTransform: "capitalize",
          }}
        >
          {row?.status || "inactive"}
        </span>
      ),
    },
    {
      id: "fieldsCount",
      label: "Fields Count",
      sortable: false,
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row?.dynamicFields?.length || 0}
        </span>
      ),
    },
  ];

  // Show table view if no document type is selected and not in edit mode
  if (showTableView) {
    return (
      <Box
        sx={{
          paddingBottom: "70px",
          margin: "3rem",
          bgcolor: "#fff",
          padding: "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 1px 1px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          sx={{
            fontSize: "32px",
            fontWeight: "600",
            fontFamily: `"Montserrat"`,
            color: "#0E0E0E",
            mb: 3,
          }}
        >
          Available Document Types
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : documentTypesForTable.length > 0 ? (
          <CustomTable
            data={filteredDocumentTypes}
            columns={documentTypeColumns}
            loading={loading}
            onRowClick={handleDocumentTypeClick}
            sx={{
              '& .MuiTableRow-root': {
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f9f9f9',
                },
              },
            }}
            search={search}
            setSearch={setSearch}
            skipInternalFilter={true}
          />
        ) : (
          <Typography sx={{ p: 3, textAlign: "center", color: "#707070" }}>
            No document types available for submission. Please contact your administrator.
          </Typography>
        )}
      </Box>
    );
  }

  // Show submission form view
  return (
    <Box
      sx={{
        paddingBottom: "70px",
        margin: "3rem",
        bgcolor: "#fff",
        padding: "2rem",
        borderRadius: "1.5rem",
        boxShadow: "0px 1px 1px rgba(0,0,0,0.2)",
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0px",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "space-between", width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                sx={{
                  fontSize: "32px", 
                  fontWeight: "600",
                  fontFamily: `"Montserrat"`,
                  color: "#0E0E0E",
                }}
              >
                {viewMode 
                  ? "Document Submission Details" 
                  : "Document Submission"}
            </Typography>
              {documentTypeIdFromUrl && !submissionId && !viewMode && (
                <Button
                  onClick={() => {
                    setShowTableView(true);
                    setSelectedDocumentType("");
                    history.push("/admin/previlages/document-submission");
                  }}
                  variant="outlined"
                  sx={{
                    color: "#837F39",
                    borderColor: "#837F39",
                    "&:hover": {
                      borderColor: "#6a6630",
                      backgroundColor: "#f9f9f9",
                    },
                  }}
                >
                  ← Back to Document Types
                </Button>
              )}
            </Box>
            
            
              
          </Box>
        </Box>

        <Grid container spacing={2}>
          {!documentTypeIdFromUrl && (
            <Grid item xs={12} md={6}>
              <SelectComponent
                id="documentTypeId"
                name="documentTypeId"
                label={createRequiredLabel("Document Type")}
                value={selectedDocumentType}
                onChange={handleDocumentTypeChange}
                options={documentTypes}
                required
                disabled={loading || submitting || viewMode}
              />
            </Grid>
          )}

          {documentTypeIdFromUrl && viewMode && documentTypeConfig && (
            <Grid item xs={12} md={6}>
              <InputTextComponent
                id="documentTypeName"
                name="documentTypeName"
                label="Document Type"
                type="text"
                value={documentTypeConfig.documentTypeName || ""}
                disabled={true}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <InputTextComponent
              id="submissionDate"
              name="submissionDate"
              label={createRequiredLabel("Date of Submission")}
              type="date"
              value={formData.submissionDate}
              onChange={handleInputChange}
              required
              disabled={submitting || viewMode}
              disableFutureDate={true}
            />
          </Grid>

          {/* Dynamic Fields */}
          {documentTypeConfig?.dynamicFields &&
            documentTypeConfig.dynamicFields.length > 0 && (
              <>
                

                {documentTypeConfig.dynamicFields.map((field, index) => (
                  <Grid
                    item
                    xs={12}
                    md={field.fieldType === "checkbox" ? 12 : 6}
                    key={field.id || field._id || index}
                  >
                    {renderDynamicField(field)}
                  </Grid>
                ))}
              </>
            )}
        </Grid>

        {/* Buttons Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: viewMode ? "space-between" : "flex-end",
            gap: 2,
            mt: 4,
            mb: 2,
          }}
        >
          {/* View Mode Buttons - Only Back Button */}
          {viewMode ? (
            <>
              {/* HR Actions for pending submissions */}
              {isHRAdmin && (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleApprove}
                    sx={{
                      backgroundColor: "#837F39",
                      color: "white",
                      fontFamily: "Work Sans",
                      fontWeight: "500",
                      borderRadius: "20px",
                      minWidth: "120px",
                      "&:hover": {
                        backgroundColor: "#6a6630",
                      },
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setRejectDialogOpen(true)}
                    sx={{
                      color: "#847F3B",
                      borderColor: "#847F3B",
                      fontFamily: "Work Sans",
                      fontWeight: "500",
                      borderRadius: "20px",
                      minWidth: "120px",
                      "&:hover": {
                        borderColor: "#6a6630",
                        backgroundColor: "#f9f9f9",
                      },
                    }}
                  >
                    Reject
                  </Button>
                </Box>
              )}
              
              {/* Back button for everyone */}
              <Button
                variant="outlined"
                onClick={() => history.push("/admin/previlages/document-submissions")}
                sx={{
                  color: "#847F3B",
                  borderColor: "#847F3B",
                  fontFamily: "Work Sans",
                  fontWeight: "500",
                  borderRadius: "20px",
                  minWidth: "120px",
                }}
              >
                Back to List
              </Button>
            </>
          ) : (
            /* Edit/Submit Mode Buttons */
            <>
              <Button
                type="button"
                variant="contained"
                onClick={handleCancel}
                sx={{
                  backgroundColor: "#FFFFFF",
                  color: "#847F3B",
                  fontFamily: "Work Sans",
                  fontWeight: "500",
                  borderRadius: "20px",
                  minWidth: "120px",
                  "&:hover": {
                    backgroundColor: "#FFFFFF",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  backgroundColor: "#837F39",
                  color: "#FFFFFF",
                  fontFamily: "Work Sans",
                  fontWeight: "500",
                  borderRadius: "20px",
                  minWidth: "120px",
                  "&:hover": {
                    backgroundColor: "#837F39",
                  },
                }}
              >
                {submitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit"
                )}
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Reject Dialog for HR */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => {
          setRejectDialogOpen(false);
          setRejectionReason("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Document Submission</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to reject this document submission?
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason (Optional)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter the reason for rejection..."
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setRejectDialogOpen(false);
              setRejectionReason("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            color="error"
            variant="contained"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentSubmission;

