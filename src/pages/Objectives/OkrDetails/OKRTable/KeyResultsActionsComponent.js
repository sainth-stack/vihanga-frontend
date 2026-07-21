/* eslint-disable no-mixed-operators */
import React from "react";
import more from "assets/svg/More.svg";
import { useTranslation } from "react-i18next";

export default function KeyResultsActionsComponent({
  privileges,
  handleAddTask,
  handleComments,
  handleEdit,
  handleDelete,
  row,
}) {
  const { t } = useTranslation();
  return (
    <div className="d-flex flex-wrap">
      <div className="dropdown actionDropdown">
        <button
          className="dropdown-hide d-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <img src={more} alt={more} style={{ height: 15 }} />
        </button>
        <div
          className="dropdown-menu text-left dropdown-menu-right "
          aria-labelledby="dropdownMenuButton"
        >
          {(row.objectiveStatus === "Unlock" ||
            row.objectiveStatus === "Reject" ||
            row.objectiveStatus === "Create" ||
            row.objectiveStatus === "Update") &&
            privileges &&
            privileges.length > 0 &&
            privileges.filter((privilege) => privilege.page === "Key Results")
              .length > 0 &&
            privileges.filter(
              (privilege) => privilege.page === "Key Results"
            )[0].edit && (
              <button
                className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                onClick={() => handleAddTask(row)}
              >
                &nbsp;
                {t("OKR Details.Add New Task")}
              </button>
            )}
          {(row.objectiveStatus === "Unlock" ||
            row.objectiveStatus === "Reject" ||
            row.objectiveStatus === "Create" ||
            row.objectiveStatus === "Update" ||
            row.objectiveStatus === "Approve") &&
            privileges &&
            privileges.length > 0 &&
            ((privileges.filter((privilege) => privilege.page === "Key Results")
              .length > 0 &&
              privileges.filter(
                (privilege) => privilege.page === "Key Results"
              )[0].view) ||
              (privileges.filter(
                (privilege) =>
                  privilege.page ===
                  "Key Results - Actual, comments update once locked"
              ).length > 0 &&
                privileges.filter(
                  (privilege) =>
                    privilege.page ===
                    "Key Results - Actual, comments update once locked"
                )[0].view) ||
              (privileges.filter(
                (privilege) =>
                  privilege.page === "Key Results - Target update once locked"
              ).length > 0 &&
                privileges.filter(
                  (privilege) =>
                    privilege.page === "Key Results - Target update once locked"
                )[0].view)) && (
              <button
                className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                onClick={() => handleComments(row)}
              >
                &nbsp;
                {t("OKR Details.View Conversation")}
              </button>
            )}

          {(row.objectiveStatus === "Unlock" ||
            row.objectiveStatus === "Reject" ||
            row.objectiveStatus === "Create" ||
            row.objectiveStatus === "Update" ||
            row.objectiveStatus === "Approve") &&
            privileges &&
            privileges.length > 0 &&
            ((privileges.filter((privilege) => privilege.page === "Key Results")
              .length > 0 &&
              privileges.filter(
                (privilege) => privilege.page === "Key Results"
              )[0].edit) ||
              (privileges.filter(
                (privilege) =>
                  privilege.page ===
                  "Key Results - Actual, comments update once locked"
              ).length > 0 &&
                privileges.filter(
                  (privilege) =>
                    privilege.page ===
                    "Key Results - Actual, comments update once locked"
                )[0].edit) ||
              (privileges.filter(
                (privilege) =>
                  privilege.page === "Key Results - Target update once locked"
              ).length > 0 &&
                privileges.filter(
                  (privilege) =>
                    privilege.page === "Key Results - Target update once locked"
                )[0].edit)) && (
              <button
                className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                onClick={() => handleEdit(row)}
                disabled={row.target === row.actual}
              >
                &nbsp;
                {t("OKR Details.Edit")}
              </button>
            )}

          {(row.objectiveStatus === "Unlock" ||
            row.objectiveStatus === "Reject" ||
            row.objectiveStatus === "Create" ||
            row.objectiveStatus === "Update") &&
            privileges &&
            privileges.length > 0 &&
            privileges.filter((privilege) => privilege.page === "Key Results")
              .length > 0 &&
            privileges.filter(
              (privilege) => privilege.page === "Key Results"
            )[0].delete && (
              <button
                className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                onClick={() => handleDelete(row._id, row)}
              >
                &nbsp;Delete
                {t("OKR Details.Delete")}
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
