import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Alert, AlertTitle } from "@mui/material";
import Stepper from "pages/vihanga/components/stepper";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PersonalDetails from "./PersonalDetails";
import BankDetails from "./BankDetails";
import FamilyInformation from "./FamilyInformation";
import DocumentInfo from "./DocumentInfo";
import CustomButton from "../../../components/Button/CustomButton";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { appURL, getApiErrorMessage, removeDuplicates } from "utilities";
import { hiringOptions } from "pages/vihanga/utils/const";
import { getDesignations } from "action/DesignationAct";
import { getDepartmentsData } from "action/DepartmentAct";
import { useDispatch } from "react-redux";
import { Toast } from "service/toast";

const ProfileSetup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const candidateId = urlParams.get("candidateId") ? Number(urlParams.get("candidateId")) : null;
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    profile: {
      candidateId: null,
      firstName: "",
      phoneNumber: "",
      joiningDate: "",
      designation: "",
      department: "",
      workingshift: "",
      emailId: "",
      status: "",
      gender: "",
      dateOfBirth: "",
      address: "",
      title: "",
      middleName: "",
      panNumber: "",
      countryOfBirth: "",
      stateOfBirth: "",
      nationality: "",
      marriageDate: "",
      maritalStatus:"",
      fatherName: "",
      bloodGroup: "",
      pfNumber: "",
      hasPfUan: "no",
    },
    personal: {
      aadharNumber: "",
      passportNumber: "",
      driverLicenseNumber: "",
      driverLicenseExpiry: "",
      driverLicensePeriod: "",
      spouseFirstName: "",
      spouseSurName: "",
      spouseDateOfBirth: "",
      spouseOccupation: "",
      childInfoList: [],
      presentStreetHouseNumber: "",
      presentAddressLine2: "",
      presentCity: "",
      presentPostalCode: "",
      presentCountry: "",
      presentRegionState: "",
      presentDistrict: "",
      presentPrimaryEmergencyContact: "",
      presentSecondaryEmergencyContact: "",
      permanentStreetHouseNumber: "",
      permanentAddressLine2: "",
      permanentCity: "",
      permanentPostalCode: "",
      permanentCountry: "",
      permanentRegionState: "",
      permanentDistrict: "",
      permanentPrimaryEmergencyContact: "",
      permanentSecondaryEmergencyContact: "",
    },
    bank: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
      branchAddress: "",
      city: "",
      state: "",
    },
    family: {
      maritalStatus: "",
      coverageFor: "",
      spouseName: "",
      spouseDob: "",
      child1Name: "",
      child1Dob: "",
      child2Name: "",
      child2Dob: "",
    },
    document: {
      resume: null,
      certificates: [],
    },
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      let response = dispatch(getDepartmentsData());
      response.then(({ data, message }) => {
        if (data?.length > 0 && data[0]?.departments?.length > 0) {
          const result = data[0].departments
            .filter((item) => item.status === "Active")
            .map((item) => ({
              value: item.departmentName,
              label: item.departmentName,
              key: item.departmentName,
            }));
          setDepartments(removeDuplicates(result, "value"));
        } else {
          setError(message || "No Data Found!");
        }
      });
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignations = async () => {
    try {
      setLoading(true);
      let response = dispatch(getDesignations());
      response.then(({ data, message }) => {
        if (data?.length > 0) {
          const result = data
            .filter((item) => item.status === "Active")
            .map((item) => ({
              value: item.designationName,
              label: item.designationName,
              key: item.designationName,
            }));
          setDesignations(removeDuplicates(result, "value"));
        } else {
          setError(message || "No Data Found!");
        }
      });
    } catch (error) {
      console.error("Error fetching designations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (candidateId) {
      const fetchCandidate = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${appURL}/recruitment/getCandidateById?_id=${candidateId}`
          );
          const candidateData = response?.data?.data?.[0];

          setFormData((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              candidateId: candidateData?.candidateId ? Number(candidateData.candidateId) : candidateId,
              firstName:
                candidateData?.profileDetails?.firstName ||
                candidateData?.candidateName?.split(" ")[0] ||
                "",
              phoneNumber:
                candidateData?.profileDetails?.phoneNumber ||
                candidateData?.phone ||
                "",
              designation:
                candidateData?.designation ||
                candidateData?.profileDetails?.designation ||
                "",
              department:
                candidateData?.department ||
                candidateData?.profileDetails?.department ||
                "",
              workingshift: candidateData?.profileDetails?.workingshift || "",
              emailId:
                candidateData?.profileDetails?.emailId || candidateData?.email || "",
              status:
                candidateData?.status ||
                candidateData?.profileDetails?.status ||
                "onboarding",
              gender: (() => {
                const genderValue = candidateData?.gender || candidateData?.profileDetails?.gender || "";
                return genderValue ? String(genderValue).toLowerCase() : "";
              })(),
              dateOfBirth:
                candidateData?.profileDetails?.dateOfBirth ||
                candidateData?.dob ||
                "",
              address:
                candidateData?.profileDetails?.address ||
                candidateData?.location ||
                "",
              joiningDate:
                candidateData?.profileDetails?.dateOfJoining ||
                candidateData?.dateOfJoining ||
                "",
              title: candidateData?.profileDetails?.title || candidateData?.title || "",
              middleName: candidateData?.profileDetails?.middleName || candidateData?.middleName || "",
              panNumber: candidateData?.profileDetails?.panNumber || candidateData?.panNumber || "",
              countryOfBirth:
                candidateData?.profileDetails?.countryOfBirth || candidateData?.countryOfBirth || "",
              stateOfBirth: candidateData?.profileDetails?.stateOfBirth || candidateData?.cityStateOfBirth || "",
              nationality: candidateData?.profileDetails?.nationality || candidateData?.nationality || "",
              marriageDate: candidateData?.marriageDate || candidateData?.profileDetails?.marriageDate || "",
              maritalStatus: candidateData?.maritalStatus || candidateData?.profileDetails?.maritalStatus || "",
              fatherName: candidateData?.profileDetails?.fatherName || candidateData?.fatherName || "",
              bloodGroup: candidateData?.profileDetails?.bloodGroup || candidateData?.bloodGroup || "",
              pfNumber: candidateData?.profileDetails?.pfNumber || candidateData?.pfNumber || "",
              hasPfUan: candidateData?.profileDetails?.hasPfUan || "no",
            },
            personal: {
              ...prev.personal,
              aadharNumber: candidateData?.personalDetails?.aadharNumber || "",
              passportNumber: candidateData?.personalDetails?.passportNumber || "",
              driverLicenseNumber: candidateData?.personalDetails?.driverLicenseNumber || "",
              driverLicenseExpiry: candidateData?.personalDetails?.driverLicenseExpiry || "",
              driverLicensePeriod: candidateData?.personalDetails?.driverLicensePeriod || "",
              spouseFirstName: candidateData?.personalDetails?.spouseDetails?.firstName || "",
              spouseSurName: candidateData?.personalDetails?.spouseDetails?.surName || "",
              spouseDateOfBirth: candidateData?.personalDetails?.spouseDetails?.dateOfBirth || "",
              spouseOccupation: candidateData?.personalDetails?.spouseDetails?.occupation || "",
              childInfoList: candidateData?.childInfoList || [],
              presentStreetHouseNumber: candidateData?.personalDetails?.presentAddress?.streetHouseNumber || "",
              presentAddressLine2: candidateData?.personalDetails?.presentAddress?.addressLine2 || "",
              presentCity: candidateData?.personalDetails?.presentAddress?.city || "",
              presentPostalCode: candidateData?.personalDetails?.presentAddress?.postalCode || "",
              presentCountry: candidateData?.personalDetails?.presentAddress?.country || "",
              presentRegionState: candidateData?.personalDetails?.presentAddress?.regionState || "",
              presentDistrict: candidateData?.personalDetails?.presentAddress?.district || "",
              presentPrimaryEmergencyContact: candidateData?.personalDetails?.presentAddress?.primaryEmergencyContact || "",
              presentSecondaryEmergencyContact: candidateData?.personalDetails?.presentAddress?.secondaryEmergencyContact || "",
              permanentStreetHouseNumber: candidateData?.personalDetails?.permanentAddress?.streetHouseNumber || "",
              permanentAddressLine2: candidateData?.personalDetails?.permanentAddress?.addressLine2 || "",
              permanentCity: candidateData?.personalDetails?.permanentAddress?.city || "",
              permanentPostalCode: candidateData?.personalDetails?.permanentAddress?.postalCode || "",
              permanentCountry: candidateData?.personalDetails?.permanentAddress?.country || "",
              permanentRegionState: candidateData?.personalDetails?.permanentAddress?.regionState || "",
              permanentDistrict: candidateData?.personalDetails?.permanentAddress?.district || "",
              permanentPrimaryEmergencyContact: candidateData?.personalDetails?.permanentAddress?.primaryEmergencyContact || "",
              permanentSecondaryEmergencyContact: candidateData?.personalDetails?.permanentAddress?.secondaryEmergencyContact || "",
            },
            bank: {
              ...prev.bank,
              accountNumber: candidateData?.bankDetails?.accountNumber || "",
              ifscCode: candidateData?.bankDetails?.ifscCode || "",
              bankName: candidateData?.bankDetails?.bankName || "",
              branchName: candidateData?.bankDetails?.branchName || "",
              branchAddress: candidateData?.bankDetails?.branchAddress || "",
              city: candidateData?.bankDetails?.city || "",
              state: candidateData?.bankDetails?.state || "",
            },
            family: {
              ...prev.family,
              maritalStatus: candidateData?.familyDetails?.maritalStatus || "",
              coverageFor: candidateData?.insuranceDetails?.coverageFor || "",
              spouseName: candidateData?.insuranceDetails?.spouseName || "",
              spouseDob: candidateData?.insuranceDetails?.spouseDob || "",
              child1Name: candidateData?.insuranceDetails?.child1Name || "",
              child1Dob: candidateData?.insuranceDetails?.child1Dob || "",
              child2Name: candidateData?.insuranceDetails?.child2Name || "",
              child2Dob: candidateData?.insuranceDetails?.child2Dob || "",
            },
            document: {
              ...prev.document,
              resume: candidateData?.resume || null,
              certificates: (candidateData?.documents || []).map((doc) => ({
                type: doc.type || "",
                fileUrl: doc.url || "",
                fileName: doc.fileName || "",
                fileSize: doc.fileSize || "",
              })),
            },
          }));
        } catch (error) {
          console.error("Error fetching candidate:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCandidate();
    }
    fetchDepartments();
    fetchDesignations();
  }, [candidateId]);

  const steps = [{ label: "Profile Setup" }, { label: "Personal Details" }];

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const workshiftOptions = [
    { label: "Morning Shift", value: "morning" },
    { label: "Evening Shift", value: "evening" },
    { label: "Night Shift", value: "night" },
    { label: "General Shift", value: "general" },
  ];

  const formFields = [
    { id: "candidateId", label: "Candidate ID", type: "text", component: "input", disabled: true },
    { id: "title", label: "Title", component: "select", options: [
      { value: "Mr.", label: "Mr." },
      { value: "Mrs.", label: "Mrs." },
      { value: "Ms.", label: "Ms." },
      { value: "Dr.", label: "Dr." },
    ], required: true },
    { id: "firstName", label: "First Name", type: "text", component: "input", disabled: true },
    { id: "middleName", label: "Middle Name", type: "text", component: "input" },
    { id: "panNumber", label: "PAN Number", type: "text", component: "input", required: true },
    { id: "countryOfBirth", label: "Country of Birth", type: "text", component: "input" },
    { id: "stateOfBirth", label: "City/State of Birth", type: "text", component: "input" },
    { id: "nationality", label: "Nationality (Primary)", type: "text", component: "input", required: true },
    {id:"maritalStatus" , label:"Marital Status",component: "select", options:[  
    { label: "Single", value: "single" },
    { label: "Married", value: "married" },
    { label: "Divorced", value: "divorced" },
    { label: "Widowed", value: "widowed" },
    { label: "Separated", value: "separated" }]},
    { id: "marriageDate", label: "Marriage Date", type: "date", component: "input", },
    { id: "fatherName", label: "Father's Name (In Full)", type: "text", component: "input", required: true },
    { id: "bloodGroup", label: "Blood Group", type: "text", component: "input", required: true },
    { id: "hasPfUan", label: "PF (UAN) Applicable?", component: "select", options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ]},
    { id: "pfNumber", label: "PF (UAN) Number", type: "text", component: "input", required: formData.profile.hasPfUan === "yes", disabled: formData.profile.hasPfUan !== "yes" },
    { id: "phoneNumber", label: "Phone Number", type: "number", component: "input", disabled: true },
    { id: "joiningDate", label: "Joining Date", type: "date", component: "input", disabled: true },
    { id: "designation", label: "Designation", component: "select", options: designations, disabled: true },
    { id: "department", label: "Function", component: "select", options: departments, disabled: true },
    { id: "workingshift", label: "Working Shift", component: "select", options: workshiftOptions },
    { id: "emailId", label: "Email ID", type: "email", component: "input", disabled: true },
    { id: "status", label: "Status", component: "select", options: hiringOptions, disabled: true },
    { id: "gender", label: "Gender", component: "select", options: genderOptions, disabled: true },
    { id: "dateOfBirth", label: "Date of Birth", type: "date", component: "input", disabled: true },
    { id: "address", label: "Address", type: "text", component: "input" },
  ];

  const handleSectionChange = (sectionName) => (event) => {
    const { name, value } = event.target;
    if (submitError) setSubmitError("");
    setFormData((prev) => ({
      ...prev,
      [sectionName]: { ...prev[sectionName], [name]: value },
    }));
  };

  const handleNext = () => {
    // Validate mandatory fields when moving from step 0 (Profile Setup)
    if (activeStep === 0) {
      const mandatoryFields = {
        title: "Title",
        panNumber: "PAN Number",
        nationality: "Nationality (Primary)",
        fatherName: "Father's Name (In Full)",
        bloodGroup: "Blood Group"
      };

      for (const [field, label] of Object.entries(mandatoryFields)) {
        const fieldValue = formData.profile[field];
        if (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === "")) {
          Toast({ 
            message: `${label} is required`, 
            type: "error" 
          });
          return;
        }
      }
      // Conditional PF (UAN) validation
      if (formData.profile.hasPfUan === "yes") {
        const pf = formData.profile.pfNumber;
        if (!pf || (typeof pf === "string" && pf.trim() === "")) {
          Toast({
            message: "PF (UAN) Number is required",
            type: "error"
          });
          return;
        }
      }
    }
    
    if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setSubmitError("");
      setLoading(true);

      // Validate mandatory fields
      const mandatoryFields = {
        title: "Title",
        panNumber: "PAN Number",
        nationality: "Nationality (Primary)",
        fatherName: "Father's Name (In Full)",
        bloodGroup: "Blood Group"
      };

      for (const [field, label] of Object.entries(mandatoryFields)) {
        const fieldValue = formData.profile[field];
        if (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === "")) {
          Toast({ 
            message: `${label} is required`, 
            type: "error" 
          });
          setLoading(false);
          return;
        }
      }
      // Conditional PF (UAN) validation
      if (formData.profile.hasPfUan === "yes") {
        const pf = formData.profile.pfNumber;
        if (!pf || (typeof pf === "string" && pf.trim() === "")) {
          Toast({
            message: "PF (UAN) Number is required",
            type: "error"
          });
          setLoading(false);
          return;
        }
      }

      const payload = {
        candidateId: formData.profile.candidateId,
        // Include newly editable fields at root level for backend compatibility
        title: formData.profile.title || "",
        middleName: formData.profile.middleName || "",
        panNumber: formData.profile.panNumber || "",
        countryOfBirth: formData.profile.countryOfBirth || "",
        cityStateOfBirth: formData.profile.stateOfBirth || "",
        nationality: formData.profile.nationality || "",
        marriageDate: formData.profile.marriageDate || "",
         maritalStatus: formData.profile.maritalStatus || "",
        fatherName: formData.profile.fatherName || "",
        bloodGroup: formData.profile.bloodGroup || "",
        pfNumber: formData.profile.pfNumber || "",
        profileDetails: formData.profile,
        personalDetails: {
          aadharNumber: formData.personal.aadharNumber,
          passportNumber: formData.personal.passportNumber,
          driverLicenseNumber: formData.personal.driverLicenseNumber,
          driverLicenseExpiry: formData.personal.driverLicenseExpiry,
          driverLicensePeriod: formData.personal.driverLicensePeriod,
          spouseDetails: {
            firstName: formData.personal.spouseFirstName,
            surName: formData.personal.spouseSurName,
            dateOfBirth: formData.personal.spouseDateOfBirth,
            occupation: formData.personal.spouseOccupation,
          },
          presentAddress: {
            streetHouseNumber: formData.personal.presentStreetHouseNumber,
            addressLine2: formData.personal.presentAddressLine2,
            city: formData.personal.presentCity,
            postalCode: formData.personal.presentPostalCode,
            country: formData.personal.presentCountry,
            regionState: formData.personal.presentRegionState,
            district: formData.personal.presentDistrict,
            primaryEmergencyContact: formData.personal.presentPrimaryEmergencyContact,
            secondaryEmergencyContact: formData.personal.presentSecondaryEmergencyContact,
          },
          permanentAddress: {
            streetHouseNumber: formData.personal.permanentStreetHouseNumber,
            addressLine2: formData.personal.permanentAddressLine2,
            city: formData.personal.permanentCity,
            postalCode: formData.personal.permanentPostalCode,
            country: formData.personal.permanentCountry,
            regionState: formData.personal.permanentRegionState,
            district: formData.personal.permanentDistrict,
            primaryEmergencyContact: formData.personal.permanentPrimaryEmergencyContact,
            secondaryEmergencyContact: formData.personal.permanentSecondaryEmergencyContact,
          },
        },
        bankDetails: {
          accountNumber: formData.bank.accountNumber,
          ifscCode: formData.bank.ifscCode,
          bankName: formData.bank.bankName,
          branchName: formData.bank.branchName,
          branchAddress: formData.bank.branchAddress,
          city: formData.bank.city,
          state: formData.bank.state,
        },
        childInfoList: formData.personal.childInfoList || [],
        familyDetails: {
          maritalStatus: formData.family.maritalStatus,
        },
        insuranceDetails: {
          coverageFor: formData.family.coverageFor,
          spouseName: formData.family.spouseName,
          spouseDob: formData.family.spouseDob,
          child1Name: formData.family.child1Name,
          child1Dob: formData.family.child1Dob,
          child2Name: formData.family.child2Name,
          child2Dob: formData.family.child2Dob,
        },
      };

      console.log("Payload to send:", JSON.stringify(payload, null, 2));

      const response = await axios.put(
        `${appURL}/recruitment/candidates`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      Toast({ message: "Data saved successfully", type: "success" });
      console.log("Response:", response.data);
      setTimeout(() => {
        window.close();
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage = getApiErrorMessage(
        error,
        "Failed to submit data. Please check your entries and try again."
      );
      setSubmitError(errorMessage);
      Toast({ message: errorMessage, type: "error" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Grid container spacing={2}>
            {formFields.map((field) => (
              <Grid item xs={12} md={6} key={field.id}>
                {field.component === "input" ? (
                  <InputTextComponent
                    id={field.id}
                    name={field.id}
                    label={field.required ? (
                      <>
                        {field.label} <span style={{ color: "red" }}>*</span>
                      </>
                    ) : field.label}
                    type={field.type}
                    value={formData.profile[field.id] !== null && formData.profile[field.id] !== undefined ? formData.profile[field.id] : ""}
                    onChange={handleSectionChange("profile")}
                    disabled={field.disabled || false}
                    {...(field.id === "address" && {
                      multiline: true,
                      minRows: 5,
                    })}
                    {...(field.type === "date" && {
                      InputLabelProps: {
                        shrink: true,
                      },
                      disableFutureDate: field.id === "marriageDate" || field.id === "dateOfBirth",
                    })}
                  />
                ) : (
                  <SelectComponent
                    id={field.id}
                    name={field.id}
                    label={field.required ? (
                      <>
                        {field.label} <span style={{ color: "red" }}>*</span>
                      </>
                    ) : field.label}
                    value={formData.profile[field.id] || ""}
                    onChange={handleSectionChange("profile")}
                    options={field.options || []}
                    disabled={field.disabled || false}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PersonalDetails
                data={formData.personal}
                onChange={handleSectionChange("personal")}
              />
            </Grid>
            <Grid item xs={12}>
              <BankDetails
                data={formData.bank}
                onChange={handleSectionChange("bank")}
              />
            </Grid>
            <Grid item xs={12}>
              <FamilyInformation
                data={formData.family}
                onChange={handleSectionChange("family")}
              />
            </Grid>
            <Grid item xs={12}>
              <DocumentInfo
                data={formData.document}
                onChange={handleSectionChange("document")}
              />
            </Grid>
          </Grid>
        );

      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
    <>
      <Box
        sx={{
          margin: "20px",
          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Stepper
          steps={steps}
          activeStep={activeStep}
          stepIconColor="#837F39"
          connectorColor="#9E9E9E"
          onStepClick={(stepIndex) => setActiveStep(stepIndex)}
        />
      </Box>

      <Box
        sx={{
          backgroundColor: activeStep === 0 ? "#fff" : "transparent",
          margin: activeStep === 0 ? "1rem" : "-1rem 0 1rem 0",
          padding: activeStep === 0 ? "2rem" : "0rem 1rem 0rem 1rem",
          borderRadius: "1.5rem",
          boxShadow:
            activeStep === 0 ? "0px 0.1px 0px rgba(0,0,0,0.2)" : "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {submitError && (
          <Alert
            severity="error"
            onClose={() => setSubmitError("")}
            sx={{ mb: 2 }}
          >
            <AlertTitle>Unable to submit form</AlertTitle>
            {submitError}
          </Alert>
        )}

        {activeStep === 0 && (
          <Typography
            sx={{
              fontSize: "32px",
              fontWeight: "600",
              fontFamily: "Montserrat",
              color: "#0E0E0E",
            }}
          >
            Profile Setup
          </Typography>
        )}

        <Box mt={3}>{renderStepContent(activeStep)}</Box>

        <Box display="flex" justifyContent="flex-end" gap={2} mt="auto" pt={4}>
          <CustomButton
            onClick={handleBack}
            disabled={activeStep === 0}
            text="Previous"
            backgroundColor="#FFFFFF"
            color="#837F39"
            IconColor="#837F39"
            fontWeight="500"
            fontSize="13px"
            border="1px solid #837F39"
            variant="contained"
            iconExists
            IconProp={ArrowBackIosNewIcon}
            iconPosition="start"
            sx={{
              fontFamily: "Work Sans",
              borderRadius: "2rem",
              maxWidth: "8rem",
            }}
          />

          <CustomButton
            onClick={handleNext}
            disabled={loading}
            text={activeStep === steps.length - 1 ? (loading ? "Submitting..." : "Submit") : "Next"}
            backgroundColor="#837F39"
            color="#FFFFFF"
            IconColor="#FFFFFF"
            fontWeight="500"
            fontSize="13px"
            border="1px solid #837F39"
            variant="contained"
            iconExists
            IconProp={ArrowForwardIosIcon}
            iconPosition="endNoRotate"
            sx={{
              fontFamily: "Work Sans",
              borderRadius: "2rem",
              maxWidth: "8rem",
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default ProfileSetup;
