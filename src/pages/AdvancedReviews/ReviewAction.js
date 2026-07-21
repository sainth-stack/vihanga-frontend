import React from "react";
import more from "assets/svg/More.svg";
import { useTranslation } from "react-i18next";
export default function ReviewAction({ row }) {
  const { t } = useTranslation();
  return (
    <div className="d-flex">
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
          className="dropdown-menu text-left"
          aria-labelledby="dropdownMenuButton"
        >
          <a
            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            href={`/admin/reviews-report/${row._id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Tasks.View Report")}
          </a>
          <button
            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => {
              window.location.href = `/admin/reviews/${row._id}`;
            }}
          >
            {t("Tasks.Edit")}
          </button>
          <button className="btn btn-default dropdown-item text-capitalize text-left justify-content-start">
            {t("Tasks.Delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
