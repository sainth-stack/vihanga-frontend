import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";
import { InputTextComponent } from "./../../components/input-elements/text";
import { useHistory, useLocation } from "react-router-dom";
import StepperCardGroup from "../approval-workflow/workFlow/components/steperGroup/steperCardGroup";
import { useTranslation } from "react-i18next";

const WorkFlowChain = ({ data, onChange, selected, workflowDetails }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const [error, setError] = useState(null);
  const [approvalChain, setApprovalChain] = useState(data || {});

  const approvalChainArray = Object.keys(approvalChain)
    .sort((a, b) => Number(a) - Number(b))
    .map((step) => approvalChain[step]);

  useEffect(() => {
    if (location.state?.newApprovers) {
      const newApprovers = location.state.newApprovers;
      const currentStep =
        location.state?.step?.toString() ||
        Object.keys(approvalChain).length.toString();

      onChange({
        ...approvalChain,
        [currentStep]: newApprovers,
      });

      history.replace({ ...location, state: {} });
    }
  }, [location.state, approvalChain, onChange, history]);

  const handleAddStep = () => {
    if (!selected || !workflowDetails) {
      setError(t("workflowChain.completeDetailsError"));
      return;
    }

    const navigationState = {
      selected,
      workflowDetails,
      approvalChain,
      step: Object.keys(approvalChain).length,
      isEdit: location.state?.isEdit || false,
      workflowId: location.state?.workflowId,
    };

    history.push({
      pathname: "/admin/add-approval",
      state: navigationState,
    });
  };

  const handleStepClick = (stepIndex) => {
    if (!selected || !workflowDetails) {
      setError(t("workflowChain.completeDetailsError"));
      return;
    }

    const navigationState = {
      selected,
      workflowDetails,
      approvalChain,
      step: stepIndex,
      isEdit: location.state?.isEdit || false,
      workflowId: location.state?.workflowId,
    };

    history.push({
      pathname: "/admin/add-approval",
      state: navigationState,
    });
  };

  const handleRemoveStep = (stepIndex) => {
    const newApprovalChain = { ...approvalChain };
    delete newApprovalChain[stepIndex];
    setApprovalChain(newApprovalChain);
  };

  return (
    <Box
      sx={{
        borderRadius: "16px",
        p: 4,
        backgroundColor: "#fff",
        maxWidth: "100%",
        mx: "auto",
        mt: 1.5,
      }}
    >
      {/* 🔹 Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      {/* 🔹 Page Titles */}
      <Typography fontWeight="bold" fontSize="20px" mb={1}>
        {t("workflowChain.configureApprovalChain")}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {t("workflowChain.defineSequence")}
      </Typography>
      <Typography fontWeight="bold" mb={2}>
        {t("workflowChain.currentApprovalChain")}
      </Typography>

      {/* 🔹 No Steps Yet */}
      {Object.keys(approvalChain).length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 5,
            borderRadius: 3,
            border: "1px solid rgba(244, 244, 244, 1)",
            background: "rgba(255, 255, 255, 1)",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight="medium" mb={2}>
            {t("workflowChain.noStepsDefined")}
          </Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={handleAddStep}
              sx={{
                borderColor: "#7a7a52",
                color: "#7a7a52",
                textTransform: "none",
                borderRadius: "20px",
              }}
            >
              {t("workflowChain.addStep")}
            </Button>
          </Box>
        </Paper>
      ) : (
        <Box>
          <StepperCardGroup
            steps={approvalChainArray}
            addStep={true}
            removeStep={true}
            handleAddStep={handleAddStep}
            onStepClick={handleStepClick}
            onRemoveStep={handleRemoveStep}
          />
        </Box>
      )}
    </Box>
  );
};

export default WorkFlowChain;
