import React from 'react'
import more from "assets/svg/More.svg";
import eye from "assets/svg/eye.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import trashIcon from "assets/svg/trashIcon.svg";

export default function TasksActionsComponent({ privileges, row, handleViewTask, setViewModalTask, handleEditTask, setEditModalTask, handleDeleteTasks }) {
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
          {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Tasks").length > 0 && privileges.filter(privilege => privilege.page === "Tasks")[0].view &&
            <button
              className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
              onClick={() => {
                handleViewTask(row);
                setViewModalTask(true);
              }}
            >
              <img src={eye} alt="edit table icon" />
              &nbsp;View
            </button>}
          {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Tasks").length > 0 && privileges.filter(privilege => privilege.page === "Tasks")[0].edit && <button
            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => {
              handleEditTask(row);
              setEditModalTask(true);
            }}
            disabled={row.progressStatus === 100}
          >
            <img src={editTableIcon} alt="edit table icon" />
            &nbsp;Edit
          </button>}
          {privileges && privileges.length > 0 && privileges.filter(privilege => privilege.page === "Tasks").length > 0 && privileges.filter(privilege => privilege.page === "Tasks")[0].delete && <button
            className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
            onClick={() => handleDeleteTasks(row._id, row)}
          >
            <img src={trashIcon} alt="delete table icon" />
            &nbsp;Delete
          </button>}
        </div>
      </div>
    </div>
  )
}
