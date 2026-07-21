import React from 'react'
import more from "assets/svg/More.svg";
import { Link } from 'react-router-dom';
import { AuthLineManager } from 'utilities';
import { t } from 'i18next';
export default function ReviewAction({ row }) {
  return (
    <div className="d-flex">
      <div className="dropdown actionDropdown review-dropdown"
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
          <a
            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            href={`/admin/reviews-report/${row._id}/${row.employeeId}`} target="_blank" rel="noopener noreferrer"
          >
            {t("Reviews.viewReport")}
          </a>

          <button
            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => {
              window.location.href = `/admin/reviews/${row._id}`

            }}
          >
            {t("Reviews.Edit")}
          </button>

          {
            <button
              className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            >
              {t("Reviews.Delete")}
            </button>
          }


        </div>
      </div>

    </div>
  )
}
