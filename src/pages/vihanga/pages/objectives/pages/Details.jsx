import React, { useState } from "react";
import FileUpload from "../../../components/filesUplode/draganddropFile";
import { Box, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Stepper from "pages/vihanga/components/stepper";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import BellCurveChart from "./Graph";
const Details = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [{ label: "Objective" }, { label: "KR" }, { label: "Task" }];

  return (
    <>
      <Box
        sx={{
          width: "100%",
          margin: "20px",
          paddingBottom: "10px",
          borderRadius: "16px",
          backgroundColor: "#fff", // Optional: gives a clean look
          boxShadow: 1, // Optional: subtle shadow
        }}
      >
        <Stepper
          steps={steps || []}
          activeStep={activeStep}
          stepIconColor="#837F39"
          connectorColor="#9E9E9E"
          onStepClick={(stepIndex) => setActiveStep(stepIndex)}
          sx={{
            width: "fit-content",
            mx: "auto",
            gap: "20px",
          }}
        />
      </Box>
      <div
        className="card p-3"
        style={{
          // maxWidth: "1200px",
          width: "100%",
          borderRadius: "20px",
          margin: "20px",
        }}
      >
  
        {/* Header */}
        <div className="d-flex align-items-center mb-3">
          <Typography
            sx={{
              fontSize: "32px",
              fontWeight: "700",
              fontStyle: "Montserrat",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "30px",
            }}
            gutterBottom
          >
            <ArrowBackIosIcon
              sx={{
                fontSize: "32px",
                fontStyle: "Montserrat",
                fontWeight: "700",
                marginTop: "-4px",
              }}
            />
            OKR Details
          </Typography>
        </div>
        <p className="text-muted">OKR Name</p>
        <p className="text-muted">
          organizations to provide access to education...
        </p>

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="alignedCheck"
          />
          <label
            className="form-check-label fw-semibold"
            htmlFor="alignedCheck"
            style={{ color: "rgba(131, 127, 57, 1)" }}
          >
            Aligned to company objective
          </label>
          <div
            style={{
              borderBottom: "1px solid rgba(190, 168, 129, 1)",
              width: "100%",
              margin: "20px 0",
              marginTop: "25px",
              // maxWidth: "1200px",
            }}
          />
        </div>

        <p
          style={{
            fontSize: "32px",
            fontStyle: "Montserrat",
            fontWeight: "700",
            marginBottom: "3px",
          }}
        >
          Add KR
        </p>

        <div className="mb-3">
          <label htmlFor="krName" className="form-label">
            Key Result Name
          </label>
          {/* <input
            type="text"
            className="form-control form-control-custom"
            id="krName"
            placeholder="Enter key result name"
          /> */}
          <InputTextComponent />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Status</label>
            <SelectComponent />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">KPIs</label>
            <SelectComponent />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Unit of Measurement</label>
            <SelectComponent />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label d-block mb-3">Polarity</label>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input custom-olive"
                type="radio"
                name="polarity"
                id="positive"
                value="positive"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="positive">
                Positive
              </label>
            </div>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input custom-olive"
                type="radio"
                name="polarity"
                id="negative"
                value="negative"
              />
              <label className="form-check-label" htmlFor="negative">
                Negative
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="targetResult" className="form-label">
              Target Result
            </label>
            <InputTextComponent />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="actualResult" className="form-label">
              Actual Result
            </label>
            <InputTextComponent />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="targetDate" className="form-label">
              Target Date
            </label>
            <InputTextComponent type="date" />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="completionDate" className="form-label">
              Completion Date
            </label>
            <InputTextComponent type="date" />
          </div>
        </div>

        <Box>
          <p
            className="fw-medium mt-3"
            style={{ color: "rgba(14, 14, 14, 1)" }}
          >
            Upload File
          </p>
          <FileUpload 
          id="kr-upload"
          sx={{ width: "100%" }} />
        </Box>

        <div
          className="d-flex justify-content-center mt-4"
          style={{ gap: "10px" }}
        >
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: "#fff",
              color: "#73712A",
              padding: "12px 30px",
              border: "1px solid #73712A",
              borderRadius: "30px",
              fontWeight: "bold",
            }}
          >
            Save Details
          </button>
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: "#73712A",
              color: "white",
              padding: "12px 30px",
              border: "none",
              borderRadius: "30px",
              fontWeight: "bold",
            }}
          >
            Add Task
          </button>
        </div>

        <style>
          {`
          .form-control-custom {
            border: 1px solid rgba(233, 234, 236, 1);
            border-radius: 6px;
            height: 40px;
            font-size: 14px;
          }

          input[type="radio"].custom-olive {
            accent-color: rgba(131, 127, 57, 1);
          }

          input[type="radio"].custom-olive:checked {
            background-color: rgba(131, 127, 57, 1);
            border-color: rgba(131, 127, 57, 1);
          }
        `}
        </style>
      </div>
    </>
  );
};

export default Details;
