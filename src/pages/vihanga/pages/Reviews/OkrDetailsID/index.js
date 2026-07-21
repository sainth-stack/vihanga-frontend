/* eslint-disable no-mixed-operators */
import React from "react";
import TitleHeader from "components/TitleHeader";
import "./styles.scss";
import { useState, useEffect } from "react";
import download from "assets/svg/download.svg";
import { Col, Row } from "react-bootstrap";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import CheckboxInput from "components/Company/CheckboxInput";
import Button from "components/Company/Button";
import { useParams } from "react-router-dom";
import Popup from "pages/Tasks/Popup";
import ProgressStatus from "../ProgressStatus";
import { createTask, deleteTask, updateTask } from "action/TasksAct";
import CommentPopup from "./CommentsPopup";
import EditCommentPopup from "./EditComment";
import childIcon from "assets/svg/child.svg";
import userIcon from "assets/svg/userprofile.png";
import eye from "assets/svg/eye.svg";
import trashIcon from "assets/svg/trashIcon.svg";
import {
  createkeyResult,
  deletekeyResult,
  updatekeyResult,
  getKeyResultSingle,
} from "action/keyResultAct";
import { useDispatch } from "react-redux";
import paginationFactory from "react-bootstrap-table2-paginator";
import more from "assets/svg/More.svg";
import attachmentIcon from "assets/svg/attachmentIcon.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";

import {
  AuthUserId,
  Dimensions,
  Frequencies,
  LoadingIndicator,
  Polarities,
  UOMs,
} from "utilities";

