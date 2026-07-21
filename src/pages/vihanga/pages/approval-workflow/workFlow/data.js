import i18n from "i18next";

export const transactionOptions = [
  {
    id: "leave_request",
    title: i18n.t("transactions.leaveRequestTitle"),
    description: i18n.t("transactions.leaveRequestDescription"),
  },
  {
    id: "timesheet",
    title: i18n.t("transactions.timesheetTitle"),
    description: i18n.t("transactions.timesheetDescription"),
  },
  {
    id: "resignation_request",
    title: i18n.t("transactions.resignationRequestTitle"),
    description: i18n.t("transactions.resignationRequestDescription"),
  },
];
