import React from "react";
import {
  Stepper as MuiStepper,
  Step as MuiStep,
  StepLabel as MuiStepLabel,
  StepConnector,
  Grid,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Stepper = ({
  steps,
  activeStep,
  orientation = "horizontal",
  alternativeLabel = true,
  connectorColor = "#9F9F9F",
  stepIconColor = "#BEA781",
  stepIconSize = 30,
  stepIconBorderWidth = 2,
  connectorHeight = 45,
  labelPosition = "top",
  onStepClick,
  sx = {},
}) => {
  const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
    "& .MuiStepConnector-line": {
      borderColor: connectorColor,
      borderTopWidth: stepIconBorderWidth,
      marginTop: connectorHeight,
      borderTop: `4px solid ${connectorColor}`,
      borderRadius: "2px",
    },
  }));

  const CustomStepIconRoot = styled("div")(({ ownerState }) => ({
    width: stepIconSize,
    height: stepIconSize,
    borderRadius: "50%",
    border: `${stepIconBorderWidth}px solid ${
      ownerState.active || ownerState.completed
        ? stepIconColor
        : connectorColor
    }`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: onStepClick ? "pointer" : "default",
    outline: "none",

    "&:focus-visible": {
      boxShadow: "0 0 0 3px rgba(0,0,0,0.35)",
    },

    "&::after": {
      content: '""',
      width: stepIconSize - 8,
      height: stepIconSize - 8,
      borderRadius: "50%",
      backgroundColor:
        ownerState.active || ownerState.completed
          ? stepIconColor
          : connectorColor,
    },
  }));

  const CustomStepIcon = ({ active, completed, index }) => {
    const handleKeyDown = (e) => {
      if (onStepClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onStepClick(index);
      }
    };

    return (
      <CustomStepIconRoot
        ownerState={{ active, completed }}
        tabIndex={0}
        role="button"
        aria-label={`Step ${index + 1}`}
        aria-current={active ? "step" : undefined}
        onClick={() => handleStepClick(index)}
        onKeyDown={handleKeyDown}
      />
    );
  };

  const handleStepClick = (index) => {
    if (onStepClick) {
      onStepClick(index);
    }
  };

  return (
    <Grid container direction="column" alignItems="center" paddingBottom="15px">
      <Box width="100%">
        <MuiStepper
          orientation={orientation}
          alternativeLabel={alternativeLabel}
          activeStep={activeStep}
          connector={<CustomStepConnector />}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            "& .MuiStepConnector-root": {
              top: "20px",
              left: "calc(-50% + 20px)",
              right: "calc(50% + 20px)",
            },

            "& .MuiStepConnector-line": {
              borderColor: "#7a7a52",
              borderTopWidth: "2px",
            },
          }}
        >
          {steps.map((step, index) => (
            <MuiStep key={step.label} completed={index < activeStep}>
              <MuiStepLabel
                optional={step.optional}
                StepIconComponent={() => (
                  <CustomStepIcon
                    index={index}
                    active={index === activeStep}
                    completed={index < activeStep}
                  />
                )}
                sx={{
                  display: "flex",
                  flexDirection:
                    labelPosition === "top"
                      ? "column-reverse !important"
                      : "column",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",

                  /* Default label */
                  "& .MuiStepLabel-label": {
                    color: "#9F9F9F",
                    fontSize: "12px",
                    fontFamily: "Inter",
                    fontWeight: "500",
                    marginBottom: "10px",
                  },

                  /* ACTIVE step */
                  "&.Mui-active .MuiStepLabel-label": {
                    color: "#837F39",
                    fontWeight: 600,
                  },

                  /* COMPLETED step */
                  "&.Mui-completed .MuiStepLabel-label": {
                    color: "#837F39",
                  },
                }}
              >
                <span>{step.label}</span>
              </MuiStepLabel>
            </MuiStep>
          ))}
        </MuiStepper>
      </Box>
    </Grid>
  );
};

export default Stepper;