import React from "react";
import more from "assets/svg/More.svg";

export default function GroupActions({
  handleEdit,
  handleDelete,
  handleEditCopy,
  row,
}) {
  return (
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
        style={{
          maxHeight: "100px",
          overflowY: "auto",
          minWidth: "150px",
        }}
      >
        <button
          className="btn btn-default text-capitalize fs-14 text-left justify-content-start"
          onClick={() => {
            handleEdit(row);
          }}
        >
          Edit
        </button>
        <button
          className="btn btn-default text-capitalize fs-14 text-left justify-content-start"
          onClick={() => {
            handleEditCopy(row);
          }}
        >
          Copy
        </button>
        <button
          className="btn btn-default text-capitalize fs-14 text-left justify-content-start"
          onClick={() => handleDelete(row._id)}
        >
          Delete
        </button>
        <button className="btn btn-default text-capitalize fs-14 text-left justify-content-start">
          View Summary
        </button>
        <button className="btn btn-default text-capitalize fs-14 text-left justify-content-start">
          View Change History
        </button>
      </div>
    </div>
  );
}
