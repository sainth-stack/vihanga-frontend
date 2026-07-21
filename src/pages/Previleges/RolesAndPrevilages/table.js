import React, { useState } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import Table from "components/Table";
import trashIcon from "assets/svg/trashIcon.svg";
import objective from "assets/svg/objective.svg";
import childIcon from "assets/svg/child.svg";
import userIcon from "assets/svg/userprofile.png";
import { useDispatch } from "react-redux";
import { LoadingIndicator } from "utilities";
import { Link } from "react-router-dom";
import more from "assets/svg/More.svg";
import eye from "assets/svg/eye.svg";

import editTableIcon from "assets/svg/editTableIcon.svg";
const transformChild = (childData, index, data) => {
  return childData.map((item) => ({
    ...item,
    dueDate: window.moment(item.targetDate).format("YYYY-MM-DD"),
    owner: data[index].owner ? data[index].owner : data[index].employeeName,
    successMetrics: data[index].successMetrics,
    weight: data[index].weight,
  }));
};
export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      employeeName: data[i].employeeName,
      okrPeriod: data[i].okrPeriod,
      okrYear: data[i].okrYear,
      objective: data[i].objective,
      dueDate: window.moment(data[i].dueDate).format("YYYY-MM-DD"),
      weight: data[i].weight,
      owner: data[i].owner ? data[i].owner : data[i].employeeName,
      successMetrics: data[i].successMetrics,
      progressStatus: data[i].progressStatus,
      feedAttachment: data[i].feedAttachment,
      comments: data[i].comments,
      employeeReferenceId: data[i].employeeReferenceId,
      updatedAt: data[i].updatedAt,
      children:
        data[i].children.length > 0
          ? transformChild(data[i].children, i, data)
          : data[i].children,
      cascaded: data[i].cascaded,
    });
  }
  return items;
};

export const tableGeneratorChild = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      keyResultName: data[i].keyResultName,
      dueDate: window.moment(data[i].targetDate).format("YYYY-MM-DD"),
      feedAttachment: data[i].feedAttachment,
      updatedAt: data[i].updatedAt,
    });
  }
  return items;
};

export default function RolesTable(props) {
  const [loading, ] = useState(false);
  const [, setEditModal] = useState(false);
  const [searchKey, ] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [data, ] = useState([]);
  const [data2, ] = useState([]);
  const legalEntities = [];
  const parentprogressStatus = [];
  const locations = [];
  for (var i = 0; i < data.length; i++) {
    legalEntities.push({
      key: data[i].legalEntityName,
      value: data[i].legalEntityName,
    });
    parentprogressStatus.push({
      key: data[i].parentprogressStatus,
      value: data[i].parentprogressStatus,
    });
    locations.push({
      key: data[i].location,
      value: data[i].location,
    });
  }
  const columns = [
    {
      dataField: "objective",
      text: "OBJECTIVE",
      sort: true,
      style: { width: "20.8%" },
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <div
            onClick={() => {
              setEditModal(true);
            }}
          >
            <img
              src={objective}
              alt="Objective"
              className="mr-1"
              style={{ height: 15 }}
            />
            {row.objective}
            <br />
            <small>OKR Name</small>
            {row.cascaded && (
              <div>
                <span className="badge badge-pill bg-green p-1 text-white">
                  Company
                </span>
                <span className="badge badge-pill bg-green p-1 text-white m-2">
                  Manager Cascaded
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      dataField: "dueDate",
      text: "DUE DATE",
      sort: true,
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <p
            onClick={() => {
              setEditModal(true);
            }}
          >
            {window.moment(row.dueDate).format("D MMM YYYY")}
          </p>
        );
      },
    },
    {
      dataField: "weight",
      text: "WEIGHT",
      sort: true,
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <div>
            <p> {row.weight}</p>
          </div>
        );
      },
    },
    {
      dataField: "owner",
      text: "OWNER",
      sort: true,
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <div>
            <p>
              <img src={userIcon} alt="user pic" className="userPic" />{" "}
              {row.owner}
            </p>
          </div>
        );
      },
    },
    {
      dataField: "action",
      text: "ACTION",
      headerAttrs: {
        hidden: true,
      },
      style: { width: "8%" },
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
                <Link
                  to={{
                    pathname: "/admin/objectives/okrdetails",
                    state: {
                      data: {
                        ...row,
                        keyResultName: undefined,
                        _id: row.objectiveId,
                      },
                    },
                  }}
                  className="text-decoration-none text-left"
                >
                  <button className="btn btn-default dropdown-item text-capitalize text-left justify-content-start">
                    <img src={eye} alt="edit table icon" />
                    &nbsp;View
                  </button>
                </Link>
                {row.percent !== 100 ? (
                  <Link
                    to={{
                      pathname: "/admin/objectives/okrdetails",
                      state: {
                        data: { ...row, _id: row.objectiveId, keyId: row._id },
                      },
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
                <button
                  className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                >
                  <img src={trashIcon} alt="delete table icon" />
                  &nbsp;Delete
                </button>
              </div>
            </div>
            &nbsp;&nbsp;
          </div>
        );
      },
    },
  ];
  const columnsChildTasks = [
    {
      dataField: "title",
      text: "TITLE",
      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: { width: "19.5%", height: "91px" },
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <p className="text-left">
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
      dataField: "targetDate",
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
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return <p>{window.moment(row.dueDate).format("D MMM YYYY")}</p>;
      },
    },

    {
      dataField: "action",
      text: "ACTION",
      headerAttrs: {
        hidden: true,
      },
      style: { width: "7.5%" },
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
                <button
                  className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                  onClick={() => {
                  }}
                >
                  <img src={eye} alt="edit table icon" />
                  &nbsp;View
                </button>
                <button
                  className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                  onClick={() => {
                  }}
                  disabled={row.progressStatus === 100}
                >
                  <img src={editTableIcon} alt="edit table icon" />
                  &nbsp;Edit
                </button>
                <button
                  className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                >
                  <img src={trashIcon} alt="delete table icon" />
                  &nbsp;Delete
                </button>
              </div>
            </div>
          </div>
        );
      },
    },

  ];

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    onSelect: (row) => {
      let totalData = [...selectedUsers];
      let filterData = totalData.findIndex((item) => item._id === row._id);
      if (filterData < 0) {
        totalData.push(row);
        setSelectedUsers(totalData);
      } else {
        totalData.splice(filterData, 1);
        setSelectedUsers(totalData);
      }
    },
    onSelectAll: (isSelected) => {
      if (isSelected) {
        setSelectedUsers(data);
      } else {
        setSelectedUsers([]);
      }
    },
  };
  return (
    <>
      <div className="shadow mt-2 pt-0">
        {loading ? (
          <div className="text-center">
            <LoadingIndicator size={3} />
          </div>
        ) : (
          <Table
            title="objectives"
            data={data}
            column={columns}
            paginationFactory={paginationFactory}
            searchKey={searchKey}
            selectRow={selectRow}
            data2={data2}
            childData={{
              data,
              columnsChildTasks,
              searchKey,
            }}
          />
        )}

      </div>

    </>
  );
}
