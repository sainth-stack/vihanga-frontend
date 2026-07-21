/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./styles.scss";
import taskPlusIcon from "assets/svg/tasks.svg";
import Message from "assets/svg/message.svg";
import ProgressStatus from "./ProgressStatus";
import ArrowOrderComponent from "./ObjectivesTable/ArrowOrderComponent";
import TasksActionsComponent from "./ObjectivesTable/TasksActionsComponent";
import { defaultProfilePic, taskStatus } from "utilities";
import plus from "../../../src/assets/svg/plus.svg";
import { t } from "i18next";
export function Columns(
  handleEdit,
  setEditModal,
  privileges,
  refreshData,
  props,
  totalWeight,
  handleDelete,
  setOrderModalShow4,
  setMultipleObjectives,
  setSelectedObjective,
  handleDeleteKeyResults,
  handleViewTask,
  setViewModalTask,
  handleEditTask,
  handleSubTask,
  setEditModalTask,
  setSubTaskModal,
  handleDeleteTasks,
  addComment,
  handleAuditHistory,
  handleCopyTask
) {
  const columns = [
    {
      dataField: "title",
      text: t("Tasks.Title"),

      sort: true,
      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "19.5%",
        height: "91px",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <p className="text-left">
            <img
              src={taskPlusIcon}
              alt="Objective"
              className="mr-1"
              style={{
                height: 15,
              }}
            />
            <a
              className="text-primary cursor-pointer"
              onClick={() => {
                handleEditTask(row);
                setEditModalTask(true);
              }}
            >
              {row.title}
            </a>
          </p>
        );
      },
    },
    {
      dataField: "dueDate",
      text: t("Tasks.Due Date"),
      sort: true,
      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "11.4%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <p>
            {window.moment(row.dueDate).format("D MMM YYYY")}
            <br />
            {row.progressStatus < 100 && (
              <small
                className={`text-${
                  row.dueMessage.toString().includes("Under")
                    ? "success"
                    : "danger"
                }`}
              >
                {row.dueMessage}
              </small>
            )}
          </p>
        );
      },
    },

    {
      dataField: "owner",
      text: t("Tasks.Owner"),

      sort: true,
      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "15%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <div>
            <p>
              <img
                src={
                  row.profilePicture ? row.profilePicture : defaultProfilePic
                }
                alt="user pic"
                className="userPic"
              />{" "}
              {row.owner}
            </p>
          </div>
        );
      },
    },
    {
      dataField: "employeeName",
      text: "Assign To",
      sort: true,
      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "15%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <div>
            <p>{row.employeeName}</p>
          </div>
        );
      },
    },
    {
      dataField: "priority",
      text: t("Tasks.Priority"),

      sort: true,
      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "15%",
        height: "91px",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <p className="text-left">
            <img
              src={taskPlusIcon}
              alt="Objective"
              className="mr-1"
              style={{
                height: 15,
              }}
            />
            <a href="#">{row.priority}</a>
          </p>
        );
      },
    },
    {
      dataField: "status",
      text: t("objectives.Progress_Status"),
      sort: true,
      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "10%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <div>
            <p>{taskStatus.find((item) => item.value === row.status)?.key}</p>
          </div>
        );
      },
    },
    {
      dataField: "comments",
      text: t("Tasks.Comments"),
      sort: false,
      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "10%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <div onClick={() => addComment(row)} className="cursor-pointer">
            <img src={Message} alt="message" />
            <span className="date ml-1">{row.comments.length}</span>
          </div>
        );
      },
    },
    {
      dataField: "progressStatus",
      text: t("Tasks.Priority"),

      sort: true,
      style: {
        width: "12.8%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <ProgressStatus
            percent={row.progressStatus}
            updatedAt={row.updatedAt}
            onEdit={() => {
              handleEditTask(row);
              setEditModalTask(true);
            }}
          />
        );
      },
    },
    {
      dataField: "action",
      text: t("Tasks.Action"),

      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "7.5%",
      },
      formatter: (cellContent, row) => {
        return (
          <TasksActionsComponent
            privileges={privileges}
            row={row}
            handleViewTask={handleViewTask}
            setViewModalTask={setViewModalTask}
            handleEditTask={handleEditTask}
            setEditModalTask={setEditModalTask}
            handleDeleteTasks={handleDeleteTasks}
            handleAuditHistory={handleAuditHistory}
            handleCopyTask={handleCopyTask}
          />
        );
      },
    },
    {
      dataField: "feed",
      text: t("objectives.Sub Task"),

      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "6%",
      },
      formatter: (cellContent, row) => {
        let updatedRow = { ...row, mainTask: row._id };
        return (
          <img
            className="cursor-pointer"
            onClick={() => {
              handleSubTask(updatedRow);
              setSubTaskModal(true);
            }}
            alt=""
            src={plus}
            width="30px"
            height={"30px"}
          />
        );
      },
    },
  ];
  const columnsChild = [
    {
      dataField: "title",
      text: "TITLE",
      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: {
        width: "19.8%",
        height: "91px",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <p className="text-left">
            <img
              src={taskPlusIcon}
              alt="Objective"
              className="mr-1"
              style={{
                height: 15,
              }}
            />
            <a
              className="text-primary cursor-pointer"
              onClick={() => {
                handleEditTask(row);
                setEditModalTask(true);
              }}
            >
              {row.title}
            </a>
          </p>
        );
      },
    },
    {
      dataField: "dueDate",
      text: "DUE DATE",
      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: {
        width: "11%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (_cellContentt, row) => {
        return (
          <p>
            {window.moment(row.dueDate).format("D MMM YYYY")}
            <br />
            {row.progressStatus < 100 && (
              <small
                className={`text-${
                  row.dueMessage.toString().includes("Under")
                    ? "success"
                    : "danger"
                }`}
              >
                {row.dueMessage}
              </small>
            )}
          </p>
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
      style: {
        width: "15%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <div>
            <p>
              <img
                src={
                  row.profilePicture ? row.profilePicture : defaultProfilePic
                }
                alt="user pic"
                className="userPic"
              />{" "}
              {row.owner}
            </p>
          </div>
        );
      },
    },
    {
      dataField: "employeeName",
      text: "Assign To",
      sort: true,
      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "15%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <div>
            <p>{row.employeeName}</p>
          </div>
        );
      },
    },
    {
      dataField: "priority",
      text: t("Tasks.Priority"),

      sort: true,
      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "16%",
        height: "91px",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <p className="text-left">
            <img
              src={taskPlusIcon}
              alt="Objective"
              className="mr-1"
              style={{
                height: 15,
              }}
            />
            <a href="#">{row.priority}</a>
          </p>
        );
      },
    },
    {
      dataField: "status",
      text: t("objectives.Progress_Status"),
      sort: true,
      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "15%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <div>
            <p>{taskStatus.find((item) => item.value === row.status).key}</p>
          </div>
        );
      },
    },
    {
      dataField: "comments",
      text: t("Tasks.Comments"),
      sort: false,
      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "10%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <div onClick={() => addComment(row)} className="cursor-pointer">
            <img src={Message} alt="message" />
            <span className="date ml-1">{row.comments.length}</span>
          </div>
        );
      },
    },
    {
      dataField: "progressStatus",
      text: "PROGRESS",
      sort: true,
      style: {
        width: "12.8%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <ProgressStatus
            percent={row.progressStatus}
            updatedAt={row.updatedAt}
            onEdit={() => {
              handleEditTask(row);
              setEditModalTask(true);
            }}
          />
        );
      },
    },
    {
      dataField: "action",
      text: "ACTION",
      headerAttrs: {
        hidden: false,
      },
      style: {
        width: "7.5%",
      },
      formatter: (cellContent, row) => {
        return (
          <TasksActionsComponent
            privileges={privileges}
            handleAuditHistory={handleAuditHistory}
            row={row}
            handleViewTask={handleViewTask}
            setViewModalTask={setViewModalTask}
            handleEditTask={handleEditTask}
            setEditModalTask={setEditModalTask}
            handleDeleteTasks={handleDeleteTasks}
            handleCopyTask={handleCopyTask}
          />
        );
      },
    },
    {
      dataField: "feed",
      text: "FEED",
      headerAttrs: {
        hidden: true,
      },
      style: {
        width: "9%",
        paddingRight: "20px",
      },
      formatter: (cellContent, row) => {
        return <h1></h1>;
      },
    },
  ];
  const columnsChildTasks = [
    {
      dataField: "comment",
      text: "Comment",
      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: {
        width: "100%",
        height: "91px",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <p className="text-left">
            <img src={Message} alt="message" /> {row.comment}
          </p>
        );
      },
    },
  ];
  return {
    columns,
    columnsChild,
    columnsChildTasks,
  };
}
