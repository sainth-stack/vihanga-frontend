import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";

const FamilyInformation = ({ data = {}, onChange }) => {
  

  const maritalStatusOptions = [
    { label: "Single", value: "single" },
    { label: "Married", value: "married" },
    { label: "Divorced", value: "divorced" },
    { label: "Widowed", value: "widowed" },
    { label: "Separated", value: "separated" },
  ];

  // Insurance select options
  const insuranceTypeOptions = [
    { label: "Health Insurance", value: "health" },
    { label: "Life Insurance", value: "life" },
    { label: "Accidental Insurance", value: "accidental" },
    { label: "Dental Insurance", value: "dental" },
    { label: "Vision Insurance", value: "vision" },
    { label: "Other", value: "other" },
  ];

  const nomineeRelationshipOptions = [
    { label: "Spouse", value: "spouse" },
    { label: "Parent", value: "parent" },
    { label: "Child", value: "child" },
    { label: "Sibling", value: "sibling" },
    { label: "Other", value: "other" },
  ];

  const coverageForOptions = [
    { label: "Self only", value: "self_only" },
    { label: "Self + Family (Spouse + 2 Kids)", value: "self_family" },
  ];

  const formFields = [
    // {
    //   id: "maritalStatus",
    //   label: "Marital Status",
    //   component: "select",
    //   options: maritalStatusOptions,
    // },
  ];

  // Removed other insurance fields as per requirement; only collecting coverageFor and spouse/kids details


  const handleChange = (name, value) => {
    if (onChange) {
      onChange({
        target: {
          name,
          value,
        },
      });
    }
  };

  return (
    <>
      {/* <Box
        sx={{
          padding: "1rem",

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
          Family Information
        </Typography>
        <Box
          sx={{
            paddingBottom: "70px",
            bgcolor: "#fff",
            padding: ".5rem",
            borderRadius: "1.5rem",
            // height: "100vh",
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
                    onChange={(event) => {
                      console.log("value ----", event.target.value);
                      handleChange(field.id, event.target.value);
                    }}
                    options={field.options || []}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box> */}

      {/* Insurance Information Section */}
      <Box
        sx={{
          padding: "1rem",
          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
          mt: 2,
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
          Insurance Information
        </Typography>
        <Box
          sx={{
            paddingBottom: "70px",
            bgcolor: "#fff",
            padding: ".5rem",
            borderRadius: "1.5rem",
          }}
        >
         <Grid item xs={12}  md={6} >
              <SelectComponent
                id="coverageFor"
                label="Coverage For"
                value={data["coverageFor"] || ""}
                options={coverageForOptions}
                onChange={(event) => {
                  handleChange("coverageFor", event.target.value);
                }}
              />
            </Grid>
          <Grid container spacing={2}>
            {/* Coverage For selection */}
           

            {/* Spouse and children details when family coverage selected */}
            {data["coverageFor"] === "self_family" && (
              <>
                <Grid item xs={12} md={6}>
                  <InputTextComponent
                    id="spouseName"
                    label="Spouse Name"
                    type="text"
                    value={data["spouseName"] || ""}
                    onChange={(event) => {
                      handleChange("spouseName", event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputTextComponent
                    id="spouseDob"
                    label="Spouse Date of Birth"
                    type="date"
                    value={data["spouseDob"] || ""}
                    onChange={(event) => {
                      handleChange("spouseDob", event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputTextComponent
                    id="child1Name"
                    label="Child 1 Name"
                    type="text"
                    value={data["child1Name"] || ""}
                    onChange={(event) => {
                      handleChange("child1Name", event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputTextComponent
                    id="child1Dob"
                    label="Child 1 Date of Birth"
                    type="date"
                    value={data["child1Dob"] || ""}
                    onChange={(event) => {
                      handleChange("child1Dob", event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputTextComponent
                    id="child2Name"
                    label="Child 2 Name"
                    type="text"
                    value={data["child2Name"] || ""}
                    onChange={(event) => {
                      handleChange("child2Name", event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputTextComponent
                    id="child2Dob"
                    label="Child 2 Date of Birth"
                    type="date"
                    value={data["child2Dob"] || ""}
                    onChange={(event) => {
                      handleChange("child2Dob", event.target.value);
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default FamilyInformation;
