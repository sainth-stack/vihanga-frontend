import React from "react";
import { Box, Typography, Stack, Grid } from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { useTranslation } from "react-i18next";

const WorkFlowDetails = ({ data, onChange, selected }) => {
  const { t } = useTranslation();

  const handleChange = (field) => (event) => {
    onChange({
      ...data,
      [field]: event.target.value,
    });
  };

  const getConditionObject = () => {
    if (data?.condition && typeof data.condition === "object" && !Array.isArray(data.condition)) {
      const normalized = { ...data.condition };
      // Normalize legacy operator values so the dropdown shows a valid selection
      if (normalized.operator === "equal") normalized.operator = "equal_to";
      if (normalized.operator === "greater_than_or_equal_to")
        normalized.operator = "greater_than_or_equal";
      if (normalized.operator === "less_than_or_equal_to")
        normalized.operator = "less_than_or_equal";
      return normalized;
    }
    return {};
  };

  const handleConditionChange = (field) => (event) => {
    const nextValue = event.target.value;
    const currentCondition = getConditionObject();

    // When operator toggles between "between" and others, keep the condition shape clean
    if (field === "operator") {
      if (nextValue === "between") {
        onChange({
          ...data,
          condition: {
            ...currentCondition,
            operator: nextValue,
            // Ensure these exist for UI + backend evaluation
            minValue: currentCondition.minValue ?? "",
            maxValue: currentCondition.maxValue ?? "",
            // Clear legacy single value
            value: undefined,
          },
        });
        return;
      }

      // Non-between operator: use single "value" and clear min/max
      onChange({
        ...data,
        condition: {
          ...currentCondition,
          operator: nextValue,
          value: currentCondition.value ?? "",
          minValue: undefined,
          maxValue: undefined,
        },
      });
      return;
    }

    onChange({
      ...data,
      condition: {
        ...currentCondition,
        [field]: nextValue,
      },
    });
  };

  // Options for the dropdowns
  const attributeOptions = [
    { value: "days", label: t("WorkFlowDetails.Days") },
  ];

  const operatorOptions = [
    { value: "equal_to", label: t("WorkFlowDetails.is") },
    { value: "less_than_or_equal", label: t("WorkFlowDetails.lesserOrEqual") },
    {
      value: "greater_than_or_equal",
      label: t("WorkFlowDetails.greaterOrEqual"),
    },
    { value: "between", label: t("WorkFlowDetails.between") },
  ];

  return (
    <Box maxWidth="600px" mb={4} mt={5}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {t("WorkFlowDetails.WorkflowDetails")}
      </Typography>
      <Typography variant="body2" mb={3} mt={2}>
        {t("WorkFlowDetails.ProvideNameDescription")}
      </Typography>

      <Stack spacing={3}>
        <InputTextComponent
          required
          label={t("WorkFlowDetails.WorkflowName")}
          placeholder={t("WorkFlowDetails.WorkflowNamePlaceholder")}
          fullWidth
          variant="outlined"
          value={data.name}
          sx={{
            fontWeight: "500",
            color: "#000",
          }}
          onChange={handleChange("name")}
        />

        <InputTextComponent
          required
          label={t("WorkFlowDetails.Description")}
          placeholder={t("WorkFlowDetails.DescriptionPlaceholder")}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={data.description}
          onChange={handleChange("description")}
        />

        {/* Condition field (only if not leave_request) */}
        {selected?.id !== "leave_request" && (
          <InputTextComponent
            label={t("WorkFlowDetails.Condition")}
            placeholder={t("WorkFlowDetails.ConditionPlaceholder")}
            fullWidth
            variant="outlined"
            value={data.condition}
            onChange={handleChange("condition")}
          />
        )}

        {/* Structured condition section for Leave Request transaction type */}
        {selected?.id === "leave_request" && (
          <Box>
            <Typography
              variant="body1"
              sx={{
                marginBottom: "0.5rem",
                fontWeight: 400,
                fontFamily: "Work Sans !important",
                color: "#707070",
                fontSize: "14px",
              }}
            >
              {t("WorkFlowDetails.ConditionLeaveRequest")}
            </Typography>
            <Typography
              variant="body2"
              mb={2}
              sx={{ color: "#999", fontSize: "12px" }}
            >
              {t("WorkFlowDetails.SetRules")}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <SelectComponent
                  id="condition-attribute"
                  label={t("WorkFlowDetails.Attribute")}
                  value={getConditionObject().attribute || ""}
                  onChange={handleConditionChange("attribute")}
                  options={attributeOptions}
                  placeholder={t("WorkFlowDetails.SelectAttribute")}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <SelectComponent
                  id="condition-operator"
                  label={t("WorkFlowDetails.Operator")}
                  value={getConditionObject().operator || ""}
                  onChange={handleConditionChange("operator")}
                  options={operatorOptions}
                  placeholder={t("WorkFlowDetails.SelectOperator")}
                  fullWidth
                />
              </Grid>
              {getConditionObject().operator === "between" ? (
                <>
                  <Grid item xs={12} sm={2}>
                    <InputTextComponent
                      id="condition-min-value"
                      label={t("WorkFlowDetails.Min")}
                      type="number"
                      placeholder={t("WorkFlowDetails.EnterNumber")}
                      value={getConditionObject().minValue ?? ""}
                      onChange={handleConditionChange("minValue")}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <InputTextComponent
                      id="condition-max-value"
                      label={t("WorkFlowDetails.Max")}
                      type="number"
                      placeholder={t("WorkFlowDetails.EnterNumber")}
                      value={getConditionObject().maxValue ?? ""}
                      onChange={handleConditionChange("maxValue")}
                      fullWidth
                    />
                  </Grid>
                </>
              ) : (
                <Grid item xs={12} sm={4}>
                  <InputTextComponent
                    id="condition-value"
                    label={t("WorkFlowDetails.Value")}
                    type="number"
                    placeholder={t("WorkFlowDetails.EnterNumber")}
                    value={getConditionObject().value ?? ""}
                    onChange={handleConditionChange("value")}
                    fullWidth
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* Simple text condition for Timesheet and Resignation Request */}
        {(data.transactionType?.id === "timesheet" ||
          data.transactionType?.id === "resignation_request") && (
          <InputTextComponent
            label={t("WorkFlowDetails.Condition")}
            placeholder={t("WorkFlowDetails.ConditionPlaceholder")}
            fullWidth
            variant="outlined"
            value={typeof data.condition === "string" ? data.condition : ""}
            onChange={handleChange("condition")}
          />
        )}
      </Stack>
    </Box>
  );
};

export default WorkFlowDetails;
