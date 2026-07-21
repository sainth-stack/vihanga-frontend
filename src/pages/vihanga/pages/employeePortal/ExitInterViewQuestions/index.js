import React, { useState, useEffect } from "react";
import { Typography, Box, Grid, Button, Modal, Paper } from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import ExitInterviewTable from './table/index'
import axios from "axios";
import { Alert, CircularProgress } from "@mui/material";
import { Toast } from '../../../../../service/toast'
import { appURL } from "utilities";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";


const ExitInterView = () => {

  const userId = getItemFromLocalStorage("user")?._id
  const companyId = getItemFromLocalStorage("companyId")

  const [resumeFile, setResumeFile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    normalDate: "",
    employeeName: "",
    empStartDate: "",
    empEndDate: "",
    position: "",
    note: "",
    halfDay: false,
  });

 



  // Function to fetch employee data and prefill form
  const fetchEmployee=async  ()=>{
    await axios.get(`${appURL}/recruitment/getExitInterViewById?id=${userId}&companyId=${companyId}`)
    .then(res => {
      const data =  res?.data.data;
      console.log("res----",res.data)
      setFormData(prev => ({
        ...prev,
        employeeName: `${data.personalInformation?.firstName || ""} ${data.personalInformation?.lastName || ""}`.trim(),
        position: data.employmentInformation?.designation || "",
        empStartDate: data.contactInformation?.createdAt ? new Date(data.contactInformation.createdAt).toISOString().split('T')[0] : "",
      }));
    })
    .catch(err => {
      console.error("Failed to fetch resignation data", err);
    });
  }

  const fetchEmployeeDetails=async  ()=>{
    await axios.get(`${appURL}/employees/getEmployeeById/${userId}`)
    .then(res => {
      const data =  res?.data?.data;
      setFormData({
        employeeName: data.personalInformation?.firstName+data.personalInformation?.lastName || "",
        position: data.employmentInformation?.designation || "",
        empStartDate: data.employmentInformation?.hireDate,
        normalDate:new Date().toISOString().split('T')[0],
      
      });
    })
    .catch(err => {
      console.error("Failed to fetch resignation data", err);
    });
  }

  useEffect(() => {
 
      if (!userId) {
        Toast({ type: "error", message: "Please Employee ID and Company ID is Required..." });
      }
      else{

        fetchEmployee()
        fetchEmployeeDetails()
      }
     
    
  }, [setFormData]);


 

  const handleClear = () => {
    
    setFormData({
      normalDate: "",
      employeeName: "",
      empStartDate: "",
      empEndDate: "",
      position: "",
      note: "",
      halfDay: false,
    });
    setEditData(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (row) => {
    console.log("Editing row:", row);
    setEditData(row);
  };

  const refreshTable = () => {
    setEditData(null);
    setRefreshTrigger((prev) => !prev); // toggle trigger
  };

  const durationOptions = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
  ];

  // Define fields in an array
  const formFields = [
    { id: "normalDate", label: "Date", type: "date", component: "input" },
    {
      id: "employeeName",
      label: "Employee Name",
      type: "text",
      component: "input",
      disabled:true
    },
    {
      id: "position",
      label: "Position",
      type: "text",
      component: "input",
      disabled:true

    },
    {
      id: "empStartDate",
      label: "Employment Start Date",
      type: "date",
      component: "input",
      disabled:true

    },
    {
      id: "empEndDate",
      label: "Employment End Date",
      type: "date",
      component: "input",
    },
  ];


 

  return (
    <>
      <Box
        sx={{
          paddingBottom: "70px",
          margin: "1rem",
          bgcolor: "#fff",
          padding: "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 16px",
          }}
        >
          <Typography
            sx={{
              fontSize: "32px",
              fontWeight: "600",
              fontFamily: `"Montserrat"`,
              color: "#0E0E0E",
            }}
          >
            Exit Interview Questionnaire
          </Typography>
        </Box>


        <Grid container spacing={2}>
          {formFields.map((field) => (
            <Grid item xs={12} md={6} key={field.id}>
              {field.component === "input" ? (
                <InputTextComponent
                  id={field.id}
                  label={field.label}
                  type={field.type}
                  value={formData[field.id]}
                  onChange={handleChange}
                  disabled={field.disabled || false}
                  sx={{
  cursor: field.disabled ? "not-allowed" : "auto",
}}


                />
              ) : (
                <SelectComponent
                  id={field.id}
                  label={field.label}
                  value={formData[field.id]}
                  onChange={handleChange}
                  options={field.options || []}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>

      <ExitFeedback editData={editData}
        onSuccess={refreshTable} userId={userId}
companyId={companyId} />
      <ExitInterviewTable
        onEdit={handleEdit}
        refreshTrigger={refreshTrigger}

      />
    </>
  );
};

export default ExitInterView;









export const ExitFeedback = ({ editData = null, onSuccess,userId,companyId }) => {

  const questions = [
    "1. What were the primary reasons for leaving the organization?",
    "2. Were there specific aspects of your job or organization's culture contributing to your decision?",
    "3. Were there any areas where you felt unsupported or dissatisfied?",
    "4. What are your suggestions for improving the workplace or the employee experience?",
    "5. What did you like about your job?",
    "6. What were your expectations when you joined the organization and were your expectations satisfied?",
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setAnswers([
        editData.q1 || "",
        editData.q2 || "",
        editData.q3 || "",
        editData.q4 || "",
        editData.q5 || "",
        editData.q6 || "",
      ]);
    }
  }, [editData]);

  const handleChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handlePreview = async () => {
    setPreviewOpen(true);
    setPreviewLoading(true);
    
    try {
      const response = await axios.get(`${appURL}/recruitment/getExitInterViewById?id=${userId}&companyId=${companyId}`);
      const data = response?.data?.data;
      
      if (data && data.exitInterview) {
        setPreviewData({
          employeeName: `${data.personalInformation?.firstName || ""} ${data.personalInformation?.lastName || ""}`.trim(),
          employeeNumber: data.employmentInformation?.employeeNumber || "",
          position: data.employmentInformation?.designation || "",
          exitInterview: data.exitInterview,
          createdAt: data.contactInformation?.createdAt || ""
        });
      } else {
        setPreviewData(null);
      }
    } catch (error) {
      console.error("Error fetching preview data:", error);
      setPreviewData(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewData(null);
  };

  const handleSubmit = async () => {
    console.log("editData---at submit------------",editData)
    setLoading(true);

    const payload = {
      employeeId: editData?.employeeId || userId || "",
      companyId: companyId || "",
      q1: answers[0],
      q2: answers[1],
      q3: answers[2],
      q4: answers[3],
      q5: answers[4],
      q6: answers[5],
    };

    try {
      if (editData?.employeeId) {
        // Update existing exit interview
        await axios.put(`${appURL}/recruitment/updateExitInterView?id=${userId}&companyId=${companyId}`, {
          q1: answers[0],
          q2: answers[1],
          q3: answers[2],
          q4: answers[3],
          q5: answers[4],
          q6: answers[5],
        });
        Toast({ type: "success", message: "Feedback updated successfully." });
      } else {
        // Create new exit interview
        await axios.post(`${appURL}/recruitment/ExitInterView`, payload);
        Toast({ type: "success", message: "Feedback submitted successfully." });
        setAnswers(Array(6).fill(""));  
      }

      if (onSuccess) onSuccess(); 
    } catch (err) {
      console.error("Error submitting exit feedback:", err);
      Toast({ type: "error", message: "Failed to submit. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Preview Modal Component
  const PreviewModal = () => (
    <Modal
      open={previewOpen}
      onClose={handleClosePreview}
      aria-labelledby="preview-modal-title"
      aria-describedby="preview-modal-description"

    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 800,
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflow: 'auto'
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontFamily: "Work Sans, sans-serif",
            fontWeight: "bold",
            fontSize: "24px",
            color: "#000",
            mb: 3,
            textAlign: "center"
          }}
        >
          Exit Interview Preview
        </Typography>

        {previewLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : previewData ? (
          <>
            {/* Employee Information */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "600" }}>
                Employee Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">Name:</Typography>
                  <Typography variant="body1">{previewData.employeeName || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">Employee Number:</Typography>
                  <Typography variant="body1">{previewData.employeeNumber || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">Position:</Typography>
                  <Typography variant="body1">{previewData.position || "N/A"}</Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Exit Interview Questions */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {questions.map((question, index) => (
                <Box key={index} sx={{ border: "1px solid #e0e0e0", borderRadius: 1, p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: "Work Sans, sans-serif",
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#333",
                      mb: 1
                    }}
                  >
                    {question}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Work Sans, sans-serif",
                      fontSize: "14px",
                      color: "#666",
                      backgroundColor: "#f9f9f9",
                      p: 2,
                      borderRadius: 1,
                      minHeight: "60px",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {previewData.exitInterview[`q${index + 1}`] || "No answer provided"}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography variant="body1" color="textSecondary">
              No exit interview data found for this employee.
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            onClick={handleClosePreview}
            sx={{
              backgroundColor: "#837F39",
              color: "#FFFFFF",
              fontFamily: "Work Sans",
              fontWeight: "500",
              borderRadius: "20px",
              px: 4,
              "&:hover": {
                backgroundColor: "#837F39",
                color: "#FFFFFF",
              },
            }}
          >
            Close Preview
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  return (
    <>
      <Box
        sx={{
          paddingBottom: "70px",
          margin: "1rem",
          bgcolor: "#fff",
          padding: "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem", 
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Work Sans, sans-serif",
            fontWeight: "bold",
            fontSize: "18px",
            color: "#000",
          }}
        >
          Exit Interview Questions
        </Typography>

        {/* Questions */}
        {questions.map((question, index) => (
          <InputTextComponent
            key={index}
            label={question}
            multiline={true}
            minRows={5}
            sx={{}}
            value={answers[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        ))}

        <Box display="flex" justifyContent="flex-end" gap={2} mt={4} mb={2}>
          <Button
            type="button"
            variant="contained"
            sx={{
              backgroundColor: "#FFFFFF",
              color: "#847F3B",
              fontFamily: "Work Sans",
              fontWeight: "500",
              borderRadius: "20px",
              "&:hover": {
                backgroundColor: "#FFFFFF",
                color: "#847F3B",
              },
              "&:active": {
                backgroundColor: "#FFFFFF",
                color: "#847F3B",
              },
            }}
            onClick={() => {
              setAnswers(Array(questions.length).fill(""));
              setSuccessMsg("");
              setErrorMsg("");
            }}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="contained"
            sx={{
              backgroundColor: "gray",
              color: "#FFFFFF",
              fontFamily: "Work Sans",
              fontWeight: "500",
              borderRadius: "20px",
              "&:hover": {
                             backgroundColor: "gray",

                color: "#FFFFFF",
              },
            }}
            onClick={handlePreview}
            disabled={loading}
          >
            Preview
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#837F39",
              color: "#FFFFFF",
              fontFamily: "Work Sans",
              fontWeight: "500",
              borderRadius: "20px",
              "&:hover": {
                backgroundColor: "#837F39",
                color: "#FFFFFF",
              },
              "&:active": {
                backgroundColor: "#837F39",
                color: "#FFFFFF",
              },
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : editData ? "Update" : "Submit"}
          </Button>
        </Box>
      </Box>

      {/* Preview Modal */}
      <PreviewModal />
    </>
  );
};

