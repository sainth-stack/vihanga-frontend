import React from 'react'
import more from "assets/svg/More.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import trashIcon from "assets/svg/trashIcon.svg";
import { Link } from 'react-router-dom';

export default function KeyResultsActionsComponent({ privileges, row, handleDeleteKeyResults }) {
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
          {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Key Results").length > 0 && privileges.filter(privilege => privilege.page === "Key Results")[0].edit && <>
            {row.percent !== 100 ? (
              <Link
                to={{
                  pathname: "/admin/objectives/okrdetails",
                  state: { data: { objective: row.okrName, objectiveId: row.objectiveId, ...row, keyId: row._id, privileges } }
                }}
                className="text-decoration-none text-left"
              >
                <button className="btn btn-default dropdown-item text-capitalize text-left justify-content-start">
                  <img src={editTableIcon} alt="edit table icon" />
                  &nbsp;Edit
                </button>
              </Link>
            ) : (
              <button
                disabled
                className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
              >
                <img src={editTableIcon} alt="edit table icon" />
                &nbsp;Edit
              </button>
            )}
          </>}
          {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Key Results").length > 0 && privileges.filter(privilege => privilege.page === "Key Results")[0].delete && <button
            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => handleDeleteKeyResults(row._id)}
          >
            <img src={trashIcon} alt="delete table icon" />
            &nbsp;Delete
          </button>}
        </div>
      </div>
    </div>
  )
}
