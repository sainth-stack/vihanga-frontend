import React, { useState, useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import "./styles.scss";
import Text from "components/Company/Text";
import HorizontalBar from "components/Company/HorizontalBar";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import CheckboxInput from "components/Company/CheckboxInput";
import Button from "components/Company/Button";
import { useDispatch } from "react-redux";
import {
  countriesNames,
  genders,
  getRandom,
  jobCategories,
  loginMethods,
  removeDuplicates,
  statusesActive,
} from "utilities";
import { Col, Row } from "react-bootstrap";
import { Validator } from "utilities";
import { getEmployeesAll, updateEmployee } from "action/EmployeeAct";
import { Link, useHistory } from "react-router-dom";
import { getEntities } from "action/EntityAct";
import { getDepartmentsData } from "action/DepartmentAct";
import { getDesignations } from "action/DesignationAct";
import { getAllPrivileges } from "action/PrivilegesAct";
import maleIcon from "assets/images/male.png";
import femaleIcon from "assets/images/female.png";
import { maritalStatuses, highestEducationLevels, religions } from "utilities/constants";
import { getGrades } from "action/GradeAct";
import { removeQueries } from "pages/Objectives/hooks/useGetEmployees";
import { useTranslation } from "react-i18next";
import { Box, Grid, IconButton } from "@mui/material";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { Toast } from "service/toast";
import { canEdit } from "utilities/privilegeHelper";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data?.[i]?._id,
      companyEntityName: data?.[i]?.companyEntityName,
      industry: data?.[i]?.industry,
      legalEntityName: data?.[i]?.legalEntityName,
      status: data?.[i]?.status,
      country: data?.[i]?.country,
    });
  }
  return items;
};

