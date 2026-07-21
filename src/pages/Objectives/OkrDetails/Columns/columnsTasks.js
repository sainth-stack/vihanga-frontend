import React from "react";
import childIcon from "assets/svg/child.svg";
import eye from "assets/svg/eye.svg";
import trashIcon from "assets/svg/trashIcon.svg";
import more from "assets/svg/More.svg";
import attachmentIcon from "assets/svg/attachmentIcon.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";

export default function columnsTasks(
  privileges,
  setUpdateObj,
  handleEditViewTask,
  setViewModalTask,
  setEditModalTask,
  handleDeleteTasks
) {
  return [
    {
      dataField: "title",
      text: "TITLE ",
      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: { width: "19.5%", height: "91px" },
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <p
            className="text-left cursor-pointer"
            onClick={() => {
              setUpdateObj(handleEditViewTask(row));
              setViewModalTask(true);
            }}
          >
            <img
              src={childIcon}
              alt="Objective"
              className="mr-1"
              style={{ height: 15 }}
            />
            {row.title}
          </p>
        );
      },
    },
    {
      dataField: "dueDate",
      text: "TARGET DATE",
      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: { width: "10.4%" },
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return <p>{window.moment(row.dueDate).format("d MMM YYYY")}</p>;
      },
    },
    {
      dataField: "owner",
      text: "OWNER",
      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: { width: "25%" },
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <div>
            <p>{row.owner}</p>
          </div>
        );
      },
    },
    {
      dataField: "status",
      text: "SUCCESS METRICS",
      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: { width: "16.5%" },
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        let status = "";
        if (row.status === "notstarted") {
          status = "Not Started";
        } else if (row.status === "inprogress") {
          status = "In Progress";
        } else if (row.status === "completed") {
          status = "Completed";
        }
        return <p>{status}</p>;
      },
    },
    {
      dataField: "action",
      text: "ACTION",
      headerAttrs: {
        hidden: true,
      },
      style: { width: "6%" },
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
                className="dropdown-menu text-left "
                aria-labelledby="dropdownMenuButton"
              >
                {privileges &&
                  privileges.length > 0 &&
                  privileges.filter((privilege) => privilege.page === "Tasks")
                    .length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Tasks"
                  )[0].view && (
                    <button
                      className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                      onClick={() => {
                        setUpdateObj(handleEditViewTask(row));
                        setViewModalTask(true);
                      }}
                    >
                      <img src={eye} alt="edit table icon" />
                      &nbsp;View
                    </button>
                  )}
                {(row.objectiveStatus === "Unlock" ||
                  row.objectiveStatus === "Reject" ||
                  row.objectiveStatus === "Create" ||
                  row.objectiveStatus === "Update") &&
                  privileges &&
                  privileges.length > 0 &&
                  privileges.filter((privilege) => privilege.page === "Tasks")
                    .length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Tasks"
                  )[0].edit && (
                    <button
                      className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                      onClick={() => {
                        setUpdateObj(handleEditViewTask(row));
                        setEditModalTask(true);
                      }}
                      disabled={row.progressStatus === 100}
                    >
                      <img src={editTableIcon} alt="edit table icon" />
                      &nbsp;Edit
                    </button>
                  )}

                {(row.objectiveStatus === "Unlock" ||
                  row.objectiveStatus === "Reject" ||
                  row.objectiveStatus === "Create" ||
                  row.objectiveStatus === "Update") &&
                  privileges &&
                  privileges.length > 0 &&
                  privileges.filter((privilege) => privilege.page === "Tasks")
                    .length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Tasks"
                  )[0].delete && (
                    <button
                      className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                      onClick={() => handleDeleteTasks(row._id, row)}
                    >
                      <img src={trashIcon} alt="delete table icon" />
                      &nbsp;Delete
                    </button>
                  )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      dataField: "feed",
      text: "FEED",
      headerAttrs: {
        hidden: true,
      },
      style: { width: "5%" },
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
                <button className="dropdown-hide d-toggle">
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
