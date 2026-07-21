import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, IconButton, Checkbox, FormControlLabel } from "@mui/material";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";

const PersonalDetails = ({ data = {}, onChange }) => {
  const [childInfoList, setChildInfoList] = useState(
    data.childInfoList && data.childInfoList.length > 0
      ? data.childInfoList
      : [{ firstName: "", lastName: "", gender: "", dateOfBirth: "" }]
  );
  const [sameAsPresentAddress, setSameAsPresentAddress] = useState(false);

  // Helper function to check if present and permanent addresses match
  const checkIfAddressesMatch = (currentData) => {
    const presentFields = [
      "presentStreetHouseNumber",
      "presentAddressLine2",
      "presentCity",
      "presentPostalCode",
      "presentCountry",
      "presentRegionState",
      "presentDistrict",
      "presentPrimaryEmergencyContact",
      "presentSecondaryEmergencyContact",
    ];
    
    const permanentFields = [
      "permanentStreetHouseNumber",
      "permanentAddressLine2",
      "permanentCity",
      "permanentPostalCode",
      "permanentCountry",
      "permanentRegionState",
      "permanentDistrict",
      "permanentPrimaryEmergencyContact",
      "permanentSecondaryEmergencyContact",
    ];
    
    // Check if all fields match and at least one field has a value
    const allMatch = presentFields.every((field, index) => {
      const presentValue = currentData[field] || "";
      const permanentValue = currentData[permanentFields[index]] || "";
      return presentValue === permanentValue;
    });
    
    // Also check if at least one field has a value (to avoid auto-checking when both are empty)
    const hasAtLeastOneValue = presentFields.some(field => {
      const value = currentData[field] || "";
      return value.trim() !== "";
    });
    
    return allMatch && hasAtLeastOneValue;
  };

  useEffect(() => {
    if (data.childInfoList && data.childInfoList.length > 0) {
      setChildInfoList(data.childInfoList);
    }
  }, [data.childInfoList]);

  // Check if permanent address matches present address whenever data changes
  useEffect(() => {
    const addressesMatch = checkIfAddressesMatch(data);
    if (addressesMatch && !sameAsPresentAddress) {
      setSameAsPresentAddress(true);
    } else if (!addressesMatch && sameAsPresentAddress) {
      // Only uncheck if user manually changed something (not if we just unchecked)
      // This prevents flickering
    }
  }, [data]);

  const formFields = [
    {
      id: "aadharNumber",
      label: "Aadhar Number",
      type: "text",
      component: "input",
    },
    {
      id: "driverLicenseNumber",
      label: "Driver License Number",
      type: "text",
      component: "input",
    },
    {
      id: "driverLicenseExpiry",
      label: "Driver License Expiry",
      type: "date",
      component: "input",
    },
    {
      id: "driverLicensePeriod",
      label: "Driver License Period",
      type: "text",
      component: "input",
    },
    {
      id: "passportNumber",
      label: "Passport Number",
      type: "text",
      component: "input",
    },
  ];

  const spouseFields = [
    {
      id: "spouseFirstName",
      label: "First Name",
      type: "text",
      component: "input",
      required: true,
    },
    {
      id: "spouseSurName",
      label: "Sur Name",
      type: "text",
      component: "input",
    },
    {
      id: "spouseDateOfBirth",
      label: "Date of Birth",
      type: "date",
      component: "input",
      required: true,
    },
    {
      id: "spouseOccupation",
      label: "Occupation",
      type: "text",
      component: "input",
    },
  ];

  const presentAddressFields = [
    {
      id: "presentStreetHouseNumber",
      label: "Street & House Number",
      type: "text",
      component: "input",
    },
    {
      id: "presentAddressLine2",
      label: "Address Line 2",
      type: "text",
      component: "input",
    },
    {
      id: "presentCity",
      label: "City",
      type: "text",
      component: "input",
    },
    {
      id: "presentPostalCode",
      label: "Postal Code",
      type: "text",
      component: "input",
    },
    {
      id: "presentCountry",
      label: "Country",
      type: "text",
      component: "input",
    },
    {
      id: "presentRegionState",
      label: "Region/State",
      type: "text",
      component: "input",
    },
    {
      id: "presentDistrict",
      label: "District",
      type: "text",
      component: "input",
    },
    {
      id: "presentPrimaryEmergencyContact",
      label: "Primary Emergency Contact Number",
      type: "text",
      component: "input",
    },
    {
      id: "presentSecondaryEmergencyContact",
      label: "Secondary Emergency Contact Number",
      type: "text",
      component: "input",
    },
  ];

  const permanentAddressFields = [
    {
      id: "permanentStreetHouseNumber",
      label: "Street & House Number",
      type: "text",
      component: "input",
    },
    {
      id: "permanentAddressLine2",
      label: "Address Line 2",
      type: "text",
      component: "input",
    },
    {
      id: "permanentCity",
      label: "City",
      type: "text",
      component: "input",
    },
    {
      id: "permanentPostalCode",
      label: "Postal Code",
      type: "text",
      component: "input",
    },
    {
      id: "permanentCountry",
      label: "Country",
      type: "text",
      component: "input",
    },
    {
      id: "permanentRegionState",
      label: "Region/State",
      type: "text",
      component: "input",
    },
    {
      id: "permanentDistrict",
      label: "District",
      type: "text",
      component: "input",
    },
    {
      id: "permanentPrimaryEmergencyContact",
      label: "Primary Emergency Contact Number",
      type: "text",
      component: "input",
    },
    {
      id: "permanentSecondaryEmergencyContact",
      label: "Secondary Emergency Contact Number",
      type: "text",
      component: "input",
    },
  ];

  const genders = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const handleChange = (name, value) => {
    if (onChange) {
      onChange({
        target: {
          name,
          value,
        },
      });
    }
    
    // If same as present address is checked and present address field is changed, update permanent address
    if (sameAsPresentAddress && name.startsWith("present")) {
      const permanentFieldName = name.replace("present", "permanent");
      if (onChange) {
        onChange({
          target: {
            name: permanentFieldName,
            value,
          },
        });
      }
    }
    
    // Check if addresses match after a short delay to allow parent state to update
    if ((name.startsWith("present") || name.startsWith("permanent")) && !sameAsPresentAddress) {
      setTimeout(() => {
        const updatedData = { ...data, [name]: value };
        if (checkIfAddressesMatch(updatedData)) {
          setSameAsPresentAddress(true);
        }
      }, 50);
    }
  };

  const handleSameAsPresentAddressChange = (event) => {
    const isChecked = event.target.checked;
    setSameAsPresentAddress(isChecked);
    
    if (isChecked) {
      // Copy all present address fields to permanent address
      const presentToPermanentMap = {
        presentStreetHouseNumber: "permanentStreetHouseNumber",
        presentAddressLine2: "permanentAddressLine2",
        presentCity: "permanentCity",
        presentPostalCode: "permanentPostalCode",
        presentCountry: "permanentCountry",
        presentRegionState: "permanentRegionState",
        presentDistrict: "permanentDistrict",
        presentPrimaryEmergencyContact: "permanentPrimaryEmergencyContact",
        presentSecondaryEmergencyContact: "permanentSecondaryEmergencyContact",
      };
      
      Object.entries(presentToPermanentMap).forEach(([presentField, permanentField]) => {
        if (onChange && data[presentField]) {
          onChange({
            target: {
              name: permanentField,
              value: data[presentField],
            },
          });
        }
      });
    }
  };

  const handleAddChild = () => {
    const newChild = { firstName: "", lastName: "", gender: "", dateOfBirth: "" };
    const updatedList = [...childInfoList, newChild];
    setChildInfoList(updatedList);
    if (onChange) {
      onChange({
        target: {
          name: "childInfoList",
          value: updatedList,
        },
      });
    }
  };

  const handleRemoveChild = (index) => {
    const updatedList = childInfoList.filter((_, i) => i !== index);
    setChildInfoList(updatedList);
    if (onChange) {
      onChange({
        target: {
          name: "childInfoList",
          value: updatedList,
        },
      });
    }
  };

  const handleChildInputChange = (index, field, value) => {
    const updatedList = [...childInfoList];
    updatedList[index][field] = value;
    setChildInfoList(updatedList);
    if (onChange) {
      onChange({
        target: {
          name: "childInfoList",
          value: updatedList,
        },
      });
    }
  };

  return (
    <Box
      sx={{
padding:"1rem",
        borderRadius: "16px",
        paddingBottom: "10px",
        backgroundColor: "#fff",
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
      Personal Details
      </Typography>
      <Box
        sx={{
          paddingBottom: "70px",
          margin: "1rem",
          bgcolor: "#fff",
          padding: ".5rem",
          borderRadius: "1.5rem",
        }}
      >
        <Grid container spacing={2}>
          {formFields.map((field) => (
            <Grid item xs={12} md={6} key={field.id}>
              {field.component === "input" ? (
                <InputTextComponent
                  id={field.id}
                  label={field.label}
                  type={field.type}
                  value={data[field.id] || ""}
                  onChange={(event) => {
                    console.log("value ----", event.target.value);
                    handleChange(field.id, event.target.value);
                  }}
                  required={field.required || false}
                  {...(field.id === "address" && {
                    multiline: true,
                    minRows: 5,
                  })}
                />
              ) : (
                <SelectComponent
                  id={field.id}
                  label={field.label}
                  value={data[field.id] || ""}
                  onChange={(event) =>
                    handleChange(field.id, event.target.value)
                  }
                  options={field.options || []}
                  required={field.required || false}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Spouse Information Section */}
      <Typography
        sx={{
          fontSize: "32px",
          fontWeight: "600",
          fontFamily: `"Montserrat"`,
          color: "#0E0E0E",
          marginTop: "2rem",
        }}
      >
        Spouse Information
      </Typography>
      <Box
        sx={{
          paddingBottom: "70px",
          margin: "1rem",
          bgcolor: "#fff",
          padding: ".5rem",
          borderRadius: "1.5rem",
        }}
      >
        <Grid container spacing={2}>
          {spouseFields.map((field) => (
            <Grid item xs={12} md={6} key={field.id}>
              {field.component === "input" ? (
                <InputTextComponent
                  id={field.id}
                  label={field.label}
                  type={field.type}
                  value={data[field.id] || ""}
                  onChange={(event) => {
                    console.log("value ----", event.target.value);
                    handleChange(field.id, event.target.value);
                  }}
                  required={field.required || false}
                />
              ) : (
                <SelectComponent
                  id={field.id}
                  label={field.label}
                  value={data[field.id] || ""}
                  onChange={(event) =>
                    handleChange(field.id, event.target.value)
                  }
                  options={field.options || []}
                  required={field.required || false}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Child Information Section */}
      <Typography
        sx={{
          fontSize: "32px",
          fontWeight: "600",
          fontFamily: `"Montserrat"`,
          color: "#0E0E0E",
          marginTop: "2rem",
        }}
      >
        Child Information
      </Typography>
      <Box
        sx={{
          paddingBottom: "70px",
          margin: "1rem",
          bgcolor: "#fff",
          padding: ".5rem",
          borderRadius: "1.5rem",
        }}
      >
        {/* Add Child Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <IconButton onClick={handleAddChild} sx={{ color: "#837F39" }}>
            <IoMdAddCircle size={35} />
          </IconButton>
        </Box>

        {/* Render multiple child sections */}
        {childInfoList.map((child, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            {/* Remove button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                onClick={() => handleRemoveChild(index)}
                sx={{ color: "red" }}
              >
                <IoMdRemoveCircle size={28} />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              {/* First Name */}
              <Grid item xs={12} md={6}>
                <InputTextComponent
                  id={`child-firstName-${index}`}
                  label="First Name"
                  type="text"
                  value={child.firstName || ""}
                  onChange={(event) =>
                    handleChildInputChange(index, "firstName", event.target.value)
                  }
                  required={true}
                />
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} md={6}>
                <InputTextComponent
                  id={`child-lastName-${index}`}
                  label="Last Name"
                  type="text"
                  value={child.lastName || ""}
                  onChange={(event) =>
                    handleChildInputChange(index, "lastName", event.target.value)
                  }
                  required={true}
                />
              </Grid>

              {/* Gender */}
              <Grid item xs={12} md={6}>
                <SelectComponent
                  id={`child-gender-${index}`}
                  label="Gender"
                  value={child.gender || ""}
                  onChange={(event) =>
                    handleChildInputChange(index, "gender", event.target.value)
                  }
                  options={genders}
                />
              </Grid>

              {/* Date of Birth */}
              <Grid item xs={12} md={6}>
                <InputTextComponent
                  id={`child-dateOfBirth-${index}`}
                  label="Date of Birth"
                  type="date"
                  value={child.dateOfBirth || ""}
                  onChange={(event) =>
                    handleChildInputChange(index, "dateOfBirth", event.target.value)
                  }
                  required={true}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>

      {/* Present Address for correspondence Section */}
      <Typography
        sx={{
          fontSize: "32px",
          fontWeight: "600",
          fontFamily: `"Montserrat"`,
          color: "#0E0E0E",
          marginTop: "2rem",
        }}
      >
        Present Address for correspondence
      </Typography>
      <Box
        sx={{
          paddingBottom: "70px",
          margin: "1rem",
          bgcolor: "#fff",
          padding: ".5rem",
          borderRadius: "1.5rem",
        }}
      >
        <Grid container spacing={2}>
          {presentAddressFields.map((field) => (
            <Grid item xs={12} md={6} key={field.id}>
              {field.component === "input" ? (
                <InputTextComponent
                  id={field.id}
                  label={field.label}
                  type={field.type}
                  value={data[field.id] || ""}
                  onChange={(event) => {
                    console.log("value ----", event.target.value);
                    handleChange(field.id, event.target.value);
                  }}
                  required={field.required || false}
                />
              ) : (
                <SelectComponent
                  id={field.id}
                  label={field.label}
                  value={data[field.id] || ""}
                  onChange={(event) =>
                    handleChange(field.id, event.target.value)
                  }
                  options={field.options || []}
                  required={field.required || false}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Permanent Address for correspondence Section */}
      <Typography
        sx={{
          fontSize: "32px",
          fontWeight: "600",
          fontFamily: `"Montserrat"`,
          color: "#0E0E0E",
          marginTop: "2rem",
        }}
      >
        Permanent Address for correspondence
      </Typography>
      <Box
        sx={{
          paddingBottom: "70px",
          margin: "1rem",
          bgcolor: "#fff",
          padding: ".5rem",
          borderRadius: "1.5rem",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={sameAsPresentAddress}
                onChange={handleSameAsPresentAddressChange}
                sx={{
                  color: "#837F39",
                  "&.Mui-checked": {
                    color: "#837F39",
                  },
                }}
              />
            }
            label="Same as Present Address"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontFamily: "Work Sans",
                fontSize: "16px",
                fontWeight: "500",
              },
            }}
          />
        </Box>
        <Grid container spacing={2}>
          {permanentAddressFields.map((field) => (
            <Grid item xs={12} md={6} key={field.id}>
              {field.component === "input" ? (
                <InputTextComponent
                  id={field.id}
                  label={field.label}
                  type={field.type}
                  value={data[field.id] || ""}
                  onChange={(event) => {
                    console.log("value ----", event.target.value);
                    handleChange(field.id, event.target.value);
                  }}
                  required={field.required || false}
                  disabled={sameAsPresentAddress}
                />
              ) : (
                <SelectComponent
                  id={field.id}
                  label={field.label}
                  value={data[field.id] || ""}
                  onChange={(event) =>
                    handleChange(field.id, event.target.value)
                  }
                  options={field.options || []}
                  required={field.required || false}
                  disabled={sameAsPresentAddress}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default PersonalDetails;
