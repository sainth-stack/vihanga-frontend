/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./styles.scss";
import objective from "assets/svg/objective.svg";
import childIcon from "assets/svg/child.svg";
import taskPlusIcon from "assets/svg/tasks.svg";
import ProgressStatus from "./ProgressStatus";
import ArrowOrderComponent from "./ObjectivesTable/ArrowOrderComponent";
import ManagerCascadedComponent from "./ObjectivesTable/ManagerCascadedComponent";
import ObjectivesActionsComponent from "./ObjectivesTable/ObjectivesActionsComponent";
import KeyResultsActionsComponent from "./ObjectivesTable/KeyResultsActionsComponent";
import TasksActionsComponent from "./ObjectivesTable/TasksActionsComponent";
import ApproveRejectComponent from "./ObjectivesTable/ApproveRejectComponent";
import { Link } from "react-router-dom";
import { defaultProfilePic } from "utilities";
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
  setEditModalTask,
  handleDeleteTasks,
  handleOpenPopup,
  handleAuditHistory,
  hideColumns
) {
  const columns = [
    {
      dataField: "objective",
      text: t("Objectives.Goal"),
      sort: true,
      headerClasses: "id-custom-cell",
      style: {
        width: "18.8%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <div>
            <img
              src={objective}
              alt="Objective"
              className="mr-1"
              style={{
                height: 15,
              }}
              onClick={() => {
                handleEdit(row);
                setEditModal(true);
              }}
            />
            <a
              href="#"
              onClick={() => {
                handleEdit(row);
                setEditModal(true);
              }}
            >
              {row.objective}
            </a>
            <i
              className="fa fa-trash p-2 cursor-pointer"
              onClick={() => handleDelete(row._id, row)}
            />
            <br />
            <small
              onClick={() => {
                handleEdit(row);
                setEditModal(true);
              }}
            >
              OKR Name
            </small>
            {row.cascaded && <ManagerCascadedComponent />}
          </div>
        );
      },
    },
    {
      dataField: "dueDate",
      text: t("Objectives.Due Date"),
      sort: true,
      style: {
        width: "9.8%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
    },
    {
      dataField: "weight",
      text: t("Objectives.Weight"),
      sort: true,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
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
      text: t("Objectives.Owner"),
      sort: true,
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
      dataField: "progressStatus",
      text: t("Objectives.PROGRESS"),
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
              if (
                row.objectiveStatus === "Unlock" ||
                row.objectiveStatus === "Reject" ||
                row.objectiveStatus === "Create" ||
                row.objectiveStatus === "Update"
              ) {
                handleEdit(row);
                setEditModal(true);
              }
            }}
          />
        );
      },
    },
    {
      dataField: "successMetrics",
      text: t("Objectives.Approve_Reject"),

      sort: true,
      formatter: (cellContent, row) => {
        return (
          <ApproveRejectComponent
            privileges={privileges}
            refreshData={() => refreshData()}
            row={row}
            companyInfo={props.companyInfo}
            totalWeight={totalWeight}
            forwardedRef3={props.forwardedRef3}
          />
        );
      },
    },
    {
      dataField: "action",
      text: t("Objectives.ACTION"),

      formatter: (cellContent, row) => {
        return (
          <ObjectivesActionsComponent
            privileges={privileges}
            row={row}
            companyInfo={props.companyInfo}
            handleEdit={handleEdit}
            setEditModal={setEditModal}
            handleDelete={handleDelete}
            setOrderModalShow4={setOrderModalShow4}
            setMultipleObjectives={setMultipleObjectives}
            setSelectedObjective={setSelectedObjective}
            forwardedRef2={props.forwardedRef2}
            refreshData={() => refreshData()}
            handleAuditHistory={handleAuditHistory}
          />
        );
      },
    },
  ];
  const columnsChild = [
    {
      dataField: "keyResultName",
      text: t("Objectives.OBJECTIVE"),

      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: {
        width: "23.8%",
        height: "91px",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <p className="text-left">
            <img
              src={childIcon}
              alt="Objective"
              className="mr-1"
              style={{
                height: 15,
              }}
            />
            <a
              href={null}
              onClick={() => {
                handleOpenPopup({
                  data: {
                    ...row,
                    _id: row.objectiveId,
                    keyId: row._id,
                    privileges,
                    objectiveStatus: row.objectiveStatus,
                    polarity: row.polarity ? row.polarity : "Positive",
                  },
                });
              }}
              className="text-decoration-none text-left cursor-pointer"
            >
              {row.keyResultName}
            </a>
          </p>
        );
      },
    },
    {
      dataField: "dueDate",
      text: t("Objectives.Target Date"),

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
        return <p>{window.moment(row.dueDate).format("D MMM YYYY")}</p>;
      },
    },
    {
      dataField: "weight",
      text: t("Objectives.Weight"),

      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: {
        width: "9%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return <div>{<p>{row.weight}</p>}</div>;
      },
    },
    {
      dataField: "owner",
      text: t("Objectives.Owner"),

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
      dataField: "progressStatus",
      text: t("objectives.Progress_Status"),

      sort: true,
      style: {
        width: "16.5%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return (
          <ProgressStatus
            percent={row.percent}
            updatedAt={row.updatedAt}
            onEdit={() => {}}
          />
        );
      },
    },
    {
      dataField: "successMetrics",
      text: t("Objectives.Successmetrics"),

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
        return <p>{row.successMetrics}</p>;
      },
    },
    {
      dataField: "action",
      text: t("Objectives.Action"),

      headerAttrs: {
        hidden: true,
      },
      style: {
        width: "8%",
      },
      formatter: (cellContent, row) => {
        return (
          <KeyResultsActionsComponent
            privileges={privileges}
            row={row}
            handleDeleteKeyResults={handleDeleteKeyResults}
          />
        );
      },
    },
    {
      dataField: "feed",
      text: t("Objectives.Feed"),

      headerAttrs: {
        hidden: true,
      },
      style: {
        width: "9%",
        paddingRight: "20px",
      },
      formatter: (cellContent, row) => {
        return (
          <Link to="/admin/tasks" className="btn btn-default">
            <i className="fa fa-external-link text-green" />
          </Link>
        );
      },
    },
  ];
  const columnsChildTasks = [
    {
      dataField: "title",
      text: t("Objectives.Title"),

      sort: true,
      headerAttrs: {
        hidden: true,
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
            <a href="#">{row.title}</a>
          </p>
        );
      },
    },
    {
      dataField: "targetDate",
      text: t("Objectives.Target Date"),

      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: {
        width: "10.4%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return <p>{window.moment(row.dueDate).format("D MMM YYYY")}</p>;
      },
    },
    {
      dataField: "weight",
      text: t("Objectives.Weight"),

      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: {
        width: "9%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
      formatter: (cellContent, row) => {
        return <div>{}</div>;
      },
    },
    {
      dataField: "owner",
      text: t("Objectives.Owner"),

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
      dataField: "successMetrics",
      text: t("Objectives.Successmetric"),

      sort: true,
      headerAttrs: {
        hidden: true,
      },
      style: {
        width: "29.5%",
      },
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
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
      text: t("Objectives.Action"),

      headerAttrs: {
        hidden: true,
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
          />
        );
      },
    },
    {
      dataField: "feed",
      text: t("Objectives.Feed"),

      headerAttrs: {
        hidden: true,
      },
      style: {
        width: "6%",
      },
      formatter: (cellContent, row) => {
        return (
          <Link to="/admin/tasks" className="btn btn-default">
            <i className="fa fa-external-link text-green" />
          </Link>
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
