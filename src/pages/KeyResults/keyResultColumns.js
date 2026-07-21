import React from "react";
import ArrowOrderComponent from "../Objectives/ObjectivesTable/ArrowOrderComponent";
import trashIcon from "assets/svg/trashIcon.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import attachmentIcon from "assets/svg/attachmentIcon.svg";
import ProgressStatus from "pages/Objectives/ProgressStatus";
import { Link } from "react-router-dom";
import { t } from "i18next";

export default function keyResultsColumns(privileges, handleDelete) {
  return [
    {
      dataField: "id",
      text: "S.No",
      csvExport: false,
      hidden: true,
    },
    {
      dataField: "_id",
      text: "_id",
      hidden: true,
    },
    {
      dataField: "okrName",
      text: t("KeyResult.OBJECTIVE"),
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => <ArrowOrderComponent order={order} column={column.dataField} />,
      headerClasses: "id-custom-cell",
      style: { width: "400px" },
    },
    {
      dataField: "keyResultName",
      text: t("KeyResult.KR"),
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => <ArrowOrderComponent order={order} column={column.dataField} />,
      formatter: (cellContent, row) => (
        <div className="d-flex">
          {privileges?.some(p => p.page === "Key Results" && p.edit) && (
            <Link
              to={{
                pathname: "/admin/objectives/okrdetails",
                state: {
                  data: {
                    objective: row.okrName,
                    objectiveId: row.objectiveId,
                    ...row,
                    keyId: row._id,
                    privileges,
                    _id: row.objectiveId,
                    objectiveStatus: row.objectiveStatus,
                    polarity: row.polarity || "Positive",
                  },
                },
              }}
              className="text-decoration-none text-left mr-2"
            >
              <p>{row.keyResultName}</p>
            </Link>
          )}
        </div>
      ),
      headerClasses: "id-custom-cell",
      style: { width: "400px" },
    },
    {
      dataField: "frequency",
      text: t("KeyResult.FREQUENCY"),
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => <ArrowOrderComponent order={order} column={column.dataField} />,
      headerClasses: "id-custom-cell",
      style: { width: "500px" },
    },
    {
      dataField: "uom",
      text: t("KeyResult.UOM"),
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => <ArrowOrderComponent order={order} column={column.dataField} />,
      headerClasses: "id-custom-cell",
      style: { width: "400px" },
    },
    {
      dataField: "polarity",
      text: t("KeyResult.POLARITY"),
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => <ArrowOrderComponent order={order} column={column.dataField} />,
      headerClasses: "id-custom-cell",
      style: { width: "500px" },
    },
    {
      dataField: "targetDate",
      text: t("KeyResult.TARGETDATE"),
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => <ArrowOrderComponent order={order} column={column.dataField} />,
      headerClasses: "id-custom-cell",
      style: { width: "10%" },
    },
    {
      dataField: "actualDate",
      text: t("KeyResult.ACTUALDATE"),
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => <ArrowOrderComponent order={order} column={column.dataField} />,
      headerClasses: "id-custom-cell",
      style: { width: "10%" },
    },
    {
      dataField: "target",
      text: t("KeyResult.TARGET"),
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => <ArrowOrderComponent order={order} column={column.dataField} />,
      headerClasses: "id-custom-cell",
      style: { width: "400px" },
    },
    {
      dataField: "actual",
      text: t("KeyResult.ACTUAL"),
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => <ArrowOrderComponent order={order} column={column.dataField} />,
      headerClasses: "id-custom-cell",
      style: { width: "400px" },
    },
    {
      dataField: "progress",
      text: t("KeyResult.PROGRESS"),
      formatter: (cellContent, row) => <ProgressStatus percent={row.progress} onEdit={() => {}} />,
      style: { width: "12%" },
    },
    {
      dataField: "",
      text: t("KeyResult.ACTION"),
      csvExport: false,
      formatter: (cellContent, row) => (
        <div className="d-flex">
          {privileges?.some(p => p.page === "Key Results" && p.edit) && (
            <Link
              to={{
                pathname: "/admin/objectives/okrdetails",
                state: {
                  data: {
                    objective: row.okrName,
                    objectiveId: row.objectiveId,
                    ...row,
                    keyId: row._id,
                    privileges,
                    _id: row.objectiveId,
                    objectiveStatus: row.objectiveStatus,
                    polarity: row.polarity || "Positive",
                  },
                },
              }}
              className="text-decoration-none text-left mr-2"
            >
              <img src={editTableIcon} alt="edit" className="action-icon cursor-pointer" title={t("Tasks.Edit")} />
            </Link>
          )}
          {privileges?.some(p => p.page === "Key Results" && p.delete) && (
            <img
              src={trashIcon}
              alt="delete"
              className="action-icon cursor-pointer"
              title={t("Tasks.Delete")}
              onClick={() => handleDelete(row._id)}
            />
          )}
        </div>
      ),
      csvFormatter: () => <p>Export</p>,
    },
    {
      dataField: "feedAttachment",
      text: " ",
      headerAttrs: { hidden: false },
      formatter: (cellContent, row) => (
        <div className="d-flex flex-wrap">
          <div className="dropdown actionDropdown">
            <a
              href={row.feedAttachment?.length > 0 ? row.feedAttachment : "!#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="dropdown-hide d-toggle" type="button">
                <img src={attachmentIcon} alt="attachment" style={{ height: 25 }} className="cursor-pointer" />
              </button>
            </a>
          </div>
        </div>
      ),
    },
  ];
}
