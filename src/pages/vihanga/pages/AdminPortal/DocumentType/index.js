import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  MenuItem,
} from "@mui/material";
import CustomCheckBoxSwitch from "pages/vihanga/components/CustomCheckSwitch";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import DocumentTypeTable from "./DocumentTypeTable";
import { appURL } from "./../../../../../utilities/baseurl";
import axios from "axios";
import { Toast } from "service/toast";
import { getAllPrivilegesGroup } from "action/PrivilegesGroupAct";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import PersonIcon from '@mui/icons-material/Person';
import { canEdit } from "utilities/privilegeHelper";

const DocumentType = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const generateDocumentCode = () => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    const rand = Math.floor(Math.random() * 90 + 10);
    return `${h}${m}${s}${rand}`;
  };

  // Helper function to create label with red asterisk for required fields
  const createRequiredLabel = (labelText) => {
    return (
      <>
        {labelText}{" "}
        <span style={{ color: "red" }}>*</span>
      </>
    );
  };

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [privilegeGroupOptions, setPrivilegeGroupOptions] = useState([]);
  const [privilegeGroupsData, setPrivilegeGroupsData] = useState([]);
  const [loadingPrivilegeGroups, setLoadingPrivilegeGroups] = useState(false);
  const [formData, setFormData] = useState({
    documentTypeName: "",
    documentCode: generateDocumentCode(),
    status: "",
    privilegeGroup: "",
    privilegeGroupId: "",
    dynamicFields: [
      {
        id: Date.now(),
        fieldName: "",
        fieldType: "",
        isRequired: false,
        fieldOptions: "",
      },
    ],
  });
  const [selectedPrivilegeGroup, setSelectedPrivilegeGroup] = useState(null);
  const [showEmployeePopup, setShowEmployeePopup] = useState(false);

  const companyId =
    localStorage.getItem("companyId") !== null
      ? JSON.parse(localStorage.getItem("companyId"))
      : null;

  // Check if user is HR
  const userData = localStorage.getItem("user");
  let userRole = "";
  try {
    if (userData) {
      const parsedUser = JSON.parse(userData);
      userRole = parsedUser.role || "";
      console.log("User Role:", userRole);
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  const isHR = userRole.toLowerCase().includes("hr");
  console.log("Is HR:", isHR);

  // Get all employees from selected privilege group
  const getSelectedGroupEmployees = useCallback(() => {
    if (!formData.privilegeGroup) {
      return [];
    }

    const group = privilegeGroupsData.find(g => g.groupName === formData.privilegeGroup);
    if (group && group.activeGroupMembers) {
      return group.activeGroupMembers;
    }

    return [];
  }, [formData.privilegeGroup, privilegeGroupsData]);

  // Close employee popup
  const handleCloseEmployeePopup = () => {
    setShowEmployeePopup(false);
  };

  useEffect(() => {
    const fetchPrivilegeGroupOptions = async () => {
      setLoadingPrivilegeGroups(true);
      setError(null);
      try {
        const response = dispatch(getAllPrivilegesGroup());
        const { success, message, data } = await response;
        
        if (success && data) {
          const privilegeGroupsData = data.privilegeGroups || [];
          const options = privilegeGroupsData.map((item) => ({
            label: item.groupName,
            value: item.groupName,
            id: item._id,
          }));
          setPrivilegeGroupOptions(options);
          setPrivilegeGroupsData(privilegeGroupsData); // Store full data with members
        } else {
          setPrivilegeGroupOptions([]);
          setPrivilegeGroupsData([]);
          setError(message || "Failed to fetch privilege groups");
        }
      } catch (err) {
        console.error("Fetch Privilege Groups Error:", err);
        setError("Failed to fetch privilege groups");
      } finally {
        setLoadingPrivilegeGroups(false);
      }
    };

    fetchPrivilegeGroupOptions();
  }, [companyId, dispatch]);

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const fieldTypeOptions = [
    { label: "Text", value: "text" },
    { label: "Number", value: "number" },
    { label: "Date", value: "date" },
    { label: "File Upload", value: "file" },
    { label: "Dropdown", value: "dropdown" },
    { label: "Radio", value: "radio" },
    { label: "Checkbox", value: "checkbox" },
  ];

  const handleAddField = () => {
    setFormData((prev) => ({
      ...prev,
      dynamicFields: [
        ...prev.dynamicFields,
        {
          id: Date.now(),
          fieldName: "",
          fieldType: "",
          isRequired: false,
          fieldOptions: "",
        },
      ],
    }));
  };

  const handleRemoveField = (fieldId) => {
    setFormData((prev) => {
      const filteredFields = prev.dynamicFields.filter((field) => {
        // Match by id, _id, or any identifier
        const fieldIdentifier = field.id || field._id;
        return String(fieldIdentifier) !== String(fieldId);
      });
      return {
        ...prev,
        dynamicFields: filteredFields,
      };
    });
  };

  const handleFieldChange = (fieldId, fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      dynamicFields: prev.dynamicFields.map((field) => {
        const currentFieldId = field.id || field._id;
        return String(currentFieldId) === String(fieldId)
          ? { ...field, [fieldName]: value }
          : field;
      }),
    }));
  };

  const handleEdit = useCallback((selectedRow) => {
    setFormData((prev) => {
      // Ensure all dynamic fields have an id for proper removal
      const fieldsWithIds = (selectedRow.dynamicFields || []).map((field, index) => ({
        ...field,
        id: field.id || field._id || Date.now() + index, // Use existing id, _id, or generate one
      }));
      
      return {
        _id: selectedRow._id || "",
        documentTypeName: selectedRow.documentTypeName || "",
        documentCode: selectedRow.documentCode || generateDocumentCode(),
        status: selectedRow.status || "",
        privilegeGroup: selectedRow.privilegeGroup || "",
        privilegeGroupId: selectedRow.privilegeGroupId || "",
        dynamicFields: fieldsWithIds,
      };
    });
    
    // Set selected privilege group (single selection)
    if (selectedRow.privilegeGroup) {
      const selectedGroup = privilegeGroupOptions.find(opt => opt.value === selectedRow.privilegeGroup);
      setSelectedPrivilegeGroup(selectedGroup || { 
        label: selectedRow.privilegeGroup, 
        value: selectedRow.privilegeGroup, 
        id: selectedRow.privilegeGroupId || '' 
      });
    } else {
      setSelectedPrivilegeGroup(null);
    }
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [privilegeGroupOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.documentTypeName?.trim()) {
      Toast({
        message: "Please enter document type name",
        type: "error",
      });
      return;
    }

    if (!formData.status) {
      Toast({
        message: "Please select status",
        type: "error",
      });
      return;
    }

    if (!formData.privilegeGroup) {
      Toast({
        message: "Please select an employee group",
        type: "error",
      });
      return;
    }

    // Validate dynamic fields (skip completely empty fields)
    for (const field of formData.dynamicFields) {
      const hasFieldName = field.fieldName?.trim();
      const hasFieldType = field.fieldType;
      
      // Skip validation if both are empty (optional field)
      if (!hasFieldName && !hasFieldType) {
        continue;
      }
      
      // If one is filled, both must be filled
      if (!hasFieldName) {
        Toast({
          message: "Please enter field name for all fields",
          type: "error",
        });
        return;
      }
      if (!hasFieldType) {
        Toast({
          message: "Please select field type for all fields",
          type: "error",
        });
        return;
      }
      if ((field.fieldType === "dropdown" || field.fieldType === "radio") && !field.fieldOptions?.trim()) {
        Toast({
          message: "Please enter field options for dropdown/radio fields",
          type: "error",
        });
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        documentTypeName: formData.documentTypeName,
        documentCode: formData.documentCode,
        status: formData.status,
        privilegeGroup: formData.privilegeGroup || "",
        privilegeGroupId: formData.privilegeGroupId || "",
        dynamicFields: formData.dynamicFields
          .filter((field) => field.fieldName?.trim() && field.fieldType) // Only include filled fields
          .map((field) => ({
            fieldName: field.fieldName,
            fieldType: field.fieldType,
            isRequired: field.isRequired,
            fieldOptions: field.fieldOptions || "",
          })),
        companyId: companyId,
      };

      const url = formData._id
        ? `${appURL}/recruitment/document-type?id=${formData._id}`
        : `${appURL}/recruitment/document-type`;

      const response = await axios[formData._id ? "put" : "post"](url, payload);

      Toast({
        message:
          response?.data?.message ||
          (formData._id
            ? "Document type updated successfully"
            : "Document type created successfully"),
        type: "success",
      });

      setFormData({
        documentTypeName: "",
        documentCode: generateDocumentCode(),
        status: "",
        privilegeGroup: "",
        privilegeGroupId: "",
        dynamicFields: [
          {
            id: Date.now(),
            fieldName: "",
            fieldType: "",
            isRequired: false,
            fieldOptions: "",
          },
        ],
      });
      setSelectedPrivilegeGroup(null);
      setRefreshTable((prev) => !prev);
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred while submitting the form. Please try again.";
      setError(errorMessage);
      Toast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonConfigs = [
    {
      label: "Cancel",
      type: "button",
      variant: "contained",
      sx: {
        backgroundColor: "#FFFFFF",
        color: "#847F3B",
        fontFamily: "Work Sans",
        fontWeight: "500",
        borderRadius: "20px",
        "&:hover": {
          backgroundColor: "#FFFFFF",
        },
      },
      onClick: () => {
      setFormData({
        documentTypeName: "",
        documentCode: generateDocumentCode(),
        status: "",
        privilegeGroup: "",
        privilegeGroupId: "",
        dynamicFields: [
          {
            id: Date.now(),
            fieldName: "",
            fieldType: "",
            isRequired: false,
            fieldOptions: "",
          },
        ],
      });
      setSelectedPrivilegeGroup(null);
      setError(null);
      },
    },
    {
      label: formData._id ? "Update" : "Submit",
      type: "submit",
      variant: "contained",
      sx: {
        backgroundColor: "#837F39",
        color: "#FFFFFF",
        fontFamily: "Work Sans",
        fontWeight: "500",
        borderRadius: "20px",
        "&:hover": {
          backgroundColor: "#837F39",
        },
        ...((!canEdit()) && {
          opacity: 0.5,
          cursor: "not-allowed",
        }),
      },
      disabled: isSubmitting || !canEdit(),
    },
  ];

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          margin: "20px",
          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
          height: "auto",
          overflowY: "auto",
        }}
      >
        <Box sx={{ padding: "30px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "8px 16px",
            }}
          >
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "600",
                fontFamily: `"Montserrat"`,
                color: "#0E0E0E",
                marginLeft: "-17px",
              }}
            >
              Document Type Management
            </Typography>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InputTextComponent
                id="documentTypeName"
                name="documentTypeName"
                label={createRequiredLabel("Document Type Name")}
                type="text"
                value={formData.documentTypeName || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documentTypeName: e.target.value,
                  })
                }
                required
                disabled={isSubmitting || loadingPrivilegeGroups || !canEdit()}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InputTextComponent
                sx={{
                  pointerEvents: "none",
                  color: "#555",
                }}
                id="documentCode"
                name="documentCode"
                label="Document Code"
                type="text"
                value={formData.documentCode || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    documentCode: e.target.value,
                  })
                }
                disabled={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectComponent
                id="status"
                name="status"
                label={createRequiredLabel("Status")}
                value={formData.status || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                options={statusOptions}
                required
                disabled={isSubmitting || loadingPrivilegeGroups || !canEdit()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectComponent
                id="privilegeGroup"
                name="privilegeGroup"
                label={createRequiredLabel("Employee Group")}
                value={selectedPrivilegeGroup?.id || ""}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  
                  // Find the selected group
                  const selectedGroup = privilegeGroupOptions.find(opt => opt.id === selectedId);
                  
                  console.log("Selected privilege group ID:", selectedId);
                  console.log("Selected group:", selectedGroup);
                  
                  // Update selectedPrivilegeGroup state (single object)
                  setSelectedPrivilegeGroup(selectedGroup || null);
                  
                  // Update formData
                  setFormData((prev) => ({
                    ...prev,
                    privilegeGroup: selectedGroup ? selectedGroup.value : "",
                    privilegeGroupId: selectedGroup ? selectedGroup.id : "",
                  }));
                }}
                options={privilegeGroupOptions.map(opt => ({ ...opt, value: opt.id }))}
                required
                disabled={isSubmitting || loadingPrivilegeGroups || !canEdit()}
              />
              
              {/* Display employee count as clickable text */}
              {formData.privilegeGroup && getSelectedGroupEmployees().length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    onClick={() => setShowEmployeePopup(true)}
                    sx={{
                      color: '#837F39',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      '&:hover': {
                        color: '#6a6630',
                      },
                    }}
                  >
                    <PersonIcon sx={{ fontSize: '18px' }} />
                    View {getSelectedGroupEmployees().length} Employee{getSelectedGroupEmployees().length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              )}
            </Grid>

           
          </Grid>

          {/* Dynamic Fields Section */}
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: "600",
                  fontFamily: '"Montserrat"',
                  color: "#0E0E0E",
                }}
              >
                Dynamic Fields
              </Typography>
              {canEdit() && (
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleAddField}
                  sx={{
                    color: "#837F39",
                    textTransform: "none",
                    fontFamily: "Work Sans",
                  }}
                >
                  Add Field
                </Button>
              )}
            </Box>

            <Box
              sx={{
                maxHeight: "525px",
                overflowY: "auto",
                overflowX: "hidden",
                pr: 1,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#555",
                },
              }}
            >
              {formData.dynamicFields.map((field, index) => {
                const fieldId = field.id || field._id || `field-${index}`;
                return (
                  <Box
                    key={fieldId}
                    sx={{
                      border: "1px solid #E9EAEC",
                      borderRadius: "10px",
                      p: 2,
                      mb: 2,
                      transition: "all 0.2s ease-in-out",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "#837F39",
                        boxShadow: "0px 4px 2px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "18px",
                          fontWeight: "600",
                          fontFamily: '"Work Sans"',
                          color: "#0E0E0E",
                        }}
                      >
                        Field {index + 1}
                      </Typography>
                      {canEdit() && (
                        <IconButton
                          onClick={() => handleRemoveField(fieldId)}
                          sx={{ 
                            color: "#d32f2f",
                          }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <InputTextComponent
                          id={`fieldName-${fieldId}`}
                          name={`fieldName-${fieldId}`}
                          label={createRequiredLabel("Field Name")}
                          type="text"
                          value={field.fieldName || ""}
                          onChange={(e) =>
                            handleFieldChange(fieldId, "fieldName", e.target.value)
                          }
                          required
                          disabled={isSubmitting || !canEdit()}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <SelectComponent
                          id={`fieldType-${fieldId}`}
                          name={`fieldType-${fieldId}`}
                          label={createRequiredLabel("Field Type")}
                          value={field.fieldType || ""}
                          onChange={(e) =>
                            handleFieldChange(fieldId, "fieldType", e.target.value)
                          }
                          options={fieldTypeOptions}
                          required
                          disabled={isSubmitting || !canEdit()}
                        />
                      </Grid>

                      {(field.fieldType === "dropdown" || field.fieldType === "radio") && (
                        <Grid item xs={12} md={6}>
                          <InputTextComponent
                            id={`fieldOptions-${fieldId}`}
                            name={`fieldOptions-${fieldId}`}
                            label={createRequiredLabel("Field Options (comma-separated)")}
                            type="text"
                            value={field.fieldOptions || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                fieldId,
                                "fieldOptions",
                                e.target.value
                              )
                            }
                            placeholder="Option1, Option2, Option3"
                            required
                            disabled={isSubmitting || !canEdit()}
                          />
                        </Grid>
                      )}

                      <Grid item xs={12} md={6}>
                        <CustomCheckBoxSwitch
                          type="checkbox"
                          label="Is Required?"
                          checked={field.isRequired}
                          onChange={(event) =>
                            handleFieldChange(
                              fieldId,
                              "isRequired",
                              event.target.checked
                            )
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}

              {formData.dynamicFields.length === 0 && (
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#999",
                    fontFamily: "Work Sans",
                    py: 4,
                  }}
                >
                  No fields added. Click "Add Field" to add dynamic fields.
                </Typography>
              )}
            </Box>
          </Box>
          
          {canEdit() && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
                mb: 2,
              }}
            >
              {buttonConfigs.map((btn, index) => (
                <Button
                  key={index}
                  type={btn.type}
                  variant={btn.variant}
                  onClick={btn.onClick}
                  disabled={btn.disabled}
                  sx={btn.sx}
                >
                  {btn.label}
                </Button>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <DocumentTypeTable onEdit={handleEdit} refreshTable={refreshTable} privilegeGroupsData={privilegeGroupsData} isHR={isHR} />

      {/* Employee List Popup */}
      <Dialog 
        open={showEmployeePopup} 
        onClose={handleCloseEmployeePopup}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: '#837F39', 
          color: 'white',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Employees in Selected Groups</span>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Total: {getSelectedGroupEmployees().length}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {getSelectedGroupEmployees().length > 0 ? (
            <List sx={{ 
              maxHeight: '400px', 
              overflow: 'auto',
              '& .MuiListItem-root': {
                borderBottom: '1px solid #f0f0f0',
                '&:last-child': {
                  borderBottom: 'none'
                }
              }
            }}>
              {getSelectedGroupEmployees().map((employee, index) => (
                <ListItem 
                  key={employee._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f9f9f9'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                    <Typography 
                      sx={{ 
                        minWidth: '30px', 
                        fontWeight: 600, 
                        color: '#837F39' 
                      }}
                    >
                      {index + 1}.
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: '16px',
                          color: '#0E0E0E'
                        }}
                      >
                        {employee.personalInformation 
                          ? `${employee.personalInformation.firstName || ''} ${employee.personalInformation.lastName || ''}`.trim()
                          : employee.name || 'Unknown'}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ color: '#707070', mt: 0.5 }}
                      >
                        {employee.contactInformation?.email || 'No email'}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#707070',
                          fontWeight: 500 
                        }}
                      >
                        {employee.employmentInformation?.department || 'N/A'}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ color: '#999' }}
                      >
                        {employee.employmentInformation?.role || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography sx={{ p: 3, textAlign: 'center', color: '#707070' }}>
              No employees found in selected groups
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
          <Button 
            onClick={handleCloseEmployeePopup}
            variant="contained"
            sx={{
              backgroundColor: '#837F39',
              color: 'white',
              '&:hover': {
                backgroundColor: '#6a6630',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocumentType;