export default function FormEdit(props) {
  const { state } = props?.location || {};
  const validator = Validator();
  const dispatch = useDispatch();
  let personalInformation = {
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null,
    profilePicture: maleIcon,
    title: "",
    PanNumber: "",
    middleName: "",
  };
  let contactInformation = {
    email: "",
    loginMethod: "",
    mobileNumber: "",
    whatsappNumber: "",
    isSameWhatsapp: false,
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
    legalEntityMappings: [], // New field: Array of Legal Entity & Function mappings
    location: "",
    lineManager: "",
    jobCategory: "",
    role: "",
    designation: "",
    grade: "",
    departmentHead: "No",
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
  // Helper function to normalize employment information for backward compatibility
  const normalizeEmploymentInfo = (empInfo) => {
    if (!empInfo) {
      return {
        ...employmentInformation,
        legalEntityMappings: [{
          legalEntity: "",
          function: "",
          type: "PRIMARY",
          functionalHead: false,
          designation: "",
        }]
      };
    }

    let normalized = { ...employmentInformation, ...empInfo };

    // Convert old format to new format if needed
    if (!normalized.legalEntityMappings || !Array.isArray(normalized.legalEntityMappings) || normalized.legalEntityMappings.length === 0) {
      // Check if old format exists (single legalEntity and department)
      if (normalized.legalEntity || normalized.department) {
        normalized.legalEntityMappings = [{
          legalEntity: normalized.legalEntity || "",
          function: normalized.department || "",
          designation: normalized.designation || "",
          type: "PRIMARY",
          functionalHead: normalized.departmentHead === "Yes" || normalized.departmentHead === true,
        }];
      } else {
        // No mapping data at all, initialize with empty PRIMARY
        normalized.legalEntityMappings = [{
          legalEntity: "",
          function: "",
          type: "PRIMARY",
          functionalHead: false,
          designation: "",
        }];
      }
    }

    normalized.departmentHead = (normalized.departmentHead === "Yes" || normalized.departmentHead === true) ? true : false;

    // Ensure mapping-level fields exist
    normalized.legalEntityMappings = normalized.legalEntityMappings.map((m) => ({
      ...m,
      functionalHead: typeof m.functionalHead === "boolean" ? m.functionalHead : (m.type === "PRIMARY" ? !!normalized.departmentHead : false),
      designation: typeof m.designation === "string" && m.designation.trim() ? m.designation : (m.type === "PRIMARY" ? (normalized.designation || "") : "")
    }));

    return normalized;
  };

  const [formData, setFormData] = useState({
    personalInformation: {
      ...personalInformation,
      ...state?.data?.personalInformation,
    },
    contactInformation: {
      ...contactInformation,
      ...state?.data?.contactInformation,
      hasPf: state?.data?.contactInformation?.Pf ? "Yes" : "No",
    },
    employmentInformation: normalizeEmploymentInfo(state?.data?.employmentInformation),
    resignation: state?.data?.resignation || resignationDefault,
    candidateInformation: {
      ...candidateInformationDefault,
      ...(state?.data?.candidateInformation || {}),
      personalDetails: {
        ...candidateInformationDefault.personalDetails,
        ...(state?.data?.candidateInformation?.personalDetails || {}),
      },
      bankDetails: {
        ...candidateInformationDefault.bankDetails,
        ...(state?.data?.candidateInformation?.bankDetails || {}),
      },
      insuranceDetails: {
        ...candidateInformationDefault.insuranceDetails,
        ...(state?.data?.candidateInformation?.insuranceDetails || {}),
      },
      interviewer1: {
        ...candidateInformationDefault.interviewer1,
        ...(state?.data?.candidateInformation?.interviewer1 || {}),
      },
      interviewer2: {
        ...candidateInformationDefault.interviewer2,
        ...(state?.data?.candidateInformation?.interviewer2 || {}),
      },
      reportingManager: {
        ...candidateInformationDefault.reportingManager,
        ...(state?.data?.candidateInformation?.reportingManager || {}),
      },
      documentDetails: state?.data?.candidateInformation?.documentDetails || [],
      documents: state?.data?.candidateInformation?.documents || [],
      references:
        state?.data?.candidateInformation?.references?.length > 0
          ? state?.data?.candidateInformation?.references
          : candidateInformationDefault.references,
    },
    SpouseInformation: state?.data?.SpouseInformation || SpouseInformation,
    ChildInformation: state?.data?.ChildInformation || ChildInformation,
    PresentAddress: state?.data?.PresentAddress || PresentAddress,
    PermanentAddress: state?.data?.PermanentAddress || PermanentAddress,
  });
  useEffect(() => {
    const record = state?.data;
    if (!record?._id) return;

    // Always fetch the latest employee data to ensure we have complete candidate information
    try {
      let response = dispatch(getEmployeesAll());
      response?.then?.(({ data }) => {
        const found = (data || [])?.find?.((e) => e?._id === record?._id);
        if (found) {
          const ci = found?.candidateInformation || {};
          const presentAddr = found?.PresentAddress || PresentAddress;
          const permanentAddr = found?.PermanentAddress || PermanentAddress;

          // Check if addresses match
          const addressesMatch =
            presentAddr?.streetHouseNumber === permanentAddr?.streetHouseNumber &&
            presentAddr?.addressLine2 === permanentAddr?.addressLine2 &&
            presentAddr?.city === permanentAddr?.city &&
            presentAddr?.postalCode === permanentAddr?.postalCode &&
            presentAddr?.country === permanentAddr?.country &&
            presentAddr?.regionState === permanentAddr?.regionState &&
            presentAddr?.district === permanentAddr?.district &&
            presentAddr?.primaryEmergencyContactNumber === permanentAddr?.primaryEmergencyContactNumber &&
            presentAddr?.secondaryEmergencyContactNumber === permanentAddr?.secondaryEmergencyContactNumber &&
            (presentAddr?.streetHouseNumber || presentAddr?.city || presentAddr?.country); // At least one field has value

          setSameAsPresentAddress(addressesMatch);

          setFormData((prev) => ({
            ...prev,
            resignation: found?.resignation || resignationDefault,
            candidateInformation: {
              ...candidateInformationDefault,
              ...ci,
              personalDetails: {
                ...candidateInformationDefault.personalDetails,
                ...(ci?.personalDetails || {}),
              },
              bankDetails: {
                ...candidateInformationDefault.bankDetails,
                ...(ci?.bankDetails || {}),
              },
              insuranceDetails: {
                ...candidateInformationDefault.insuranceDetails,
                ...(ci?.insuranceDetails || {}),
              },
              interviewer1: { ...candidateInformationDefault.interviewer1, ...(ci?.interviewer1 || {}) },
              interviewer2: { ...candidateInformationDefault.interviewer2, ...(ci?.interviewer2 || {}) },
              reportingManager: { ...candidateInformationDefault.reportingManager, ...(ci?.reportingManager || {}) },
              documentDetails:
                (ci?.documentDetails && ci?.documentDetails?.length > 0)
                  ? ci?.documentDetails
                  : (ci?.documents || [])?.map?.((d) => d?.url)?.filter?.(Boolean) || [],
              documents: ci?.documents || [],
              references: (ci?.references && ci?.references?.length > 0)
                ? ci?.references
                : candidateInformationDefault?.references || [],
            },
            SpouseInformation: found?.SpouseInformation || SpouseInformation,
            ChildInformation: found?.ChildInformation || ChildInformation,
            PresentAddress: presentAddr,
            PermanentAddress: permanentAddr,
          }));
        }
      });
    } catch (e) {
      console.error("Failed to hydrate candidateInformation:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [, setLoading] = useState(false);
  const [, setError] = useState(false);
  const [, forceUpdate] = useState(false);
  const [, setData] = useState([]);
  const [style3] = useState(150);
  const [style2] = useState(140);
  const [legalEntities, setLegalEntities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [grades, setGrades] = useState([]);
  const [lineManagers, setLineManagers] = useState([]);
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
  const normalizeCode = (v) => {
    if (!v) return "+91";
    const s = String(v).trim();
    return s.startsWith("+") ? s : `+${s}`;
  };
  const [countryCode, setCountryCode] = useState(
    normalizeCode(state?.data?.contactInformation?.countryCode)
  );
  const [countryCode2, setCountryCode2] = useState(
    normalizeCode(state?.data?.contactInformation?.countryCode2)
  );
  const [sameAsPresentAddress, setSameAsPresentAddress] = useState(false);

  useEffect(() => {
    const cc = formData?.contactInformation?.countryCode;
    const cc2 = formData?.contactInformation?.countryCode2;
    if (cc) setCountryCode(normalizeCode(cc));
    if (cc2) setCountryCode2(normalizeCode(cc2));
  }, [formData?.contactInformation?.countryCode, formData?.contactInformation?.countryCode2]);

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
          departmentHead: !!primaryMapping.functionalHead,
          designation: primaryMapping.designation || prev.employmentInformation.designation,
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

  // Row-wise designation options based on selected function/department
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
    let fileName = originalFileName?.split?.(".")?.[0] + "_" + getRandom(9);
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

  const getPrivilegesDataRefresh = () => {
    try {
      let response = dispatch(getAllPrivileges());
      response?.then?.(({ data, message }) => {
        if (data !== undefined && data?.length > 0) {
          let nonduplicate = removeDuplicates(data, "role");
          let updatedData = nonduplicate.map((item) => {
            return { key: item?.role, value: item?.role };
          });
          setRoles(updatedData);
          setError("");
        } else if (data?.length === 0) {
          setError("No Data Found!");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error?.toString?.() || "An error occurred");
    }
  };

  const fetchEntities = () => {
    try {
      setLoading(true);
      let response = dispatch(getEntities());
      response?.then?.(({ data, message }) => {
        if (data !== undefined && data?.length > 0) {
          let result = data
            .filter((item) => item.status === "Active")
            .map((item) => {
              return { key: item?.legalEntityName, value: item?.legalEntityName };
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
      setError(error?.toString?.() || "An error occurred");
    }
  };
  const fetchDepartments = () => {
    try {
      setLoading(true);
      let response = dispatch(getDepartmentsData());
      response?.then?.(({ data, message }) => {
        if (
          data !== undefined &&
          data?.length > 0 &&
          data[0]?.departments?.length > 0
        ) {
          // Store raw data for filtering
          const activeDepartments = data[0]?.departments.filter(
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
      setError(error?.toString?.() || "An error occurred");
    }
  };

  const fetchDesignations = () => {
    try {
      setLoading(true);
      let response = dispatch(getDesignations());
      response?.then?.(({ data, message }) => {
        if (data !== undefined && data?.length > 0) {
          // Store raw data for filtering
          const activeDesignations = data.filter(
            (item) => item?.status === "Active"
          );
          setAllDesignationsRaw(activeDesignations);

          // Initially show all designations (will be filtered when department is selected)
          let result = activeDesignations.map((item) => {
            return { key: item.designationName, value: item.designationName };
          });
          let nonduplicates = removeDuplicates(result, "value");
          setDesignations(nonduplicates);
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
      setError(error?.toString?.() || "An error occurred");
    }
  };

  const fetchGrades = () => {
    try {
      setLoading(true);
      let response = dispatch(getGrades());
      response?.then?.(({ data, message }) => {
        if (data !== undefined && data?.length > 0) {
          let result = data
            .filter((item) => item?.status === "Active")
            .map((item) => {
              return { key: item.gradeName, value: item.gradeName };
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
      setError(error?.toString?.() || "An error occurred");
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
    if (validator?.current?.allValid?.()) {
      try {
        let response = dispatch(
          updateEmployee(state?.data?._id, {
            ...formData,
            employmentInformation: {
              ...formData?.employmentInformation,
              departmentHead: formData?.employmentInformation?.departmentHead
                ? "Yes"
                : "No",
            },
          })
        );
        response?.then?.(({ success, message }) => {
          setLoading(true);
          if (success) {
            setLoading(false);
            setError("");
            removeQueries?.();
            history.push("/admin/setups/employees");
          } else {
            setLoading(false);
            setError(message);
          }
        });
      } catch (error) {
        setLoading(false);
        setError(error?.toString?.() || "An error occurred");
      }
    } else {
      validator?.current?.showMessages?.();
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

  const fetchEmployees = () => {
    try {
      setLoading(true);
      let response = dispatch(getEmployeesAll());
      response?.then?.(({ data, message }) => {
        if (data !== undefined && data?.length > 0) {
          let activeEmployees = data?.filter?.(
            (item) => item?.employmentInformation?.status === "Active"
          ) || [];
          setData(activeEmployees);
          const lineManagers2 = activeEmployees?.map?.((item) => {
            return {
              key:
                item?.personalInformation?.firstName +
                " " +
                item?.personalInformation?.lastName,
              value: item?._id,
            };
          }) || [];
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
      setError(error?.toString?.() || "An error occurred");
    }
  };
  useEffect(() => {
    fetchEntities();
    fetchDepartments();
    fetchDesignations();
    fetchGrades();
    fetchEmployees();
    getPrivilegesDataRefresh();
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
  return (
    <>
      <TitleHeader name="Admin Portal - Dashboard" />
      <div className="rounded mh-100 responsive-container">

        <p className="title text-dark font-weight-bold pb20">Employees Setup</p>
        <div className="company-form responsive-form"
          style={{
            padding: "1.5rem",
            margin: "20px",
            borderRadius: "16px",
            backgroundColor: "#fff",
            boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
          }}>

          {/* Profile Section */}
          <div className="profile-section">
            <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#837F39" }} text="PERSONAL INFORMATION" />
            <div className="profile-image-container"  >
              <img
                src={
                  formData?.personalInformation?.profilePicture
                    ? formData?.personalInformation?.profilePicture
                    : formData?.personalInformation?.gender?.toLowerCase() === "male"
                      ? maleIcon
                      : femaleIcon
                }
                className="profilelogo responsive-profile"
                alt=""
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
                  value={formData?.personalInformation?.title}
                  onChangeText={(e) => handleChange(e, "personalInformation")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label={<>First Name <span style={{ color: "red" }}>*</span></>}
                  name="firstName"
                  value={formData?.personalInformation?.firstName}
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
                  value={formData?.personalInformation?.middleName || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "personalInformation")}
                />
              </Col>
              <Col xs={12} md={6} className="responsive-col">
                <TextInput
                  label={<>Last Name <span style={{ color: "red" }}>*</span></>}
                  name="lastName"
                  value={formData?.personalInformation?.lastName}
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
                  value={formData?.personalInformation?.gender}
                  onChangeText={(e) => handleChange(e, "personalInformation")}
                />
              </Col>

              <Col className="responsive-col">
                <TextInput
                  label={<>Date of Birth <span style={{ color: "red" }}>*</span></>}
                  dateType="date"
                  name="dateOfBirth"
                  value={formData?.personalInformation?.dateOfBirth ? window.moment(formData?.personalInformation?.dateOfBirth).format("YYYY-MM-DD") : ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "personalInformation")}
                />
              </Col>
            </Row>

            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="PAN Number"
                  name="PanNumber"
                  value={formData?.personalInformation?.PanNumber || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "personalInformation")}
                />
              </Col>
              <Col className="responsive-col"></Col>
            </Row>
          </div>

          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Contact Information */}
          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#837F39" }} text="CONTACT INFORMATION" />
          <div className="form-section">
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label={<>Work Email <span style={{ color: "red" }}>*</span></>}
                  name="email"
                  dateType="email"
                  value={formData?.contactInformation?.email}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <SelectInput
                  label="Login Method"
                  placeholder="--Select--"
                  name="loginMethod"
                  options={loginMethods}
                  value={formData?.contactInformation?.loginMethod}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>
            <Row className="mt-3 mb-3 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label={<>Mobile No<span style={{ color: "red" }}>*</span></>}
                  name="mobileNumber"
                  dateType="number"
                  isCountry={true}
                  countryCode={countryCode}
                  onChangeCountry={(e) => {
                    const code = e.target.value;
                    setCountryCode(code);
                    handleChange({ target: { name: "countryCode", value: code } }, "contactInformation");
                  }}
                  value={formData?.contactInformation?.mobileNumber}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col className="responsive-col">
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
                  value={formData?.contactInformation?.whatsappNumber}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>
            <Row className="mt-3 mb-3 p-2 responsive-row">
              <Col className="responsive-col">
                <CheckboxInput
                  className="checkBox responsive-checkbox"
                  label="Same as Whatsapp No"
                  name="isSameWhatsapp"
                  value={formData?.contactInformation?.isSameWhatsapp}
                  style={checkStyle}
                  onChangeText={(e) => {
                    handleChange(e, "contactInformation");
                    if (e.target.value) {
                      handleChange(
                        {
                          target: {
                            name: "whatsappNumber",
                            value: formData?.contactInformation?.mobileNumber,
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
              <Col className="responsive-col">
                <TextInput
                  label="Personal Email"
                  name="workEmail"
                  dateType="email"
                  value={formData?.contactInformation?.workEmail}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Home Address"
                  name="homeAddress"
                  value={formData?.contactInformation?.homeAddress}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>

            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Country of Birth"
                  name="countryOfBirth"
                  value={formData?.contactInformation?.countryOfBirth || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="City/State of Birth"
                  name="StateOfBirth"
                  value={formData?.contactInformation?.StateOfBirth || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>

            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Nationality (Primary)"
                  name="nationality"
                  value={formData?.contactInformation?.nationality || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Marriage Date"
                  dateType="date"
                  name="marriageDate"
                  value={formData?.contactInformation?.marriageDate || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>

            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Father's Name (In Full)"
                  name="FatherName"
                  value={formData?.contactInformation?.FatherName || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Blood Group"
                  name="BloodGroup"
                  value={formData?.contactInformation?.BloodGroup || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>

            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <SelectInput
                  label="PF (UAN)"
                  placeholder="--Select--"
                  name="hasPf"
                  style={style3}
                  options={[
                    { key: "Yes", value: "Yes" },
                    { key: "No", value: "No" },
                  ]}
                  value={formData?.contactInformation?.hasPf}
                  onChangeText={(e) => {
                    handleChange(e, "contactInformation");
                    if (e?.target?.value === "No") {
                      handleChange({ target: { name: "Pf", value: "" } }, "contactInformation");
                    }
                  }}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label={
                    <>
                      PF (UAN) Number
                      {formData?.contactInformation?.hasPf === "Yes" && (
                        <span style={{ color: "red" }}> *</span>
                      )}
                    </>
                  }
                  name="Pf"
                  value={formData?.contactInformation?.Pf || ""}
                  style={style3}
                  disabled={formData?.contactInformation?.hasPf !== "Yes"}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>
          </div>

          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Employment Information */}
          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#837F39" }} text="EMPLOYMENT INFORMATION" />
          <div className="form-section">
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label={<>Hire Date <span style={{ color: "red" }}>*</span></>}
                  dateType="date"
                  name="hireDate"
                  value={formData?.employmentInformation?.hireDate ? window.moment(formData?.employmentInformation?.hireDate).format("YYYY-MM-DD") : ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>

              <Col className="responsive-col">
                <TextInput
                  label={<>Employee No <span style={{ color: "red" }}>*</span></>}
                  name="employeeNumber"
                  value={formData?.employmentInformation?.employeeNumber}
                  style={style2}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <SelectInput
                  label={<>{t("Tasks.Status")}<span style={{ color: "red" }}>*</span></>}
                  placeholder="--Select--"
                  name="status"
                  style={style2}
                  options={statusesActive}
                  value={formData?.employmentInformation?.status}
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
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label={
                    <>
                      Inactive Date
                      {formData?.employmentInformation?.status === "Inactive" && (
                        <span style={{ color: "red" }}> *</span>
                      )}
                    </>
                  }
                  dateType="date"
                  name="inactiveDate"
                  value={
                    formData?.employmentInformation?.inactiveDate
                      ? window.moment(formData?.employmentInformation?.inactiveDate).format("YYYY-MM-DD")
                      : ""
                  }
                  style={style3}
                  disabled={formData?.employmentInformation?.status !== "Inactive"}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Location"
                  name="location"
                  value={formData?.employmentInformation?.location}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <SelectInput
                  label={<>Line Manager<span style={{ color: "red" }}>*</span></>}
                  placeholder="--Select--"
                  name="lineManager"
                  style={style3}
                  options={lineManagers}
                  value={formData?.employmentInformation?.lineManager}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <SelectInput
                  label="Job Category"
                  placeholder="--Select--"
                  name="jobCategory"
                  style={style3}
                  options={jobCategories}
                  value={formData?.employmentInformation?.jobCategory}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <SelectInput
                  label={<>Vihanga Hr Role<span style={{ color: "red" }}>*</span></>}
                  placeholder="--Select--"
                  name="role"
                  style={style3}
                  options={roles}
                  value={formData?.employmentInformation?.role}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <SelectInput
                  label="Grade"
                  placeholder="--Select--"
                  name="grade"
                  style={style3}
                  options={grades}
                  value={formData?.employmentInformation?.grade}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <SelectInput
                  label="Marital Status"
                  placeholder="--Select--"
                  name="maritalStatus"
                  style={style3}
                  options={maritalStatuses}
                  value={formData?.employmentInformation?.maritalStatus}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <SelectInput
                  label="Highest Education Level"
                  placeholder="--Select--"
                  name="highestEducationLevel"
                  style={style3}
                  options={highestEducationLevels}
                  value={formData?.employmentInformation?.highestEducationLevel}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <SelectInput
                  label="Religion"
                  placeholder="--Select--"
                  name="religion"
                  style={style3}
                  options={religions}
                  value={formData?.employmentInformation?.religion}
                  onChangeText={(e) => handleChange(e, "employmentInformation")}
                />
              </Col>
            </Row>
          </div>

          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Legal Entity & Function Mapping Section */}
          {/* Legal Entity & Function Mapping Section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#837F39" }} text="LEGAL ENTITY & FUNCTION MAPPING" />
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
              <Col className="responsive-col">
                <TextInput
                  label="First Name"
                  name="firstName"
                  value={formData?.SpouseInformation?.firstName || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "SpouseInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Sur Name"
                  name="lastName"
                  value={formData?.SpouseInformation?.lastName || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "SpouseInformation")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Date of Birth"
                  dateType="date"
                  name="dateOfBirth"
                  value={formData?.SpouseInformation?.dateOfBirth ? window.moment(formData?.SpouseInformation?.dateOfBirth).format("YYYY-MM-DD") : ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "SpouseInformation")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Occupation"
                  name="Occupation"
                  value={formData?.SpouseInformation?.Occupation || ""}
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
            {formData?.ChildInformation && formData.ChildInformation.length > 0 && formData.ChildInformation.map((child, index) => (
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
                  <Col className="responsive-col">
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
                  <Col className="responsive-col">
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
                  <Col className="responsive-col">
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
                  <Col className="responsive-col">
                    <TextInput
                      label="Date of Birth"
                      dateType="date"
                      name="dateOfBirth"
                      value={child.dateOfBirth ? window.moment(child.dateOfBirth).format("YYYY-MM-DD") : ""}
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
              <Col className="responsive-col">
                <TextInput
                  label="Street/House Number"
                  name="streetHouseNumber"
                  value={formData?.PresentAddress?.streetHouseNumber || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Address Line 2"
                  name="addressLine2"
                  value={formData?.PresentAddress?.addressLine2 || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="City"
                  name="city"
                  value={formData?.PresentAddress?.city || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Postal Code"
                  name="postalCode"
                  value={formData?.PresentAddress?.postalCode || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Country"
                  name="country"
                  value={formData?.PresentAddress?.country || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Region/State"
                  name="regionState"
                  value={formData?.PresentAddress?.regionState || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="District"
                  name="district"
                  value={formData?.PresentAddress?.district || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Primary Emergency Contact"
                  name="primaryEmergencyContactNumber"
                  value={formData?.PresentAddress?.primaryEmergencyContactNumber || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Secondary Emergency Contact"
                  name="secondaryEmergencyContactNumber"
                  value={formData?.PresentAddress?.secondaryEmergencyContactNumber || ""}
                  style={style3}
                  onChangeText={(e) => handleChange(e, "PresentAddress")}
                />
              </Col>
              <Col className="responsive-col"></Col>
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
                  value={formData?.PermanentAddress?.streetHouseNumber || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Address Line 2"
                  name="addressLine2"
                  value={formData?.PermanentAddress?.addressLine2 || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="City"
                  name="city"
                  value={formData?.PermanentAddress?.city || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Postal Code"
                  name="postalCode"
                  value={formData?.PermanentAddress?.postalCode || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Country"
                  name="country"
                  value={formData?.PermanentAddress?.country || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Region/State"
                  name="regionState"
                  value={formData?.PermanentAddress?.regionState || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="District"
                  name="district"
                  value={formData?.PermanentAddress?.district || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Primary Emergency Contact"
                  name="primaryEmergencyContactNumber"
                  value={formData?.PermanentAddress?.primaryEmergencyContactNumber || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Secondary Emergency Contact"
                  name="secondaryEmergencyContactNumber"
                  value={formData?.PermanentAddress?.secondaryEmergencyContactNumber || ""}
                  style={style3}
                  disabled={sameAsPresentAddress}
                  onChangeText={(e) => handleChange(e, "PermanentAddress")}
                />
              </Col>
              <Col className="responsive-col"></Col>
            </Row>
          </div>

          <HorizontalBar className="pt-3 pb-3 responsive-hr" />

          {/* Resignation Section */}
          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "rgb(131, 127, 57)" }} text="RESIGNATION" />
          <div className="form-section">
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Current Approval Level"
                  name="currentApprovalLevel"
                  dateType="number"
                  value={formData?.resignation?.currentApprovalLevel ?? 0}
                  style={style3}
                  disabled={true}
                  onChangeText={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resignation: {
                        ...(prev.resignation || resignationDefault),
                        currentApprovalLevel: e.target.value,
                      },
                    }))
                  }
                />
              </Col>
              <Col className="responsive-col">
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
                  value={formData?.resignation?.overallStatus ?? "Pending"}
                  onChangeText={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      resignation: {
                        ...(prev.resignation || resignationDefault),
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
              {/* Aadhar Number */}
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Aadhar Number"
                  name="aadharNumber"
                  value={formData?.candidateInformation?.personalDetails?.aadharNumber}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "personalDetails")
                  }
                />
              </Grid>

              {/* Passport Number */}
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Passport Number"
                  name="passportNumber"
                  value={formData?.candidateInformation?.personalDetails?.passportNumber}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "personalDetails")
                  }
                />
              </Grid>

              {/* Driver License Number */}
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Driver License Number"
                  name="driverLicenseNumber"
                  value={formData?.candidateInformation?.personalDetails?.driverLicenseNumber}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "personalDetails")
                  }
                />
              </Grid>

              {/* Driver License Expiry */}
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Driver License Expiry"
                  dateType="date"
                  name="driverLicenseExpiry"
                  value={
                    formData?.candidateInformation?.personalDetails?.driverLicenseExpiry
                      ? window.moment(
                        formData?.candidateInformation?.personalDetails?.driverLicenseExpiry
                      ).format("YYYY-MM-DD")
                      : ""
                  }
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "personalDetails")
                  }
                />
              </Grid>

              {/* Driver License Period */}
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Driver License Period"
                  name="driverLicensePeriod"
                  value={formData?.candidateInformation?.personalDetails?.driverLicensePeriod}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "personalDetails")
                  }
                />
              </Grid>
            </Grid>
          </Box>

          <Text style={{ fontSize: "13px", fontWeight: 600, color: "rgb(131, 127, 57)" }} className="mt-3" text="Bank Details" />
          <div className="form-section">
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Account Number"
                  name="accountNumber"
                  value={formData?.candidateInformation?.bankDetails?.accountNumber}
                  style={style3}
                  onChangeText={(e) => handleNestedChange(e, "candidateInformation", "bankDetails")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="IFSC Code"
                  name="ifscCode"
                  value={formData?.candidateInformation?.bankDetails?.ifscCode}
                  style={style3}
                  onChangeText={(e) => handleNestedChange(e, "candidateInformation", "bankDetails")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Bank Name"
                  name="bankName"
                  value={formData?.candidateInformation?.bankDetails?.bankName}
                  style={style3}
                  onChangeText={(e) => handleNestedChange(e, "candidateInformation", "bankDetails")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Branch Name"
                  name="branchName"
                  value={formData?.candidateInformation?.bankDetails?.branchName}
                  style={style3}
                  onChangeText={(e) => handleNestedChange(e, "candidateInformation", "bankDetails")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Branch Address"
                  name="branchAddress"
                  value={formData?.candidateInformation?.bankDetails?.branchAddress}
                  style={style3}
                  onChangeText={(e) => handleNestedChange(e, "candidateInformation", "bankDetails")}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="City"
                  name="city"
                  value={formData?.candidateInformation?.bankDetails?.city}
                  style={style3}
                  onChangeText={(e) => handleNestedChange(e, "candidateInformation", "bankDetails")}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="State"
                  name="state"
                  value={formData?.candidateInformation?.bankDetails?.state}
                  style={style3}
                  onChangeText={(e) => handleNestedChange(e, "candidateInformation", "bankDetails")}
                />
              </Col>
            </Row>
          </div>

          <Text style={{ fontSize: "13px", fontWeight: 600, color: "rgb(131, 127, 57)" }} className="mt-3" text="Insurance Details" />
          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={6}>
                <SelectInput
                  label="Coverage For"
                  placeholder="--Select--"
                  name="coverageFor"
                  style={{ ...style3, width: "100%" }}
                  options={[
                    { key: "Self only", value: "self_only" },
                    { key: "Self + Family (Spouse + 2 Kids)", value: "self_family" },
                  ]}
                  value={formData?.candidateInformation?.insuranceDetails?.coverageFor}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "insuranceDetails")
                  }
                />
              </Grid>
            </Grid>
          </Box>

          {formData?.candidateInformation?.insuranceDetails?.coverageFor === "self_family" && (
            <div className="form-section">
              <Row className="mt-2 mb-2 p-2 responsive-row">
                <Col className="responsive-col">
                  <TextInput
                    label="Spouse Name"
                    name="spouseName"
                    value={formData?.candidateInformation?.insuranceDetails?.spouseName}
                    style={style3}
                    onChangeText={(e) => handleNestedChange(e, "candidateInformation", "insuranceDetails")}
                  />
                </Col>
                <Col className="responsive-col">
                  <TextInput
                    label="Spouse Date of Birth"
                    name="spouseDob"
                    dateType="date"
                    value={formData?.candidateInformation?.insuranceDetails?.spouseDob ? window.moment(formData?.candidateInformation?.insuranceDetails?.spouseDob).format("YYYY-MM-DD") : ""}
                    style={style3}
                    onChangeText={(e) => handleNestedChange(e, "candidateInformation", "insuranceDetails")}
                  />
                </Col>
              </Row>
              <Row className="mt-2 mb-2 p-2 responsive-row">
                <Col className="responsive-col">
                  <TextInput
                    label="Child 1 Name"
                    name="child1Name"
                    value={formData?.candidateInformation?.insuranceDetails?.child1Name}
                    style={style3}
                    onChangeText={(e) => handleNestedChange(e, "candidateInformation", "insuranceDetails")}
                  />
                </Col>
                <Col className="responsive-col">
                  <TextInput
                    label="Child 1 Date of Birth"
                    name="child1Dob"
                    dateType="date"
                    value={formData?.candidateInformation?.insuranceDetails?.child1Dob ? window.moment(formData?.candidateInformation?.insuranceDetails?.child1Dob).format("YYYY-MM-DD") : ""}
                    style={style3}
                    onChangeText={(e) => handleNestedChange(e, "candidateInformation", "insuranceDetails")}
                  />
                </Col>
              </Row>
              <Row className="mt-2 mb-2 p-2 responsive-row">
                <Col className="responsive-col">
                  <TextInput
                    label="Child 2 Name"
                    name="child2Name"
                    value={formData?.candidateInformation?.insuranceDetails?.child2Name}
                    style={style3}
                    onChangeText={(e) => handleNestedChange(e, "candidateInformation", "insuranceDetails")}
                  />
                </Col>
                <Col className="responsive-col">
                  <TextInput
                    label="Child 2 Date of Birth"
                    name="child2Dob"
                    dateType="date"
                    value={formData?.candidateInformation?.insuranceDetails?.child2Dob ? window.moment(formData?.candidateInformation?.insuranceDetails?.child2Dob).format("YYYY-MM-DD") : ""}
                    style={style3}
                    onChangeText={(e) => handleNestedChange(e, "candidateInformation", "insuranceDetails")}
                  />
                </Col>
              </Row>
            </div>
          )}

          <Text style={{ fontSize: "13px", fontWeight: 600, color: "rgb(131, 127, 57)" }} className="mt-3" text="Interviews & Reporting" />
          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Interviewer 1 Name"
                  name="name"
                  value={formData?.candidateInformation?.interviewer1?.name}
                  style={style3}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer1")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Interviewer 1 Email"
                  name="email"
                  value={formData?.candidateInformation?.interviewer1?.email}
                  style={style3}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer1")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Interviewer 1 ID"
                  name="id"
                  value={formData?.candidateInformation?.interviewer1?.id}
                  style={style3}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer1")
                  }
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} className="responsive-grid mt-3">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Interviewer 2 Name"
                  name="name"
                  value={formData?.candidateInformation?.interviewer2?.name}
                  style={style3}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer2")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Interviewer 2 Email"
                  name="email"
                  value={formData?.candidateInformation?.interviewer2?.email}
                  style={style3}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer2")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Interviewer 2 ID"
                  name="id"
                  value={formData?.candidateInformation?.interviewer2?.id}
                  style={style3}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer2")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Feedback ID"
                  name="feedbackId"
                  value={formData?.candidateInformation?.interviewer2?.feedbackId}
                  style={style3}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "interviewer2")
                  }
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} className="responsive-grid mt-3">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Reporting Manager Name"
                  name="name"
                  value={formData?.candidateInformation?.reportingManager?.name}
                  style={style3}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "reportingManager")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Reporting Manager Email"
                  name="email"
                  value={formData?.candidateInformation?.reportingManager?.email}
                  style={style3}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "reportingManager")
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Reporting Manager ID"
                  name="id"
                  value={formData?.candidateInformation?.reportingManager?.id}
                  style={style3}
                  onChangeText={(e) =>
                    handleNestedChange(e, "candidateInformation", "reportingManager")
                  }
                />
              </Grid>
            </Grid>
          </Box>

          <Text style={{ fontSize: "13px", fontWeight: 600, color: "rgb(131, 127, 57)" }} className="mt-3" text="Offer & Other Details" />
          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Project Name"
                  name="projectName"
                  value={formData?.candidateInformation?.projectName}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Original Candidate ID"
                  name="originalCandidateId"
                  value={formData?.candidateInformation?.originalCandidateId}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Source"
                  name="source"
                  value={formData?.candidateInformation?.source}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
            </Grid>
          </Box>

          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Applied On"
                  name="appliedOn"
                  dateType="date"
                  value={
                    formData?.candidateInformation?.appliedOn
                      ? window.moment(formData?.candidateInformation?.appliedOn).format("YYYY-MM-DD")
                      : ""
                  }
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Offer Letter Date"
                  name="offerLetterDate"
                  dateType="date"
                  value={
                    formData?.candidateInformation?.offerLetterDate
                      ? window.moment(formData?.candidateInformation?.offerLetterDate).format("YYYY-MM-DD")
                      : ""
                  }
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CheckboxInput
                  className="checkBox responsive-checkbox"
                  label="Show Offer Letter"
                  name="showOfferLetter"
                  value={formData?.candidateInformation?.showOfferLetter}
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

          <Box className="mt-2 mb-2 p-2 responsive-box">
            <Grid container spacing={2} className="responsive-grid">
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Experience"
                  name="experience"
                  value={formData?.candidateInformation?.experience}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Gross Salary"
                  name="grossSalary"
                  dateType="number"
                  value={formData?.candidateInformation?.grossSalary}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Notice Period (days)"
                  name="noticePeriod"
                  dateType="number"
                  value={formData?.candidateInformation?.noticePeriod}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  label="Probation Period (days)"
                  name="probationPeriod"
                  dateType="number"
                  value={formData?.candidateInformation?.probationPeriod}
                  style={{ ...style3, width: "100%" }}
                  onChangeText={handleCandidateInfoChange}
                />
              </Grid>
            </Grid>
          </Box>

          <Text style={{ fontSize: "13px", fontWeight: 600, color: "rgb(131, 127, 57)" }} className="mt-3" text="Resume & Documents" />
          <div className="form-section">
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Resume URL"
                  name="resume"
                  value={formData?.candidateInformation?.resume}
                  style={style3}
                  onChangeText={handleCandidateInfoChange}
                />
                {formData?.candidateInformation?.resume && (
                  <div className="mt-1">
                    <span style={{ marginRight: 8 }}>Resume:</span>
                    <a href={formData?.candidateInformation?.resume} target="_blank" rel="noreferrer">Click here</a>
                  </div>
                )}
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Document URLs (comma separated)"
                  name="documentDetails"
                  value={formData?.candidateInformation?.documentDetails?.join(", ")}
                  style={style3}
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
                {Array.isArray(formData?.candidateInformation?.documentDetails) &&
                  formData?.candidateInformation?.documentDetails?.length > 0 && (
                    <div className="mt-1">
                      {formData?.candidateInformation?.documentDetails?.map((url, idx) => (
                        <div key={idx}>
                          <span style={{ marginRight: 8 }}>Document {idx + 1}:</span>
                          <a href={url} target="_blank" rel="noreferrer">Click here</a>
                        </div>
                      ))}
                    </div>
                  )}
              </Col>
            </Row>
          </div>

          <Text style={{ fontSize: "13px", fontWeight: 600, color: "rgb(131, 127, 57)" }} className="mt-3" text="References" />
          <div className="form-section">
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Reference 1 Name"
                  name="name"
                  value={formData?.candidateInformation?.references?.[0]?.name}
                  style={style3}
                  onChangeText={(e) => handleArrayNestedChange(e, "candidateInformation", "references", 0)}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Reference 1 Email"
                  name="email"
                  value={formData?.candidateInformation?.references?.[0]?.email}
                  style={style3}
                  onChangeText={(e) => handleArrayNestedChange(e, "candidateInformation", "references", 0)}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Reference 1 Phone"
                  name="phone"
                  value={formData?.candidateInformation?.references?.[0]?.phone}
                  style={style3}
                  onChangeText={(e) => handleArrayNestedChange(e, "candidateInformation", "references", 0)}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2 p-2 responsive-row">
              <Col className="responsive-col">
                <TextInput
                  label="Reference 2 Name"
                  name="name"
                  value={formData?.candidateInformation?.references?.[1]?.name}
                  style={style3}
                  onChangeText={(e) => handleArrayNestedChange(e, "candidateInformation", "references", 1)}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Reference 2 Email"
                  name="email"
                  value={formData?.candidateInformation?.references?.[1]?.email}
                  style={style3}
                  onChangeText={(e) => handleArrayNestedChange(e, "candidateInformation", "references", 1)}
                />
              </Col>
              <Col className="responsive-col">
                <TextInput
                  label="Reference 2 Phone"
                  name="phone"
                  value={formData?.candidateInformation?.references?.[1]?.phone}
                  style={style3}
                  onChangeText={(e) => handleArrayNestedChange(e, "candidateInformation", "references", 1)}
                />
              </Col>
            </Row>
          </div>

          {/* Buttons Section */}
          {canEdit() && (
            <div className="responsive-buttons">
              <Link to="/admin/setups/employees">
                <Button text="Cancel" className="bg-white responsive-button" style={{ border: "1px solid #837F39" }} />
              </Link>
              <Button
                text="Update"
                className="responsive-button"
                style={{ backgroundColor: "#837F39", color: "white" }}
                handleClick={handleSave}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}