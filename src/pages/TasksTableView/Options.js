import { t } from "i18next";

export function Options(
  displayOptions,
  onChangeText,
  displayOptions2,
  onChangeText2
) {
  const checkboxOptions = [
    {
      label: t("objectives.Title"),
      name: "title",
      value: displayOptions.title,
      onChangeText,
    },
    {
      label: t("objectives.Key Results"),

      name: "keyResultName",
      value: displayOptions.keyResultName,
      onChangeText,
    },
    {
      label: t("objectives.Due Date"),

      name: "dueDate",
      value: displayOptions.dueDate,
      onChangeText,
    },
    {
      label: t("objectives.Owner"),

      name: "owner",
      value: displayOptions.owner,
      onChangeText,
    },
    {
      label: t("objectives.Status"),

      name: "status",
      value: displayOptions.status,
      onChangeText,
    },
    {
      label: t("objectives.Priority"),

      name: "priority",
      value: displayOptions.priority,
      onChangeText,
    },
    {
      label: t("objectives.Assign To"),

      name: "employeeName",
      value: displayOptions.employeeName,
      onChangeText,
    },

    {
      label: t("objectives.Comments"),

      name: "comments",
      value: displayOptions.comments,
      onChangeText,
    },
    {
      label: t("objectives.Progress_Status"),

      name: "progressStatus",
      value: displayOptions.progressStatus,
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
