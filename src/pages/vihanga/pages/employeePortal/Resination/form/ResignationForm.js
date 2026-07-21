import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import Header from "pages/vihanga/pages/board/components/Header";
import FileUploadCustom from "pages/vihanga/components/filesUplode/draganddropFile";
// import CalendarView from "pages/vihanga/components/Calendar/CalendarView";
// import CalendarPage from "../TeamLeave";
import axios from "axios";
import { Toast } from "service/toast";
import {useResignationManager} from "../hooks/useResignationManager"
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getThemeColors } from "utilities/getThemeColors";
import { appURL } from "utilities";
import { canEdit } from "utilities/privilegeHelper";
import './index.css'
const ResignationForm = ({selectedRecord,onSaved}) => {
  const userId = getItemFromLocalStorage("user")
const companyId = getItemFromLocalStorage("companyId");
  const loggedUserDetails = getItemFromLocalStorage("user")

  // Add state for workflow
  const [workflow, setWorkflow] = useState(null);
  const [loadingWorkflow, setLoadingWorkflow] = useState(false);
  const [hasNoticePeriod, setHasNoticePeriod] = useState(false);

  const {
    formData,
    setFormData,
    file,
    handleChange,
    handleFileChange,
    resetForm,
  } = useResignationManager();
  

    const isEditing = Boolean(selectedRecord?._id);
    
  const { primaryColor, secondaryColors } = getThemeColors();
 
// populate form when editing
  useEffect(() => {
    if (selectedRecord) {
      setFormData({
        fullName: selectedRecord.fullName,
        employeeNumber: selectedRecord.employeeId,
        reasonForResignation: selectedRecord.reasonForResignation,
        lastDayOfWorking: selectedRecord.lastDayOfWorking.slice(0, 10),
        notifiedDate: selectedRecord.notifiedDate.slice(0, 10),

      });
    } 
  }, [selectedRecord]);

  // Prefill from API if not editing

  const fetchEmployee=async  ()=>{
    await axios.get(`${appURL}/recruitment/getResignation?id=${userId?._id}&companyId=${companyId}`)
    .then(res => {
      const data =  res?.data.data[0];
      console.log("res----",res.data)
      setFormData({
        fullName: (data.personalInformation?.firstName || "") + " " + (data.personalInformation?.lastName || ""),
        employeeNumber: data.employmentInformation?.employeeNumber || "",
      
      });
    })
    .catch(err => {
      console.error("Failed to fetch resignation data", err);
    });
  }

  const fetchEmployeeDetails=async  (isEditMode = false)=>{
    await axios.get(`${appURL}/employees/getEmployeeById/${userId?._id}`)
    .then(res => {
      const data =  res?.data?.data;
      const noticePeriod = Number(data?.candidateInformation?.noticePeriod || 0);
      const hasNoticePeriodValue = noticePeriod > 0 && data?.candidateInformation?.noticePeriod !== null;
      setHasNoticePeriod(hasNoticePeriodValue);
      
      // Only update form data if not editing (when editing, preserve values from selectedRecord)
      if (!isEditMode) {
        const currentDate = new Date();
        let lastDayOfWorking = new Date(currentDate);
        if (noticePeriod > 0) {
          lastDayOfWorking.setDate(currentDate.getDate() + noticePeriod);
        }
        
        setFormData(prevData => ({
          ...prevData,
          fullName: (data.personalInformation?.firstName || "") + " " + (data.personalInformation?.lastName || ""),
          employeeNumber: data.employmentInformation?.employeeNumber || "",
          notifiedDate: currentDate.toISOString().split("T")[0],
          lastDayOfWorking: lastDayOfWorking.toISOString().split("T")[0],
        }));
      }
    })
    .catch(err => {
      console.error("Failed to fetch resignation data", err);
    });
  }
  useEffect(() => {
    if (!isEditing) {
      if (!userId) return;
      fetchEmployee()
      fetchEmployeeDetails(false)
    } else {
      // When editing, also fetch employee details to check for noticePeriod
      if (userId) {
        fetchEmployeeDetails(true)
      }
    }

  }, [isEditing, setFormData]);

  // Fetch the resignation workflow on mount
  useEffect(() => {
    const fetchWorkflow = async () => {
      setLoadingWorkflow(true);
      try {
        const res = await axios.get(`${appURL}/recruitment/workflow?companyId=${companyId}`);
        const workflows = res.data.data;
        const resignationWorkflow = workflows.find(wf => wf.transactionType?.id === 'resignation_request');
        setWorkflow(resignationWorkflow);
      } catch (err) {
        console.error("Failed to fetch resignation workflow", err);
      } finally {
        setLoadingWorkflow(false);
      }
    };
    fetchWorkflow();
  }, [companyId]);

  
  const handleFormSubmit = async (e) => {
        e.preventDefault();

    const formPayload = new FormData();
    // Object.entries(formData).forEach(([k, v]) => formPayload.append(k, v));
    formPayload.append("employeeId", userId._id|| "");
    formPayload.append("employeeNumber", formData?.employeeNumber|| "");

    formPayload.append("companyId", companyId|| "");

formPayload.append(('fullName'), formData.fullName||"");
    formPayload.append("reasonForResignation", formData.reasonForResignation|| "");
    formPayload.append("lastDayOfWorking", formData.lastDayOfWorking|| "");
    formPayload.append("notifiedDate", formData.notifiedDate|| "");

    if (file) {
      formPayload.append("uploadAttachments", file);
    }
    // Attach workflow info if available
    if (workflow) {
      formPayload.append('workflowId', workflow._id);
      formPayload.append('approvalChain', JSON.stringify(workflow.approvalChain));
    }
    console.log("formpayload", formData);

    try {
      console.log(isEditing)
      if(isEditing){
        await axios.put( `${appURL}/recruitment/updateResignation?id=${selectedRecord._id}&companyId=${companyId}`,formPayload)
              Toast({ type: "success", message: "Resignation Edited and updated!" });

      }
    else{
      const response = await axios.post(
        `${appURL}/recruitment/createResignation`,
        formPayload
      );
      console.log("dataform", response.data);
      Toast({
        type: "success",
        message: "Resignation form submitted successfully!",
      });}
       onSaved();
    } catch (error) {
      console.error(
        " Error in submission:",
        error.response?.data || error.message
      );
      let errorMessage = "Something went wrong";
      if (
        error?.response?.data?.message ===
        "A resignation request is already pending for this employee."
      ) {
        errorMessage = "A resignation request is already pending for this employee.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      Toast({
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
<>
    <Box
component="form"
      onSubmit={handleFormSubmit}
      sx={{
        paddingBottom: "70px",
        margin: "1rem",
        bgcolor: secondaryColors.white,
        padding: "2rem",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      <Header text={isEditing ? "Edit Resignation" : "Resignation Form"} />
      <Typography sx={{ marginTop: "20px" }}>
 {isEditing
          ? "Update the fields below and click Update."
          : "Please fill out the following form to submit your resignation."}      </Typography>


      <Grid container spacing={3} mt={2}>
        {/* Full Name */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <InputTextComponent
              id="fullName"
              value={formData.fullName}
              onChange={handleChange("fullName")
              }
              disabled={true}

            />
          </Stack>
        </Grid>

        {/* Employee ID */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <label htmlFor="employeeNumber" className="form-label">
              Employee ID
            </label>
            <InputTextComponent
              id="employeeNumber"
              value={formData.employeeNumber}
              onChange={handleChange("employeeNumber")
              }
              disabled={true}

            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <label htmlFor="notifiedDate" className="form-label">
              Notified Date
            </label>
            <InputTextComponent
              id="notifiedDate"
              type="date"
              value={formData.notifiedDate}
              onChange={handleChange("notifiedDate")
              }
              disabled={!canEdit()}
            />
          </Stack>
        </Grid>
      

        {/* Last Date of Working */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <label htmlFor="lastWorkingDate" className="form-label">
              Last Date of Working
            </label>
            <InputTextComponent
              id="lastWorkingDate"
              type="date"
              value={formData.lastDayOfWorking}
              onChange={handleChange("lastDayOfWorking")
              }
              disabled={hasNoticePeriod || !canEdit()}
            />
          </Stack>
        </Grid>

                {/* Reason for Resignation */}
                <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <label htmlFor="resignationReason" className="form-label">
                    Reason for Resignation
                  </label>
                  <InputTextComponent
                    id="resignationReason"
                    multiline
                    rows={4}
                    value={formData.reasonForResignation}
                    onChange={handleChange("reasonForResignation")
                    }
                    disabled={!canEdit()}
                  />
                </Stack>
              </Grid>


        {/* File Upload */}
        {canEdit() && (
          <Grid item xs={12}>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{
                  mt: 2,
                  fontWeight: "600",
                  color: "rgba(14, 14, 14, 1)",
                }}
              >
                Upload attachments
              </Typography>
              <Typography sx={{ fontSize: "10px" }}>
                Please sign the document manually and then upload it.
              </Typography>
              <FileUploadCustom
                id="resignation-upload"
                name="fileAttachment"
                sx={{
                  border: "1.5px dashed #99965E",
                }}
                onFileUpload={handleFileChange}
                file={file}
                hideLabel // Optional: Add this to suppress internal label
              />
            </Box>
          </Grid>
        )}

        {/* Buttons */}
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            variant="outlined"
              className="resignation-form-buttons"
            sx={{
              textTransform: "capitalize",
              color: "#7a7a52",
              borderColor: "#7a7a52",
              borderRadius: "60px",
              "&:hover": {
                Color: "#7a7a52", // keep the same on hover
              },
            }}  onClick={() => {
               onSaved()
               resetForm()
              // setFile(null);
            }}
          >
            Cancel
          </Button>
          {canEdit() && (
            <Button
              className="resignation-form-buttons"
              variant="contained"
              type="submit"
              sx={{
                textTransform: "capitalize",
                backgroundColor: "#7a7a52",
                borderRadius: "60px",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  backgroundColor: "#7a7a52", // keep the same on hover
                },
              }}
            >
              {isEditing ? "Update Form" : "Submit Form"}
            </Button>
          )}
        </Grid>
      </Grid>

      {/* <CalendarPage/> */}
    </Box>

    </>
  );
};

export default ResignationForm;
