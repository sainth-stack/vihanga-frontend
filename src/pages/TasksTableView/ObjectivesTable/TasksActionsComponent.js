import React from "react";
import more from "assets/svg/More.svg";
import eye from "assets/svg/eye.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import trashIcon from "assets/svg/trashIcon.svg";
import { useTranslation } from "react-i18next";

export default function TasksActionsComponent({
  privileges,
  row,
  handleViewTask,
  setViewModalTask,
  handleEditTask,
  setEditModalTask,
  handleDeleteTasks,
  handleAuditHistory,
  handleCopyTask,
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
          <button
            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => {
              handleViewTask(row);
              setViewModalTask(true);
            }}
          >
            <img src={eye} alt="edit table icon" />
            &nbsp; &nbsp; {t("OKR Details.View")}
          </button>
          <button
            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => {
              handleEditTask(row);
              setEditModalTask(true);
            }}
          >
            <img src={editTableIcon} alt="edit table icon" />
            &nbsp; &nbsp; {t("OKR Details.Edit")}
          </button>
          <button
            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => handleCopyTask(row._id, row)}
          >
            <i className="fa fa-copy" />
            &nbsp; {t("OKR Details.Copy")}
          </button>
          <button
            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => handleDeleteTasks(row._id, row)}
          >
            <img src={trashIcon} alt="delete table icon" />
            &nbsp; {t("OKR Details.Delete")}
          </button>
          <button
            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => handleAuditHistory(row._id)}
          >
            <i className="fa fa-clock" />
            &nbsp; {t("OKR Details.Audit History")}
          </button>
        </div>
      </div>
    </div>
  );
}
