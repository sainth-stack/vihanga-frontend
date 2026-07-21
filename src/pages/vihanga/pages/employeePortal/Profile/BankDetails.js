import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";

const BankDetails = ({ data = {}, onChange }) => {
  const bankOptions = [
    { label: "State Bank of India", value: "sbi" },
    { label: "HDFC Bank", value: "hdfc" },
    { label: "ICICI Bank", value: "icici" },
    { label: "Axis Bank", value: "axis" },
    { label: "Punjab National Bank", value: "pnb" },
    { label: "Bank of Baroda", value: "bob" },
    { label: "Canara Bank", value: "canara" },
    { label: "Union Bank of India", value: "union" },
    { label: "Bank of India", value: "boi" },
    { label: "Indian Bank", value: "indian" },
    { label: "Central Bank of India", value: "central" },
    { label: "Kotak Mahindra Bank", value: "kotak" },
    { label: "IndusInd Bank", value: "indusind" },
    { label: "Yes Bank", value: "yes" },
    { label: "IDFC First Bank", value: "idfc" },
    { label: "Federal Bank", value: "federal" },
    { label: "South Indian Bank", value: "sib" },
    { label: "Karnataka Bank", value: "karnataka" },
    { label: "City Union Bank", value: "cub" },
    { label: "IDBI Bank", value: "idbi" },
  ];

  const formFields = [
    {
      id: "accountNumber",
      label: "Account Number",
      type: "text",
      component: "input",
      required:true
    },
    {
      id: "ifscCode",
      label: "IFSC Code",
      type: "text",
      component: "input",
      required:true

    },

    {
      id: "bankName",
      label: "Bank Name",
      component: "select",
      options: bankOptions,
      required:true

    },
    {
      id: "branchName",
      label: "Branch Name",
      type: "text",
      component: "input",
    },
    {
      id: "branchAddress",
      label: "Branch Address",
      type: "text",
      component: "input",
    },
    {
      id: "city",
      label: "City",
      type: "text",
      component: "input",
    },
    {
      id: "state",
      label: "State",
      type: "text",
      component: "input",
    },
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
};

  return (
    <>
      <Box
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
          Bank Details
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
                    required={field?.required}
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
                    required={field?.required}

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
      </Box>
    </>
  );
};

export default BankDetails;