import BrowseFilesNormal from "components/Company/BrowseFilesNormal";
import CascadedPopup from "./CascadedPopup";
import Table from "components/Table";
import TasksEditPopup from "../TasksEditPopup";
import TasksView from "../TasksView";
import {
  updateNotificationKR,
  updateNotificationTask,
} from "action/NotificationAct";
import { t } from "i18next";
export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id || "",
      dimension: data[i].dimension || "",
      isAlignedToCompany: data[i].isAlignedToCompany || "",
      okrName: data[i].okrName || "",
      keyResultName: data[i].keyResultName || "",
      objectiveId: data[i].objectiveId || "",
      frequency: data[i].frequency || "",
      uom: data[i].uom || "",
      polarity: data[i].polarity || "",
      msc: data[i].msc || "",
      targetDate: window.moment(data[i].targetDate).format("DD MMM YYYY") || "",
      actualDate: data[i].actualDate
        ? window.moment(data[i].actualDate).format("DD MMM YYYY")
        : "",
      target: data[i].target || "",
      actual: data[i].actual || 0,
      feedAttachment: data[i].feedAttachment || "",
      progress: data[i].progress || "",
      basevalue: data[i].basevalue || 0,
      objectiveStatus: data[i].objectiveStatus || 0,
      children: data[i].children || "",
      privileges: data[i].privileges || "",
      employeeReferenceId: data[i].employeeReferenceId || "",
      employeeName: data[i].employeeName || "",
      objective: data[i].objective || "",
    });
  }
  return items;
};
export default function OkrDetails() {
  const { id } = useParams();
  const [okrdetails, setOKRDetails] = useState();
  const dispatch = useDispatch();
  const [emptyData, setEmptyData] = useState({
    objectiveStatus: "",
    dimension: "",
    objective: "",
    objectiveId: "",
  });
  const [comment, setComment] = useState({});
  const [orderModalShow, setOrderModalShow] = useState(false);
  const [orderModalShow2, setOrderModalShow2] = useState(false);
  const [orderModalShow3, setOrderModalShow3] = useState(false);
  const [orderModalShow4, setOrderModalShow4] = useState(false);
  const [frequency, setFrequency] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState(false);
  const [selectedKR, setSelectedKR] = useState("");
  const [data, setData] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [addNewKr, setAddNewKr] = useState(false);
  const [updateData, setUpdateData] = useState({
    objectiveStatus: "",
    dimension: "",
    objective: "",
    objectiveId: "",
    userId: AuthUserId,
  });
  const [, setCreatedData] = useState({});
  const [updateRowId, setUpdateRowId] = useState("");
  const [, setClearSelectInputs] = useState(false);

  const [isAlignedToCompany, setIsAlignedToCompany] = useState(false);
  const [updateCheckBox, setUpdateCheckBox] = useState(false);
  const [showAttachment, setShowAttachment] = useState(true);
  const [krReferenceId, setKRReferenceId] = useState("");
  const [employeeReferenceId, setemployeeReferenceId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [keyResultsText, setKeyResultsText] = useState({});
  const [updateObj, setUpdateObj] = useState({});
  const [editTaskModal, setEditModalTask] = useState(false);
  const [viewTaskModal, setViewModalTask] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleEditTask = (cellContent, field) => {
    const updateOb = {
      _id: cellContent._id,
      title: cellContent.title,
      dueDate: cellContent.dueDate,
      attachments: cellContent.feedAttachment,
      description: cellContent.description,
      startDate: cellContent.startDate,
      actualCompletionDate: cellContent.actualCompletionDate,
      linkToKR: cellContent.linkToKR,
      assignTo: cellContent.assignTo,
      priority: cellContent.priority,
      comments: cellContent.comments,
      krReferenceId: cellContent.krReferenceId,
      userId: AuthUserId,
      // progressStatus: cellContent.progressStatus
    };
    setUpdateObj(updateOb);
  };
  const handleViewTask = (cellContent, field) => {
    const updateOb = {
      _id: cellContent._id,
      title: cellContent.title,
      dueDate: cellContent.dueDate,
      attachments: cellContent.feedAttachment,
      description: cellContent.description,
      startDate: cellContent.startDate,
      actualCompletionDate: cellContent.actualCompletionDate,
      linkToKR: cellContent.linkToKR,
      assignTo: cellContent.assignTo,
      priority: cellContent.priority,
      comments: cellContent.comments,
      krReferenceId: cellContent.krReferenceId,
      userId: AuthUserId,
    };
    setUpdateObj(updateOb);
  };
  const handleDeleteTasks = (id, row) => {
    try {
      let user =
        localStorage.getItem("userData") !== null
          ? JSON.parse(localStorage.getItem("userData"))
          : null;
      if (user !== null) {
        const objectiveStatus = {
          objectiveStatus: "Delete",
          row: { ...row, employeeReferenceId: user.ownerId },
          companyInfo: {
            employeeName: user.ownerName,
            employeeReferenceId: user.ownerId,
          },
        };
        let response2 = dispatch(updateNotificationTask(id, objectiveStatus));
        response2.then(({ success, message }) => {
          if (success) {
            let response = dispatch(deleteTask(id));
            response.then(({ success, message }) => {
              if (success) {
                fetchKeyResults();
                setError("");
              } else {
                setError(message);
              }
            });
          }
        });
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleCallbackEditTask = (childData) => {
    try {
      setLoading(true);
      let response = dispatch(updateTask(childData[1].id, childData[0]));
      response.then(({ data, message, success }) => {
        if (success) {
          let user =
            localStorage.getItem("userData") !== null
              ? JSON.parse(localStorage.getItem("userData"))
              : null;
          if (user !== null) {
            const objectiveStatus = {
              objectiveStatus: "Update",
              row: { ...childData[0], employeeReferenceId: user.ownerId },
              companyInfo: {
                employeeName: user.ownerName,
                employeeReferenceId: user.ownerId,
              },
            };
            let response2 = dispatch(
              updateNotificationTask(childData[1].id, objectiveStatus)
            );
            response2.then(({ success, message }) => {
              if (success) {
                setEditModalTask(false);
                setLoading(false);
                setError("");
                fetchKeyResults();
              }
            });
          }
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const columns = [
    {
      dataField: "keyResultName",
      text: "KEY RESULT",
      csvExport: false,
      style: { width: "5%" },
    },
    {
      dataField: "frequency",
      text: "FREQUENCY",
      style: { width: "5%" },
    },
    {
      dataField: "uom",
      text: "UOM",
      style: { width: "5%" },
    },
    {
      dataField: "polarity",
      text: "POLARITY",
      style: { width: "5%" },
    },
    //{
    //  dataField: "msc",
    //  text: "MSC",
    //  style: { width: "5%" },
    //},
    {
      dataField: "targetDate",
      text: "TARGET DATE",
      style: { width: "5%" },
    },
    {
      dataField: "actualDate",
      text: "ACTUAL DATE",
      style: { width: "5%" },
    },
    {
      dataField: "target",
      text: "TARGET",
      style: { width: "5%" },
    },
    {
      dataField: "actual",
      text: "ACTUAL",
      style: { width: "5%" },
    },
    {
      dataField: "basevalue",
      text: "BASE",
      style: { width: "5%" },
    },
    {
      dataField: "progress",
      text: "PROGRESS",
      style: { width: "15%" },
      formatter: (cellContent, row) => {
        return (
          <ProgressStatus
            percent={row.progress}
            onEdit={() => { }}
          // handleEdit(row);
          // setEditModal(true)
          />
        );
      },
    },

    {
      dataField: "action",
      text: "ACTION",
      style: { width: "5%" },
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
                className="dropdown-menu text-left dropdown-menu-right "
                aria-labelledby="dropdownMenuButton"
              >
                {(row.objectiveStatus === "Unlock" ||
                  row.objectiveStatus === "Reject" ||
                  row.objectiveStatus === "Create" ||
                  row.objectiveStatus === "Update") &&
                  privileges &&
                  privileges.length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  ).length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  )[0].edit && (
                    <button
                      className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                      onClick={() => handleAddTask(row)}
                    >
                      &nbsp;
                      {t("OKR Details.Add New Task")}
                    </button>
                  )}
                {(row.objectiveStatus === "Unlock" ||
                  row.objectiveStatus === "Reject" ||
                  row.objectiveStatus === "Create" ||
                  row.objectiveStatus === "Update" ||
                  row.objectiveStatus === "Approve") &&
                  privileges &&
                  privileges.length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  ).length > 0 &&
                  (privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  )[0].view ||
                    privileges.filter(
                      (privilege) =>
                        privilege.page ===
                        "Key Results - Actual, comments update once locked"
                    ).length > 0) &&
                  (privileges.filter(
                    (privilege) =>
                      privilege.page ===
                      "Key Results - Actual, comments update once locked"
                  )[0].view ||
                    privileges.filter(
                      (privilege) =>
                        privilege.page ===
                        "Key Results - Target update once locked"
                    ).length > 0) &&
                  privileges.filter(
                    (privilege) =>
                      privilege.page ===
                      "Key Results - Target update once locked"
                  )[0].view && (
                    <button
                      className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                      onClick={() => handleComments(row)}
                    >
                      &nbsp;
                      {t("OKR Details.View Conversation")}
                    </button>
                  )}

                {(row.objectiveStatus === "Unlock" ||
                  row.objectiveStatus === "Reject" ||
                  row.objectiveStatus === "Create" ||
                  row.objectiveStatus === "Update" ||
                  row.objectiveStatus === "Approve") &&
                  privileges &&
                  privileges.length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  ).length > 0 &&
                  (privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  )[0].edit ||
                    privileges.filter(
                      (privilege) =>
                        privilege.page ===
                        "Key Results - Actual, comments update once locked"
                    ).length > 0) &&
                  (privileges.filter(
                    (privilege) =>
                      privilege.page ===
                      "Key Results - Actual, comments update once locked"
                  )[0].edit ||
                    privileges.filter(
                      (privilege) =>
                        privilege.page ===
                        "Key Results - Target update once locked"
                    ).length > 0) &&
                  privileges.filter(
                    (privilege) =>
                      privilege.page ===
                      "Key Results - Target update once locked"
                  )[0].edit && (
                    <button
                      className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                      onClick={() => handleEdit(row)}
                      disabled={row.target === row.actual}
                    >
                      &nbsp;
                      {t("OKR Details.Edit")}
                    </button>
                  )}

                {(row.objectiveStatus === "Unlock" ||
                  row.objectiveStatus === "Reject" ||
                  row.objectiveStatus === "Create" ||
                  row.objectiveStatus === "Update") &&
                  privileges &&
                  privileges.length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  ).length > 0 &&
                  privileges.filter(
                    (privilege) => privilege.page === "Key Results"
                  )[0].delete && (
                    <button
                      className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                      onClick={() => handleDelete(row._id, row)}
                    >
                      &nbsp;
                      {t("OKR Details.Delete ")}
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
      text: "",
      style: { width: "5%" },
      headerAttrs: {
        hidden: false,
      },
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
                <button className="dropdown-hide d-toggle" type="button">
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
        return <p>{window.moment(row.dueDate).format("d MMM YYYY")}</p>;
      },
    },
    {
      dataField: "weight",
      text: "WEIGHT",
      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: { width: "9%" },
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
            <p>{row.weight}</p>
          </div>
        );
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
      dataField: "successMetrics",
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
                        handleViewTask(row);
                        setViewModalTask(true);
                      }}
                    >
                      <img src={eye} alt="edit table icon" />
                      &nbsp; {t("Tasks.View")}
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
                        handleEditTask(row);
                        setEditModalTask(true);
                      }}
                      disabled={row.progressStatus === 100}
                    >
                      <img src={editTableIcon} alt="edit table icon" />
                      &nbsp;
                      {t("Tasks.Edit")}
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
                      &nbsp; {t("Tasks.Delete")}
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

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    //selected: true,
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
  const addNewKrfunction = () => {
    setAddNewKr(true);
    setShowAttachment(true);
    setKeyResultsText({});
  };
  const fetchKeyResults = () => {
    let user =
      localStorage.getItem("user") !== null
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    if (user !== null) {
      let response = dispatch(getKeyResultSingle(id, user.role));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(data, data.length);
          setOKRDetails(result[0]);
          let emptyData = {
            dimension: result[0].dimension ? result[0].dimension : "",
            keyResultName: result[0].keyResultName
              ? result[0].keyResultName
              : "",
            target: result[0].target ? result[0].target : "",
            actual: result[0].actual ? result[0].actual : 0,
            basevalue: result[0].basevalue ? result[0].basevalue : 0,
            status: result[0].status ? result[0].status : "",
            frequency: result[0].frequency ? result[0].frequency : undefined,
            uom: result[0].uom ? result[0].uom : "",
            polarity: result[0].polarity ? result[0].polarity : "",
            msc: result[0].msc ? result[0].msc : "",
            targetDate: result[0].targetDate ? result[0].targetDate : null,
            actualDate: result[0].actualDate ? result[0].actualDate : null,
            okrName: result[0].objective,
            feedAttachment: result[0].feedAttachment
              ? result[0].feedAttachment
              : "",
            objectiveStatus: result[0].objectiveStatus
              ? result[0].objectiveStatus
              : "",
            objective: result[0].objective ? result[0].objective : "",
          };
          setData(result);
          setEmptyData(emptyData);
          setUpdateData(emptyData);
          setPrivileges(result[0].privileges);
          setIsAlignedToCompany(result[0].isAlignedToCompany);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setData([]);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    }
  };
  useEffect(() => {
    if (emptyData.keyResultName !== undefined) {
      handleEditData();
    }
    //eslint-disable-next-line
  }, [okrdetails]);
  useEffect(() => {
    fetchKeyResults();
    //eslint-disable-next-line
  }, [id]);
  const handleAddTask = (row) => {
    setOrderModalShow(true);
    setSelectedKR(row._id);
  };
  const filterData = (data) => {
    return data.filter((item) => {
      return (
        item.keyResultName
          .toLowerCase()
          .indexOf(searchKey || frequency.toLowerCase()) !== -1 ||
        item.frequency
          .toLowerCase()
          .indexOf(searchKey || frequency.toLowerCase()) !== -1
      );
    });
  };
  const handleChangeSearch = ({ target: { name, value } }) => {
    if (update) {
      let updatedData = { ...updateData };
      updatedData[name] = value;
      setUpdateData(updatedData);
      setError("");
    } else {
      let updatedData = { ...keyResultsText };
      updatedData[name] = value;
      setKeyResultsText(updatedData);
      setError("");
    }
  };
  const handleComments = (row) => {
    setOrderModalShow3(true);
    setKRReferenceId(row._id);
    setemployeeReferenceId(emptyData.employeeReferenceId);
    setEmployeeName(emptyData.employeeName);
  };
  const clearAll = () => {
    setClearSelectInputs(true);
    setKeyResultsText({
      ...emptyData,
      targetDate: null,
      actualDate: null,
    });
    setUpdateData({
      targetDate: null,
      actualDate: null,
    });
    setIsAlignedToCompany(false);
    setUpdateCheckBox(false);
    setIsEdit(false);
    setAddNewKr(false);
  };
  const handleChangeCheckBox = () => {
    if (update) {
      setUpdateCheckBox(!updateCheckBox);
    } else {
      setIsAlignedToCompany(!isAlignedToCompany);
    }
  };

  const handleUpdate = () => {
    try {
      if (update) {
        setLoading(true);
        const finalCheckBox = {
          isAlignedToCompany: updateCheckBox ? "Yes" : "No",
        };
        const finalData = {
          ...updateData,
          ...finalCheckBox,
          companyId: localStorage.getItem("companyId") !== null ? JSON.parse(localStorage.getItem("companyId")) : null
        };
        let response = dispatch(updatekeyResult(updateRowId, finalData));
        response.then(({ success, message }) => {
          setIsEdit(false);
          if (success) {
            const objectiveStatus = {
              objectiveStatus: "Update",
              row: {
                ...finalData,
                employeeReferenceId: okrdetails.employeeReferenceId
                  ? okrdetails.employeeReferenceId
                  : employeeReferenceId,
              },
              companyInfo: {
                ...okrdetails,
                employeeReferenceId: okrdetails.employeeReferenceId
                  ? okrdetails.employeeReferenceId
                  : employeeReferenceId,
              },
            };
            let response2 = dispatch(
              updateNotificationKR(updateRowId, objectiveStatus)
            );
            response2.then(({ success, message }) => {
              setIsEdit(false);
              if (success) {
                setKeyResultsText(emptyData);
                fetchKeyResults();
                setLoading(false);
                setError("");
                clearAll();
              } else {
                setLoading(false);
                setError(message);
              }
            });
          } else {
            setLoading(false);
            setError(message);
          }
        });
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const handleSave = () => {
    try {
      var finalData = {
        okrName: emptyData.objective,
        dimension: keyResultsText.dimension,
        isAlignedToCompany: isAlignedToCompany ? "Yes" : "No",
        keyResultName: keyResultsText.keyResultName,
        frequency: keyResultsText.frequency,
        uom: keyResultsText.uom,
        polarity: keyResultsText.polarity,
        msc: keyResultsText.msc,
        targetDate: keyResultsText.targetDate,
        actualDate: keyResultsText.actualDate,
        target: keyResultsText.target,
        actual: keyResultsText.actual,
        basevalue: keyResultsText.basevalue,
        feedAttachment: keyResultsText.feedAttachment,
        objectiveId: emptyData.objectiveId,
        userId: AuthUserId,
        companyId: localStorage.getItem("companyId") !== null ? JSON.parse(localStorage.getItem("companyId")) : null
      };
      var finalData2 = { ...finalData, ...comment };
      let response = dispatch(createkeyResult(finalData2));
      response.then(({ success, message }) => {
        setLoading(true);
        if (success) {
          const objectiveStatus = {
            objectiveStatus: "Create",
            row: {
              ...finalData2,
              employeeReferenceId: okrdetails.employeeReferenceId
                ? okrdetails.employeeReferenceId
                : employeeReferenceId,
            },
            companyInfo: {
              ...okrdetails,
              employeeReferenceId: okrdetails.employeeReferenceId
                ? okrdetails.employeeReferenceId
                : employeeReferenceId,
            },
          };
          let response2 = dispatch(
            updateNotificationKR(data._id, objectiveStatus)
          );
          response2.then(({ success, message }) => {
            setLoading(true);
            if (success) {
              setKeyResultsText(emptyData);
              setCreatedData(response);
              fetchKeyResults();
              setLoading(false);
              setError("");
              clearAll();
            } else {
              setLoading(false);
              setError(message);
            }
          });
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleDelete = (id, row) => {
    try {
      const objectiveStatus = {
        objectiveStatus: "Delete",
        row: {
          ...row,
          employeeReferenceId: okrdetails.employeeReferenceId
            ? okrdetails.employeeReferenceId
            : employeeReferenceId,
        },
        companyInfo: {
          ...okrdetails,
          employeeReferenceId: okrdetails.employeeReferenceId
            ? okrdetails.employeeReferenceId
            : employeeReferenceId,
        },
      };
      let response2 = dispatch(updateNotificationKR(id, objectiveStatus));
      response2.then(({ success, message }) => {
        if (success) {
          let response = dispatch(deletekeyResult(id));
          response.then(({ success, message }) => {
            if (success) {
              fetchKeyResults();
              setError("");
            } else {
              setError(message);
            }
          });
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleCascade = () => {
    setOrderModalShow4(true);
  };
  const handleEditData = () => {
    setUpdateCheckBox(
      emptyData.isAlignedToCompany ? emptyData.isAlignedToCompany : false
    );
    setUpdate(true);
    setIsEdit(true);
    const data = {
      // _id:row._id,
      dimension: emptyData.dimension || "",
      okrName: emptyData.objective || "",
      keyResultName: emptyData.keyResultName || "",
      frequency: emptyData.frequency || "",
      uom: emptyData.uom || "",
      polarity: emptyData.polarity || " ",
      msc: emptyData.msc || "",
      targetDate:
        window.moment(emptyData.targetDate).format("YYYY-MM-DD") || null,
      actualDate: emptyData.actualDate
        ? window.moment(emptyData.actualDate).format("YYYY-MM-DD")
        : null,
      target: emptyData.target || "",
      actual: emptyData.actual || 0,
      basevalue: emptyData.basevalue || 0,
      feedAttachment: emptyData.feedAttachment || "",
      objectiveId: emptyData.objectiveId || "",
      weight: emptyData.weight || "",
      userId: AuthUserId,
      //_id: emptyData._id
    };
    setUpdateRowId(emptyData.keyId);
    setUpdateData(data);
    setAddNewKr(true);
  };
  const handleEdit = (row) => {
    setUpdateCheckBox(row.isAlignedToCompany);
    setUpdate(true);
    setIsEdit(true);
    const data = {
      // _id:row._id,
      dimension: row.dimension || "",
      okrName: row.okrName || "",
      keyResultName: row.keyResultName || "",
      frequency: row.frequency || "",
      uom: row.uom || "",
      polarity: row.polarity || " ",
      msc: row.msc || "",
      targetDate: window.moment(row.targetDate).format("YYYY-MM-DD") || null,
      actualDate: row.actualDate
        ? window.moment(row.actualDate).format("YYYY-MM-DD")
        : null,
      target: row.target || "",
      actual: row.actual || 0,
      basevalue: row.basevalue || 0,
      feedAttachment: row.feedAttachment || "",
      objectiveId: emptyData.objectiveId || "",
      weight: emptyData.weight || "",
      objectiveStatus: emptyData.objectiveStatus,
      _id: row._id || "",
      userId: AuthUserId,
    };
    setUpdateRowId(row._id);
    setUpdateData(data);
    setAddNewKr(true);
    setKeyResultsText({});
    setShowAttachment(
      row.feedAttachment && row.feedAttachment.length > 0 ? false : true
    );
  };
  const handleCallback2 = (childData) => {
    try {
      setLoading(true);
      const data = {
        title: childData.title,
        description: childData.description,
        startDate: childData.startDate,
        dueDate: childData.dueDate,
        actualCompletionDate: childData.actualCompletionDate,
        linkToKR: childData.linkToKr,
        assignTo: childData.assignTo,
        priority: childData.priority,
        comments: childData.comments,
        attachments: childData.attachments,
        krReferenceId: childData.krReferenceId,
        owner: childData.owner,
        estimationEffort: childData.estimationEffort,
        actualEffort: childData.actualEffort,
        userId: AuthUserId,
      };
      let response = dispatch(createTask(data));
      response.then(({ data, message }) => {
        if (data !== undefined) {
          let user =
            localStorage.getItem("userData") !== null
              ? JSON.parse(localStorage.getItem("userData"))
              : null;
          const objectiveStatus = {
            objectiveStatus: "Create",
            row: { ...data, employeeReferenceId: user.ownerId },
            companyInfo: {
              employeeReferenceId: user.ownerId,
              ...emptyData,
            },
          };
          let response2 = dispatch(
            updateNotificationTask(data._id, objectiveStatus)
          );
          response2.then(({ success, message }) => {
            if (success) {
              setOrderModalShow(false);
              setLoading(false);
              setError("");
              fetchKeyResults();
            }
          });
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleCallback3 = (childData) => {
    setComment(childData);
    setOrderModalShow2(false);
  };
  return (
    <>
      <TitleHeader name="Employee Portal - OKR" />
      <div className="bg-light-primary rounded mh-100 p-4 m-4">
        <div className="company-form">
          <div className="header">
            <div>
              <p className="text-header">OKR Details</p>
            </div>
            <div className="d-flex">
              {(emptyData.objectiveStatus === "Unlock" ||
                emptyData.objectiveStatus === "Reject" ||
                emptyData.objectiveStatus === "Create" ||
                emptyData.objectiveStatus === "Update") &&
                privileges &&
                privileges.length > 0 &&
                privileges.filter(
                  (privilege) => privilege.page === "Cascade Objectives"
                ).length > 0 &&
                privileges.filter(
                  (privilege) => privilege.page === "Cascade Objectives"
                )[0].view && (
                  <div
                    className="cascade"
                    style={{ cursor: "pointer" }}
                    onClick={handleCascade}
                  >
                    Cascade
                  </div>
                )}
              <div className="ml-2">
                <img src={download} alt="downloadd" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
              <p>
                OKR Name:
                <span className="okr-name ml-2">{emptyData.objective}</span>
              </p>
            </div>
            <div className="col-5">
              <SelectInput
                label="Dimension"
                name="dimension"
                options={Dimensions}
                value={
                  updateData.dimension
                    ? updateData.dimension
                    : keyResultsText.dimension
                }
                style={{ marginRight: "150px" }}
                onChangeText={handleChangeSearch}
              />
            </div>
          </div>
          <div className="header mt-3">
            <div>
              <CheckboxInput
                label="Aligned To Company Objective"
                name="alignedObjective"
                value={updateCheckBox ? updateCheckBox : isAlignedToCompany}
                onChangeText={handleChangeCheckBox}
              />
            </div>
            <div></div>
          </div>
        </div>
        <div className="company-form mt-3">
          <div className="header">
            <div>
              <p className="text-header">Add KR Details</p>
            </div>
            <div>
              {(emptyData.objectiveStatus === "Unlock" ||
                emptyData.objectiveStatus === "Reject" ||
                emptyData.objectiveStatus === "Create" ||
                emptyData.objectiveStatus === "Update") &&
                !isEdit &&
                !addNewKr && (
                  <Button
                    text="Add New KR"
                    className="bg-green border text-white"
                    handleClick={addNewKrfunction}
                  />
                )}
            </div>
          </div>
          <div>
            {loading ? (
              <LoadingIndicator />
            ) : (
              <div>
                {!addNewKr && (
                  <div>
                    <Row>
                      <Col lg="9">
                        <Row className="mt-2">
                          <Col lg="3">
                            <label htmlFor="keyResult">Key Result Name</label>
                          </Col>
                          <Col lg="9">
                            <input
                              type="text"
                              id="keyResult"
                              className="form-control bg-light searchBox text-dark fs14"
                              value={searchKey}
                              onChange={(e) => setSearchKey(e.target.value)}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col lg="3" className="mt-2">
                        <SelectInput
                          label="Frequency"
                          placeholder="--Select--"
                          name="frequency"
                          options={Frequencies}
                          value={frequency}
                          onChangeText={(e) => setFrequency(e.target.value)}
                        />
                      </Col>
                    </Row>
                  </div>
                )}
                {addNewKr && (
                  <div>
                    <Row className="mt-3 p-2">
                      <Col lg="2">
                        <label htmlFor="keyResult" className="m-1 fs14">
                          Key Result Name
                        </label>
                      </Col>
                      <Col lg="10">
                        <input
                          type="text"
                          placeholder=""
                          name="keyResultName"
                          id="keyResult"
                          className="form-control bg-light searchBox text-dark fs14"
                          value={
                            updateData.keyResultName
                              ? updateData.keyResultName
                              : keyResultsText.keyResultName
                          }
                          onChange={handleChangeSearch}
                          disabled={
                            updateData.objectiveStatus === "Approve" &&
                            privileges &&
                            privileges.length > 0 &&
                            privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            ).length > 0 &&
                            (privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            )[0].edit ||
                              privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Actual, comments update once locked"
                              ).length > 0) &&
                            (privileges.filter(
                              (privilege) =>
                                privilege.page ===
                                "Key Results - Actual, comments update once locked"
                            )[0].edit ||
                              privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Target update once locked"
                              ).length > 0) &&
                            privileges.filter(
                              (privilege) =>
                                privilege.page ===
                                "Key Results - Target update once locked"
                            )[0].edit
                          }
                        />
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col className="">
                        <SelectInput
                          label="Frequency"
                          placeholder="--Select--"
                          name="frequency"
                          options={Frequencies}
                          value={
                            updateData.frequency
                              ? updateData.frequency
                              : keyResultsText.frequency
                          }
                          onChangeText={handleChangeSearch}
                          readonly={
                            updateData.objectiveStatus === "Approve" &&
                            privileges &&
                            privileges.length > 0 &&
                            privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            ).length > 0 &&
                            (privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            )[0].edit ||
                              privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Actual, comments update once locked"
                              ).length > 0) &&
                            (privileges.filter(
                              (privilege) =>
                                privilege.page ===
                                "Key Results - Actual, comments update once locked"
                            )[0].edit ||
                              privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Target update once locked"
                              ).length > 0) &&
                            privileges.filter(
                              (privilege) =>
                                privilege.page ===
                                "Key Results - Target update once locked"
                            )[0].edit
                          }
                        />
                      </Col>
                      <Col className="">
                        <SelectInput
                          label="UOM"
                          placeholder="--Select--"
                          name="uom"
                          options={UOMs}
                          value={
                            updateData.uom ? updateData.uom : keyResultsText.uom
                          }
                          onChangeText={handleChangeSearch}
                          readonly={
                            updateData.objectiveStatus === "Approve" &&
                            privileges &&
                            privileges.length > 0 &&
                            privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            ).length > 0 &&
                            (privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            )[0].edit ||
                              privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Actual, comments update once locked"
                              ).length > 0) &&
                            (privileges.filter(
                              (privilege) =>
                                privilege.page ===
                                "Key Results - Actual, comments update once locked"
                            )[0].edit ||
                              privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Target update once locked"
                              ).length > 0) &&
                            privileges.filter(
                              (privilege) =>
                                privilege.page ===
                                "Key Results - Target update once locked"
                            )[0].edit
                          }
                        />
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col className="">
                        <SelectInput
                          label="Polarity"
                          placeholder="--Select--"
                          name="polarity"
                          value={
                            updateData.polarity
                              ? updateData.polarity
                              : keyResultsText.polarity
                          }
                          onChangeText={handleChangeSearch}
                          options={Polarities}
                          readonly={
                            updateData.objectiveStatus === "Approve" &&
                            privileges &&
                            privileges.length > 0 &&
                            privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            ).length > 0 &&
                            (privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            )[0].edit ||
                              privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Actual, comments update once locked"
                              ).length > 0) &&
                            (privileges.filter(
                              (privilege) =>
                                privilege.page ===
                                "Key Results - Actual, comments update once locked"
                            )[0].edit ||
                              privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Target update once locked"
                              ).length > 0) &&
                            privileges.filter(
                              (privilege) =>
                                privilege.page ===
                                "Key Results - Target update once locked"
                            )[0].edit
                          }
                        />
                      </Col>

                      <Col className="">
                        <TextInput
                          label="Target Date"
                          dateType="date"
                          name="targetDate"
                          value={
                            updateData.targetDate
                              ? updateData.targetDate
                              : keyResultsText.targetDate
                          }
                          onChangeText={handleChangeSearch}
                          disabled={
                            !(
                              updateData.objectiveStatus === "Unlock" ||
                              updateData.objectiveStatus === "Reject" ||
                              updateData.objectiveStatus === "Create" ||
                              updateData.objectiveStatus === "Approve"
                            ) &&
                            privileges &&
                            privileges.length > 0 &&
                            ((privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            ).length > 0 &&
                              privileges.filter(
                                (privilege) => privilege.page === "Key Results"
                              )[0].edit) ||
                              (privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Target update once locked"
                              ).length > 0 &&
                                privileges.filter(
                                  (privilege) =>
                                    privilege.page ===
                                    "Key Results - Target update once locked"
                                )[0].edit))
                          }
                        />
                      </Col>
                      <Col className="">
                        <TextInput
                          label="Actual date"
                          dateType="date"
                          name="actualDate"
                          value={
                            updateData.actualDate
                              ? updateData.actualDate
                              : keyResultsText.actualDate
                          }
                          onChangeText={handleChangeSearch}
                          disabled={
                            !(
                              updateData.objectiveStatus === "Unlock" ||
                              updateData.objectiveStatus === "Reject" ||
                              updateData.objectiveStatus === "Create" ||
                              updateData.objectiveStatus === "Approve"
                            ) &&
                            privileges &&
                            privileges.length > 0 &&
                            ((privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            ).length > 0 &&
                              privileges.filter(
                                (privilege) => privilege.page === "Key Results"
                              )[0].edit) ||
                              (privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Actual, comments update once locked"
                              ).length > 0 &&
                                privileges.filter(
                                  (privilege) =>
                                    privilege.page ===
                                    "Key Results - Actual, comments update once locked"
                                )[0].edit))
                          }
                        />
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col lg="4" className="">
                        <TextInput
                          dateType="number"
                          label="Base Value"
                          name="basevalue"
                          value={
                            updateData.basevalue
                              ? updateData.basevalue
                              : keyResultsText.basevalue
                          }
                          onChange={handleChangeSearch}
                          // eslint-disable-next-line no-mixed-operators
                          disabled={
                            updateData.objectiveStatus === "Approve" &&
                            privileges &&
                            privileges.length > 0 &&
                            ((privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            ).length > 0 &&
                              privileges.filter(
                                (privilege) => privilege.page === "Key Results"
                              )[0].edit) ||
                              (privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Actual, comments update once locked"
                              ).length > 0 &&
                                privileges.filter(
                                  (privilege) =>
                                    privilege.page ===
                                    "Key Results - Actual, comments update once locked"
                                )[0].edit) ||
                              (privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Target update once locked"
                              ).length > 0 &&
                                privileges.filter(
                                  (privilege) =>
                                    privilege.page ===
                                    "Key Results - Target update once locked"
                                )[0].edit))
                          }
                        />
                      </Col>
                      <Col lg="4" className="">
                        <TextInput
                          dateType="number"
                          label="Target"
                          name="target"
                          value={
                            updateData.target
                              ? updateData.target
                              : keyResultsText.target
                          }
                          onChangeText={handleChangeSearch}
                          disabled={
                            !(
                              updateData.objectiveStatus === "Unlock" ||
                              updateData.objectiveStatus === "Reject" ||
                              updateData.objectiveStatus === "Create" ||
                              updateData.objectiveStatus === "Approve"
                            ) &&
                            privileges &&
                            privileges.length > 0 &&
                            ((privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            ).length > 0 &&
                              privileges.filter(
                                (privilege) => privilege.page === "Key Results"
                              )[0].edit) ||
                              (privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Target update once locked"
                              ).length > 0 &&
                                privileges.filter(
                                  (privilege) =>
                                    privilege.page ===
                                    "Key Results - Target update once locked"
                                )[0].edit))
                          }
                        />
                      </Col>
                      <Col lg="4" className="">
                        <TextInput
                          dateType="number"
                          label="Actual"
                          name="actual"
                          value={
                            updateData.actual
                              ? updateData.actual
                              : keyResultsText.actual
                          }
                          onChange={handleChangeSearch}
                          disabled={
                            !(
                              updateData.objectiveStatus === "Unlock" ||
                              updateData.objectiveStatus === "Reject" ||
                              updateData.objectiveStatus === "Create" ||
                              updateData.objectiveStatus === "Approve"
                            ) &&
                            privileges &&
                            privileges.length > 0 &&
                            ((privileges.filter(
                              (privilege) => privilege.page === "Key Results"
                            ).length > 0 &&
                              privileges.filter(
                                (privilege) => privilege.page === "Key Results"
                              )[0].edit) ||
                              (privileges.filter(
                                (privilege) =>
                                  privilege.page ===
                                  "Key Results - Actual, comments update once locked"
                              ).length > 0 &&
                                privileges.filter(
                                  (privilege) =>
                                    privilege.page ===
                                    "Key Results - Actual, comments update once locked"
                                )[0].edit))
                          }
                        />
                      </Col>
                    </Row>

                    <div className="mt-3 mb-3 p-3">
                      {addNewKr &&
                        (showAttachment ? (
                          <BrowseFilesNormal
                            className="col-12"
                            setData={({ url }) => {
                              handleChangeSearch({
                                target: { name: "feedAttachment", value: url },
                              });
                              setShowAttachment(!showAttachment);
                            }}
                          />
                        ) : (
                          <div className="d-flex justify-content-between align-items-center">
                            <a
                              href={
                                keyResultsText.feedAttachment
                                  ? keyResultsText.feedAttachment
                                  : updateData.feedAttachment
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Attachment
                            </a>
                            <button
                              className="btn btn-primary"
                              onClick={() => setShowAttachment(!showAttachment)}
                            >
                              Reupload Attachment
                            </button>
                          </div>
                        ))}
                    </div>
                    <div className="row mt-3">
                      <Button
                        text={t("objectives.Clear")}
                        className="bg-light border border-dark text-dark"
                        handleClick={clearAll}
                      />
                      {!isEdit ? (
                        <Button
                          handleClick={handleSave}
                          text="Save"
                          className="bg-green border text-white"
                        />
                      ) : (
                        <Button
                          text="Update"
                          className="bg-green border text-white"
                          handleClick={handleUpdate}
                        />
                      )}
                      <Button
                        handleClick={() => handleComments(updateData)}
                        text="Comment"
                        className="bg-green border text-white"
                      />
                    </div>
                  </div>
                )}
                <div>
                  {loading ? (
                    <div className="text-center">
                      <LoadingIndicator size={3} />
                    </div>
                  ) : (
                    <Table
                      title="okr details"
                      data={filterData(data).filter((item) => {
                        return (
                          item.keyResultName
                            .toLowerCase()
                            .indexOf(item.keyResultName.toLowerCase()) !== -1 ||
                          item.frequency
                            .toLowerCase()
                            .indexOf(
                              item.frequency.toString().toLowerCase()
                            ) !== -1
                        );
                      })}
                      columns={columns}
                      paginationFactory={paginationFactory}
                      searchKey={searchKey || frequency}
                      selectRow={selectRow}
                      //data2={{ a: null }}
                      childData={{
                        data,
                        columnsChild: columnsChildTasks,
                        columnsChildTasks,
                        searchKey,
                        checkboxOptions: [],
                      }}
                    />
                  )}
                  <p className="m-0 fs14 text-center text-danger">
                    {error.length > 0 ? error : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {orderModalShow && (
        <Popup
          show={orderModalShow}
          onHide={() => setOrderModalShow(false)}
          handlecallback={(data) => handleCallback2(data)}
          selectedKR={selectedKR}
        />
      )}
      {orderModalShow2 && (
        <CommentPopup
          show={orderModalShow2}
          onHide={() => setOrderModalShow2(false)}
          handlecallback={(data) => handleCallback3(data)}
        />
      )}
      {orderModalShow3 && (
        <EditCommentPopup
          show={orderModalShow3}
          onHide={() => setOrderModalShow3(false)}
          krReferenceId={krReferenceId}
          employeeName={employeeName}
          employeeReferenceId={employeeReferenceId}
        />
      )}
      {orderModalShow4 && (
        <CascadedPopup
          show={orderModalShow4}
          onHide={() => setOrderModalShow4(false)}
          selectedObjective={[
            { objectiveId: emptyData.objectiveId, weight: emptyData.weight },
          ]}
          handleCallback={() => { }}
        />
      )}
      {editTaskModal && (
        <TasksEditPopup
          show={editTaskModal}
          onHide={() => setEditModalTask(false)}
          data={updateObj}
          owner={emptyData}
          handlecallbackeditTask={handleCallbackEditTask}
        />
      )}
      {viewTaskModal && (
        <TasksView
          show={viewTaskModal}
          onHide={() => setViewModalTask(false)}
          data={updateObj}
          owner={emptyData}
        />
      )}
    </>
  );
}
