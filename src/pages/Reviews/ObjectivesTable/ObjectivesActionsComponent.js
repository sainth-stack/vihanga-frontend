import React from "react";
import more from "assets/svg/More.svg";
import { AuthLineManager } from "utilities";
import { useTranslation } from "react-i18next";
export default function ObjectivesActionsComponent({
  privileges,
  row,
  companyInfo,
  handleEdit,
  setEditModal,
  handleDelete,
  setOrderModalShow4,
  setMultipleObjectives,
  setSelectedObjective,
  refreshData,
  forwardedRef2,
  handleAuditHistory,
}) {
  const { t } = useTranslation();
  return (
    <div className="d-flex">
      <div
        className="dropdown actionDropdown"
        ref={row.id === 1 ? forwardedRef2 : null}
      >
        <button
          className="dropdown-hide d-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <img src={more} alt={"more"} style={{ height: 15 }} />
        </button>
        <div
          className="dropdown-menu text-left "
          aria-labelledby="dropdownMenuButton"
        >
          {(row.objectiveStatus === "Unlock" ||
            row.objectiveStatus === "Reject" ||
            row.objectiveStatus === "Create" ||
            row.objectiveStatus === "Update") &&
            privileges &&
            privileges.length > 0 &&
            privileges.filter((privilege) => privilege.page === "Objectives")
              .length > 0 &&
            privileges.filter((privilege) => privilege.page === "Objectives")[0]
              .edit && (
              <button
                className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                onClick={() => {
                  handleEdit(row);
                  setEditModal(true);
                }}
                disabled={row.progressStatus === 100 && AuthLineManager !== ""}
              >
                {t("Tasks.Edit")}
              </button>
            )}

          {
            <button
              className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
              onClick={() => handleDelete(row._id, row)}
            >
              {t("Tasks.Delete")}
            </button>
          }
          {
            <button
              className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
              onClick={() => handleAuditHistory(row._id)}
            >
              {t("Tasks.Audit History")}
            </button>
          }
          {(row.objectiveStatus === "Unlock" ||
            row.objectiveStatus === "Reject" ||
            row.objectiveStatus === "Create" ||
            row.objectiveStatus === "Update") &&
            privileges &&
            privileges.length > 0 &&
            privileges.filter(
              (privilege) => privilege.page === "Cascade Objectives"
            ).length > 0 &&
            privileges.filter(
              (privilege) => privilege.page === "Cascade Objectives"
            )[0].view && (
              <button
                className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                onClick={() => {
                  setOrderModalShow4(true);
                  setMultipleObjectives(false);
                  setSelectedObjective([
                    { objectiveId: row._id, weight: row.weight },
                  ]);
                }}
              >
                {t("Tasks.Cascade")}
              </button>
            )}
          <button
            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => window.print()}
          >
            {t("Tasks.Print As PDF")}
          </button>
        </div>
      </div>
    </div>
  );
}
