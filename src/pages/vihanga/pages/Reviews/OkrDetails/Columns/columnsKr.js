/* eslint-disable no-mixed-operators */
import React from "react";
import ProgressStatus from "pages/Objectives/ProgressStatus";
import more from "assets/svg/More.svg";
import attachmentIcon from "assets/svg/attachmentIcon.svg";
import { t } from "i18next";
export default function columnsKr(
  privileges,
  handleAddTask,
  handleComments,
  handleEdit,
  handleDelete,
  handleScroll,
  handleAuditHistory
) {
  return [
    {
      dataField: "keyResultName",
      text: "KEY RESULTS",
      csvExport: false,
      style: { width: "20%" },
      formatter: (cellContent, row) => {
        return (
          <div>
            <a
              href={null}
              className="text-left justify-content-start cursor-pointer "
              onClick={() => {
                if (
                  (privileges &&
                    privileges.length > 0 &&
                    privileges.filter(
                      (privilege) => privilege.page === "Key Results"
                    ).length > 0 &&
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
                      privilege.page ===
                      "Key Results - Target update once locked"
                  ).length > 0 &&
                    privileges.filter(
                      (privilege) =>
                        privilege.page ===
                        "Key Results - Target update once locked"
                    )[0].edit)
                ) {
                  handleEdit(row);
                }
                //}
              }}
            >
              <p onClick={handleScroll}>{row.keyResultName}</p>
            </a>
          </div>
        );
      },
    },
    {
      dataField: "targetDate",
      text: "TARGET DATE",
      style: { width: "17%" },
    },
    {
      dataField: "target",
      text: "TARGET",
      style: { width: "8%" },
    },
    {
      dataField: "actual",
      text: "ACTUAL",
      style: { width: "8%" },
    },
    {
      dataField: "progress",
      text: "PROGRESS",
      style: { width: "25%" },
      formatter: (cellContent, row) => {
        return <ProgressStatus percent={row.progress} onEdit={() => {}} />;
      },
    },

    {
      dataField: "action",
      text: "ACTION",
      style: { width: "5%" },
      formatter: (cellContent, row) => {
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
                {privileges &&
                  privileges.length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  ).length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  )[0].edit && (
                    <button
                      className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                      onClick={() => {
                        handleAddTask(row);
                      }}
                    >
                      &nbsp;
                      {t("OKR Details.Add New Task")}
                    </button>
                  )}
                {privileges &&
                  privileges.length > 0 &&
                  ((privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  ).length > 0 &&
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
                        privilege.page ===
                        "Key Results - Target update once locked"
                    ).length > 0 &&
                      privileges.filter(
                        (privilege) =>
                          privilege.page ===
                          "Key Results - Target update once locked"
                      )[0].view)) && (
                    <button
                      className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                      onClick={() => handleComments(row)}
                    >
                      &nbsp;
                      {t("OKR Details.View Conversation")}
                    </button>
                  )}

                {privileges &&
                  privileges.length > 0 &&
                  ((privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  ).length > 0 &&
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
                        privilege.page ===
                        "Key Results - Target update once locked"
                    ).length > 0 &&
                      privileges.filter(
                        (privilege) =>
                          privilege.page ===
                          "Key Results - Target update once locked"
                      )[0].edit)) && (
                    <button
                      className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                      onClick={() => handleEdit(row)}
                    >
                      &nbsp;
                      {t("OKR Details.Edit")}
                    </button>
                  )}

                {privileges &&
                  privileges.length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  ).length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  )[0].delete && (
                    <button
                      className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                      onClick={() => handleDelete(row._id, row)}
                    >
                      &nbsp;
                      {t("OKR Details.Delete")}
                    </button>
                  )}
                <button
                  className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                  onClick={() => handleAuditHistory(row._id)}
                >
                  &nbsp;
                  {t("OKR Details.Audit History")}
                </button>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      dataField: "feed",
      text: "",
      style: { width: "5%" },
      headerAttrs: {
        hidden: false,
      },
      formatter: (cellContent, row) => {
        return (
          <div className="d-flex flex-wrap">
            <div className="dropdown actionDropdown">
              <a
                href={
                  row.feedAttachment && row.feedAttachment.length > 0
                    ? row.feedAttachment
                    : "!#"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="dropdown-hide d-toggle" type="button">
                  <img
                    src={attachmentIcon}
                    alt={"attachment"}
                    style={{ height: 25 }}
                  />
                </button>
              </a>
            </div>
          </div>
        );
      },
    },
  ];
}
