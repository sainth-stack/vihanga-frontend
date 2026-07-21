import { t } from "i18next";

export function Options(
  displayOptions,
  onChangeText,
  displayOptions2,
  onChangeText2
) {
  const checkboxOptions = [
    {
      label: t("objectives.Create"),
      name: "objective",
      value: displayOptions.objective,
      onChangeText,
    },
    {
      label: t("objectives.Due_Date"),
      name: "dueDate",
      value: displayOptions.dueDate,
      onChangeText,
    },
    {
      label: t("objectives.Weight"),
      name: "weight",
      value: displayOptions.weight,
      onChangeText,
    },
    {
      label: t("objectives.Owner"),
      name: "owner",
      value: displayOptions.owner,
      onChangeText,
    },
    {
      label: t("objectives.Approve_Reject"),
      name: "successMetrics",
      value: displayOptions.successMetrics,
      onChangeText,
    },
    {
      label: t("objectives.Progress_Status"),
      name: "progressStatus",
      value: displayOptions.progressStatus,
      onChangeText,
    },
    {
      label: t("objectives.Key_Result"),
      name: "keyResultName",
      value: displayOptions.keyResultName,
      onChangeText,
    },
  ];
  const filterOptions = [
    {
      label: t("objectives.OnTrack"),
      name: "onTrack",
      value: displayOptions2.onTrack,
      onChangeText: onChangeText2,
    },
    {
      label: t("objectives.AtRisk"),
      name: "atRisk",
      value: displayOptions2.atRisk,
      onChangeText: onChangeText2,
    },
    {
      label: t("objectives.OffTrack"),
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
