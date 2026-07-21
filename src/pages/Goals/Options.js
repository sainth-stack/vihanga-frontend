import { t } from "i18next";

export function Options(
  displayOptions,
  onChangeText,
  displayOptions2,
  onChangeText2
) {
  const checkboxOptions = [
    {
      label: "Objective",
      name: "objective",
      value: displayOptions.objective,
      onChangeText,
    },
    {
      label: t("Tasks.Due Date"),

      name: "dueDate",
      value: displayOptions.dueDate,
      onChangeText,
    },
    {
      label: "Weight",
      name: "weight",
      value: displayOptions.weight,
      onChangeText,
    },
    {
      label: "Owner",
      name: "owner",
      value: displayOptions.owner,
      onChangeText,
    },
    {
      label: "Approve/Reject",
      name: "successMetrics",
      value: displayOptions.successMetrics,
      onChangeText,
    },
    {
      label: "Progress & Status",
      name: "progressStatus",
      value: displayOptions.progressStatus,
      onChangeText,
    },
    {
      label: "Key Result",
      name: "keyResultName",
      value: displayOptions.keyResultName,
      onChangeText,
    },
  ];
  const filterOptions = [
    {
      label: "On Track",
      name: "onTrack",
      value: displayOptions2.onTrack,
      onChangeText: onChangeText2,
    },
    {
      label: "At Risk",
      name: "atRisk",
      value: displayOptions2.atRisk,
      onChangeText: onChangeText2,
    },
    {
      label: "Off Track",
      name: "offTrack",
      value: displayOptions2.offTrack,
      onChangeText: onChangeText2,
    },
  ];
  return {
    checkboxOptions,
    filterOptions,
  };
}
