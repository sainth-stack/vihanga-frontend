import React, { useState } from "react";
import { Typography, Box, Grid } from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";

const DocumentForum = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState("");
  const [existingResume, setExistingResume] = useState("");

  const [formData, setFormData] = useState({
    normalDate: "",
    employeeName: "",
    empStartDate: "",
    empEndDate: "",
    position: "",
    note: "",
    halfDay: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

 const jobOptions = [
   { label: "Frontend Developer", value: "frontend_developer" },
   { label: "Backend Developer", value: "backend_developer" },
   { label: "Full Stack Developer", value: "full_stack_developer" },
   { label: "DevOps Engineer", value: "devops_engineer" },
 ];


  // Define fields in an array
  const formFields = [
    {
      id: "fullName",
      label: "Full Name",
      type: "text",
          component: "input",
      
    },
    {
      id: "jobAppliedFor",
      label: "Job Title Applied For",
      component: "select",
      options: jobOptions,
    },
    {
      id: "dateOfSubmission",
      label: "Date Of Submission",
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
        <Box>
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
              Document Verification Form
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: "600",
              fontFamily: `"Montserrat"`,
              color: "#0E0E0E",
            }}
          >
            Candidate Information
          </Typography>

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
                    endIcon={["fullName"].includes(field.id) ? true : false}
                  />
                ) : (
                  <SelectComponent
                    id={field.id}
                    label={field.label}
                    value={formData[field.label]}
                    onChange={handleChange}
                    options={field.options || []}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default DocumentForum;
