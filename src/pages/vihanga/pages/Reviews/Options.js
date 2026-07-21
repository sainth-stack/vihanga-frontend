import { t } from "i18next";
import { useTranslation } from "react-i18next";

export function Options(
  displayOptions,
  onChangeText,
  displayOptions2,
  onChangeText2,
  hideOptions
) {
  const checkboxOptions = [
    {
      label: t("objectives.Action"),

      name: "objective",
      value: displayOptions.objective,
      onChangeText,
    },
    {
      label: t("objectives.Due Date"),

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

      name: hideOptions ? "" : "owner",
      value: displayOptions.owner,
      onChangeText,
    },
    {
      label: t("objectives.Successmetric"),

      name: hideOptions ? "" : "successMetrics",
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
      label: t("objectives.Employee Rating"),

      name: hideOptions ? "employeeRating" : "",
      value: displayOptions.employeeRating,
      onChangeText,
    },
    {
      label: t("objectives.Manager Rating"),

      name: hideOptions ? "managerRating" : "",
      value: displayOptions.managerRating,
      onChangeText,
    },
    {
      label: t("objectives.Key Result"),

      name: "keyResultName",
      value: displayOptions.keyResultName,
      onChangeText,
    },
  ];
  const filterOptions = [
    {
      label: t("objectives.On Track"),

      name: "onTrack",
      value: displayOptions2.onTrack,
      onChangeText: onChangeText2,
    },
    {
      label: t("objectives.At Risk"),

      name: "atRisk",
      value: displayOptions2.atRisk,
      onChangeText: onChangeText2,
    },
    {
      label: t("objectives.Off Track"),

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
