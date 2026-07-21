import React from "react";
import more from "assets/svg/More.svg";
import { Link } from "react-router-dom";
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
          <img src={more} alt={"more"} style={{ height: 15 }} />
        </button>
        <div
          className="dropdown-menu text-left "
          aria-labelledby="dropdownMenuButton"
        >
          {privileges &&
            privileges.length > 0 &&
            privileges.filter((privilege) => privilege.page === "Objectives")
              .length > 0 &&
            privileges.filter((privilege) => privilege.page === "Objectives")[0]
              .view && (
              <Link
                to={{
                  pathname: "/admin/objectives/okrdetails",
                  state: {
                    data: {
                      ...row,
                      objectiveId: row._id,
                      ownerName: companyInfo,
                      privileges,
                    },
                  },
                }}
                className="text-decoration-none text-left"
              >
                <button className="btn btn-default dropdown-item text-capitalize text-left justify-content-start">
                  {t("Tasks.View")}
                </button>
              </Link>
            )}

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
                disabled={row.progressStatus === 100}
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
