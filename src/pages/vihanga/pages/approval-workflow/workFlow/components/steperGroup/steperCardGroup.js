import React from "react";
import { Box, Button } from "@mui/material";
import StepperCard from "./steperCard";
import AddIcon from "@mui/icons-material/Add";

const StepperCardGroup = ({
  steps,
  addStep = false,
  handleAddStep,
  onStepClick,
  removeStep = false,
  onRemoveStep,
}) => {
  console.log("StepperCardGroup steps:", steps);

  const stepGroups = Array.isArray(steps) ? steps : Object.values(steps || {});

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        px: 2,
        py: 4,
      }}
    >
      {stepGroups?.map((group, index) => (
        <React.Fragment key={index}>
          {/* Stepper Card */}
          <Box
            sx={{
              flex: 1,
              minWidth: 150,
              maxWidth: 250,
              mx: 1,
              position: "relative",
              zIndex: 2,
              background: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* CHANGE 1: Pass index and onStepClick to StepperCard */}
            <StepperCard
              stepGroup={group}
              stepIndex={index}
              onStepClick={onStepClick}
              removeStep={removeStep}
              onRemoveStep={onRemoveStep}
            />
          </Box>

          {/* Connector line between cards */}
          {index < stepGroups.length - 1 && (
            <Box
              sx={{
                height: 2,
                flex: 0.2,
                backgroundColor: "#e0e0e0",
              }}
            />
          )}
        </React.Fragment>
      ))}

      {/* Add Step Button */}
      {addStep && (
        <>
          {/* Connector line before Add Step button */}
          {stepGroups.length > 0 && (
            <Box
              sx={{
                height: 2,
                flex: 0.2,
                backgroundColor: "#e0e0e0",
              }}
            />
          )}

          {/* Add Step Button */}
          <Box
            sx={{
              minWidth: 150,
              maxWidth: 250,
              mx: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                borderColor: "#837F39",
                color: "#837F39",
                borderRadius: 3,
                px: 3,
                py: 1,
                fontFamily: "Work Sans",
                fontWeight: 500,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#837F39",
                  backgroundColor: "rgba(131, 127, 57, 0.04)",
                },
              }}
              onClick={handleAddStep}
            >
              Add Step
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default StepperCardGroup;
