import React, { useEffect, useState } from "react";
import "./styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import { deleteReviewForm } from "action/ReviewFormAct";
import { useDispatch } from "react-redux";
import { selectRow } from "pages/KeyResults/KeyResultsTable/defaultData";
import { updateReviewForm } from "action/ReviewFormAct";
import useGetReview from "./hooks/usegetReview";
import ReviewAction from "./ReviewAction";
import TableNormal from "components/TableNormal";
import { useQueryClient } from "@tanstack/react-query";
import MoveAsModal from "./ObjectiveMobile/movePopup";
import { t } from "i18next";
export default function ReviewsTable() {
  const [, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [, setError] = useState("");
  const [filterText, setFilterText] = useState("all");
  const [selectedData, setSelectedData] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([]);
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const { data: ReviewResponse, isLoading: ReviewLoading, error: ReviewError } = useGetReview();

  const opt1 = [
    { key: "Self submission", value: "Submit" },
    { key: "Manager Review", value: "Manager Review" },
    { key: "HR Calibration", value: "HR Review" },
    { key: "Manager Signoff", value: "Manager Signoff" },
    { key: "Employee Sign off", value: "Employee Sign off" },
    { key: "Completed", value: "Completed" },

  ];

  const handleDelete = (id) => {
    let response = dispatch(deleteReviewForm(id));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        queryClient.invalidateQueries("reviewsForm")
      } else {
        setLoading(false);
      }
    });
  }
  const handleCallback2 = (selectedUserId) => {
    let response = dispatch(updateReviewForm(selectedData._id, { ...selectedData, status: selectedUserId }, false));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        setShowModal(false)
        getAllReview();
      } else {
        setLoading(false);
      }
    });
  }

  const columns = [
    {
      dataField: "employeeFullName",
      text: t("Reviews.employee"),
      sort: true,
      formatter: (cellContent, row) => (
        <div>
          <a href={`/admin/reviews/${row._id}`}>{row.employeeFullName}</a>
          <i className="fa fa-trash cursor-pointer ml-2" onClick={() => handleDelete(row._id)} />
        </div>
      ),
    },
    {
      dataField: "startDate",
      text: t("Reviews.startDate"),
      sort: true,
      formatter: (cellContent, row) => <div>{row.reviewPeriodStartDate}</div>,
    },
    {
      dataField: "endDate",
      text: t("Reviews.endDate"),
      sort: true,
      formatter: (cellContent, row) => <div>{row.reviewPeriodEndDate}</div>,
    },
    {
      dataField: "createdAt",
      text: t("Reviews.createdAt"),
      sort: true,
      formatter: (cellContent, row) => <div>{window.moment(row.createdAt).format("YYYY-MM-DD")}</div>,
    },
    {
      dataField: "updatedAt",
      text: t("Reviews.updatedAt"),
      sort: true,
      formatter: (cellContent, row) => <div>{window.moment(row.updatedAt).format("YYYY-MM-DD")}</div>,
    },
    {
      dataField: "templateName",
      text: t("Reviews.template"),
      sort: true,
      formatter: (cellContent, row) => <div>{row.templateName}</div>,
    },
    {
      dataField: "move",
      text: t("Reviews.move"),
      sort: true,
      hidden: localStorage.getItem("user") !== null && JSON.parse(localStorage.getItem("user"))?.role.includes('Employee') ? true : false,
      formatter: (cellContent, row) => (
        <div>
          <button className="btn btn-primary bg-green" onClick={() => { setShowModal(true); setSelectedData(row) }}>
            {t("Reviews.move")}
          </button>
        </div>
      ),
    },
    {
      dataField: "status",
      text: t("Reviews.status"),
      sort: true,
      formatter: (cellContent, row) => (
        <div>
          {row.status === 'Submit' ? t("Reviews.selfSubmission") : row.status}
        </div>
      ),
    },
    {
      dataField: "action",
      text: t("Reviews.action"),
      sort: true,
      style: {
        width: "9.8%"
      },
      formatter: (cellContent, row) => <ReviewAction row={row} />,
    },
  ];
  

  const getAllReview = () => {
    try {
      setLoading(true);

      const { data = [], success, message } = ReviewResponse;

      if (data && data.length > 0) {
        setReviews(data)
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  useEffect(() => {
    getAllReview();
  }, [ReviewResponse]);

  return (
    <div className="bg-light-primary rounded-12 mh-100 p-4 m-4">
      <div>
        <div
          onClick={() => setFilterText("all")}
          className={`text-decoration-none nav cursor-pointer ${filterText === "all" ? "activeLink" : ""}`}
        >
          All
        </div>
        <div
          onClick={() => setFilterText("In Progress")}
          className={`text-decoration-none nav ml-3 cursor-pointer ${filterText === "In Progress" ? "activeLink" : ""}`}
        >
          In progress
        </div>
        <div
          onClick={() => setFilterText("Completed")}
          className={`text-decoration-none nav ml-3 cursor-pointer ${filterText === "Completed" ? "activeLink" : ""}`}
        >
          Completed
        </div>
        {/*<div style={{ display: 'flex', justifyContent: 'end' }}>
          <button>Delete</button>
        </div>*/}
        <div className="mt-4">
          <TableNormal
            className="react-bootstrap-table table"
            title="reviews"
            keyField="_id"
            data={reviews.filter((items) => {
              if (filterText === "all") {
                return items
              } else if (filterText === "In Progress") {
                return items.status !== "Submit" && items.status !== "Completed"
              } else if (filterText === "Completed") {
                return items.status === "Completed"
              }
            })}
            columns={columns}

            paginationFactory={paginationFactory}
            selectRow={selectRow(selectedUsers, setSelectedUsers, reviews)}

          />
        </div>
        <MoveAsModal
          show={showModal}
          onHide={() => setShowModal(false)}
          employees={opt1}
          data={selectedData}
          handlecallback={(data) => handleCallback2(data)}
        />
      </div>
    </div>
  );
}
