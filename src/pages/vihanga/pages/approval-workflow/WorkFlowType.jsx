import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import Stepper from "pages/vihanga/components/stepper";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WorkFlowChain from "./WorkFlowChain";
import WorkFlowDetails from "./DetailWorkFlow";
import { useHistory, useLocation } from "react-router-dom";
import TransactionCard from "./components/TransactionCard";
import { transactionOptions } from "./workFlow/data";
import axios from "axios";
import { appURL } from "utilities";
import { Toast } from "service/toast";
import { useTranslation } from "react-i18next";

const STEPS = [
  { label: "Transaction Type" },
  { label: "Workflow Details" },
  { label: "Approval Chain" },
];

const WorkflowType = () => {
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [workflowDetails, setWorkflowDetails] = useState({
    name: "",
    description: "",
    condition: "",
  });
  const [approvalChain, setApprovalChain] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const companyId =
    localStorage.getItem("companyId") !== null
      ? JSON.parse(localStorage.getItem("companyId"))
      : null;

  const [isEdit, setIsEdit] = useState(false);
  const [workflowId, setWorkflowId] = useState(null);

  useEffect(() => {
    if (location.state?.isEdit && location.state?.workflow) {
      const { workflow, isEdit, workflowId } = location.state;
      setIsEdit(isEdit);
      setWorkflowId(workflowId);
      setSelected(workflow.transactionType || null);
      setWorkflowDetails(
        workflow.workflowDetails || {
          name: "",
          description: "",
          condition: null,
        }
      );
      setApprovalChain(
        Array.isArray(workflow.approvalChain)
          ? workflow.approvalChain.reduce(
              (acc, curr, index) => ({ ...acc, [index]: curr }),
              {}
            )
          : workflow.approvalChain || {}
      );
      history.replace({ ...location, state: {} });
    }
  }, [location, history]);

  useEffect(() => {
    if (location.state?.fromAddApproval) {
      const {
        selected: incomingSelected,
        workflowDetails: incomingDetails,
        approvalChain: incomingChain,
      } = location.state;
      if (incomingSelected) setSelected(incomingSelected);
      if (incomingDetails) setWorkflowDetails(incomingDetails);
      if (incomingChain) {
        setApprovalChain(
          Array.isArray(incomingChain)
            ? incomingChain.reduce(
                (acc, curr, index) => ({ ...acc, [index]: curr }),
                {}
              )
            : incomingChain || {}
        );
      }
      setActiveStep(2);
      history.replace({ ...location, state: {} });
    }
  }, [location, history]);

  const handleNext = async () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      const payload = {
        companyId,
        transactionType: selected,
        workflowDetails,
        approvalChain,
      };
      setLoading(true);
      setError(null);
      try {
        let response;
        if (isEdit) {
          response = await axios.put(
            `${appURL}/recruitment/workflow?id=${workflowId}&companyId=${companyId}`,
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          Toast({ message: t("workflow.updatedSuccess"), type: "success" });
        } else {
          response = await axios.post(
            `${appURL}/recruitment/workflow`,
            payload,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          Toast({ message: t("workflow.createdSuccess"), type: "success" });
        }
        history.push("/admin/approval-workflow");
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          t("workflow.failed", { action: isEdit ? t("update") : t("create") });
        setError(errorMessage);
        Toast({ message: errorMessage, type: "error" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return selected !== null;
      case 1:
        return (
          workflowDetails.name.trim() !== "" &&
          workflowDetails.description.trim() !== ""
        );
      case 2:
        return Object.keys(approvalChain).length > 0;
      default:
        return true;
    }
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <Typography fontWeight="bold" fontSize="22px" mb={2} mt={3}>
              {t("workflow.selectTransactionType")}
            </Typography>
            <Typography variant="body2" mb={4}>
              {t("workflow.chooseTransactionType")}
            </Typography>
            <Grid container spacing={3} mb={6}>
              {transactionOptions.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={4} lg={4}>
                  <TransactionCard
                    title={item.title}
                    description={item.description}
                    selected={selected?.id === item.id}
                    onClick={setSelected}
                    item={item}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        );
      case 1:
        return (
          <WorkFlowDetails
            data={workflowDetails}
            selected={selected}
            onChange={setWorkflowDetails}
          />
        );
      case 2:
        return (
          <WorkFlowChain
            data={approvalChain}
            onChange={setApprovalChain}
            selected={selected}
            workflowDetails={workflowDetails}
          />
        );
      default:
        return <Typography>{t("workflow.unknownStep")}</Typography>;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Box
        sx={{
          borderRadius: "16px",
          p: 2,
          backgroundColor: "#fff",
          maxWidth: "100%",
          mx: "auto",
        }}
      >
        <Typography variant="h4" fontWeight={600} mb={1}>
          {isEdit
            ? t("workflow.editWorkflow")
            : t("workflow.createNewWorkflow")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={4}>
          {isEdit
            ? t("workflow.modifyWorkflow")
            : t("workflow.setupNewWorkflow")}
        </Typography>

        <Box
          mt="20px"
          sx={{
            width: "100%",
            borderRadius: "16px",
            paddingBottom: "10px",
            backgroundColor: "#fff",
            boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
          }}
        >
          <Stepper
            steps={STEPS.map((s) => ({ label: t(`workflow.${s.label}`) }))}
            activeStep={activeStep}
            stepIconColor="#7a7a52"
            connectorColor="#9E9E9E"
            onStepClick={(stepIndex) => {
              if (isStepValid()) {
                setActiveStep(stepIndex);
              }
            }}
          />
        </Box>

        {renderStepContent(activeStep)}

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#7a7a52",
              color: "#7a7a52",
              textTransform: "none",
              borderRadius: "20px",
            }}
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
          >
            {t("workflow.previous")}
          </Button>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#7a7a52",
                color: "#7a7a52",
                textTransform: "none",
                borderRadius: "20px",
              }}
              onClick={() => {
                setActiveStep(0);
                setSelected(null);
                setWorkflowDetails({
                  name: "",
                  description: "",
                  condition: "",
                });
                setApprovalChain({});
                setError(null);
                history.push("/admin/approval-workflow");
              }}
              disabled={loading}
            >
              {t("workflow.cancel")}
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#7a7a52",
                textTransform: "none",
                borderRadius: "20px",
                "&:hover": { backgroundColor: "#656544" },
              }}
              disabled={!isStepValid() || loading}
              onClick={handleNext}
              endIcon={loading ? null : <ArrowForwardIcon />}
            >
              {loading
                ? t("workflow.submitting")
                : activeStep === STEPS.length - 1
                ? isEdit
                  ? t("workflow.updateWorkflow")
                  : t("workflow.createWorkflow")
                : t("workflow.next")}
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default WorkflowType;
