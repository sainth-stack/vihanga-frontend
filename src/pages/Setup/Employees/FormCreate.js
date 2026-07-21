import React, { useState, useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import "./styles.scss";
import Text from "components/Company/Text";
import HorizontalBar from "components/Company/HorizontalBar";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import CheckboxInput from "components/Company/CheckboxInput";
import DownloadLink from "components/Company/DownloadLink";
import BrowseFiles from "components/Company/BrowseFiles";
import Button from "components/Company/Button";
import UploadProgress from "components/Company/UploadProgress";
import maleIcon from "assets/images/male.png";
import femaleIcon from "assets/images/female.png";
import { useDispatch } from "react-redux";
import {
  bytesToSize,
  countriesNames,
  genders,
  getRandom,
  jobCategories,
  loginMethods,
  removeDuplicates,
  statusesActive,
} from "utilities";
import { Col, Row } from "react-bootstrap";
import { employeeApi } from "service/apiVariables";
import axios from "axios";
import { getServiceUrl } from "service/api";
import { Validator } from "utilities";
import { createEmployee, getEmployeesAll } from "action/EmployeeAct";
import { useHistory } from "react-router-dom";
import { getEntities } from "action/EntityAct";
import { getDepartmentsData } from "action/DepartmentAct";
import { getDesignations } from "action/DesignationAct";
import { getAllPrivileges } from "action/PrivilegesAct";
import {
  createUpload,
  deleteUpload,
  getUploadsByCategory,
} from "action/UploadAct";
import { maritalStatuses, highestEducationLevels, religions } from "utilities/constants";
import { Toast } from "service/toast";
import { getGrades } from "action/GradeAct";
import { useTranslation } from "react-i18next";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import FileUploadCustom from "pages/vihanga/components/filesUplode/draganddropFile";
import { ref } from "yup";
import { downloadEmployeeTemplate } from "./utils";
import { canEdit } from "utilities/privilegeHelper";

export default function FormCreate({ refresh }) {
  const validator = Validator();
  const dispatch = useDispatch();
  let personalInformation = {
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null,
    profilePicture: "",
    title: "",
    PanNumber: "",
    middleName: "",
  };
  let contactInformation = {
    email: "",
    loginMethod: "",
    mobileNumber: "",
    whatsappNumber: "",
    isSameWhatsapp: true,
    countryCode: "+91",
    countryCode2: "+91",
    workEmail: "",
    homeAddress: "",
    countryOfBirth: "",
    StateOfBirth: "",
    nationality: "",
    marriageDate: "",
    hasPf: "No",
    Pf: "",
    FatherName: "",
    BloodGroup: "",
  };
  let SpouseInformation = {
    firstName: "",
    lastName: "",
    Occupation: "",
    dateOfBirth: null,
  };
  let ChildInformation = [];
  let PresentAddress = {
    streetHouseNumber: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "",
    regionState: "",
    district: "",
    primaryEmergencyContactNumber: "",
    secondaryEmergencyContactNumber: "",
  };
  let PermanentAddress = {
    streetHouseNumber: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "",
    regionState: "",
    district: "",
    primaryEmergencyContactNumber: "",
    secondaryEmergencyContactNumber: "",
  };
  let employmentInformation = {
    hireDate: null,
    employeeNumber: "",
    status: "",
    inactiveDate: null,
    legalEntity: "", // Legacy field - kept for backward compatibility
    department: "", // Legacy field - kept for backward compatibility
    legalEntityMappings: [
      {
        legalEntity: "",
        function: "",
        type: "PRIMARY",
        designation: "",
        functionalHead: true, // preserve legacy default behavior
      }
    ], // New field: Array of Legal Entity & Function mappings
    location: "",
    lineManager: "no_manager",
    jobCategory: "",
    role: "Employee",
    designation: "",
    grade: "",
    departmentHead: true,
    maritalStatus: "",
    highestEducationLevel: "",
    religion: "",
  };
  const resignationDefault = {
    currentApprovalLevel: 0,
    overallStatus: "Pending",
    approvalSteps: [],
  };
  const candidateInformationDefault = {
    personalDetails: {
      aadharNumber: "",
      passportNumber: "",
      driverLicenseNumber: "",
      driverLicenseExpiry: null,
      driverLicensePeriod: "",
    },
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
      branchAddress: "",
      city: "",
      state: "",
    },
    insuranceDetails: {
      coverageFor: "",
      spouseName: "",
      spouseDob: null,
      child1Name: "",
      child1Dob: null,
      child2Name: "",
      child2Dob: null,
    },
    interviewer1: { name: "", email: "", id: "" },
    interviewer2: { name: "", email: "", id: "", feedbackId: "" },
    reportingManager: { name: "", email: "", id: "" },
    documentDetails: [],
    showOfferLetter: false,
    originalCandidateId: "",
    source: "",
    appliedOn: null,
    experience: "",
    grossSalary: "",
    noticePeriod: "",
    probationPeriod: "",
    offerLetterDate: null,
    resume: "",
    documents: [],
    references: [
      { name: "", email: "", phone: "" },
      { name: "", email: "", phone: "" },
    ],
    projectName: "",
  };
  const [formData, setFormData] = useState({
    personalInformation,
    contactInformation,
    employmentInformation,
    resignation: resignationDefault,
    candidateInformation: candidateInformationDefault,
    SpouseInformation,
    ChildInformation,
    PresentAddress,
    PermanentAddress,
  });
  const [, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const [, setError] = useState(false);
  const [bulkUpload, setBulkUpload] = useState(true);
  const [, forceUpdate] = useState(false);
  const [, setData] = useState([]);
  const [style3] = useState(150);
  const [style2] = useState(140);
  const [legalEntities, setLegalEntities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [lineManagers, setLineManagers] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [grades, setGrades] = useState([]);
  const [roles, setRoles] = useState([]);
  const history = useHistory();

  // Store raw data for filtering
  const [allDepartmentsRaw, setAllDepartmentsRaw] = useState([]);
  const [allDesignationsRaw, setAllDesignationsRaw] = useState([]);
  const [noDepartmentsAvailable, setNoDepartmentsAvailable] = useState(false);
  const [noDesignationsAvailable, setNoDesignationsAvailable] = useState(false);

  const [checkStyle] = useState({
    width: 300,
    mt: 10,
    ml: 20,
  });
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [fileName, setFileName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countryCode2, setCountryCode2] = useState("+91");
  const [sameAsPresentAddress, setSameAsPresentAddress] = useState(false);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  const handleChange = ({ target: { name, value } }, objectName) => {
    let updatedData = { ...formData };
    updatedData[objectName][name] = value;

    // Handle cascading filters for legal entity, department, and designation
    if (objectName === "employmentInformation") {
      if (name === "legalEntity") {
        // When legal entity changes, clear department and designation
        updatedData.employmentInformation.department = "";
        updatedData.employmentInformation.designation = "";
        // Filter departments based on selected legal entity (or show all if empty)
        filterDepartmentsByLegalEntity(value);
        // Show all designations when department is cleared
        if (allDesignationsRaw.length > 0) {
          const allDesignations = allDesignationsRaw.map((item) => ({
            key: item.designationName,
            value: item.designationName,
          }));
          let nonduplicates = removeDuplicates(allDesignations, "value");
          setDesignations(nonduplicates);
        }
        setNoDesignationsAvailable(false);
      } else if (name === "department") {
        // When department changes, clear designation
        updatedData.employmentInformation.designation = "";
        // Filter designations based on selected department (or show all if empty)
        filterDesignationsByDepartment(value);
      }
    }

    setFormData(updatedData);
    setError("");

    // If same as present address is checked and present address field is changed, update permanent address
    if (sameAsPresentAddress && objectName === "PresentAddress") {
      const permanentFieldName = name;
      updatedData.PermanentAddress[permanentFieldName] = value;
      setFormData(updatedData);
    }
  };

  // Filter departments based on selected legal entity
  const filterDepartmentsByLegalEntity = (selectedLegalEntity) => {
    if (!selectedLegalEntity || allDepartmentsRaw.length === 0) {
      // If no legal entity selected, show all departments
      const allDepartments = allDepartmentsRaw.map((item) => ({
        key: item.departmentName,
        value: item.departmentName,
      }));
      let nonduplicates = removeDuplicates(allDepartments, "value");
      setDepartments(nonduplicates);
      setNoDepartmentsAvailable(false);
      return;
    }

    const filtered = allDepartmentsRaw
      .filter((dept) => dept.legalEntityName === selectedLegalEntity)
      .map((item) => ({
        key: item.departmentName,
        value: item.departmentName,
      }));

    let nonduplicates = removeDuplicates(filtered, "value");
    setDepartments(nonduplicates);
    // Show message if no departments available for selected legal entity
    setNoDepartmentsAvailable(nonduplicates.length === 0 && selectedLegalEntity && allDepartmentsRaw.length > 0);
  };

  // Filter designations based on selected department
  const filterDesignationsByDepartment = (selectedDepartment) => {
    if (!selectedDepartment || allDesignationsRaw.length === 0) {
      // If no department selected, show all designations
      const allDesignations = allDesignationsRaw.map((item) => ({
        key: item.designationName,
        value: item.designationName,
      }));
      let nonduplicates = removeDuplicates(allDesignations, "value");
      setDesignations(nonduplicates);
      setNoDesignationsAvailable(false);
      return;
    }

    const filtered = allDesignationsRaw
      .filter((desig) => desig.departmentName === selectedDepartment)
      .map((item) => ({
        key: item.designationName,
        value: item.designationName,
      }));

    let nonduplicates = removeDuplicates(filtered, "value");
    setDesignations(nonduplicates);
    // Show message if no designations available for selected department
    setNoDesignationsAvailable(nonduplicates.length === 0 && selectedDepartment && allDesignationsRaw.length > 0);
  };

  const handleSameAsPresentAddressChange = (event) => {
    const isChecked = event.target.checked || event.target.value;
    setSameAsPresentAddress(isChecked);

    if (isChecked) {
      // Copy all present address fields to permanent address
      setFormData((prev) => ({
        ...prev,
        PermanentAddress: {
          ...prev.PresentAddress,
        },
      }));
    }
  };

  const handleAddChild = () => {
    const newChild = { firstName: "", lastName: "", gender: "", dateOfBirth: null };
    setFormData((prev) => ({
      ...prev,
      ChildInformation: [...(prev.ChildInformation || []), newChild],
    }));
  };

  const handleRemoveChild = (index) => {
    setFormData((prev) => ({
      ...prev,
      ChildInformation: prev.ChildInformation.filter((_, i) => i !== index),
    }));
  };

  // ===== LEGAL ENTITY & FUNCTION MAPPING HANDLERS =====
  const handleAddMapping = () => {
    const newMapping = {
      legalEntity: "",
      function: "",
      type: "SECONDARY", // New mappings default to SECONDARY
      designation: "",
      functionalHead: false,
    };
    setFormData((prev) => ({
      ...prev,
      employmentInformation: {
        ...prev.employmentInformation,
        legalEntityMappings: [...(prev.employmentInformation.legalEntityMappings || []), newMapping],
      },
    }));
  };

  const handleRemoveMapping = (index) => {
    const mappings = formData.employmentInformation?.legalEntityMappings || [];
    // Don't allow removal of the last mapping
    if (mappings.length <= 1) {
      Toast({ type: "error", message: "At least one Legal Entity & Function mapping is required", time: 3000 });
      return;
    }
    // Don't allow removal of PRIMARY mapping
    if (mappings[index]?.type === "PRIMARY") {
      Toast({ type: "error", message: "Cannot remove PRIMARY mapping", time: 3000 });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      employmentInformation: {
        ...prev.employmentInformation,
        legalEntityMappings: prev.employmentInformation.legalEntityMappings.filter((_, i) => i !== index),
      },
    }));
  };

  const handleMappingChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedMappings = [...(prev.employmentInformation.legalEntityMappings || [])];
      updatedMappings[index] = {
        ...updatedMappings[index],
        [field]: value,
      };

      // Designation depends on Function; clear designation when Function changes
      if (field === "function") {
        updatedMappings[index].designation = "";
      }

      // Update legacy fields from PRIMARY mapping for backward compatibility
      const primaryMapping = updatedMappings.find(m => m.type === "PRIMARY");
      let legacyFields = {};
      if (primaryMapping) {
        legacyFields = {
          legalEntity: primaryMapping.legalEntity,
          department: primaryMapping.function,
          designation: primaryMapping.designation || prev.employmentInformation.designation,
          // Keep legacy functional-head field in sync with PRIMARY mapping
          departmentHead: !!primaryMapping.functionalHead,
        };
      }

      return {
        ...prev,
        employmentInformation: {
          ...prev.employmentInformation,
          ...legacyFields,
          legalEntityMappings: updatedMappings,
        },
      };
    });
    setError("");
  };

  const handleMappingTypeChange = (index, newType) => {
    const mappings = formData.employmentInformation?.legalEntityMappings || [];

    // If changing to PRIMARY, ensure no other PRIMARY exists
    if (newType === "PRIMARY") {
      const existingPrimaryIndex = mappings.findIndex(m => m.type === "PRIMARY");
      if (existingPrimaryIndex !== -1 && existingPrimaryIndex !== index) {
        Toast({ type: "error", message: "Only one PRIMARY mapping is allowed. Please change the existing PRIMARY to SECONDARY first.", time: 4000 });
        return;
      }
    }

    handleMappingChange(index, "type", newType);
  };
  // ===== END LEGAL ENTITY & FUNCTION MAPPING HANDLERS =====


  const handleCandidateInfoChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({
      ...prev,
      candidateInformation: {
        ...prev.candidateInformation,
        [name]: value,
      },
    }));
  };
  const handleNestedChange = ({ target: { name, value } }, parentKey, childKey) => {
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: {
          ...prev[parentKey][childKey],
          [name]: value,
        },
      },
    }));
  };
  const handleArrayNestedChange = (
    { target: { name, value } },
    parentKey,
    arrayKey,
    index
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [arrayKey]: prev[parentKey][arrayKey].map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        ),
      },
    }));
  };
  const handleChangePicture = (e) => {
    let originalFileName = e?.target?.files?.[0]?.name;
    let fileName = originalFileName?.split(".")?.[0] + "_" + getRandom(9);
    const data = new FormData();
    data.append("file", e?.target?.files?.[0]);
    data.append("upload_preset", "ma7nge92");
    data.append("public_id", "talentspotifypics/" + fileName);
    fetch("https://api.cloudinary.com/v1_1/dbqm9svvp/image/upload", {
      method: "post",
      body: data,
    })
      .then((responce) => responce?.json?.())
      .then((data) => {
        handleChange(
          { target: { name: "profilePicture", value: data?.url } },
          "personalInformation"
        );
      })
      .catch((err) => console.log(err));
  };
  const fetchEmployees = () => {
    try {
      setLoading(true);
      let response = dispatch(getEmployeesAll());
      response.then(({ data, message }) => {
        if (data !== undefined && data?.length > 0) {
          let activeEmployees = data?.filter(
            (item) => item?.employmentInformation?.status === "Active"
          );
          setData(activeEmployees);
          const lineManagers2 = activeEmployees?.map((item) => {
            return {
              key:
                item?.personalInformation?.firstName +
                " " +
                item?.personalInformation?.lastName,
              value: item?._id,
            };
          });
          // Add "No Manager" at the beginning of the array
          lineManagers2?.unshift?.({ key: "No Manager", value: "no_manager" });
          let nonduplicates = removeDuplicates(lineManagers2, "key");
          setLineManagers(nonduplicates);
          setLoading(false);
          setError("");
        } else if (data?.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  // Row-wise options helpers
  const getDepartmentOptionsForLegalEntity = (legalEntityName) => {
    if (!allDepartmentsRaw || allDepartmentsRaw.length === 0) return departments || [];
    if (!legalEntityName) {
      const all = allDepartmentsRaw.map((item) => ({
        key: item.departmentName,
        value: item.departmentName,
      }));
      return removeDuplicates(all, "value");
    }
    const filtered = allDepartmentsRaw
      .filter((d) => d.legalEntityName === legalEntityName)
      .map((item) => ({
        key: item.departmentName,
        value: item.departmentName,
      }));
    return removeDuplicates(filtered, "value");
  };

  const getDesignationOptionsForDepartment = (departmentName) => {
    if (!allDesignationsRaw || allDesignationsRaw.length === 0) return designations || [];
    if (!departmentName) {
      const all = allDesignationsRaw.map((item) => ({
        key: item.designationName,
        value: item.designationName,
      }));
      return removeDuplicates(all, "value");
    }
    const filtered = allDesignationsRaw
      .filter((d) => d.departmentName === departmentName)
      .map((item) => ({
        key: item.designationName,
        value: item.designationName,
      }));
    return removeDuplicates(filtered, "value");
  };

  const fetchEntities = () => {
    try {
      setLoading(true);
      let response = dispatch(getEntities());
      response.then(({ data, message }) => {
        if (data !== undefined && data?.length > 0) {
          let result = data
            ?.filter((item) => item?.status === "Active")
            ?.map((item) => {
              return { key: item.legalEntityName, value: item.legalEntityName };
            });

          let nonduplicates = removeDuplicates(result, "value");
          setLegalEntities(nonduplicates);
          setLoading(false);
          setError("");
        } else if (data?.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error?.toString());
    }
  };
  const fetchDepartments = () => {
    try {
      setLoading(true);
      let response = dispatch(getDepartmentsData());
      response.then(({ data, message }) => {
        if (
          data !== undefined &&
          data.length > 0 &&
          data[0].departments?.length > 0
        ) {
          // Store raw data for filtering
          const activeDepartments = data[0].departments.filter(
            (item) => item?.status === "Active"
          );
          setAllDepartmentsRaw(activeDepartments);

          // Initially show all departments (will be filtered when legal entity is selected)
          let result = activeDepartments.map((item) => {
            return { key: item.departmentName, value: item.departmentName };
          });
          let nonduplicates = removeDuplicates(result, "value");
          setDepartments(nonduplicates);
          setLoading(false);
          setError("");
        } else if (data?.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error?.toString());
    }
  };

  const fetchDesignations = () => {
    try {
      setLoading(true);
      let response = dispatch(getDesignations());
      response.then(({ data, message }) => {
        if (data !== undefined && data?.length > 0) {
          // Store raw data for filtering
          const activeDesignations = data.filter(
            (item) => item?.status === "Active"
          );
          setAllDesignationsRaw(activeDesignations);

          // Initially show all designations (will be filtered when department is selected)
          let result = activeDesignations.map((item) => {
            return { key: item?.designationName, value: item?.designationName };
          });
          let nonduplicates = removeDuplicates(result, "value");
          setDesignations(nonduplicates);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error?.toString());
    }
  };

  const getPrivilegesDataRefresh = () => {
    try {
      let response = dispatch(getAllPrivileges());
      response.then(({ data, message }) => {
        if (data !== undefined && data?.length > 0) {
          let nonduplicate = removeDuplicates(data, "role");
          let updatedData = nonduplicate.map((item) => {
            return { key: item?.role, value: item?.role };
          });
          const mergedRoles = [...roles];
          updatedData.forEach(dynamicRole => {
            if (!mergedRoles.some(role => role.value === dynamicRole.value)) {
              mergedRoles.push(dynamicRole);
            }
          });
          setRoles(mergedRoles);
          setRoles(updatedData);
          setError("");
        } else if (data?.length === 0) {
          setError("No Data Found!");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error?.toString());
    }
  };

  const fetchGrades = () => {
    try {
      setLoading(true);
      let response = dispatch(getGrades());
      response.then(({ data, message }) => {
        if (data !== undefined && data?.length > 0) {
          let result = data
            ?.filter((item) => item?.status === "Active")
            ?.map((item) => {
              return { key: item?.gradeName, value: item?.gradeName };
            });
          let nonduplicates = removeDuplicates(result, "value");
          setGrades(nonduplicates);
          setLoading(false);
          setError("");
        } else if (data?.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error?.toString());
    }
  };
  const clearData = () => {
    setFormData({
      personalInformation,
      contactInformation,
      employmentInformation,
      resignation: resignationDefault,
      candidateInformation: candidateInformationDefault,
      SpouseInformation,
      ChildInformation,
      PresentAddress,
      PermanentAddress,
    });
    setError("");
    Toast({ message: "Form Cleared", type: "success", time: 4000 });
  };

  const handleSaveDraft = () => {
    try {
      const draftData = {
        formData: formData,
        sameAsPresentAddress: sameAsPresentAddress,
        savedAt: new Date().toISOString()
      };

      localStorage.setItem("employeeFormDraft", JSON.stringify(draftData));
      Toast({ message: "Draft saved successfully", type: "success", time: 3000 });
      setIsDraftLoaded(true);
    } catch (error) {
      console.error("Error saving draft:", error);
      Toast({ message: "Failed to save draft", type: "error", time: 3000 });
    }
  };

  const handleSave = () => {
    const validationErrors = validateMandatoryFields();

    if (validationErrors.length > 0) {
      validationErrors.forEach((error, index) => {
        setTimeout(() => {
          Toast({ type: "error", message: error, time: 2000 });
        }, index * 200);
      });
      return;
    }
    if (validator.current.allValid()) {
      try {
        setLoading(true);
        let response = dispatch(
          createEmployee({
            ...formData,
            companyId:
              localStorage.getItem("companyId") !== null
                ? JSON.parse(localStorage.getItem("companyId"))
                : null,
            employmentInformation: {
              ...formData.employmentInformation,
              departmentHead: formData.employmentInformation?.departmentHead
                ? "Yes"
                : "No",
            },
          })
        );
        response.then(({ success, message }) => {
          setLoading(true);
          if (success) {
            setLoading(false);
            setError("");

            // Clear draft from localStorage after successful submission
            localStorage.removeItem("employeeFormDraft");

            setFormData({
              personalInformation,
              contactInformation,
              employmentInformation,
              resignation: resignationDefault,
              candidateInformation: candidateInformationDefault,
              SpouseInformation,
              ChildInformation,
              PresentAddress,
              PermanentAddress,
            });
            history.push("/admin/setups/employees");
          } else {
            setLoading(false);
            setError(message);
          }
        }).catch((error) => {
          setLoading(false);
          setError(error.message || "An error occurred while creating employee");
        });
      } catch (error) {
        setLoading(false);
        setError(error?.toString());
      }
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };
  const validateMandatoryFields = () => {
    const errors = [];

    const checkRequired = (value, fieldName) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.push(`${fieldName} is required`);
      }
    };

    // Personal Information
    checkRequired(formData.personalInformation?.firstName, 'First Name');
    checkRequired(formData.personalInformation?.lastName, 'Last Name');
    checkRequired(formData.personalInformation?.dateOfBirth, 'Date of Birth');

    // Contact Information
    checkRequired(formData.contactInformation?.email, 'Email Address');
    checkRequired(formData.contactInformation?.mobileNumber, 'Mobile Number');
    if (formData.contactInformation?.hasPf === 'Yes') {
      checkRequired(formData.contactInformation?.Pf, 'PF (UAN) Number');
    }


    // Employment Information
    checkRequired(formData.employmentInformation?.hireDate, 'Hire Date');
    checkRequired(formData.employmentInformation?.employeeNumber, 'Employee Number');
    checkRequired(formData.employmentInformation?.status, 'Status');
    if (formData.employmentInformation?.status === 'Inactive') {
      checkRequired(formData.employmentInformation?.inactiveDate, 'Inactive Date');
    }

    // Validate Legal Entity & Function Mappings
    const mappings = formData.employmentInformation?.legalEntityMappings || [];
    if (mappings.length === 0) {
      errors.push('At least one Legal Entity & Function mapping is required');
    } else {
      // Check for at least one PRIMARY mapping
      const hasPrimary = mappings.some(m => m.type === "PRIMARY");
      if (!hasPrimary) {
        errors.push('At least one PRIMARY Legal Entity & Function mapping is required');
      }

      // Validate each mapping
      mappings.forEach((mapping, index) => {
        if (!mapping.legalEntity || !mapping.legalEntity.trim()) {
          errors.push(`Legal Entity is required for mapping ${index + 1}`);
        }
        if (!mapping.function || !mapping.function.trim()) {
          errors.push(`Function is required for mapping ${index + 1}`);
        }
        // Require designation only for PRIMARY mappings
        if (mapping.type === "PRIMARY" && (!mapping.designation || !mapping.designation.trim())) {
          errors.push(`Designation is required for mapping ${index + 1}`);
        }
      });

      // Check for duplicate mappings
      const seen = new Set();
      mappings.forEach((mapping, index) => {
        const key = `${mapping.legalEntity}|${mapping.function}`;
        if (mapping.legalEntity && mapping.function) {
          if (seen.has(key)) {
            errors.push(`Duplicate Legal Entity & Function combination found at mapping ${index + 1}`);
          }
          seen.add(key);
        }
      });
    }

    checkRequired(formData.employmentInformation?.lineManager, 'Line Manager');
    checkRequired(formData.employmentInformation?.role, 'Role');


    return errors;
  };

  const handleFileUpload = async ({ data: employees, file, url }) => {
    setShowProgress(true);
    setFileUrl(url);
    setFileName(file?.name);
    let reqBody = {
      category: "employee",
      filename: file?.name,
      loadedData: loaded,
      totalData: total,
      fileSize: bytesToSize(file?.size),
      fileUrl: url,
      companyId:
        localStorage.getItem("companyId") !== null
          ? JSON.parse(localStorage.getItem("companyId"))
          : null,
    };
    let totalEmployees = [...(employees || [])];
    let filteredEmails = [...(employees || [])];
    let finalEmployees = filteredEmails;
    finalEmployees = filteredEmails.map((employee) => {
      const getDate = (date) => {
        let dob = "";
        if (typeof date === "number") {
          // Handle numerical representation of dates (e.g., 26665.000115740742)
          const excelDate = new Date((date - 25569) * 86400 * 1000);
          dob = excelDate?.toDateString?.() || ""; // Adjust formatting as needed
        } else if (typeof date === "string") {
          // Handle date strings (e.g., '14-11-1968')
          const parts = date?.split?.("-") || [];
          const formattedDate = new Date(`${parts?.[2]}-${parts?.[1]}-${parts?.[0]}`);
          dob = formattedDate?.toDateString?.() || ""; // Adjust formatting as needed
        }
        return dob;
      };
      return {
        personalInformation: {
          firstName: employee?.firstName,
          lastName: employee?.lastName,
          gender: employee?.gender,
          dateOfBirth: employee?.dateOfBirth
            ? new Date(getDate(employee?.dateOfBirth))
            : new Date(),
        },
        contactInformation: {
          email: employee?.email,
          loginMethod: employee?.loginMethod,
          mobileNumber: employee?.mobileNumber,
          whatsappNumber: employee?.whatsappNumber,
          isSameWhatsapp: employee?.mobileNumber === employee?.whatsappNumber,
          workMail: employee?.workMail,
          homeAddress: employee?.homeAddress,
        },
        employmentInformation: {
          hireDate: employee?.hireDate
            ? new Date(getDate(employee?.hireDate))
            : new Date(),
          employeeNumber: employee?.employeeNumber,
          status: employee?.status,
          inactiveDate: employee?.inactiveDate
            ? new Date(getDate(employee?.inactiveDate))
            : null,
          legalEntity: employee?.legalEntity,
          department: employee?.department,
          location: employee?.location,
          lineManager: employee?.lineManager,
          jobCategory: employee?.jobCategory,
          role: employee?.role,
          designation: employee?.designation,
          grade: employee?.grade,
          departmentHead: employee?.departmentHead,
        },
        status: employee?.status,
        companyId:
          localStorage.getItem("companyId") !== null
            ? JSON.parse(localStorage.getItem("companyId"))
            : null,
      };
    });

    try {
      let result = await axios
        .post(
          getServiceUrl("production") +
          employeeApi?.createOrUpdateMultipleEmployees?.api,
          { data: finalEmployees },
          {
            onUploadProgress: (data) => {
              setTotal(totalEmployees?.length || 0);
              setLoaded(
                Math.round(
                  100 * (data?.loaded / data?.total) * ((totalEmployees?.length || 0) / 100)
                )
              );
              setProgress(Math.round((100 * data?.loaded) / data?.total));
            },
          }
        );

      if (result?.data?.success) {
        reqBody.status = "success";
        reqBody.loadedData = filteredEmails?.length || 0;
        reqBody.totalData = totalEmployees?.length || 0;
        const uploadResponse = dispatch(createUpload(reqBody));
        uploadResponse
          ?.then?.(({ success, message, id }) => {
            if (success) {
              setError("");
              setTimeout(() => {
                setShowProgress(false);
                fetchUploads();
                history.push("/admin/setups/employees");
              }, 2000);
            } else {
              setTimeout(() => {
                setShowProgress(false);
                fetchUploads();
                history.push("/admin/setups/employees");
              }, 2000);
            }
          })
          ?.catch?.((error) => {
            console.log("error detected", error);
          });
      } else {
        // Show error toast when bulk upload fails
        Toast({
          message: result?.data?.message || result?.message || "Bulk upload failed. Please check your data and try again.",
          type: "error",
          time: 5000
        });

        setTimeout(() => {
          setShowProgress(false);
          fetchUploads();
          history.push("/admin/setups/employees");
        }, 2000);
      }
    } catch (err) {
      reqBody.status = "failed";
      reqBody.loadedData = filteredEmails?.length || 0;
      reqBody.totalData = totalEmployees?.length || 0;

      // Show error toast immediately
      Toast({
        message: err?.response?.data?.message || err?.message || "Bulk upload failed. Please try again.",
        type: "error",
        time: 5000
      });

      const uploadResponse = dispatch(createUpload(reqBody));
      uploadResponse
        ?.then?.(({ success, message, id }) => {
          if (success) {
            setError("");
            setTimeout(() => {
              setShowProgress(false);
              fetchUploads();
              history.push("/admin/setups/employees");
            }, 1000);
          } else {
            setTimeout(() => {
              setShowProgress(false);
              fetchUploads();
              history.push("/admin/setups/employees");
            }, 2000);
            setError(message);
            // Show additional error toast if upload record creation fails
            Toast({
              message: message || "Failed to record upload status",
              type: "error",
              time: 4000
            });
          }
        })
        ?.catch?.((error) => {
          console.log("error detected", error);
          // Show error toast for upload record creation failure
          Toast({
            message: "Failed to record upload status",
            type: "error",
            time: 4000
          });
        });
    }
  };
  const fetchUploads = () => {
    try {
      setLoading(true);
      let response = dispatch(getUploadsByCategory("employee"));
      response.then(({ data, message }) => {
        if (data !== undefined && data?.length > 0) {
          setUploads(data);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setUploads([]);
        } else {
          setLoading(false);
          setError(message);
        }
        setTotal(0);
        setProgress(0);
        setLoaded(0);
      });
    } catch (error) {
      setLoading(false);
      setError(error?.toString());
    }
  };


  // Load draft from localStorage when creating new employee
  const loadDraftFromLocalStorage = () => {
    // Only load draft if we're not editing an existing employee (no refresh prop or similar)
    try {
      const draftData = localStorage.getItem("employeeFormDraft");
      if (draftData) {
        const parsedDraft = JSON.parse(draftData);
        const draftFormData = parsedDraft.formData || formData;
        setFormData(draftFormData);
        if (parsedDraft.sameAsPresentAddress !== undefined) {
          setSameAsPresentAddress(parsedDraft.sameAsPresentAddress);
        }
        const ci = draftFormData?.contactInformation;
        if (ci?.countryCode) setCountryCode(ci.countryCode);
        if (ci?.countryCode2) setCountryCode2(ci.countryCode2);
        setIsDraftLoaded(true);
        Toast({ message: "Draft loaded successfully", type: "info", time: 3000 });
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchEntities();
    fetchDepartments();
    fetchDesignations();
    fetchGrades();
    fetchUploads();
    getPrivilegesDataRefresh();

    // Load draft only on initial mount
    loadDraftFromLocalStorage();
    //eslint-disable-next-line
  }, []);

  // Apply filters when legal entity or department is selected
  useEffect(() => {
    const selectedLegalEntity = formData.employmentInformation?.legalEntity;
    const selectedDepartment = formData.employmentInformation?.department;

    if (selectedLegalEntity && allDepartmentsRaw.length > 0) {
      filterDepartmentsByLegalEntity(selectedLegalEntity);
    }

    if (selectedDepartment && allDesignationsRaw.length > 0) {
      filterDesignationsByDepartment(selectedDepartment);
    }
    //eslint-disable-next-line
  }, [allDepartmentsRaw, allDesignationsRaw, formData.employmentInformation?.legalEntity, formData.employmentInformation?.department]);





  const { t } = useTranslation();

  const deleteUploadData = (id) => {
    try {
      let response = dispatch(deleteUpload(id));
      response?.then?.(({ success, message }) => {
        if (success) {
          setError("");
          fetchUploads();

        }
        else {
          setError(message);
        }
      });
    } catch (error) {
      console.log("error--", error);
    }
  };


  return (
    <>
      <TitleHeader name="Admin Portal - Dashboard" />
      <div className=" rounded mh-100 responsive-container" >
        <p className="title text-dark font-weight-bold pb10 pl10">Employees Setup</p>
        <div className="company-form responsive-form"
          style={{
            padding: "1.5rem",
            margin: "20px",
            borderRadius: "16px",
            backgroundColor: "#fff",
            boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
          }}>
          {/* Profile Picture Section */}
          <div className="profile-section">
            <Text text="PERSONAL INFORMATION" />
            <div className="profile-image-container">
              <img
                src={
                  formData.personalInformation?.profilePicture
                    ? formData.personalInformation?.profilePicture
                    : formData.personalInformation?.gender?.toLowerCase() === "male"
                      ? maleIcon
                      : femaleIcon
                }
                className="profilelogo responsive-profile"
              />
              <input
                type="file"
                id="choosefile"
                className="d-none"
                onChange={handleChangePicture}
                disabled={!canEdit()}
              />
              <div className="p-relative">
                <label htmlFor="choosefile" className="edit-label">
                  <i className="fa fa-pencil editpencil" />
                </label>
              </div>
            </div>
          </div>


          {/* Personal Information */}
          <div className="form-section">
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <SelectInput
                  label="Title"
                  placeholder="--Select--"
                  name="title"
                  style={style3}
                  options={[
                    { key: "Mr.", value: "Mr." },
                    { key: "Mrs.", value: "Mrs." },
                    { key: "Ms.", value: "Ms." },
                    { key: "Dr.", value: "Dr." },
                  ]}
                  value={formData.personalInformation?.title}
                  onChangeText={(e) => handleChange(e, "personalInformation")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label={
                    <>
                      First Name <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  name="firstName"
                  value={formData.personalInformation?.firstName}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "personalInformation")}
                />
              </Col>
            </Row>

            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Middle Name"
                  name="middleName"
                  value={formData.personalInformation?.middleName || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "personalInformation")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label={
                    <>
                      Last Name <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  name="lastName"
                  value={formData.personalInformation?.lastName}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "personalInformation")}
                />
              </Col>
            </Row>

            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <SelectInput
                  label="Gender"
                  placeholder="--Select--"
                  name="gender"
                  style={style3}
                  options={genders}
                  value={formData.personalInformation?.gender}
                  onChangeText={(e) => handleChange(e, "personalInformation")}
                />
              </Col>

              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label={
                    <>
                      Date of Birth<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  dateType="date"
                  name="dateOfBirth"
                  value={formData.personalInformation?.dateOfBirth || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "personalInformation")}
                />
              </Col>
            </Row>



            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="PAN Number"
                  name="PanNumber"
                  value={formData.personalInformation?.PanNumber || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "personalInformation")}
                />
              </Col>
            </Row>
          </div>

          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Contact Information */}
          <Text text="CONTACT INFORMATION" />
          <div className="form-section">
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label={
                    <>
                      Work Email<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  name="email"
                  dateType="email"
                  value={formData.contactInformation?.email}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <SelectInput
                  label="Login Method"
                  placeholder="--Select--"
                  name="loginMethod"
                  options={loginMethods}
                  value={formData.contactInformation?.loginMethod}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>
            <Row className="mt-3 mb-3 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label={
                    <>
                      Mobile No<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  name="mobileNumber"
                  dateType="number"
                  isCountry={true}
                  countryCode={countryCode}
                  onChangeCountry={(e) => {
                    const code = e.target.value;
                    setCountryCode(code);
                    handleChange({ target: { name: "countryCode", value: code } }, "contactInformation");
                  }}
                  value={formData.contactInformation?.mobileNumber}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Whatsapp Number"
                  name="whatsappNumber"
                  dateType="number"
                  isCountry={true}
                  countryCode={countryCode2}
                  onChangeCountry={(e) => {
                    const code = e.target.value;
                    setCountryCode2(code);
                    handleChange({ target: { name: "countryCode2", value: code } }, "contactInformation");
                  }}
                  value={formData.contactInformation?.whatsappNumber}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>
            <Row className="mt-3 mb-3 p-2 responsive-row">
              <Col xs={12} className="responsive-col">
                <CheckboxInput
                  className="checkBox responsive-checkbox"
                  label="Same as Whatsapp No"
                  name="isSameWhatsapp"
                  value={formData.contactInformation.isSameWhatsapp}
                  style={checkStyle}
                  onChangeText={(e) => {
                    handleChange(e, "contactInformation");
                    if (e.target.value) {
                      handleChange(
                        {
                          target: {
                            name: "whatsappNumber",
                            value: formData.contactInformation?.mobileNumber,
                          },
                        },
                        "contactInformation"
                      );
                      setCountryCode2(countryCode);
                      handleChange({ target: { name: "countryCode2", value: countryCode } }, "contactInformation");
                    }
                  }}
                />
              </Col>
            </Row>
            <Row className="responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Personal Email"
                  name="workEmail"
                  dateType="email"
                  value={formData.contactInformation?.workEmail}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Home Address"
                  name="homeAddress"
                  value={formData.contactInformation?.homeAddress}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>

            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Country of Birth"
                  name="countryOfBirth"
                  value={formData.contactInformation?.countryOfBirth || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="City/State of Birth"
                  name="StateOfBirth"
                  value={formData.contactInformation?.StateOfBirth || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>

            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Nationality (Primary)"
                  name="nationality"
                  value={formData.contactInformation?.nationality || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Marriage Date"
                  dateType="date"
                  name="marriageDate"
                  value={formData.contactInformation?.marriageDate || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>

            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Father's Name (In Full)"
                  name="FatherName"
                  value={formData.contactInformation?.FatherName || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Blood Group"
                  name="BloodGroup"
                  value={formData.contactInformation?.BloodGroup || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>

            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <SelectInput
                  label="PF (UAN)"
                  placeholder="--Select--"
                  name="hasPf"
                  style={style3}
                  options={[
                    { key: "Yes", value: "Yes" },
                    { key: "No", value: "No" },
                  ]}
                  value={formData.contactInformation?.hasPf}
                  onChangeText={(e) => {
                    handleChange(e, "contactInformation");
                    if (e?.target?.value === "No") {
                      handleChange({ target: { name: "Pf", value: "" } }, "contactInformation");
                    }
                  }}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label={
                    <>
                      PF (UAN) Number
                      {formData.contactInformation?.hasPf === "Yes" && (
                        <span style={{ color: "red" }}> *</span>
                      )}
                    </>
                  }
                  name="Pf"
                  value={formData.contactInformation?.Pf || ""}
                  style={style3}
                  disabled={formData.contactInformation?.hasPf !== "Yes"}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>
          </div>

          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Employment Information */}
          <Text text="EMPLOYMENT INFORMATION" />
          <div className="form-section">
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={4} className="responsive-col">
                <TextInput
                  label={
                    <>
                      Hire Date <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  dateType="date"
                  name="hireDate"
                  value={formData.employmentInformation?.hireDate || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>

              <Col xs={12} md={4} className="responsive-col">
                <TextInput
                  label={
                    <>
                      Employee No <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  name="employeeNumber"
                  value={formData.employmentInformation?.employeeNumber}
                  style={style2}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col xs={12} md={4} className="responsive-col">
                <SelectInput
                  label={
                    <>
                      {t("Tasks.Status")}<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  placeholder="--Select--"
                  name="status"
                  style={style2}
                  options={statusesActive}
                  value={formData.employmentInformation?.status}
                  onChangeText={(e) => {
                    handleChange(e, "employmentInformation");
                    handleChange(
                      { target: { name: "inactiveDate", value: null } },
                      "employmentInformation"
                    );
                  }}
                />
              </Col>
            </Row>

            {/* Row 2: keep 3-column layout (no empty gaps) */}
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={4} className="responsive-col">
                <TextInput
                  label={
                    <>
                      Inactive Date
                      {formData.employmentInformation?.status === "Inactive" && (
                        <span style={{ color: "red" }}> *</span>
                      )}
                    </>
                  }
                  dateType="date"
                  name="inactiveDate"
                  value={
                    formData.employmentInformation?.inactiveDate
                      ? window.moment(formData.employmentInformation?.inactiveDate).format("YYYY-MM-DD")
                      : ""
                  }
                  style={style3}
                  disabled={formData.employmentInformation.status !== "Inactive"}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col xs={12} md={4} className="responsive-col">
                <TextInput
                  label="Location"
                  name="location"
                  value={formData.employmentInformation?.location}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col xs={12} md={4} className="responsive-col">
                <SelectInput
                  label={
                    <>
                      Line Manager<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  placeholder="--Select--"
                  name="lineManager"
                  style={style3}
                  options={lineManagers}
                  value={formData.employmentInformation?.lineManager}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={4} className="responsive-col">
                <SelectInput
                  label="Job Category"
                  placeholder="--Select--"
                  name="jobCategory"
                  style={style3}
                  options={jobCategories}
                  value={formData.employmentInformation?.jobCategory}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col xs={12} md={4} className="responsive-col">
                <SelectInput
                  label={
                    <>
                      Vihanga HR Role<span style={{ color: "red" }}>*</span>
                    </>
                  }
                  placeholder="--Select--"
                  name="role"
                  style={style3}
                  options={roles}
                  value={formData.employmentInformation?.role}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col xs={12} md={4} className="responsive-col">
                <SelectInput
                  label="Grade"
                  placeholder="--Select--"
                  name="grade"
                  style={style3}
                  options={grades}
                  value={formData.employmentInformation?.grade}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={4} className="responsive-col">
                <SelectInput
                  label="Marital Status"
                  placeholder="--Select--"
                  name="maritalStatus"
                  style={style3}
                  options={maritalStatuses}
                  value={formData.employmentInformation?.maritalStatus}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col xs={12} md={4} className="responsive-col">
                <SelectInput
                  label="Highest Education Level"
                  placeholder="--Select--"
                  name="highestEducationLevel"
                  style={style3}
                  options={highestEducationLevels}
                  value={formData.employmentInformation?.highestEducationLevel}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col xs={12} md={4} className="responsive-col">
                <SelectInput
                  label="Religion"
                  placeholder="--Select--"
                  name="religion"
                  style={style3}
                  options={religions}
                  value={formData.employmentInformation?.religion}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
            </Row>
          </div>

          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Legal Entity & Function Mapping Section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <Text text="LEGAL ENTITY & FUNCTION MAPPING" />
            {canEdit() && (
              <IconButton onClick={handleAddMapping} style={{ color: "#837F39", padding: "0" }}>
                <IoMdAddCircle size={30} />
              </IconButton>
            )}
          </div>

          <div className="form-section" style={{ padding: "0 10px" }}>
            {/* Render multiple mapping rows */}
            {formData.employmentInformation?.legalEntityMappings &&
              formData.employmentInformation.legalEntityMappings.length > 0 &&
              formData.employmentInformation.legalEntityMappings.map((mapping, index) => {
                const designationOptions = getDesignationOptionsForDepartment(mapping.function);
                const showNoDesignations =
                  !!mapping.function &&
                  Array.isArray(designationOptions) &&
                  designationOptions.length === 0 &&
                  Array.isArray(allDesignationsRaw) &&
                  allDesignationsRaw.length > 0;

                return (
                  <div key={index} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "10px", marginBottom: "12px" }}>
                    {/* Line 1 */}
                    <Row className="mt-2 mb-2 p-2 responsive-row align-items-center">
                      <Col xs={12} md={3} className="responsive-col">
                        <SelectInput
                          label={<>Legal Entity<span style={{ color: "red" }}>*</span></>}
                          placeholder="--Select--"
                          name="legalEntity"
                          style={style3}
                          options={legalEntities}
                          value={mapping.legalEntity || ""}
                          onChangeText={(e) => handleMappingChange(index, "legalEntity", e.target.value)}
                          stackLabel={true}
                        />
                      </Col>
                      <Col xs={12} md={3} className="responsive-col">
                        <SelectInput
                          label={<>Function<span style={{ color: "red" }}>*</span></>}
                          placeholder="--Select--"
                          name="function"
                          style={style3}
                          options={getDepartmentOptionsForLegalEntity(mapping.legalEntity)}
                          value={mapping.function || ""}
                          onChangeText={(e) => handleMappingChange(index, "function", e.target.value)}
                          stackLabel={true}
                        />
                      </Col>
                      <Col xs={12} md={2} className="responsive-col">
                        <SelectInput
                          label={<>Type<span style={{ color: "red" }}>*</span></>}
                          placeholder="--Select--"
                          name="type"
                          style={style3}
                          options={[
                            { key: "Primary", value: "PRIMARY" },
                            { key: "Secondary", value: "SECONDARY" },
                          ]}
                          value={mapping.type || "PRIMARY"}
                          onChangeText={(e) => handleMappingTypeChange(index, e.target.value)}
                          stackLabel={true}
                        />
                      </Col>
                      {/* Remove button */}
                      <Col xs={12} md={4} className="d-flex justify-content-end align-items-center">
                        {canEdit() && formData.employmentInformation.legalEntityMappings.length > 1 && mapping.type !== "PRIMARY" && (
                          <IconButton
                            onClick={() => handleRemoveMapping(index)}
                            style={{ color: "red", padding: "0" }}
                          >
                            <IoMdRemoveCircle size={24} />
                          </IconButton>
                        )}
                      </Col>
                    </Row>

                    {/* Line 2: Designation + Department Head */}
                    <Row className="mt-2 mb-2 p-2 responsive-row align-items-center">
                      <Col xs={12} md={6} className="responsive-col">
                        <SelectInput
                          label={<>Designation{mapping.type === "PRIMARY" && <span style={{ color: "red" }}> *</span>}</>}
                          placeholder="--Select--"
                          name="designation"
                          style={style3}
                          options={designationOptions}
                          value={mapping.designation || ""}
                          onChangeText={(e) => handleMappingChange(index, "designation", e.target.value)}
                          stackLabel={true}
                        />
                        {showNoDesignations && (
                          <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                            No designations available for the selected department
                          </div>
                        )}
                      </Col>
                      <Col xs={12} md={6} className="responsive-col">
                        <CheckboxInput
                          label="Functional Head"
                          name="functionalHead"
                          value={!!mapping.functionalHead}
                          onChangeText={(e) => {
                            const checked = e?.target?.checked ?? e?.target?.value ?? e;
                            handleMappingChange(index, "functionalHead", !!checked);
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                );
              })}
          </div>



          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Spouse Information Section */}
          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "rgb(131, 127, 57)" }} text="SPOUSE INFORMATION" />
          <div className="form-section">
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="First Name"
                  name="firstName"
                  value={formData.SpouseInformation?.firstName || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "SpouseInformation")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Sur Name"
                  name="lastName"
                  value={formData.SpouseInformation?.lastName || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "SpouseInformation")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Date of Birth"
                  dateType="date"
                  name="dateOfBirth"
                  value={formData.SpouseInformation?.dateOfBirth || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "SpouseInformation")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Occupation"
                  name="Occupation"
                  value={formData.SpouseInformation?.Occupation || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "SpouseInformation")}
                />
              </Col>
            </Row>
          </div>

          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Child Information Section */}
          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "rgb(131, 127, 57)" }} text="CHILD INFORMATION" />
          <div className="form-section">
            {/* Add Child Button */}
            {canEdit() && (
              <Row className="mt-2 mb-2 p-2 responsive-row">
                <Col xs={12} className="responsive-col" style={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={handleAddChild} style={{ color: "#837F39", padding: "0" }}>
                    <IoMdAddCircle size={35} />
                  </IconButton>
                </Col>
              </Row>
            )}

            {/* Render multiple child sections */}
            {formData.ChildInformation && formData.ChildInformation.length > 0 && formData.ChildInformation.map((child, index) => (
              <div key={index} style={{ marginBottom: "2rem", position: "relative" }}>
                {/* Remove button */}
                {canEdit() && (
                  <Row className="mt-2 mb-2 p-2 responsive-row">
                    <Col xs={12} className="responsive-col" style={{ display: "flex", justifyContent: "flex-end" }}>
                      <IconButton
                        onClick={() => handleRemoveChild(index)}
                        style={{ color: "red", padding: "0" }}
                      >
                        <IoMdRemoveCircle size={28} />
                      </IconButton>
                    </Col>
                  </Row>
                )}

                <Text style={{ fontSize: "13px", fontWeight: 600 }} text={`Child ${index + 1}`} />
                <Row className="mt-2 mb-2 p-2 responsive-row">
                  <Col xs={12} md={6} className="responsive-col">
                    <TextInput
                      label="First Name"
                      name="firstName"
                      value={child.firstName || ""}
                      style={style3}
                      onChangeText={(e) => {
                        const updated = [...formData.ChildInformation];
                        updated[index] = { ...updated[index], firstName: e.target.value };
                        setFormData((prev) => ({ ...prev, ChildInformation: updated }));
                      }}
                    />
                  </Col>
                  <Col xs={12} md={6} className="responsive-col">
                    <TextInput
                      label="Last Name"
                      name="lastName"
                      value={child.lastName || ""}
                      style={style3}
                      onChangeText={(e) => {
                        const updated = [...formData.ChildInformation];
                        updated[index] = { ...updated[index], lastName: e.target.value };
                        setFormData((prev) => ({ ...prev, ChildInformation: updated }));
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mt-2 mb-2 p-2 responsive-row">
                  <Col xs={12} md={6} className="responsive-col">
                    <SelectInput
                      label="Gender"
                      placeholder="--Select--"
                      name="gender"
                      style={style3}
                      options={genders}
                      value={child.gender || ""}
                      onChangeText={(e) => {
                        const updated = [...formData.ChildInformation];
                        updated[index] = { ...updated[index], gender: e.target.value };
                        setFormData((prev) => ({ ...prev, ChildInformation: updated }));
                      }}
                    />
                  </Col>
                  <Col xs={12} md={6} className="responsive-col">
                    <TextInput
                      label="Date of Birth"
                      dateType="date"
                      name="dateOfBirth"
                      value={child.dateOfBirth || ""}
                      style={style3}
                      onChangeText={(e) => {
                        const updated = [...formData.ChildInformation];
                        updated[index] = { ...updated[index], dateOfBirth: e.target.value };
                        setFormData((prev) => ({ ...prev, ChildInformation: updated }));
                      }}
                    />
                  </Col>
                </Row>
              </div>
            ))}
          </div>

          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Present Address Section */}
          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "rgb(131, 127, 57)" }} text="PRESENT ADDRESS FOR CORRESPONDENCE" />
          <div className="form-section">
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Street/House Number"
                  name="streetHouseNumber"
                  value={formData.PresentAddress?.streetHouseNumber || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Address Line 2"
                  name="addressLine2"
                  value={formData.PresentAddress?.addressLine2 || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="City"
                  name="city"
                  value={formData.PresentAddress?.city || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Postal Code"
                  name="postalCode"
                  value={formData.PresentAddress?.postalCode || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Country"
                  name="country"
                  value={formData.PresentAddress?.country || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Region/State"
                  name="regionState"
                  value={formData.PresentAddress?.regionState || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="District"
                  name="district"
                  value={formData.PresentAddress?.district || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Primary Emergency Contact"
                  name="primaryEmergencyContactNumber"
                  value={formData.PresentAddress?.primaryEmergencyContactNumber || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Secondary Emergency Contact"
                  name="secondaryEmergencyContactNumber"
                  value={formData.PresentAddress?.secondaryEmergencyContactNumber || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
            </Row>
          </div>

          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Permanent Address Section */}
          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "rgb(131, 127, 57)" }} text="PERMANENT ADDRESS FOR CORRESPONDENCE" />
          <div className="form-section">
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} className="responsive-col">
                <CheckboxInput
                  className="checkBox responsive-checkbox"
                  label="Same as Present Address"
                  name="sameAsPresentAddress"
                  value={sameAsPresentAddress}
                  style={checkStyle}
                  onChangeText={handleSameAsPresentAddressChange}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Street/House Number"
                  name="streetHouseNumber"
                  value={formData.PermanentAddress?.streetHouseNumber || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Address Line 2"
                  name="addressLine2"
                  value={formData.PermanentAddress?.addressLine2 || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="City"
                  name="city"
                  value={formData.PermanentAddress?.city || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Postal Code"
                  name="postalCode"
                  value={formData.PermanentAddress?.postalCode || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Country"
                  name="country"
                  value={formData.PermanentAddress?.country || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Region/State"
                  name="regionState"
                  value={formData.PermanentAddress?.regionState || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="District"
                  name="district"
                  value={formData.PermanentAddress?.district || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Primary Emergency Contact"
                  name="primaryEmergencyContactNumber"
                  value={formData.PermanentAddress?.primaryEmergencyContactNumber || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Secondary Emergency Contact"
                  name="secondaryEmergencyContactNumber"
                  value={formData.PermanentAddress?.secondaryEmergencyContactNumber || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
            </Row>
          </div>

          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Resignation Section */}
          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "rgb(131, 127, 57)" }} text="RESIGNATION" />
          <div className="form-section">
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label="Current Approval Level"
                  name="currentApprovalLevel"
                  dateType="number"
                  value={formData?.resignation?.currentApprovalLevel}
                  style={style3}
                  disabled={true}
                  onChangeText={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resignation: {
                        ...prev.resignation,
                        currentApprovalLevel: e.target.value,
                      },
                    }))
                  }
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <SelectInput
                  label="Overall Status"
                  placeholder="--Select--"
                  name="overallStatus"
                  style={style3}
                  options={[
                    { key: "Pending", value: "Pending" },
                    { key: "Approved", value: "Approved" },
                    { key: "Rejected", value: "Rejected" },
                  ]}
                  value={formData?.resignation?.overallStatus}
                  onChangeText={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resignation: {
                        ...prev.resignation,
                        overallStatus: e.target.value,
                      },
                    }))
                  }
                />
              </Col>
            </Row>
          </div>

          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Candidate Information */}
          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "rgb(131, 127, 57)" }} text="CANDIDATE INFORMATION" />

          <Text style={{ fontSize: "13px", fontWeight: 600, color: "rgb(131, 127, 57)" }} className="mt-3" text="Personal Details" />

          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label=" Aadhar Number"
                  name="aadharNumber"
                  value={formData.candidateInformation?.personalDetails?.aadharNumber}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "personalDetails")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Passport Number"
                  name="passportNumber"
                  value={formData.candidateInformation?.personalDetails?.passportNumber}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "personalDetails")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Driver License Number"
                  name="driverLicenseNumber"
                  value={formData.candidateInformation?.personalDetails?.driverLicenseNumber}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "personalDetails")
                  }
                />
              </Grid>
            </Grid>
          </Box>

          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Driver License Expiry"
                  dateType="date"
                  name="driverLicenseExpiry"
                  value={formData.candidateInformation?.personalDetails?.driverLicenseExpiry || ""}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "personalDetails")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Driver License Period"
                  name="driverLicensePeriod"
                  value={formData.candidateInformation?.personalDetails?.driverLicensePeriod}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "personalDetails")
                  }
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <SelectInput
                  label="Coverage For"
                  placeholder="--Select--"
                  name="coverageFor"
                  style={style3}
                  options={[
                    { key: "Self only", value: "self_only" },
                    { key: "Self + Family (Spouse + 2 Kids)", value: "self_family" },
                  ]}
                  value={formData.candidateInformation?.insuranceDetails?.coverageFor}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "insuranceDetails")
                  }
                />
              </Grid>
            </Grid>
          </Box>

          {/* Insurance Details for Family */}
          {formData.candidateInformation?.insuranceDetails?.coverageFor === "self_family" && (
            <div className="form-section">
              <Box className="mt-2 mb-2 p-2 responsive-box">
                <Grid container spacing={2} className="responsive-grid">
                  <Grid item xs={12} md={6}>
                    <TextInput
                      label="Spouse Name"
                      name="spouseName"
                      value={formData.candidateInformation?.insuranceDetails?.spouseName}
                      style={{ ...style3, width: "100%" }}
                      onChangeText={(e) =>
                        handleNestedChange(e, "candidateInformation", "insuranceDetails")
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput
                      label="Spouse Date of Birth"
                      name="spouseDob"
                      dateType="date"
                      value={formData.candidateInformation?.insuranceDetails?.spouseDob || ""}
                      style={{ ...style3, width: "100%" }}
                      onChangeText={(e) =>
                        handleNestedChange(e, "candidateInformation", "insuranceDetails")
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box className="mt-2 mb-2 p-2 responsive-box">
                <Grid container spacing={2} className="responsive-grid">
                  <Grid item xs={12} md={6}>
                    <TextInput
                      label="Child 1 Name"
                      name="child1Name"
                      value={formData.candidateInformation?.insuranceDetails?.child1Name}
                      style={{ ...style3, width: "100%" }}
                      onChangeText={(e) =>
                        handleNestedChange(e, "candidateInformation", "insuranceDetails")
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput
                      label="Child 1 Date of Birth"
                      name="child1Dob"
                      dateType="date"
                      value={formData.candidateInformation?.insuranceDetails?.child1Dob || ""}
                      style={{ ...style3, width: "100%" }}
                      onChangeText={(e) =>
                        handleNestedChange(e, "candidateInformation", "insuranceDetails")
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box className="mt-2 mb-2 p-2 responsive-box">
                <Grid container spacing={2} className="responsive-grid">
                  <Grid item xs={12} md={6}>
                    <TextInput
                      label="Child 2 Name"
                      name="child2Name"
                      value={formData.candidateInformation?.insuranceDetails?.child2Name}
                      style={{ ...style3, width: "100%" }}
                      onChangeText={(e) =>
                        handleNestedChange(e, "candidateInformation", "insuranceDetails")
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextInput
                      label="Child 2 Date of Birth"
                      name="child2Dob"
                      dateType="date"
                      value={formData.candidateInformation?.insuranceDetails?.child2Dob || ""}
                      style={{ ...style3, width: "100%" }}
                      onChangeText={(e) =>
                        handleNestedChange(e, "candidateInformation", "insuranceDetails")
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
          )}

          {/* Interviews & Reporting */}
          <Text style={{ fontSize: "13px", fontWeight: 600, color: "rgb(131, 127, 57)" }} className="mt-3" text="Interviews & Reporting" />

          {/* Interviewer 1 */}
          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Interviewer 1 Name"
                  name="name"
                  value={formData.candidateInformation?.interviewer1?.name}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer1")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Interviewer 1 Email"
                  name="email"
                  value={formData.candidateInformation?.interviewer1?.email}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer1")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Interviewer 1 ID"
                  name="id"
                  value={formData.candidateInformation?.interviewer1?.id}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer1")
                  }
                />
              </Grid>
            </Grid>
          </Box>

          {/* Interviewer 2 */}
          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Interviewer 2 Name"
                  name="name"
                  value={formData.candidateInformation?.interviewer2?.name}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer2")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Interviewer 2 Email"
                  name="email"
                  value={formData.candidateInformation?.interviewer2?.email}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer2")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Interviewer 2 ID"
                  name="id"
                  value={formData.candidateInformation?.interviewer2?.id}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer2")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Feedback ID"
                  name="feedbackId"
                  value={formData.candidateInformation?.interviewer2?.feedbackId}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer2")
                  }
                />
              </Grid>
            </Grid>
          </Box>

          {/* Reporting Manager */}
          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Reporting Manager Name"
                  name="name"
                  value={formData.candidateInformation?.reportingManager?.name}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "reportingManager")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Reporting Manager Email"
                  name="email"
                  value={formData.candidateInformation?.reportingManager?.email}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "reportingManager")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Reporting Manager ID"
                  name="id"
                  value={formData.candidateInformation?.reportingManager?.id}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "reportingManager")
                  }
                />
              </Grid>
            </Grid>
          </Box>

          {/* Offer & Other Details */}
          <Text style={{ fontSize: "13px", fontWeight: 600, color: "rgb(131, 127, 57)" }} className="mt-3" text="Offer & Other Details" />

          {/* Row 1 */}
          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Project Name"
                  name="projectName"
                  value={formData.candidateInformation?.projectName}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Original Candidate ID"
                  name="originalCandidateId"
                  value={formData.candidateInformation?.originalCandidateId}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Source"
                  name="source"
                  value={formData.candidateInformation?.source}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Row 2 */}
          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Applied On"
                  name="appliedOn"
                  dateType="date"
                  value={formData.candidateInformation?.appliedOn || ""}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Offer Letter Date"
                  name="offerLetterDate"
                  dateType="date"
                  value={formData.candidateInformation?.offerLetterDate || ""}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CheckboxInput
                  className="checkBox responsive-checkbox"
                  label="Show Offer Letter"
                  name="showOfferLetter"
                  value={formData.candidateInformation?.showOfferLetter}
                  style={checkStyle}
                  onChangeText={(e) =>
                    handleCandidateInfoChange({
                      target: { name: "showOfferLetter", value: e.target.value },
                    })
                  }
                />
              </Grid>
            </Grid>
          </Box>

          {/* Row 3 */}
          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Experience"
                  name="experience"
                  value={formData.candidateInformation?.experience}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Gross Salary"
                  name="grossSalary"
                  dateType="number"
                  value={formData.candidateInformation?.grossSalary}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Notice Period (days)"
                  name="noticePeriod"
                  dateType="number"
                  value={formData.candidateInformation?.noticePeriod}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Probation Period (days)"
                  name="probationPeriod"
                  dateType="number"
                  value={formData.candidateInformation?.probationPeriod}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Resume & Documents */}
          <Text style={{ fontSize: "13px", fontWeight: 600, color: "rgb(131, 127, 57)" }} className="mt-3" text="Resume & Documents" />
          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={6}>
                <TextInput
                  label="Resume URL"
                  name="resume"
                  value={formData.candidateInformation?.resume}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  label="Document URLs (comma separated)"
                  name="documentDetails"
                  value={formData.candidateInformation?.documentDetails?.join(", ")}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      candidateInformation: {
                        ...prev.candidateInformation,
                        documentDetails: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    }))
                  }
                />
              </Grid>
            </Grid>
          </Box>

          {/* References */}
          <Text style={{ fontSize: "13px", fontWeight: 600, color: "rgb(131, 127, 57)" }} className="mt-3" text="References" />

          {/* Reference 1 */}
          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Reference 1 Name"
                  name="name"
                  value={formData.candidateInformation?.references?.[0]?.name}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleArrayNestedChange(e, "candidateInformation", "references", 0)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Reference 1 Email"
                  name="email"
                  value={formData.candidateInformation?.references?.[0]?.email}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleArrayNestedChange(e, "candidateInformation", "references", 0)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Reference 1 Phone"
                  name="phone"
                  value={formData.candidateInformation?.references?.[0]?.phone}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleArrayNestedChange(e, "candidateInformation", "references", 0)
                  }
                />
              </Grid>
            </Grid>
          </Box>

          {/* Reference 2 */}
          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Reference 2 Name"
                  name="name"
                  value={formData.candidateInformation?.references?.[1]?.name}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleArrayNestedChange(e, "candidateInformation", "references", 1)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Reference 2 Email"
                  name="email"
                  value={formData.candidateInformation?.references?.[1]?.email}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleArrayNestedChange(e, "candidateInformation", "references", 1)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Reference 2 Phone"
                  name="phone"
                  value={formData.candidateInformation?.references?.[1]?.phone}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleArrayNestedChange(e, "candidateInformation", "references", 1)
                  }
                />
              </Grid>
            </Grid>
          </Box>

          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Bulk Upload Section */}
          <Text text="Bulk Upload of Employees" />
          <div className="bulk-upload-section">
            {canEdit() && (
              <div className="col-md-6 m-0 p-0 d-flex justify-content-between align-items-center responsive-bulk-header">
                <CheckboxInput
                  label="Bulk upload of Employees"
                  name="bulkUpload"
                  value={bulkUpload}
                  onChangeText={(e) => setBulkUpload(!bulkUpload)}
                />
                <DownloadLink text="Download Template" link="#" onClick={downloadEmployeeTemplate} />
              </div>
            )}
            {bulkUpload && canEdit() && (
              <div className="col-md-6 m-0 p-0 responsive-bulk-content">
                <FileUploadCustom
                  id="bulkUpload-employees"
                  enableUpload={true}
                  onFileUpload={handleFileUpload}
                />

                {showProgress && (
                  <UploadProgress
                    filename={fileName}
                    link={fileUrl}
                    message="10 records successfully uploading out 15"
                    status="inprogress"
                    progressWidth={progress}
                    loaded={loaded}
                    total={total}
                  />
                )}
                {uploads !== undefined &&
                  uploads?.length > 0 &&
                  uploads?.map?.((upload, index) => (
                    <div key={index}>
                      <UploadProgress
                        upload={upload}
                        refresh={refresh}
                        index={index}
                        {...upload}
                        deleteUploadData={deleteUploadData}
                      />
                      <HorizontalBar className="responsive-hr" />
                    </div>
                  ))}
              </div>
            )}
            {isDraftLoaded && (
              <Box sx={{ mt: 2, mb: 1, px: 2 }}>
                <Typography
                  sx={{
                    color: "#837F39",
                    fontSize: "14px",
                    fontFamily: "Work Sans",
                    fontStyle: "italic",
                  }}
                >
                  {t("Draft data loaded") || "Draft data loaded"}
                </Typography>
              </Box>
            )}

            {canEdit() && (
              <div className="pt-3 m-0 responsive-buttons">
                <Button
                  text={t("objectives.Clear")}
                  className="bg-white border-grey responsive-button"
                  handleClick={clearData}
                />
                <Button
                  text={t("Save as Draft") || "Save as Draft"}
                  className="bg-white border-grey responsive-button"
                  handleClick={handleSaveDraft}
                />
                <Button
                  text="Save"
                  className="bg-green border text-white responsive-button"
                  handleClick={handleSave}
                />
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
}


