import React from "react";
import { Box, Paper } from "@mui/material";
import InfoCardHeader from "../../components/header";
import DotHeading from "../../components/dotText";
import Fotter from "../../components/fotter";
import StepperCardGroup from "../../components/steperGroup/steperCardGroup";

const Card1 = ({ workflow, sx = {}, handleDelete, handleEdit }) => {
  console.log("work flow in card 1 ",workflow)
  const handleLeaveRequest = () => {
    console.log(`Leave Request clicked for workflow: ${workflow._id}`);
  };

  const transactionTitle =
    workflow.workflowDetails?.name || "Untitled Workflow";
  const transactionDescription =
    workflow.workflowDetails?.description || "No description available";


  const steps =workflow.approvalChain;

  return (
    <Paper
      sx={{
        p: 2,
        m: 2,
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        ...sx,
      }}
    >
      <Box>
        <InfoCardHeader
          title={transactionTitle}
          subtitle={transactionDescription}
          buttonText="Leave Request"
          onButtonClick={handleLeaveRequest}
        />

        <DotHeading text="Approval Flow" />

        <Box sx={{ mt: 1 }}>
          <StepperCardGroup steps={steps} />
        </Box>

        <Box sx={{ mt: 1 }}>
          <Fotter
            createdDate={new Date(workflow.createdAt).toLocaleDateString(
              "en-US",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
            onEdit={() => handleEdit(workflow._id)}
            onDelete={() => handleDelete(workflow._id)}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default Card1;
